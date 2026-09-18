# Ramayana — A Living Universe

Complete static source export for deployment on Vercel.

## Included

- HTML: `dist/index.html`
- CSS and animations: `dist/style.css`, `dist/flow.css`
- JavaScript and interactions: `dist/app.js`, `dist/flow.js`
- Images: `dist/assets/*.webp`
- Fonts: `dist/assets/*.woff`
- Vercel configuration: `vercel.json`

## Deploy through Vercel with GitHub

1. Upload this complete folder to a new GitHub repository.
2. In Vercel, choose **Add New → Project**.
3. Import the GitHub repository.
4. Vercel will read `vercel.json`. If the dashboard asks for settings, use:
   - Framework Preset: **Other**
   - Build Command: leave empty
   - Output Directory: `dist`
5. Select **Deploy**.

## Deploy with the Vercel CLI

From the folder containing this file:

```bash
npx vercel
npx vercel --prod
```

Sign in when prompted and accept the detected project settings. The production command publishes the site.

## Custom domain

After deployment, open the project in Vercel and go to **Settings → Domains**. Add `ramayana.fricktechnology.com`, then apply the DNS record Vercel provides. Remove or replace the existing DNS record only when you are ready to move live traffic.

## Notes

- The website has no backend, database, package installation or environment variables.
- All visual assets are included locally.
- Location links open Unseen in a new tab.
- Character reference options open Sidewave and Sage East in new tabs.
- The Vault attempts to display Gabriel Veres in an iframe and includes an external fallback link.
- Browser geolocation requires HTTPS, which Vercel provides automatically.

