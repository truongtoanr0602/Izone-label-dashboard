---
name: deploy-vps
description: Use when asked to deploy, redeploy, or push the latest code live to the production VPS (izone_vps) — pull latest onto the server and rebuild/restart the backend and/or dashboard containers. Not for local dev (npm run dev) or the GitHub Pages target (npm run deploy).
---

# Deploy VPS

## Overview

Deploys `backend/` and/or `dashboard/` to the production Docker stack on
`izone_vps` (`root@160.187.146.127`, alias in `~/.ssh/config`). Four phases:
confirm what's actually about to ship, recall known deploy failure modes,
execute on the VPS, and log anything new that broke. Skip no phase — the
two production incidents this skill's memory-check step exists to prevent
(backend crash-loop, blank dashboard page) were both **latent bugs that only
a real rebuild+redeploy surfaced**, not things `git diff` would have shown.

## Workflow

### 1. Confirm local code and `origin/main` actually agree

The VPS deploys from `origin/main` on GitHub, not from this local working
tree — so the real question is "does `origin/main` have everything intended
to ship," not "does the VPS match my laptop."

```bash
git fetch origin
git log HEAD..origin/main --oneline    # origin ahead of local? fine, just note it
git log origin/main..HEAD --oneline    # local ahead of origin? these commits won't deploy until pushed
git status --short -- backend/ dashboard/ docker-compose.prod.yml backend/Dockerfile dashboard/Dockerfile dashboard/nginx.conf
```

Scope the `status` check to deploy-relevant paths only — this repo always
has unrelated untracked/modified noise at the root (docs, `.cursorrules`,
`.kiro/`, etc. from other AI-tool configs) that has nothing to do with what
ships.

- Local ahead of `origin/main` with commits touching the scoped paths →
  ask the user whether to push before deploying (don't push silently; the
  user may be mid-work). Deploying without pushing means the VPS won't get
  those changes at all.
- Uncommitted changes in the scoped paths → surface them and ask; don't
  guess whether they're meant to ship.
- Local behind `origin/main` only → normal case, proceed.

### 2. Reread deploy-relevant memory before touching the VPS

```bash
ls .claude/agents/memory/debug/
```

Read every file there (there are only a handful, all short) — don't
filter by filename alone. Each entry documents a confirmed root cause and,
for deploy-related ones, a "deploy-mechanics gotchas" section. Known ones as
of this writing (still verify against the actual files — this list will go
stale):

- **Compose project identity is directory-based.** Always build/deploy from
  `/root/izone-label-dashboard` (project name `izone-label-dashboard`,
  matching the running containers' `com.docker.compose.project` label) —
  never from a worktree like `.worktrees/main-latest-runtime`. Running from
  the wrong directory makes Compose fail to recognize the live containers as
  its own and try to *create* new ones with the same `container_name`,
  which hard-conflicts.
- **`backend` depends_on `postgres` in `docker-compose.prod.yml`.** Always
  pass `--no-deps` when bringing up `backend`/`dashboard` so Compose doesn't
  also try to create/touch the `postgres` service — it will otherwise spin
  up a *new, empty* `izone_postgres_prod` next to the real (oddly-named,
  unmanaged) running Postgres container.
- **`nest build`'s output path is not guaranteed flat.** If `backend/`
  changed, don't assume `dist/main.js` — a stray root-level `.ts` file
  (e.g. `prisma.config.ts`) can widen tsc's inferred `rootDir` and nest the
  output under `dist/src/`, breaking the Dockerfile's `CMD`.
- **A `200` from `curl` on a dashboard asset URL is not proof it's the real
  asset.** nginx's SPA `try_files` fallback returns `index.html` (status
  `200`, wrong `content-type`) for any path that doesn't exist on disk —
  check `content-type` on JS/CSS asset URLs, not just status code.

If any memory entry's fix isn't actually present in the current code (e.g.
someone reverted it), treat that as itself a deploy blocker worth flagging
before proceeding, not something to silently rediscover from scratch.

### 3. Deploy on the VPS

Run from `/root/izone-label-dashboard` (never a worktree — see Phase 2):

```bash
ssh izone_vps "cd /root/izone-label-dashboard && git status --short && git log -1 --oneline"
ssh izone_vps "cd /root/izone-label-dashboard && git pull --ff-only origin main"
```

`--ff-only` on purpose — if this fails (diverged history, detached HEAD with
local changes, etc.), stop and investigate rather than force-merging on a
production box. If HEAD is detached at a commit whose tree already matches
`origin/main` content-for-content (verify with `git diff origin/main`
first), `git reset --hard origin/main` is safe; otherwise don't.

Figure out what actually needs rebuilding instead of always rebuilding both
services — compare each image's build time to the latest commit touching
its source path:

```bash
docker inspect izone_backend_prod   --format '{{.Created}}' # image build time
docker inspect izone_dashboard_prod --format '{{.Created}}'
git -C /root/izone-label-dashboard log -1 --format='%ci' -- backend/    # (over ssh)
git -C /root/izone-label-dashboard log -1 --format='%ci' -- dashboard/
```

Build and recreate only the stale service(s), always with `--no-deps`:

```bash
ssh izone_vps "cd /root/izone-label-dashboard && docker compose -f docker-compose.prod.yml build <service...>"
ssh izone_vps "cd /root/izone-label-dashboard && docker compose -f docker-compose.prod.yml up -d --no-deps <service...>"
```

If a build/recreate produces an unexpected error (name conflict, crash-loop
on start, etc.), stop and diagnose it as its own bug per phase 4 below —
don't just retry or force through it (a name conflict in particular usually
means phase 2's directory gotcha was missed; check `docker ps -a` for
anything you didn't intend to create before removing/force-recreating
anything).

Verify, in this order:

```bash
ssh izone_vps "docker ps --format 'table {{.Names}}\t{{.Status}}' | grep izone_"
ssh izone_vps "docker logs izone_backend_prod --tail 20"     # if backend touched
ssh izone_vps "docker logs izone_dashboard_prod --tail 20"   # if dashboard touched
ssh izone_vps "curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/api/..."
ssh izone_vps "curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8088/"
```

Then check the real public entry point, not just localhost inside the VPS —
`curl -sL <public dashboard URL>` and confirm the referenced asset URLs
return the right `content-type` (see phase 2's SPA-fallback gotcha):

```bash
curl -sI https://dashboard.ducanhn.autos/assets/<the-js-file-referenced-in-index.html>
```

Clean up anything stray you created while diagnosing an error (unused
networks/volumes/containers from a failed attempt) before finishing — check
`docker ps -a` / `docker volume ls` / `docker network ls` for anything with
an unfamiliar name and confirm it's yours before removing it.

### 4. Log new issues to memory

If phase 3 hit something not already covered by an existing memory file —
and you diagnosed and fixed it (not just worked around it) — add a new
dated file to `.claude/agents/memory/debug/`, matching the structure of the
existing entries: frontmatter (`date`/`scope`/`status`/`commits`), then
Symptom / Root cause / Fix / Verify per bug, plus a "deploy-mechanics
gotchas" section if you hit a new one of those. This is the same convention
the `debug` subagent (`.claude/agents/debug.md`) reads before every
investigation — an undocumented fix here is a fix the next deploy will pay
for again.

If the fix touched source code (not just VPS-side config), it must be
committed and pushed to `origin/main` — patching only on the VPS silently
diverges from git and the next `git pull` there won't know about it. Confirm
with the user before pushing straight to `main` unless they've already
granted that latitude for this kind of fix-forward-to-unblock-deploy
situation.

If nothing new happened, don't write a memory file — routine deploys aren't
incidents.

## Common mistakes

- Building/deploying from a worktree directory instead of
  `/root/izone-label-dashboard` — silently creates duplicate containers/
  volumes/networks instead of updating the real ones.
- Running `docker compose up` on `backend`/`dashboard` without `--no-deps`
  and accidentally touching `postgres`.
- Treating `curl` returning `200` as proof an asset loaded correctly,
  without checking `content-type`.
- Rebuilding both services on every deploy instead of checking which one's
  source actually changed since its image was built.
- Silently patching a source bug only on the VPS instead of committing it —
  the fix vanishes on the next `git pull` there.
- Skipping the phase 2 memory read and re-debugging a gotcha that's already
  documented.
