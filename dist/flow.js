const stages=$$('.flow-section:not(#vault):not(#story)');
const vaultIsHidden=getComputedStyle(document.getElementById('vault')).display==='none';
const storyIsHidden=getComputedStyle(document.getElementById('story')).display==='none';
if(vaultIsHidden){
 document.querySelector('#story .eyebrow').textContent='05 / GET THE SUPERPASS';
 document.querySelector('#story .section-footer a').textContent='06 / Buy tickets ↓';
 document.querySelector('#tickets .eyebrow').textContent='06 / TAKE ACTION';
}
if(storyIsHidden)document.querySelector('#tickets .eyebrow').textContent='05 / TAKE ACTION';
function scrollToFlowSection(section){(section.closest('.flow-slot')||section).scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}
$$('[data-scroll-to]').forEach(b=>b.addEventListener('click',()=>scrollToFlowSection(document.getElementById(b.dataset.scrollTo))));
$('#hero-superpass-link').addEventListener('click',()=>{const storySection=document.getElementById('story');scrollToFlowSection(storySection);setTimeout(()=>storySection.querySelector('#superpass-name')?.focus(),reduced.matches?0:450);});
const heroSuperpassForm=$('#hero-superpass-form'),heroTicketCta=$('.hero-ticket-cta');
let heroWidgetCollapsed=false,lastHeroScrollY=scrollY;
function setHeroWidgetCollapsed(collapsed){if(heroWidgetCollapsed===collapsed)return;heroWidgetCollapsed=collapsed;heroSuperpassForm.classList.toggle('is-collapsed',collapsed);}
addEventListener('scroll',()=>{const y=scrollY,delta=y-lastHeroScrollY;if(delta>6)setHeroWidgetCollapsed(true);else if(delta<-2)setHeroWidgetCollapsed(false);lastHeroScrollY=y;},{passive:true});
heroTicketCta.addEventListener('click',event=>{if(heroWidgetCollapsed){event.preventDefault();setHeroWidgetCollapsed(false);}});
$$('.flow-nav a').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();scrollToFlowSection(document.querySelector(link.hash));}));
const stageObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&!entry.target.closest('.flow-slot')){$$('.flow-nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));$('.flow-nav').classList.add('in-flow');}}},{threshold:.35});stages.forEach(s=>stageObserver.observe(s));
addEventListener('scroll',()=>{if(scrollY<journey.offsetHeight-innerHeight*.3){$('.flow-nav').classList.remove('in-flow');$$('.flow-nav a').forEach(a=>a.classList.remove('active'));}},{passive:true});
const themes={standard:{title:'The complete Superpass.',characters:'₹699 · one-time',places:'All 7 chapters + early ticket access'},student:{title:'Built for students.',characters:'₹349 · one-time',places:'50% off with a valid student ID — every Superpass feature included'},family:{title:'Bring the whole story home.',characters:'₹1,499 · up to 4 members',places:'Share every chapter across your household'}};
let currentStoryKey='standard';
function selectStory(key){currentStoryKey=key;const theme=themes[key];$$('[data-story]').forEach(b=>{const on=b.dataset.story===key;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});$('#story-placeholder').setAttribute('aria-labelledby','tab-'+key);$('#placeholder-title').textContent=theme.title;$('#connection-character').textContent=theme.characters;$('#connection-place').textContent=theme.places;}
$$('[data-story]').forEach((b,i)=>{b.addEventListener('click',()=>selectStory(b.dataset.story));b.addEventListener('keydown',e=>{const tabs=$$('[data-story]');let index;if(e.key==='ArrowRight')index=(i+1)%3;if(e.key==='ArrowLeft')index=(i+2)%3;if(e.key==='Home')index=0;if(e.key==='End')index=2;if(index!==undefined){e.preventDefault();tabs[index].focus();selectStory(tabs[index].dataset.story)}})});
const sageWindowEl=$('#sage-window'),sageScroller=$('.sage-depth__scroller'),sageStage=$('.sage-depth__stage'),sageImages=$$('.sage-depth__image'),sageVideos=$$('.sage-depth__video'),sageInteractiveVideos=$$('[data-expandable-video]'),sageVideoClose=$('.sage-depth__video-close'),sageIntro=$('.sage-depth__intro'),sageProgress=$('.sage-depth__progress b'),sageOutput=$('.sage-depth__progress output'),sageLastImage=sageImages[sageImages.length-1];
const sageBackdropVideos=$$('.sage-depth__backdrop-media--video'),sageBackdropImages=$$('.sage-depth__backdrop-media--image');
let sageBackdropFrame=null,sageBackdropActive=null,sageBackdropVideoSlot=0,sageBackdropImageSlot=0;
function updateSageBackdrop(){
 let winner=sageImages[0],winnerOpacity=-1;
 sageImages.forEach(item=>{const op=parseFloat(item.style.opacity)||0;if(op>winnerOpacity){winnerOpacity=op;winner=item;}});
 if(winner===sageBackdropFrame)return;
 sageBackdropFrame=winner;
 const video=winner.querySelector('video'),img=winner.querySelector('img');
 if(video){
  const src=video.currentSrc||video.src;
  if(sageBackdropActive&&sageBackdropActive.tagName==='VIDEO'&&sageBackdropActive.src===src)return;
  const target=sageBackdropVideos[sageBackdropVideoSlot];
  sageBackdropVideoSlot=1-sageBackdropVideoSlot;
  const doSwap=()=>{
   try{if(video.currentTime)target.currentTime=video.currentTime;}catch(e){}
   sageBackdropVideos.forEach(v=>{if(v!==target){v.classList.remove('is-visible');v.pause();}});
   sageBackdropImages.forEach(i=>i.classList.remove('is-visible'));
   target.classList.add('is-visible');
   sageBackdropActive=target;
  };
  if(target.src===src&&target.readyState>=2){target.play().catch(()=>{});doSwap();}
  else{target.oncanplay=()=>{target.oncanplay=null;doSwap();};target.src=src;target.play().catch(()=>{});}
 }else if(img){
  const src=img.currentSrc||img.src;
  if(sageBackdropActive&&sageBackdropActive.tagName==='IMG'&&sageBackdropActive.src===src)return;
  const target=sageBackdropImages[sageBackdropImageSlot];
  sageBackdropImageSlot=1-sageBackdropImageSlot;
  const doSwap=()=>{
   sageBackdropImages.forEach(i=>{if(i!==target)i.classList.remove('is-visible')});
   sageBackdropVideos.forEach(v=>{v.classList.remove('is-visible');v.pause();});
   target.classList.add('is-visible');
   sageBackdropActive=target;
  };
  if(target.src===src&&target.complete)doSwap();
  else{target.onload=()=>{target.onload=null;doSwap();};target.src=src;}
 }
}
sageLastImage.style.width='auto';sageLastImage.style.height='auto';sageLastImage.style.aspectRatio='auto';sageLastImage.style.top='0';sageLastImage.style.left='0';
[{start:0,x:-25,y:2},{start:.0429,x:19,y:-9},{start:.0857,x:-15,y:11},{start:.1286,x:27,y:4},{start:.1714,x:-24,y:-8},{start:.2143,x:20,y:9},{start:.2571,x:-22,y:-7},{start:.3,x:14,y:10},{start:.3429,x:-19,y:-3},{start:.3857,x:23,y:7},{start:.4286,x:-17,y:-10},{start:.4714,x:18,y:5},{start:.5143,x:-12,y:9},{start:.5571,x:21,y:-6},{start:.6,x:-16,y:6},{start:.67,x:0,y:0}].forEach((layout,i)=>Object.assign(sageImages[i].dataset,layout));
let sageFrame=0,sageCurrent=0,sageTarget=0,sageStarted=false,sageSessionActive=false,sageExpandedVideo=null;
function renderSageDepth(){sageFrame=0;const difference=sageTarget-sageCurrent;sageCurrent+=difference*(reduced.matches?1:.13);if(Math.abs(difference)<.00015)sageCurrent=sageTarget;const p=sageCurrent,clamp01=n=>Math.max(0,Math.min(1,n)),smooth=t=>t*t*(3-2*t);sageImages.forEach((item,i)=>{const isLast=item===sageLastImage,start=+item.dataset.start,duration=isLast?Math.max(.001,1-start):.16,raw=(p-start)/duration,t=clamp01(raw),approach=smooth(t);if(isLast){const fadeIn=smooth(clamp01((p-start)/.16)),shrink=1-approach;item.style.opacity=String(fadeIn);item.style.inset=`${shrink*22}% ${shrink*30}%`;item.style.transform='none';item.style.zIndex=String(30)}else{const fadeIn=smooth(clamp01(t/.16)),x=+item.dataset.x*(.72+approach*.28),y=+item.dataset.y,z=-2600+approach*2920,fadeOut=1-smooth(clamp01((t-.84)/.16));item.style.opacity=fadeIn*fadeOut;item.style.transform=`translate(-50%,-50%) translate3d(${x}vw,${y}vh,${z}px)`;item.style.zIndex=String(10+i)}});sageIntro.style.opacity=String(1-clamp01(p/.07));sageIntro.style.transform=`translateY(${-p*110}px)`;sageProgress.style.transform=`scaleX(${p})`;sageOutput.value=`${Math.round(p*100).toString().padStart(2,'0')}%`;updateSageBackdrop();if(sageCurrent!==sageTarget)sageFrame=requestAnimationFrame(renderSageDepth)}
function setSageDepthProgress(value){sageTarget=Math.max(0,Math.min(1,value));if(!sageFrame)sageFrame=requestAnimationFrame(renderSageDepth)}
function closeSageVideo(){if(!sageExpandedVideo)return;const video=$('video',sageExpandedVideo);video.pause();video.muted=true;sageExpandedVideo.classList.remove('is-expanded');sageExpandedVideo=null;sageStage.classList.remove('has-expanded-video');sageScroller.classList.remove('is-video-open');sageVideoClose.classList.remove('is-visible');if(sageSessionActive)sageVideos.forEach(v=>v.play().catch(()=>{}));sageScroller.focus({preventScroll:true});}
function openSageVideo(frame){if(sageExpandedVideo===frame)return;if(sageExpandedVideo)closeSageVideo();sageExpandedVideo=frame;sageStage.classList.add('has-expanded-video');sageScroller.classList.add('is-video-open');frame.classList.add('is-expanded');sageVideoClose.classList.add('is-visible');const video=$('video',frame);sageVideos.forEach(v=>v.pause());video.muted=false;video.volume=1;video.currentTime=0;video.play().catch(()=>{});sageVideoClose.focus({preventScroll:true});}
function setSageDepthActive(active){if(active===sageSessionActive)return;sageSessionActive=active;if(active){if(!sageStarted){sageStarted=true;sageScroller.scrollTop=0;sageCurrent=sageTarget=0;sageVideos.forEach(v=>{v.muted=true;v.currentTime=0});renderSageDepth()}if(!sageExpandedVideo)sageVideos.forEach(v=>v.play().catch(()=>{}))}else sageVideos.forEach(v=>v.pause())}
sageInteractiveVideos.forEach(frame=>{frame.addEventListener('click',()=>openSageVideo(frame));frame.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openSageVideo(frame)}})});
sageVideoClose.addEventListener('click',closeSageVideo);
sageScroller.addEventListener('wheel',event=>{if(sageExpandedVideo){event.preventDefault();event.stopPropagation();}},{passive:false});
addEventListener('keydown',event=>{if(event.key==='Escape'&&sageExpandedVideo)closeSageVideo()});
addEventListener('click',event=>{if(sageExpandedVideo&&!event.target.closest('[data-expandable-video]')&&!event.target.closest('.sage-depth__video-close'))closeSageVideo()});
addEventListener('resize',()=>{if(sageWindowEl.classList.contains('entered'))renderSageDepth()});
const vaultWindowEl=$('.vault-window'),vaultDeckEl=$('#vault-deck'),vaultNow=$('#vaultNow'),vaultPrevBtn=$('#vault-prev'),vaultNextBtn=$('#vault-next');
vaultDeckEl.insertAdjacentHTML('beforeend',`<article class="vault-card tone-image vault-card-extra" tabindex="0" style="--i:10;background-image:url('assets/vault-winged-elephant.webp')" data-label="Bharata - The Keeper of the Throne"><div class="vc-face"><b>Bharata</b></div><div class="vc-detail"><span class="vc-eyebrow">Chapter 10</span><h3>The Keeper of the Throne</h3></div></article><article class="vault-card tone-image vault-card-extra" tabindex="0" style="--i:11;background-image:url('assets/vault-lotus-palace.webp')" data-label="Sita - The Coronation"><div class="vc-face"><b>Sita</b></div><div class="vc-detail"><span class="vc-eyebrow">Chapter 11</span><h3>The Coronation</h3></div><video class="vc-video" playsinline preload="none" src="assets/ramayanavid4.mp4"></video></article><article class="vault-card tone-image tone-video vault-card-extra" tabindex="0" style="--i:12;background-image:url('assets/vault-song-poster.webp')" data-label="Meri Pooja - A Song of Devotion"><div class="vc-face"><b>Meri Pooja</b></div><div class="vc-detail"><span class="vc-eyebrow">Chapter 12</span><h3>A Song of Devotion</h3></div><video class="vc-video" playsinline preload="none" poster="assets/vault-song-poster.webp" src="assets/vault-song.mp4"></video></article>`);
const vaultCards=$$('.vault-card'),vaultMobile=matchMedia('(max-width:760px)');
vaultCards.forEach((card,index)=>{const eyebrow=$('.vc-eyebrow',card);if(eyebrow)eyebrow.textContent=`Chapter ${String(index+1).padStart(2,'0')}`;});
let vaultTravel=0;
const vaultTravelMax=5;
let vaultAudioContext=null,lastVaultClickAt=-1,vaultSoundCard=null,vaultSoundNotch=0;
let vaultVisualCard=null,vaultPeekCard=null;
const vaultRestRects=new Map();
// Drop the hover peek before measuring, with transitions off, so the stored
// rectangles are the true resting geometry rather than a mid-slide position.
function captureVaultRestRects(){const peeked=vaultPeekCard;if(peeked){peeked.classList.add('no-anim');setVaultPeek(null)}vaultRestRects.clear();vaultCards.forEach(card=>{const r=card.getBoundingClientRect();vaultRestRects.set(card,{left:r.left,right:r.right,top:r.top,bottom:r.bottom})});if(peeked)peeked.classList.remove('no-anim')}
function setVaultPeek(card){if(vaultPeekCard===card)return;if(vaultPeekCard)vaultPeekCard.classList.remove('is-peeking');vaultPeekCard=card;if(card)card.classList.add('is-peeking')}
function unlockVaultAudio(){const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return Promise.resolve();if(!vaultAudioContext)vaultAudioContext=new AudioEngine();return vaultAudioContext.state==='suspended'?vaultAudioContext.resume():Promise.resolve();}
function playVaultClick(strength=.65){const ctx=vaultAudioContext;if(!ctx||ctx.state!=='running'||ctx.currentTime-lastVaultClickAt<.055)return;const now=ctx.currentTime;lastVaultClickAt=now;const oscillator=ctx.createOscillator(),toneGain=ctx.createGain();oscillator.type='triangle';oscillator.frequency.setValueAtTime(1050,now);oscillator.frequency.exponentialRampToValueAtTime(230,now+.032);toneGain.gain.setValueAtTime(.055*strength,now);toneGain.gain.exponentialRampToValueAtTime(.0001,now+.045);oscillator.connect(toneGain).connect(ctx.destination);oscillator.start(now);oscillator.stop(now+.05);const length=Math.ceil(ctx.sampleRate*.014),buffer=ctx.createBuffer(1,length,ctx.sampleRate),samples=buffer.getChannelData(0);for(let i=0;i<length;i++)samples[i]=(Math.random()*2-1)*Math.exp(-i/(length*.16));const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),noiseGain=ctx.createGain();noise.buffer=buffer;filter.type='highpass';filter.frequency.value=1800;noiseGain.gain.value=.032*strength;noise.connect(filter).connect(noiseGain).connect(ctx.destination);noise.start(now);}
function applyVaultTravel(){const xStep=vaultMobile.matches?-18:-23,yStep=vaultMobile.matches?3:4;vaultDeckEl.style.setProperty('--vault-travel-x',`${vaultTravel*xStep}%`);vaultDeckEl.style.setProperty('--vault-travel-y',`${vaultTravel*yStep}%`);vaultCards.forEach((card,i)=>{const basePosition=i<7?i:6-i,position=Math.max(0,Math.min(6,basePosition+vaultTravel));card.style.setProperty('--deck-z',`${-150+position*25}px`);card.style.setProperty('--deck-scale',`${.91+position*.015}`);card.style.setProperty('--deck-light',`${.62+position*.06}`);card.style.setProperty('--deck-ry',`${-(50-position*4)}deg`)});vaultDeckEl.setAttribute('aria-label',`Vault position ${Math.round(vaultTravel*10)/10} of ${vaultTravelMax}`);}
function moveVault(amount){const next=Math.max(0,Math.min(vaultTravelMax,vaultTravel+amount));if(next===vaultTravel)return false;vaultTravel=next;applyVaultTravel();const notch=Math.round(vaultTravel*4);if(notch!==vaultSoundNotch){vaultSoundNotch=notch;playVaultClick(.72)}clearVaultActive();return true;}
function setVaultActive(card){vaultCards.forEach(c=>{const on=c===card;c.classList.toggle('is-active',on);c.classList.toggle('is-dimmed',!on);const v=c.querySelector('.vc-video');if(v){if(on){v.currentTime=0;v.play().catch(()=>{})}else v.pause()}});vaultNow.innerHTML=`Viewing — <b>${card.dataset.label}</b>`;vaultWindowEl.classList.add('has-active-card');}
function activateVaultCard(card){if(vaultVisualCard!==card){if(!vaultVisualCard)captureVaultRestRects();vaultVisualCard=card}setVaultActive(card)}
function clearVaultActive(){vaultVisualCard=null;vaultCards.forEach(c=>{c.classList.remove('is-active','is-dimmed');const v=c.querySelector('.vc-video');if(v)v.pause()});vaultNow.textContent='Scroll to move the queue. Click a frame to bring it forward.';vaultWindowEl.classList.remove('has-active-card');}
function navigateVault(direction){if(!vaultVisualCard)return;const idx=vaultCards.indexOf(vaultVisualCard),next=vaultCards[(idx+direction+vaultCards.length)%vaultCards.length],current=vaultVisualCard;current.classList.add('no-position-anim');next.classList.add('no-position-anim');unlockVaultAudio().then(()=>playVaultClick(.85));activateVaultCard(next);requestAnimationFrame(()=>requestAnimationFrame(()=>{current.classList.remove('no-position-anim');next.classList.remove('no-position-anim');}));}
// Chromium can omit deeply transformed cards from elementsFromPoint. Resolve the
// projected rectangles ourselves, then choose the visually highest matching card.
function vaultCardAt(x,y){const contains=(r,pad=0)=>r&&x>=r.left-pad&&x<=r.right+pad&&y>=r.top-pad&&y<=r.bottom+pad;if(vaultVisualCard&&(contains(vaultVisualCard.getBoundingClientRect(),6)||contains(vaultRestRects.get(vaultVisualCard),6)))return vaultVisualCard;if(vaultPeekCard&&!vaultVisualCard&&contains(vaultPeekCard.getBoundingClientRect(),4))return vaultPeekCard;return vaultCards.filter(card=>contains(vaultVisualCard?vaultRestRects.get(card):card.getBoundingClientRect())).sort((a,b)=>(parseInt(getComputedStyle(b).zIndex)||0)-(parseInt(getComputedStyle(a).zIndex)||0))[0]||null}
const svgNS='http://www.w3.org/2000/svg',vaultTrailEl=document.createElementNS(svgNS,'svg');
vaultTrailEl.setAttribute('class','vault-trail');
vaultTrailEl.setAttribute('aria-hidden','true');
const vaultSmokeDefs=document.createElementNS(svgNS,'defs');
vaultSmokeDefs.innerHTML='<filter id="vault-smoke-soften" x="-90%" y="-130%" width="280%" height="360%"><feGaussianBlur stdDeviation="9"/></filter><radialGradient id="vault-smoke-colour" cx="42%" cy="42%" r="60%"><stop offset="0" stop-color="#eee4cb" stop-opacity=".32"/><stop offset=".48" stop-color="#b9c8ba" stop-opacity=".16"/><stop offset="1" stop-color="#6d8579" stop-opacity="0"/></radialGradient>';
vaultTrailEl.append(vaultSmokeDefs);
const vaultTrailLength=22,vaultTrailPoints=[],vaultSmokePuffs=[];
for(let i=0;i<vaultTrailLength;i++)vaultTrailPoints.push({x:0,y:0});
for(let i=0;i<11;i++){const puff=document.createElementNS(svgNS,'ellipse'),taper=1-i/11;puff.setAttribute('class','vault-smoke-puff');puff.setAttribute('fill','url(#vault-smoke-colour)');puff.setAttribute('filter','url(#vault-smoke-soften)');puff.dataset.point=String(i*2);puff.dataset.size=String(34*taper+14);puff.setAttribute('opacity',(taper*.72+.05).toFixed(2));vaultTrailEl.append(puff);vaultSmokePuffs.push(puff)}
document.body.append(vaultTrailEl);
const vaultFineHover=matchMedia('(hover:hover) and (pointer:fine)');
let vaultTrailRaw={x:0,y:0},vaultTrailOn=false,vaultTrailFrame=0;
function renderVaultTrail(){const head=vaultTrailPoints[0];head.x+=(vaultTrailRaw.x-head.x)*.56;head.y+=(vaultTrailRaw.y-head.y)*.56;for(let i=1;i<vaultTrailLength;i++){const point=vaultTrailPoints[i],ahead=vaultTrailPoints[i-1];point.x+=(ahead.x-point.x)*.3;point.y+=(ahead.y-point.y)*.3}let span=0;for(let i=0;i<vaultSmokePuffs.length;i++){const puff=vaultSmokePuffs[i],point=vaultTrailPoints[Number(puff.dataset.point)],previous=vaultTrailPoints[Math.min(vaultTrailLength-1,Number(puff.dataset.point)+1)],size=Number(puff.dataset.size);puff.setAttribute('cx',point.x.toFixed(1));puff.setAttribute('cy',point.y.toFixed(1));puff.setAttribute('rx',size.toFixed(1));puff.setAttribute('ry',(size*.62).toFixed(1));span+=Math.hypot(point.x-previous.x,point.y-previous.y)}if(vaultTrailOn||span>1)vaultTrailFrame=requestAnimationFrame(renderVaultTrail);else vaultTrailFrame=0;}
function showVaultTrail(x,y){if(!vaultFineHover.matches||reduced.matches)return;vaultTrailRaw.x=x;vaultTrailRaw.y=y;if(!vaultTrailOn){vaultTrailPoints.forEach(point=>{point.x=x;point.y=y});vaultTrailOn=true;vaultTrailEl.classList.add('is-visible')}if(!vaultTrailFrame)vaultTrailFrame=requestAnimationFrame(renderVaultTrail);}
function hideVaultTrail(){vaultTrailOn=false;vaultTrailEl.classList.remove('is-visible')}
vaultWindowEl.addEventListener('mousemove',e=>showVaultTrail(e.clientX,e.clientY));
$('#start-vault').addEventListener('click',e=>{e.stopPropagation();unlockVaultAudio().then(()=>playVaultClick(.8));vaultWindowEl.classList.add('entered');vaultDeckEl.setAttribute('aria-hidden','false');vaultDeckEl.tabIndex=0;applyVaultTravel();clearVaultActive();vaultDeckEl.focus({preventScroll:true});});
vaultWindowEl.addEventListener('mousemove',e=>{if(!vaultWindowEl.classList.contains('entered'))return;const card=vaultCardAt(e.clientX,e.clientY);if(card&&card!==vaultSoundCard){vaultSoundCard=card;playVaultClick(.4)}else if(!card)vaultSoundCard=null;setVaultPeek(vaultFineHover.matches&&card&&!vaultVisualCard?card:null);});
vaultWindowEl.addEventListener('mouseleave',()=>{vaultSoundCard=null;setVaultPeek(null);hideVaultTrail();});
vaultWindowEl.addEventListener('click',e=>{if(!vaultWindowEl.classList.contains('entered'))return;const card=vaultCardAt(e.clientX,e.clientY);if(!card){clearVaultActive();return}if(card===vaultVisualCard){clearVaultActive();return}unlockVaultAudio().then(()=>playVaultClick(.85));activateVaultCard(card)});
vaultWindowEl.addEventListener('wheel',e=>{if(!vaultWindowEl.classList.contains('entered'))return;e.preventDefault();const direction=Math.sign(e.deltaY);if(direction)moveVault(direction*Math.min(.5,Math.max(.16,Math.abs(e.deltaY)*.003)));},{passive:false});
vaultPrevBtn.addEventListener('click',e=>{e.stopPropagation();navigateVault(1);});
vaultNextBtn.addEventListener('click',e=>{e.stopPropagation();navigateVault(-1);});
vaultDeckEl.addEventListener('keydown',e=>{const amount=(e.key==='ArrowDown'||e.key==='ArrowRight')?0.5:(e.key==='ArrowUp'||e.key==='ArrowLeft')?-0.5:0;if(amount&&moveVault(amount))e.preventDefault();});
vaultMobile.addEventListener('change',applyVaultTravel);
vaultCards.forEach(card=>card.addEventListener('focus',()=>{if(!card.matches(':focus-visible'))return;if(card!==vaultSoundCard){vaultSoundCard=card;playVaultClick(.55)}activateVaultCard(card)}));
/* Legacy ticket-preview and Superpass drawer behavior retained here temporarily
   only to preserve the surrounding build's source-map line mapping. */
if(false){
const cities=[['Mumbai',19.08,72.88],['Delhi',28.61,77.21],['Bengaluru',12.97,77.59],['Chennai',13.08,80.27],['Hyderabad',17.39,78.49],['Kolkata',22.57,88.36],['Pune',18.52,73.86],['Ahmedabad',23.02,72.57],['Jaipur',26.91,75.79],['Kochi',9.93,76.27],['Lucknow',26.85,80.95]];
const citySelect=$('#ticket-city'),locationStatus=$('#location-status');
citySelect.addEventListener('change',()=>{locationStatus.textContent=citySelect.value?`Ticketing preview for ${citySelect.value}.`:'Choose a city to preview ticketing.';});
$('#locate').addEventListener('click',()=>{if(!navigator.geolocation){locationStatus.textContent='Location is unavailable. Please select your city.';return;}const button=$('#locate');button.disabled=true;locationStatus.textContent='Finding the nearest city in this demo…';navigator.geolocation.getCurrentPosition(position=>{const lat=position.coords.latitude,lon=position.coords.longitude;const rad=x=>x*Math.PI/180;const ranked=cities.map(([name,a,b])=>{const h=Math.sin(rad(a-lat)/2)**2+Math.cos(rad(lat))*Math.cos(rad(a))*Math.sin(rad(b-lon)/2)**2;return{name,distance:12742*Math.asin(Math.sqrt(Math.min(1,h)))}}).sort((a,b)=>a.distance-b.distance);button.disabled=false;if(ranked[0].distance>200){locationStatus.textContent='No nearby demo city found. Please select a city from the list.';return;}citySelect.value=ranked[0].name;locationStatus.textContent=`Nearest demo city: ${ranked[0].name}. You can change it above.`;},()=>{button.disabled=false;locationStatus.textContent='Location could not be accessed. Please select your city.';},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});});
const booking=$('#ticket-preview');
$('#book-tickets').addEventListener('click',()=>{if(!citySelect.value){locationStatus.textContent='Select your city to continue.';citySelect.focus();return;}$('#booking-city').textContent=`RAMAYANA · ${citySelect.value}`;booking.showModal();document.body.style.overflow='hidden';});
function closeBooking(){booking.close();document.body.style.overflow='';}
$('#close-booking').addEventListener('click',closeBooking);$('#change-city').addEventListener('click',()=>{closeBooking();citySelect.focus()});booking.addEventListener('cancel',e=>{e.preventDefault();closeBooking()});
const superpassModal=$('#superpass-modal'),superpassFormView=$('#superpass-form-view'),superpassSuccessView=$('#superpass-success-view'),superpassForm=$('#superpass-form');
$('.booking-note',superpassModal)?.remove();
function openSuperpass(asDrawer=false){const theme=themes[currentStoryKey];$('#superpass-plan-badge').textContent=`${currentStoryKey.toUpperCase()} · ${theme.characters}`;superpassFormView.hidden=false;superpassSuccessView.hidden=true;superpassModal.classList.remove('is-closing');superpassModal.classList.toggle('is-drawer',asDrawer);if(asDrawer)superpassModal.style.setProperty('--superpass-scrollbar-width',`${Math.max(0,innerWidth-document.documentElement.clientWidth)}px`);superpassModal.showModal();document.body.style.overflow='hidden';$('#superpass-name').focus();}
function closeSuperpass(){
 if(!superpassModal.open||superpassModal.classList.contains('is-closing'))return;
 const finish=()=>{superpassModal.close();superpassModal.classList.remove('is-drawer','is-closing');document.body.style.overflow='';};
 if(!superpassModal.classList.contains('is-drawer')||reduced.matches){finish();return;}
 superpassModal.classList.add('is-closing');
 let done=false;
 const complete=()=>{if(done)return;done=true;superpassModal.removeEventListener('animationend',onAnimationEnd);clearTimeout(fallback);finish();};
 const onAnimationEnd=e=>{if(e.target===superpassModal&&e.animationName==='superpass-drawer-out')complete();};
 superpassModal.addEventListener('animationend',onAnimationEnd);
 const fallback=setTimeout(complete,500);
}
$('#get-superpass').addEventListener('click',()=>openSuperpass());
$('#close-superpass').addEventListener('click',closeSuperpass);
superpassModal.addEventListener('cancel',e=>{e.preventDefault();closeSuperpass()});
superpassModal.addEventListener('click',e=>{if(!superpassModal.classList.contains('is-drawer'))return;const bounds=superpassModal.getBoundingClientRect();if(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom)closeSuperpass();});
superpassModal.addEventListener('close',()=>{superpassForm.reset()});
superpassForm.addEventListener('submit',e=>{e.preventDefault();const name=$('#superpass-name').value.trim(),email=$('#superpass-email').value.trim();$('#superpass-success-message').textContent=`Thanks, ${name} — we'll send your Superpass confirmation to ${email}.`;superpassFormView.hidden=true;superpassSuccessView.hidden=false;});
$('#superpass-done').addEventListener('click',closeSuperpass);
}
$$('.superpass-form').forEach(form=>{const status=form.querySelector('.superpass-status');form.addEventListener('submit',event=>{event.preventDefault();const name=form.elements.name.value.trim(),email=form.elements.email.value.trim();status.textContent=`Thanks, ${name} — we'll send Superpass details to ${email}.`;form.reset();});});
const ticketForm=$('#ticket-form');
if(ticketForm){const ticketStatus=$('#ticket-status');ticketForm.addEventListener('submit',event=>{event.preventDefault();const name=ticketForm.elements.name.value.trim(),email=ticketForm.elements.email.value.trim();ticketStatus.textContent=`Thanks, ${name} — opening BookMyShow to complete your booking. We'll send confirmation to ${email}.`;window.open('https://in.bookmyshow.com/explore/home','_blank','noopener');});}
// Structured navigation mirrors the visible chapter controls without opening external windows.
if(document.modelContext?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'navigate_ramayana_chapter',title:'Navigate the Ramayana prototype',description:'Move to a chapter of the six-stage prototype.',inputSchema:{type:'object',properties:{chapter:{type:'integer',minimum:1,maximum:6}},required:['chapter'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!Number.isInteger(input?.chapter)||input.chapter<1||input.chapter>6)throw new Error('Choose a chapter from 1 to 6.');if(input.chapter<=3)scrollTo({top:(journey.offsetHeight-innerHeight)*[0,.44,1][input.chapter-1],behavior:'instant'});else(stages[input.chapter-4].closest('.flow-slot')||stages[input.chapter-4]).scrollIntoView({behavior:'instant'});return{chapter:input.chapter};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
render();
