# Scholar-3 (OPSX-style Research)

A strict, spec-driven research workflow designed for **Claude Code** (and compatible with **Codex**).

## Workflow (high-level)
- `/discover` → build/update a single **Idea Spec** (`research/idea.md`)
- `/discover` includes ideation gates: diverge → challenge → converge → handoff
- Freeze the idea (`research/idea.meta.yaml` → `state: frozen`)
- `/proposal` → create/select a **phase proposal** under `research/proposals/Pxx-*`
- `/apply` → execute tasks step-by-step (checkbox tracked)
- `/verify` → audit falsification, reproducibility, evidence ledger, and decide next action
- `/paper` → write paper using ONLY `verified` claims from the evidence ledger (usually after `/verify`)

## Outputs (in the user's project)
- Idea:
  - `research/idea.md`
  - `research/idea.meta.yaml`
  - `research/evidence-ledger.md`
- Proposals:
  - `research/proposals/Pxx-*/proposal.md`
  - `research/proposals/Pxx-*/experiment-plan.md`
  - `research/proposals/Pxx-*/tasks.md`
  - `research/proposals/Pxx-*/experiment-report.md`
  - `research/proposals/Pxx-*/verify.md`
- Amendments:
  - `research/idea-amendments/Axx-*.md`
- Paper:
  - `research/paper/claim-evidence-map.md`
  - `research/paper/manuscript.md`
  - `research/paper/rebuttal.md`
