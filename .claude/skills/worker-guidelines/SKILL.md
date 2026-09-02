---
name: worker-guidelines
description: Behavioral lens for the agent implementing one task. Use while executing a task brief (a `tasks.md` item or a Forge Task) to surface assumptions before coding, keep the change minimal and surgical, and treat the linked scenario's verification as the definition of done. Do NOT use to choose or schedule work — that is `/next-task` and `/execute-task`; this only shapes how the work is done.
license: MIT
---

# Worker Guidelines

Four habits that remove the most common ways an implementing agent goes wrong, adapted
from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876)
to a task that has a brief and a scenario. `/execute-task` says what to do; this says how
to behave while doing it.

**Tradeoff:** these bias toward caution over speed. For a trivial task, use judgment.

## 1. Read the brief before you write

**The brief is the spec. Don't assume. Don't hide confusion.**

- State the assumptions you are making. If the brief admits two readings, present both;
  don't pick one silently.
- If a simpler approach than the one briefed exists, say so before building it.
- If something is unclear, stop and name what is confusing. A wrong guess costs more than
  a question.

The test: can you point at the line in the brief or scenario each decision came from?

## 2. Minimum change that passes the scenario

**Nothing speculative.**

- No features beyond the scenario. No abstractions for single-use code. No
  configurability nobody asked for.
- No error handling for cases that cannot happen.
- If you wrote 200 lines and 50 would do, rewrite it.

The test: would a senior engineer call this overcomplicated?

## 3. Surgical changes

**Touch only the declared files. Clean up only your own mess.**

- Stay inside the brief's file list. A blocker that forces you out gets named in the report.
- Don't improve, reformat, or refactor adjacent code. Match the existing style even where
  you would differ.
- Remove the imports and helpers *your* change orphaned. Leave pre-existing dead code
  alone; mention it instead.
- Work you discover outside scope becomes a follow-up task, never a silent edit.

The test: every changed line traces to the brief.

## 4. Done means verified

**The linked scenario is the definition of done. Loop until it passes.**

- Run the brief's verification command yourself. A passing type-check is not a working
  feature.
- If it fails, fix and rerun. If you cannot, report `Blocked: <the failing step>`, not done.
- A task that lands nothing in the repository is not done. Commit the work on the task
  branch.
- Report what you observed, not what you expect: which command, which result.

The test: could a reviewer reproduce your "done" from the report alone?

---

**These guidelines are working if:** diffs contain only requested changes, clarifying
questions come before code rather than after mistakes, and no task is reported done
without a run behind it.
