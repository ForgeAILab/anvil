## ADDED Requirements

### Requirement: Worker Lens Ships With Every Project
Every scaffolded project SHALL carry a `worker-guidelines` lens skill — a behavioral guideline for the agent implementing one task (surface assumptions before coding, minimum change that passes the scenario, surgical edits inside the declared files, verification as the definition of done) — in `.claude/skills/` and its `.codex/skills/` mirror, and the template `AGENTS.md` SHALL declare the lens in force while a task is being implemented.

#### Scenario: Generated project carries the lens
- **WHEN** `create-spark` scaffolds a project from any template
- **THEN** `.claude/skills/worker-guidelines/SKILL.md` and `.codex/skills/worker-guidelines/SKILL.md` exist in the project
- **AND** the project's `AGENTS.md` names the lens as in force during task implementation

#### Scenario: A lens is not a stage
- **WHEN** an agent reads the `worker-guidelines` skill
- **THEN** it finds behavioral principles only — a thesis, short rules, and a self-test per principle, an explicit tradeoff note, and a closing "working if" line
- **AND** it finds no phase, routing table, approval gate, or output template
- **AND** the skill defers choosing and scheduling work to `/next-task` and `/execute-task`

#### Scenario: Execute-task applies the lens
- **WHEN** `/execute-task` implements a task
- **THEN** assumptions are surfaced before the first edit, changes stay inside the brief's declared files, and the task is reported done only after its verification command has run
- **AND** work discovered outside scope is reported as a follow-up task rather than edited silently
