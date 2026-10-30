# HITAM Toastmasters

Official website for the HITAM Toastmasters Club.

## Project Structure

- `frontend/`: React 19 + TypeScript + Vite single page application with GSAP animations, Lenis smooth scroll, Three.js WebGL effects, and custom audio/timer interactions.

## Local Development

```bash
cd frontend
npm install
npm run dev
```

## Production Build

```bash
cd frontend
npm run build
```

## Deploying on Render (Static Site)

This project can be deployed on Render as a **Static Site**:

### Option 1: Automatic Blueprint (Recommended)
1. Go to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect `https://github.com/Abhineeth-23/hitam-toastmasters.git`.
4. Render will read `render.yaml` and configure everything automatically.

### Option 2: Manual Static Site Setup
1. In Render Dashboard, click **New +** > **Static Site**.
2. Connect the repository.
3. Set the following settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Important (SPA Rewrites)**: Go to the **Redirects/Rewrites** tab in your service settings and add:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   *(This ensures routes like `/about`, `/team`, `/join` do not return 404 on direct load or refresh)*
