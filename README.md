# doodle-display — static (no-backend) version

This version of the app has been stripped down so it can be hosted entirely
on **GitHub Pages**, with no server, database, or `hono-backend` required:

- `/` — the main experience: a phone mockup on the left with a fully working
  drawing canvas, and a message-wall display on the right. Draw and submit,
  and the drawing animates onto the wall in the same browser tab.
- `/canvas` and `/success` — the same drawing flow as standalone pages, if
  you want to link directly to just the phone experience.

Nothing is uploaded or saved anywhere else. Drawings only ever live in this
browser tab's memory/`sessionStorage`, just long enough to render them, and
disappear the moment the tab is closed or the person navigates away.

The `hono-backend` folder is left untouched in case you want it for a future,
backend-connected deployment (e.g. on Vercel/Render + a real domain) — it's
just not used by this GitHub Pages build.

## Deploying to GitHub Pages (deploy from a branch)

This repo publishes by having GitHub Actions build the site and push it to
a `gh-pages` branch, which Pages then serves directly — no Pages "deployment
API" involved, so there's nothing to enable beyond picking the branch.

1. Push this repo to GitHub (a new repo, or an existing one).
2. Push to `main` (or run the workflow manually from the **Actions** tab).
   `.github/workflows/deploy.yml` builds `next-frontend` as a static site
   and pushes the result to a `gh-pages` branch it creates automatically.
3. Once that workflow finishes (check the **Actions** tab for a green
   checkmark), go to **Settings → Pages**, set **Source** to
   **Deploy from a branch**, and pick **`gh-pages`** as the branch
   (root folder). Save.
4. Your site will be live at `https://<username>.github.io/<repo-name>/`
   (or `https://<username>.github.io/` if the repo is literally named
   `<username>.github.io`).

The workflow automatically sets the app's base path to match your repo name,
so image paths and routing work correctly under the GitHub Pages subfolder.

### Local dev

```bash
cd next-frontend
npm install --legacy-peer-deps   # react-canvas-draw expects React 16/17; project uses 19
npm run dev
```

(`--legacy-peer-deps` is only needed for that one peer-dependency warning —
harmless, and already baked into the CI workflow.)
