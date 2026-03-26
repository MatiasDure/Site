<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Multi-Agent Task Distribution

When task implementation is explicitly distributed across sub-agents before coding begins, one dispatcher agent MUST follow `.specify/memory/subagent-dispatch.md`, every worker sub-agent MUST read `.specify/memory/task-distribution.md`, and the active assignment ledger MUST live in the working spec directory at `specs/<feature>/task-distribution.md`.
