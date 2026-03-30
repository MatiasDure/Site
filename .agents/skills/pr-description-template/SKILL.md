---
name: pr-description-template
description: 'Generate short pull request descriptions using the team PR template. Use when writing PR summaries, change summaries, or descriptions from tasks.md, specs, completed feature work, or branch diffs. Produces a Summary heading followed by concise flat bullets.'
argument-hint: '[feature name, branch, or spec path]'
user-invocable: true
---

# PR Description Template

## When to Use

- Writing a PR description from a completed feature branch
- Summarizing completed work from tasks.md
- Turning spec, plan, quickstart, and implementation changes into a short PR summary
- Matching the existing team format that starts with Summary and uses flat bullets

## Inputs To Gather

Read these when available:

- The active feature tasks file
- The related spec and plan
- The changed files or branch diff
- Validation results such as lint and build, if they were actually run

## Procedure

1. Identify the active feature or changed branch.
2. Read the relevant tasks.md file and focus on completed tasks only.
3. Group the work into 3 to 5 outcome-focused bullets.
4. Prefer user-visible behavior and architectural outcomes over file-by-file detail.
5. Mention docs, quickstart, or spec updates only if they were part of the actual changes.
6. Mention validation only if it actually ran and succeeded.
7. Keep the description short and scannable.

## Output Format

```md
Summary
- add [primary user-facing capability]
- introduce [supporting infrastructure or shared system change]
- change or update [UI, layout, or behavior refinement]
- add or update [spec, plan, quickstart, contract, tasks, or checklist artifacts] if applicable
```

## Style Rules

- Start with Summary
- Use flat bullet points only
- Keep each bullet focused on one shipped outcome
- Prefer verbs like add, introduce, change, update, remove
- Do not turn the output into a changelog
- Do not list file names unless explicitly asked
- Keep the tone direct and factual
- If there are spec artifacts, mention them in one final bullet

## Example

```md
Summary
- add explicit light/dark theme selection with persisted preference and an early theme bootstrap to avoid first-paint mismatch
- introduce semantic theme tokens in app/globals.css and update shared UI surfaces to consume them
- change the anime activity section to a mobile-first single-column layout with updated responsive image sizing
- add the full Speckit artifact set for feature 002-theme-toggle-anime-layout (spec, plan, research, data-model, quickstart, contract, tasks, and checklist)
```

## Completion Rule

Return only the finished PR description unless the user explicitly asks for alternatives or a longer version.