# Sub-Agent Dispatch Protocol

This file defines the responsibilities of the single dispatcher agent that coordinates worker
sub-agents during a parallel implementation run.

The shared `.specify/memory/task-distribution.md` file defines the protocol only. The active
assignment ledger for a feature MUST live in that feature's own
`specs/<feature>/task-distribution.md` file.

## Dispatcher Responsibilities

1. Read the active `tasks.md` and identify which tasks can be worked on together without blocking
   on the same files.
2. Separate tasks into clear bundles that share one outcome and are unrelated enough to be worked
   on in parallel without same-file conflicts or hidden sequencing dependencies.
3. Ensure the working spec directory has its own `task-distribution.md` file before workers start.
4. Identify blocking or foundational bundles before dispatching unrelated feature bundles. If one
   bundle unlocks others, stage and land that blocker first instead of forcing blocked work to run
   in parallel.
5. Complete any blocking or foundational bundles first, commit them with short, specific messages,
   and merge them back into the working feature branch before launching dependent workers.
6. Create a distinct, goal-oriented branch and sibling worktree path for each bundle only after the
   base feature branch contains the committed spec artifacts and any required prerequisite changes.
7. Update `specs/<feature>/task-distribution.md` with every active worker assignment, including
   the goal, task bundle, branch name, worktree path, and any coordination notes.
8. Instruct every worker to read `.specify/memory/task-distribution.md` and the working spec's
   `task-distribution.md` before implementation.
9. Keep ownership boundaries clear. If two bundles touch the same file or require sequential work,
   keep them with one worker or stage them in sequence instead of pretending they are parallel.
10. Merge completed worker branches back into the active feature branch in dependency order so later
   worktrees branch from the latest committed integration point.
11. Reassign or rebundle work only by updating the working spec's `task-distribution.md` first.

## Dispatch Workflow

1. Start from the active feature branch that already contains the current spec artifacts such as
   `spec.md`, `plan.md`, and `tasks.md`.
2. Review the task list and split work into independent bundles plus any blocking bundles.
3. Land blocking bundles first.
4. After each blocking bundle is finished, commit it, merge it into the active feature branch, and
   only then dispatch any bundles that depended on it.
5. Launch unrelated, non-blocked bundles in parallel.
6. Repeat until all bundles are implemented and merged back into the active feature branch.

## Dispatch Heuristics

- Prefer bundles that map to one user story, one feature slice, or one shared outcome.
- Separate bundles by file ownership, dependency order, and reviewability.
- Keep bundle names short but specific enough to explain the branch purpose.
- Avoid launching workers until prerequisite or foundational tasks that block all bundles are done,
  committed, and merged back into the feature branch that later worktrees will use.
- Do not treat "technically different" work as parallel if one part still depends on another. For
  example, a project-like UI bundle is blocked by auth and persistence if the tasks require real
  authenticated like mutations.
- Prefer obvious parallel splits such as independent weather and GitHub integrations when they do
  not share blocking infrastructure.
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
- The worker was explicitly told that the worktree path must be a sibling of `personal-website`,
   not nested inside the repository.
- The worker was explicitly told to commit with a short, detailed message when the bundle is done.
- The worker was explicitly told that completed work must be merged back into the active feature
   branch before dependent bundles continue.
- Open conflicts, sequencing constraints, and integration points are documented in the Notes column.