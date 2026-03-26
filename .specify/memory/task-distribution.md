# Task Distribution Protocol

This file is the stable worker-facing protocol for multi-agent implementation. It defines how
workers discover assignments, create isolated worktrees, and escalate conflicts. It does NOT hold
the active assignment ledger for every feature.

## Per-Spec Source Of Truth

The active distribution for a working feature MUST live in that feature's own spec directory at:

`specs/<feature>/task-distribution.md`

Each generated spec directory MUST include its own `task-distribution.md`. The dispatcher updates
that spec-local file, and every worker reads that spec-local file before implementation.

## Worker Startup Protocol

1. Read this file fully.
2. Identify the working spec directory and open its active distribution file at
   `specs/<feature>/task-distribution.md`.
3. Locate the assignment row that names your worker and task bundle in that spec-local file.
4. From the parent directory of `personal-website`, create a dedicated worktree and branch for
   your assigned goal:

   ```bash
   cd ..
   git -C personal-website worktree add -b <clear-goal-branch-name> personal-website-<clear-goal-branch-name> HEAD
   cd personal-website-<clear-goal-branch-name>
   ```

5. The branch name MUST be clear, lowercase, and representative of the overall goal of the tasks
   you are implementing, for example `feat-theme-toggle-layout`.
6. Work ONLY inside that worktree and ONLY on the task bundle assigned to you.
7. If the assignment changes, re-read the spec-local distribution file before continuing.
8. If you find cross-bundle file overlap, dependency ambiguity, or blockers that require task
   reshaping, stop and hand the issue back to the dispatcher.

## Assignment Rules

- One worker sub-agent owns one task bundle and one worktree at a time.
- Task bundles MUST group work that belongs together and can progress without same-file conflicts.
- The dispatcher owns reassignment, rebundling, and conflict resolution.
- Workers MUST NOT edit another worker's branch, worktree, or assigned files unless the dispatcher
  updates the spec-local `task-distribution.md` first.

## Spec-Local Distribution Requirements

Every `specs/<feature>/task-distribution.md` file MUST include:

- The feature context for that spec only.
- An active assignment table with worker, goal, task bundle, branch, worktree path, status, and notes.
- Enough current detail for any worker to recover their task bundle and worktree without guesswork.