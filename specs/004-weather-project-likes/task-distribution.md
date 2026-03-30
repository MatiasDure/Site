# Task Distribution

This file stores the active multi-agent task distribution for the spec in this directory only.
Use it when implementation is intentionally split across sub-agents. If the feature is being
implemented by a single agent, this file can remain unchanged.

## Guidance

- Worker protocol: `../../.specify/memory/task-distribution.md`
- Dispatcher protocol: `../../.specify/memory/subagent-dispatch.md`
- Update this file before launching workers and whenever assignments, branches, worktrees, or
  prerequisite merge state change.
- Record worktree paths as sibling directories beside `personal-website`, not nested inside it.
- Record blocking bundles and the merge state they depend on in the Notes column so later workers
  know whether they can branch yet.

## Active Distribution

| Worker | Goal | Task Bundle | Branch | Worktree Path | Status | Notes |
|--------|------|-------------|--------|---------------|--------|-------|
| Worker A | Implement homepage weather and GitHub activity surfaces | T009-T016 covering `app/lib/open-meteo.ts`, `app/lib/github.ts`, `app/components/WeatherCard.tsx`, `app/components/GitHubActivityGraph.tsx`, `app/components/GitHubActivityGraphClient.tsx`, `app/components/ActivitySection.tsx`, `app/components/index.ts`, `app/lib/index.ts`, and `app/globals.css` | feat-homepage-runtime | D:/Mula/Documents/Matias/study/WebDevelopment/personal-site/personal-website-feat-homepage-runtime | In progress | Branch from `004-weather-project-likes` after commit `7a33f29`. Owns all homepage activity surfaces to avoid conflicts on `ActivitySection.tsx`. Commit with a short message when complete. |
| Worker B | Implement Google auth, SQLite bootstrap, and session-aware navigation | T017-T023 covering `db/client.ts`, `db/schema.ts`, `app/lib/project-sync.ts`, `app/lib/session.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/components/auth/GoogleSignInButton.tsx`, and `app/components/NavBar.tsx` | feat-auth-session-persistence | D:/Mula/Documents/Matias/study/WebDevelopment/personal-site/personal-website-feat-auth-session-persistence | In progress | Branch from `004-weather-project-likes` after commit `7a33f29`. Must read worker protocol docs before editing and operate only inside the assigned worktree. Commit with a short message when complete. |
| Pending | Implement like snapshots and cross-surface toggles | T024-T031 covering likes integration, final validation, and quickstart updates | TBD after Worker B merge | TBD | Blocked | Depends on Worker B being merged back into `004-weather-project-likes` because like mutations require auth, session, and SQLite persistence. |