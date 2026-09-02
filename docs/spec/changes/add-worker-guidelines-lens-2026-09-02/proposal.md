---
created_at: 2026-09-02T00:00:00Z
updated_at: 2026-09-02T00:00:00Z
---

## Why

Every spark skill is a procedure: a stage with inputs, rules, a workflow, and an output
template. None of them says how an implementing agent should *behave* while it works. The
failure modes that cost the most on real projects — a silently picked interpretation,
an over-built abstraction, a drive-by refactor of adjacent code, a task reported done
without a run — are behavioral, and `/execute-task` only mentions them in passing inside
its rules list. A short, always-on behavioral lens (in the shape of the
`andrej-karpathy-skills` plugin: thesis, three to five rules, one self-test per principle)
fixes this without adding a pipeline stage.

The same lens reaches Forge Task Workers for free: a Forge project scaffolded with spark
carries `.claude/skills/` and `AGENTS.md`, and the CLI agents Forge dispatches into task
worktrees read both.

## What Changes

- **New lens skill `worker-guidelines`** in `.claude/skills/` (mirrored to
  `.codex/skills/`): four principles — read the brief before you write, minimum change
  that passes the scenario, surgical changes, done means verified — each with a bold
  thesis, short rules, and a self-test line; an explicit tradeoff note; a closing
  "working if" line. About 400 words of body. No phase, routing, gate, or output template.
- **Template `AGENTS.md` (nextjs, vite-react)** declares the lens in force while
  implementing a task and lists its four theses; template `CLAUDE.md` points at it.
- **`/execute-task`** applies the lens (description and rules point at it; the lens's
  description points back).
- **Skill authoring guide** gains a third skill kind, *lens skill*, with its shape, so
  the authoring checklist stops assuming every skill is a stage.
- Skill count references (README, marketplace manifest) move from 17 to 18.

## Impact

- **Affected specs:** `agent-workflow`
- **Affected code:** `.claude/skills/worker-guidelines/SKILL.md` (new),
  `.claude/skills/execute-task/SKILL.md`, `.codex/skills/**` (re-mirrored),
  `templates/{nextjs,vite-react}/AGENTS.md`, `templates/{nextjs,vite-react}/CLAUDE.md`,
  `templates/{nextjs,vite-react}/docs/spark/AGENTS.md`, root `AGENTS.md`,
  `docs/skill-authoring.md`, `README.md`, `.claude-plugin/marketplace.json`.
- **Non-goals:** no new pipeline stage or front door; no change to the approval gate, the
  planner / implementer / evaluator split, or `tasks.md` semantics; no Forge-specific
  vocabulary in the lens beyond naming a Forge Task as one host of a task brief.
