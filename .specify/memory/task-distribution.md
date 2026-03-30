# Task Distribution Protocol

This file is the stable worker-facing protocol for multi-agent implementation. It defines how
workers discover assignments, create isolated worktrees from committed integration points, and
escalate conflicts. It does NOT hold the active assignment ledger for every feature.

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
4. Confirm the working feature branch, written as `###-feature-branch` in this protocol, already
   contains a committed baseline for the current phase. That baseline MUST include the spec
   directory and any prerequisite files needed by every worker, such as `spec.md`, `plan.md`,
   `tasks.md`, and any other relevant spec artifacts.
5. Do NOT create a worktree from uncommitted changes. If a required change is still local, commit
   it on `###-feature-branch` first so every downstream worktree starts from the same committed
   state.
6. If your bundle depends on blocking or foundational tasks, those tasks MUST be completed,
   committed, and merged back into `###-feature-branch` before any follow-on worktrees are
   created. Create later worktrees from that resulting commit, not from an earlier `HEAD`.
7. From the parent directory of `personal-website`, create a dedicated worktree and branch for
   your assigned goal:

   ```bash
   cd ..
   git -C personal-website worktree add -b <clear-goal-branch-name> personal-website-<clear-goal-branch-name> ###-feature-branch
   cd personal-website-<clear-goal-branch-name>
   ```

8. The branch name MUST be clear, lowercase, and representative of the overall goal of the tasks
   you are implementing, for example `feat-theme-toggle-layout`.
9. Work ONLY inside that worktree and ONLY on the task bundle assigned to you.
10. When the assigned bundle is complete, commit the work on your assigned branch with a short,
   specific message that describes the delivered outcome.
11. Hand the completed branch back for merge into the active feature branch. If later bundles were
   blocked on your work, they MUST wait until this merge is finished and the dispatcher updates the
   spec-local distribution file.
12. If the assignment changes, re-read the spec-local distribution file before continuing.
13. If you find cross-bundle file overlap, dependency ambiguity, or blockers that require task
   reshaping, stop and hand the issue back to the dispatcher.

## Assignment Rules

- One worker sub-agent owns one task bundle and one worktree at a time.
- Task bundles MUST group work that belongs together and can progress without same-file conflicts.
- Blocking or foundational tasks MUST be completed first on `###-feature-branch`. After they are
   merged, new worktrees MUST branch from that updated commit before dependent work continues.
- Worktrees MUST be created as siblings of `personal-website`, never inside the repository root.
- Completed worker branches MUST be committed and then merged back into `###-feature-branch`
   before dependent bundles continue.
- The dispatcher owns reassignment, rebundling, and conflict resolution.
- Workers MUST NOT edit another worker's branch, worktree, or assigned files unless the dispatcher
  updates the spec-local `task-distribution.md` first.

## Spec-Local Distribution Requirements

Every `specs/<feature>/task-distribution.md` file MUST include:

- The feature context for that spec only.
- An active assignment table with worker, goal, task bundle, branch, worktree path, status, and notes.
- Enough current detail for any worker to recover their task bundle, worktree, base feature branch,
  and prerequisite sequencing without guesswork.
- Clear notes when a bundle is blocked, what it depends on, and whether the dependency has already
   been merged into the active feature branch.