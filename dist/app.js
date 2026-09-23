const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const journey=$('.journey'),divine=$('.divine'),terrain=$('.terrain'),mist=$('.atmosphere'),hero=$('.hero-copy'),descent=$('.descent-copy'),map=$('.map-ui'),meta=$('.bottom-meta'),veil=$('.chapter-veil'),flowSections=$$('.flow-section');
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
flowSections.forEach((section,index)=>{
 const slot=document.createElement('div');
 slot.className=`flow-slot${index===0?' flow-slot--first':''}${section.id==='characters'?' flow-slot--characters':''}`;
 section.before(slot);slot.append(section);
 section.style.zIndex=String(10+index);
});
const flowSlots=$$('.flow-slot');
const vaultWindow=$('#vault .vault-window');
const vaultMapFrame=document.createElement('div');
vaultMapFrame.className='vault-map-frame';
vaultMapFrame.setAttribute('aria-hidden','true');
document.body.append(vaultMapFrame);
let vaultFrameMetrics;
function measureVaultFrame(){vaultFrameMetrics={left:vaultWindow.offsetLeft,top:vaultWindow.offsetTop,width:vaultWindow.offsetWidth,height:vaultWindow.offsetHeight};}
measureVaultFrame();
const mapJourneyDistance=()=>Math.max(1,journey.offsetHeight-innerHeight*3);
let progress=0,queued=false,currentChapter=-1;
function renderFlowTransitions(){
 let activeIndex=-1;
 flowSections.forEach((section,index)=>{
  const slot=flowSlots[index],top=slot.offsetTop-scrollY,bottom=top+slot.offsetHeight;
  const approaching=top>0&&top<innerHeight;
  const active=top<=0&&bottom>0;
  const revealProgress=1-top/innerHeight;
  const entryProgress=clamp(revealProgress);
  const arrival=reduced.matches?(active?1:0):approaching?smooth(index===0?.12:.5,index===0?.85:.96,entryProgress):active?1:0;
  const departure=!reduced.matches&&active&&bottom<innerHeight?smooth(0,1,1-bottom/innerHeight):0;
  const entryScale=index===0?.94+arrival*.06:1.07-arrival*.07;
  const scale=reduced.matches?1:active?1+departure*.075:index===0?1:entryScale;
  section.style.setProperty('--flow-arrival',arrival);
  section.style.setProperty('--flow-scale',scale);
  section.classList.toggle('is-flow-active',active);
  section.inert=!active;
  if(index===0){
   const shrink=reduced.matches?1:smooth(.17,.78,entryProgress);
   const frameOpacity=reduced.matches?0:smooth(.03,.19,entryProgress)*(1-smooth(.76,1.28,revealProgress));
   const boxOpacity=reduced.matches?(active?1:0):smooth(.78,1.65,revealProgress);
   const copy=reduced.matches?(active?1:0):smooth(.86,1.86,revealProgress);
   vaultMapFrame.style.setProperty('--vault-map-left',`${(vaultFrameMetrics.left*shrink).toFixed(1)}px`);
   vaultMapFrame.style.setProperty('--vault-map-top',`${(vaultFrameMetrics.top*shrink).toFixed(1)}px`);
   vaultMapFrame.style.setProperty('--vault-map-width',`${(innerWidth+(vaultFrameMetrics.width-innerWidth)*shrink).toFixed(1)}px`);
   vaultMapFrame.style.setProperty('--vault-map-height',`${(innerHeight+(vaultFrameMetrics.height-innerHeight)*shrink).toFixed(1)}px`);
   vaultMapFrame.style.opacity=frameOpacity.toFixed(3);
   section.style.setProperty('--vault-box-opacity',boxOpacity.toFixed(3));
   section.style.setProperty('--vault-copy-opacity',copy.toFixed(3));
   map.style.opacity=String(smooth(.61,.83,progress)*(1-smooth(.14,.5,entryProgress)));
   map.style.transform='none';
   map.style.filter='none';
  }
  if(section.id==='characters'){
   const introHold=innerHeight;
   const animationDistance=Math.max(1,slot.offsetHeight-innerHeight*1.25-introHold);
   if(typeof setSageDepthProgress==='function')setSageDepthProgress(clamp((-top-introHold)/animationDistance));
   if(typeof setSageDepthActive==='function')setSageDepthActive(active);
  }
  if(active||approaching&&arrival>.55)activeIndex=index;
 });
 if(activeIndex>=0){
  const activeId=flowSections[activeIndex].id;
  $('.flow-nav').classList.add('in-flow');
  $$('.flow-nav a').forEach(link=>link.classList.toggle('active',link.hash===`#${activeId}`));
 }
}
function render(){
 queued=false;progress=clamp(scrollY/mapJourneyDistance());
 const p=progress,mapAlpha=smooth(.61,.83,p),divineAlpha=1-smooth(.18,.47,p),heroAlpha=1-smooth(.015,.23,p),descAlpha=smooth(.23,.38,p)*(1-smooth(.53,.68,p));
 divine.style.opacity=divineAlpha;divine.style.transform=reduced.matches?'none':`scale(${1+p*.85}) translateY(${-p*14}%)`;
 terrain.style.opacity=smooth(.25,.52,p);terrain.style.transform=reduced.matches?'none':`scale(${1.4-.4*smooth(.3,.86,p)})`;
 hero.style.opacity=heroAlpha;hero.style.transform=reduced.matches?'none':`translateY(${-p*210}px)`;hero.inert=heroAlpha<.25;
 descent.style.opacity=descAlpha;descent.setAttribute('aria-hidden',descAlpha<.3);descent.style.transform=reduced.matches?'none':`translateY(${(p-.44)*-100}px)`;
 mist.style.opacity=reduced.matches?0:Math.sin(clamp((p-.14)/.58)*Math.PI)*.78;mist.style.transform=`translateY(${(p-.4)*-38}%) scale(${1+p*.3})`;
 map.style.opacity=mapAlpha;map.inert=p<.79;meta.style.opacity=1-smooth(.06,.26,p);$('.progress-line span').style.width=`${p*100}%`;
 const chapter=p<.25?0:p<.7?1:2;
 if(chapter!==currentChapter){currentChapter=chapter;$$('[data-chapter]').forEach(b=>{const i=+b.dataset.chapter;b.classList.toggle('active',i===chapter);if(i===chapter)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')})}
 veil.style.opacity=0;
 renderFlowTransitions();
}
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(render)}},{passive:true});addEventListener('resize',()=>{measureVaultFrame();render()});
function go(p){scrollTo({top:mapJourneyDistance()*p,behavior:reduced.matches?'instant':'smooth'})}
$$('[data-go-map]').forEach(b=>b.addEventListener('click',()=>go(1)));$('[data-go-descent]').addEventListener('click',()=>go(.44));$('.wordmark').addEventListener('click',e=>{e.preventDefault();go(0)});$$('[data-chapter]').forEach(b=>b.addEventListener('click',()=>go([0,.44,1][+b.dataset.chapter])));

const locationNames={ayodhya:'Ayodhya',mithila:'Mithila',forests:'The Forests',lanka:'Lanka'};
const locationImages={ayodhya:'assets/vault-ayodhya.webp',mithila:'assets/mithila.webp',forests:'assets/forest-preview.png',lanka:'assets/lanka.webp'};
const locationPreview=document.createElement('dialog');
locationPreview.id='location-preview';
locationPreview.setAttribute('aria-labelledby','location-preview-title');
locationPreview.innerHTML=`<div class="location-preview__shell"><div class="location-preview__story-stage"><div class="location-preview__top"><span class="wordmark location-preview__brand">RAMAYANA<small>A LIVING UNIVERSE</small></span><button class="location-preview__close" type="button" aria-label="Close location preview"><span>Close</span><b aria-hidden="true">&times;</b></button></div><div class="location-preview__copy"><span class="eyebrow">THE LIVING WORLD</span><h2 id="location-preview-title"></h2><p>A glimpse into the world of the epic.</p></div><div class="location-preview__viewport"><figure class="location-preview__figure"><img src="assets/vault-ayodhya.webp" alt=""><span class="location-preview__shine" aria-hidden="true"></span><figcaption>Move your cursor across the image</figcaption></figure><div class="ayodhya-story" aria-hidden="true"><article class="ayodhya-story__scene"><img src="assets/vault-ayodhya.webp" alt="An aerial view of Ayodhya's palace and its gathered people"><div class="ayodhya-story__copy"><span>01 / THE CITY OF BEGINNINGS</span><h3>Ayodhya awakens.</h3><p>Beyond the palace gates, a kingdom gathers. Every street carries the promise of a story still unfolding.</p></div></article><article class="ayodhya-story__scene"><img src="assets/ayodhya2.png" alt="A sacred ceremony in Ayodhya"><div class="ayodhya-story__copy"><span>02 / A VOW BEFORE THE FIRE</span><h3>Every promise has a witness.</h3><p>In the courtyards of Ayodhya, ritual gives form to faith—and duty becomes a living bond.</p></div></article><article class="ayodhya-story__scene"><img src="assets/ayodhya3.png" alt="A figure kneeling before the throne in Ayodhya"><div class="ayodhya-story__copy"><span>03 / THE PROMISE OF RETURN</span><h3>The throne waits.</h3><p>Bharata guards Rama's place, holding a kingdom together with loyalty until its rightful king returns.</p></div></article></div></div><span class="location-preview__index" aria-hidden="true"></span><div class="ayodhya-story__progress" aria-hidden="true"><span>01 / 03</span><i><b></b></i><em>SCROLL TO JOURNEY</em></div></div><div class="location-preview__scroll-space" aria-hidden="true"></div></div>`;
document.body.append(locationPreview);
const locationFigure=$('.location-preview__figure'),locationImage=$('.location-preview__figure img'),locationTitle=$('#location-preview-title'),locationIndex=$('.location-preview__index'),ayodhyaScenes=$$('.ayodhya-story__scene'),ayodhyaStory=$('.ayodhya-story'),ayodhyaProgress=$('.ayodhya-story__progress'),ayodhyaProgressFill=$('.ayodhya-story__progress b'),ayodhyaProgressLabel=$('.ayodhya-story__progress span');
let previewFrame=0,previewRunning=false,targetX=0,targetY=0,currentX=0,currentY=0;
function renderLocationHover(){currentX+=(targetX-currentX)*.085;currentY+=(targetY-currentY)*.085;locationFigure.style.transform=`translate3d(${currentX*18}px,${currentY*14}px,0) rotateX(${-currentY*4}deg) rotateY(${currentX*6}deg) scale(1.025)`;locationImage.style.transform=`scale(1.105) translate3d(${-currentX*13}px,${-currentY*10}px,0)`;locationFigure.style.setProperty('--shine-x',`${50+currentX*28}%`);locationFigure.style.setProperty('--shine-y',`${50+currentY*28}%`);if(previewRunning||Math.abs(targetX-currentX)>.002||Math.abs(targetY-currentY)>.002)previewFrame=requestAnimationFrame(renderLocationHover);else previewFrame=0;}
function startLocationMotion(){previewRunning=true;if(!previewFrame&&!reduced.matches)previewFrame=requestAnimationFrame(renderLocationHover);}
function resetLocationMotion(){previewRunning=false;targetX=0;targetY=0;if(!previewFrame&&!reduced.matches)previewFrame=requestAnimationFrame(renderLocationHover);}
function renderAyodhyaStory(){
 if(!locationPreview.classList.contains('is-ayodhya-story'))return;
 const distance=Math.max(1,locationPreview.scrollHeight-locationPreview.clientHeight),p=clamp(locationPreview.scrollTop/distance),fade=(start,end)=>smooth(start,end,p);
 const opacities=[1-fade(.22,.38),fade(.22,.38)*(1-fade(.72,.84)),fade(.72,.84)];
 const copyOpacities=[1-fade(.21,.29),fade(.31,.42)*(1-fade(.72,.8)),fade(.82,.9)];
 const zoomRanges=[[0,.38],[.22,.84],[.72,1]],zoomStarts=[1.02,1.14,1.02],zoomEnds=[2.25,1.45,1.3];
 ayodhyaScenes.forEach((scene,index)=>{
  const [start,end]=zoomRanges[index],travel=clamp((p-start)/(end-start)),zoom=zoomStarts[index]+(zoomEnds[index]-zoomStarts[index])*travel;
  scene.style.opacity=opacities[index].toFixed(3);
  scene.querySelector('.ayodhya-story__copy').style.opacity=copyOpacities[index].toFixed(3);
  scene.querySelector('img').style.transform=reduced.matches?'none':index===0?`translate3d(0,${(travel*26).toFixed(1)}%,0) scale(${zoom.toFixed(3)})`:`scale(${zoom.toFixed(3)})`;
 });
 const current=p<.36?0:p<.8?1:2;
 ayodhyaProgressLabel.textContent=`0${current+1} / 03`;
 ayodhyaProgressFill.style.transform=`scaleX(${p.toFixed(3)})`;
}
function openLocationPreview(key){const keys=Object.keys(locationNames),name=locationNames[key]||'The Living World',isAyodhya=key==='ayodhya';locationTitle.textContent=name;locationImage.src=locationImages[key]||'assets/ayodhya.webp';locationImage.alt=`A cinematic view representing ${name}`;locationIndex.textContent=`0${keys.indexOf(key)+1} / 04`;locationPreview.classList.toggle('is-ayodhya-story',isAyodhya);ayodhyaStory.setAttribute('aria-hidden',String(!isAyodhya));ayodhyaProgress.setAttribute('aria-hidden',String(!isAyodhya));locationFigure.querySelector('figcaption').textContent=isAyodhya?'Scroll to journey through Ayodhya':'Move your cursor across the image';locationPreview.showModal();locationPreview.scrollTop=0;renderAyodhyaStory();document.body.classList.add('location-preview-open');requestAnimationFrame(()=>locationPreview.classList.add('is-visible'));history.pushState({locationPreview:key},'',`#${key}`);}
function closeLocationPreview(fromPopstate){locationPreview.classList.remove('is-visible');locationPreview.classList.remove('is-ayodhya-story');resetLocationMotion();setTimeout(()=>{if(locationPreview.open)locationPreview.close();document.body.classList.remove('location-preview-open')},reduced.matches?0:420);if(!fromPopstate&&history.state&&history.state.locationPreview)history.back();}
$$('.pin[data-location]').forEach(pin=>{const name=locationNames[pin.dataset.location];pin.removeAttribute('target');pin.removeAttribute('rel');pin.setAttribute('href',`#${pin.dataset.location}`);pin.setAttribute('aria-label',`Preview ${name}`);pin.addEventListener('click',e=>{e.preventDefault();openLocationPreview(pin.dataset.location)})});
locationFigure.addEventListener('pointerenter',startLocationMotion);
locationFigure.addEventListener('pointermove',e=>{if(reduced.matches)return;const r=locationFigure.getBoundingClientRect();targetX=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));targetY=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));});
locationFigure.addEventListener('pointerleave',resetLocationMotion);
locationPreview.addEventListener('scroll',renderAyodhyaStory,{passive:true});
$('.location-preview__close').addEventListener('click',()=>closeLocationPreview());
locationPreview.addEventListener('cancel',e=>{e.preventDefault();closeLocationPreview()});
locationPreview.addEventListener('click',e=>{if(e.target===locationPreview)closeLocationPreview()});
addEventListener('popstate',()=>{if(locationPreview.open)closeLocationPreview(true)});
