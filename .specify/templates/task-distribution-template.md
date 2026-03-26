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
| None assigned | N/A | N/A | N/A | N/A | Not started | Populate when multi-agent implementation begins |