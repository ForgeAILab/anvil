---
created_at: 2026-09-02T00:00:00Z
updated_at: 2026-09-02T00:00:00Z
completed_at:
---

## 1. Lens skill

- [x] 1.1 Author `.claude/skills/worker-guidelines/SKILL.md` in lens shape (thesis / rules / self-test per principle, tradeoff note, "working if" line; about 400 words of body).
  - Scenario: agent-workflow / A lens is not a stage
  - Depends on: none
  - Parallel-safe: yes
  - Files: `.claude/skills/worker-guidelines/SKILL.md`
- [x] 1.2 Point `/execute-task` at the lens (description + one rule) so the boundary is mutual.
  - Scenario: agent-workflow / Execute-task applies the lens
  - Depends on: 1.1
  - Parallel-safe: yes
  - Files: `.claude/skills/execute-task/SKILL.md`

## 2. Ship it with every project

- [x] 2.1 Template `AGENTS.md` (nextjs, vite-react): add a "Worker lens" section naming the skill as in force while implementing and listing its four theses; template `CLAUDE.md`: one pointer line; template `docs/spark/AGENTS.md`: skill-table row.
  - Scenario: agent-workflow / Generated project carries the lens
  - Depends on: 1.1
  - Parallel-safe: yes
  - Files: `templates/nextjs/AGENTS.md`, `templates/vite-react/AGENTS.md`, `templates/nextjs/CLAUDE.md`, `templates/vite-react/CLAUDE.md`, `templates/nextjs/docs/spark/AGENTS.md`, `templates/vite-react/docs/spark/AGENTS.md`
- [x] 2.2 Root `AGENTS.md` skill table: add the "Worker lens" row.
  - Depends on: 1.1
  - Parallel-safe: yes
  - Files: `AGENTS.md`

## 3. Mirror, docs, counts

- [x] 3.1 `bun run scripts/sync-skills.ts` → `.codex/skills/worker-guidelines/`; `bun run check:skills` green.
  - Scenario: agent-workflow / Generated project carries the lens
  - Depends on: 1.1, 1.2
  - Parallel-safe: no
- [x] 3.2 `docs/skill-authoring.md`: add the *lens skill* kind and its shape; scope the body skeleton to pipeline/pack skills.
  - Depends on: 1.1
  - Parallel-safe: yes
  - Files: `docs/skill-authoring.md`
- [x] 3.3 `README.md` and `.claude-plugin/marketplace.json`: 17 → 18 skills.
  - Depends on: 1.1
  - Parallel-safe: yes
  - Files: `README.md`, `.claude-plugin/marketplace.json`

## 4. Truth (at archive)

- [ ] 4.1 Merge the `agent-workflow` delta (Worker Lens Ships With Every Project) into `docs/spec/specs/agent-workflow/spec.md`.

## 5. Verification

- [x] 5.1 `bun test` and `bun run check:skills` green; `bun run lint` clean.
- [x] 5.2 (vite-react, --no-packs: 18/18 skills in both mirrors, AGENTS.md + CLAUDE.md + docs/spark/AGENTS.md all reference the lens) Scaffold a throwaway project with `create-spark` and confirm both skill mirrors and the `AGENTS.md` section are present.
