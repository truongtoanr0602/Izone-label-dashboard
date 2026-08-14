---
date: 2026-08-14
scope: VPS production deploy (izone_vps, 160.187.146.127) — backend + dashboard containers
status: resolved
commits: 80674ed, 333dc14 (both pushed to origin/main)
---

# VPS deploy: backend crash-loop, then dashboard blank white page

Two independent latent bugs, both only surfaced during a routine "pull latest
+ redeploy" on the VPS — neither was introduced by that deploy, they were
sitting undetected because nobody had rebuilt the images (backend) or loaded
the site through its real custom domain (dashboard) in a while.

## Bug 1 — backend container crash-looped after rebuild

**Symptom:** `docker logs izone_backend_prod` → `Error: Cannot find module
'/app/dist/main'`, `MODULE_NOT_FOUND`, container stuck in `Restarting`.

**Root cause:** `backend/prisma.config.ts` lives at the backend project root
(sibling of `src/`), not inside `src/`. With no `rootDir` pinned in
`tsconfig.json`/`tsconfig.build.json`, TypeScript infers `rootDir` as the
longest common path of every included `.ts` file — so once `prisma.config.ts`
is in scope, that common root becomes the backend root itself instead of
`src/`, and `nest build` emits `dist/src/main.js` instead of `dist/main.js`.
`backend/Dockerfile`'s `CMD ["node", "dist/main"]` (and the `start:prod`
script) still assumed the flat path.

`prisma.config.ts` has existed since 2026-08-05 — this bug has likely been
latent since then; the previously-running container just happened to predate
whatever last touched the build output shape, and nobody had rebuilt from a
clean `dist/` since.

**Fix:** exclude `prisma.config.ts` from the Nest build in
`backend/tsconfig.build.json` (it's only read directly by the Prisma CLI at
`prisma generate`/`migrate` time via its own TS loader — never imported from
`src/`, so excluding it from `tsc` is safe). Restores `dist/main.js` at the
expected top-level path. Commit `80674ed`.

**Verify:** `docker logs izone_backend_prod` shows `Nest application
successfully started`; `curl localhost:3000/api/...` returns a real HTTP
status instead of connection refused.

## Bug 2 — dashboard rendered blank white page on the custom domain

**Symptom:** `https://dashboard.ducanhn.autos/` loads (200, valid HTML,
`<div id="root"></div>`) but nothing renders — blank white page, no visible
error without opening devtools.

**Root cause:** `dashboard/vite.config.ts` hardcodes `base:
'/Izone-label-dashboard/'`, which is correct *only* for the GitHub Pages
deploy (`npm run deploy`, which publishes under that subpath — see
`CLAUDE.md`'s note "Do not remove that base — assets 404 on Pages without
it"). The Docker image (`dashboard/Dockerfile`) built with the exact same
`vite build` and baked the same subpath into `index.html`'s asset URLs, but
`dashboard/nginx.conf` serves the app from the domain root with a SPA
fallback (`try_files $uri $uri/ /index.html`). So a request for
`/Izone-label-dashboard/assets/index-*.js` doesn't match a real file, falls
through to the fallback, and nginx returns `index.html` with
`content-type: text/html` and a `200` — the browser tries to parse that as a
JS module, fails silently, and React never mounts. `curl -I` on the asset
URL returning `200` is a red herring here; the interesting signal is the
`content-type` header, not the status code.

(Checked and ruled out as a *separate* concern: `dashboard/src/api/client.ts`
uses a relative `API_BASE_URL = '/api'`, not the hardcoded
`http://localhost:3000/api` that `CLAUDE.md`/the debug-issue hotspot table
describe — that hardcoding claim is stale for the Docker deployment path;
nginx already proxies `/api` → `backend:3000` correctly. Worth a `sync-docs`
pass if this comes up again.)

**Fix:** made `base` conditional on Vite mode in `vite.config.ts`
(`mode === 'docker' ? '/' : '/Izone-label-dashboard/'`), added a
`build:docker` script (`tsc -b && vite build --mode docker`) in
`dashboard/package.json`, and pointed `dashboard/Dockerfile` at that script
instead of the plain `build`. GitHub Pages build (`npm run build` /
`npm run deploy`) is untouched. Commit `333dc14`.

**Verify:** `curl -sL https://dashboard.ducanhn.autos/` → asset URLs are
`/assets/*` (no subpath); `curl -sI` on that URL →
`content-type: application/javascript`, not `text/html`.

## Deploy-mechanics gotchas hit along the way (not code bugs, but will bite again)

- **Compose project identity is directory-name-based.** The real prod
  containers were created from `/root/izone-label-dashboard` (compose
  project `izone-label-dashboard`, confirmed via
  `docker inspect ... com.docker.compose.project` label). Running
  `docker compose` from `/root/izone-label-dashboard/.worktrees/main-latest-runtime`
  instead uses project name `main-latest-runtime`, which doesn't recognize
  the existing containers as "its own" and tries to *create* new ones with
  the same `container_name` → hard conflict on `backend`, and (worse) it
  will happily create a **new, empty** `izone_postgres_prod` container +
  fresh volume because `backend` has `depends_on: [postgres]`. That stray
  postgres container never started (state stayed `Created`) so no data was
  at risk this time, but always build/deploy from
  `/root/izone-label-dashboard` directly, and if postgres isn't meant to be
  touched, pass `--no-deps` to `up`.
- No `schema_migrations`-style tracking table exists in the prod DB — there
  is no reliable way to check which of `database/migrations/00N_*.sql` have
  actually been applied except reading the live schema by hand. Don't assume
  migrations ran just because the file exists in the repo.
- The running postgres container's actual name is
  `2767a0ac5a41_izone_postgres_prod` (container-ID-prefixed), not the
  `izone_postgres_prod` the compose file declares — it wasn't created
  through a normal `docker compose up` of this project's `postgres` service
  (no matching compose labels). Treat it as an unmanaged/manually-adopted
  container; don't expect `docker compose` commands run against this project
  to affect it.

## Suggested doc follow-up

`CLAUDE.md`'s line "the deployed build's API base URL is currently
**hardcoded to** `http://localhost:3000/api`" is stale for `client.ts` as of
this repo state (it's `/api`, relative) — only the *build base path* problem
was real, and only for the Docker deploy target, which `CLAUDE.md` doesn't
mention at all (it only discusses the GitHub Pages target). Worth a
`sync-docs` pass to add the Docker/VPS deployment path to `CLAUDE.md` and
correct the `client.ts` claim.
