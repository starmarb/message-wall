# message-wall — static (no-backend) version

Draw on a phone-style canvas (left) and watch your drawing animate onto a
"MESSAGE WALL" display (right), all in one browser tab. No server, database,
or backend required. Nothing is uploaded or saved anywhere — drawings live
only in the tab's memory and vanish when it closes.

## Deploying to GitHub Pages (deploy from a branch — no CI, one step)

The pre-built site is already committed in the **`docs/`** folder, so there
is nothing to build on GitHub. Just:

1. Create a new repo named **`message-wall`** and push this project to `main`.
2. In the repo: **Settings → Pages → Source → Deploy from a branch**,
   branch = **`main`**, folder = **`/docs`**. Save.
3. Your site goes live at **https://<your-username>.github.io/message-wall/**
   within a minute or two.

That's it. No GitHub Actions, no workflow files, nothing that can fail on
GitHub's side.

> **Important:** the build in `docs/` has the base path `/message-wall` baked
> in, so it only works at `.../message-wall/`. If you name the repo anything
> other than `message-wall`, you must rebuild (see below) with the new name.

## Editing the site later

The real source lives in `next-frontend/`. After changing anything, rebuild
and refresh the `docs/` folder:

```bash
cd next-frontend
npm install --legacy-peer-deps          # first time only (React 19 peer warning)
NEXT_PUBLIC_BASE_PATH=/message-wall npm run build
cd ..
rm -rf docs && cp -r next-frontend/out docs && touch docs/.nojekyll
```

Then commit and push `docs/` to `main`. Pages redeploys automatically.

(The `.nojekyll` file matters — it stops GitHub from running Jekyll on the
output, which would otherwise break the `_next/` asset folder.)

### Local dev

```bash
cd next-frontend
npm run dev
```

The `hono-backend/` folder is unused here and kept only for reference.
