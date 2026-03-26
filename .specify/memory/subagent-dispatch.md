# Sub-Agent Dispatch Protocol

This file defines the responsibilities of the single dispatcher agent that coordinates worker
sub-agents during a parallel implementation run.

The shared `.specify/memory/task-distribution.md` file defines the protocol only. The active
assignment ledger for a feature MUST live in that feature's own
`specs/<feature>/task-distribution.md` file.

## Dispatcher Responsibilities

1. Read the active `tasks.md` and identify which tasks can be worked on together without blocking
   on the same files.
2. Group tasks into clear bundles that share one outcome and can be implemented in parallel with
   other bundles.
3. Ensure the working spec directory has its own `task-distribution.md` file before workers start.
4. Complete any blocking or foundational tasks first, commit them, and merge them into the working
   feature branch before launching dependent workers.
5. Create a distinct, goal-oriented branch and worktree name for each bundle only after the base
   feature branch contains the committed spec artifacts and any required prerequisite changes.
6. Update `specs/<feature>/task-distribution.md` with every active worker assignment, including
   the goal, task bundle, branch name, worktree path, and any coordination notes.
7. Instruct every worker to read `.specify/memory/task-distribution.md` and the working spec's
   `task-distribution.md` before implementation.
8. Keep ownership boundaries clear. If two bundles touch the same file or require sequential work,
   keep them with one worker or stage them in sequence instead of pretending they are parallel.
9. Reassign or rebundle work only by updating the working spec's `task-distribution.md` first.

## Dispatch Heuristics

- Prefer bundles that map to one user story, one feature slice, or one shared outcome.
- Separate bundles by file ownership, dependency order, and reviewability.
- Keep bundle names short but specific enough to explain the branch purpose.
- Avoid launching workers until prerequisite or foundational tasks that block all bundles are done,
  committed, and merged back into the feature branch that later worktrees will use.
- Keep the spec-local distribution file concise and scoped to a single spec so it remains readable.

## Worker Handoff Checklist

Before dispatching a worker, verify all of the following:

- The assigned tasks belong together and are implementation-ready.
- The base feature branch already contains the committed spec directory and every prerequisite
   artifact required by the bundle.
- The bundle has a clear branch name and matching worktree path.
- The assignment is recorded in the working spec's `task-distribution.md`.
- Blocking bundles that must land first are documented and already merged before dependent workers
   are started.
- The worker was explicitly told to operate only inside its assigned worktree.
- Open conflicts, sequencing constraints, and integration points are documented in the Notes column.