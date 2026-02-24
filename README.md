# Scholar-3: OPSX-style Research Workflow for Claude Code / Codex

Scholar-3 is a strict, spec-driven research workflow designed for agentic coding tools.

It enforces:
- a **single global Idea Spec** (formulation + protocols) that can be **frozen**
- multiple **phase proposals** (plan → tasks → report → verify)
- an **Evidence Ledger** binding paper claims to concrete artifacts
- **no fabrication** of citations or results

## Workflow

```text
/discover  ->  Idea Spec (draft)  -> freeze ->  phase proposals (P01, P02, ...)
                      |                                 |
                      | (amendment gate)                v
                      +------------------------ /verify decision
/experiment -> /apply -> /verify -> /paper
```

## Outputs (created in your project)

Idea:
- `research/idea.md` — single source of truth (formulation, H/F/C IDs, evaluation protocol)
- `research/idea.meta.yaml` — state machine (draft/frozen), version, counters
- `research/evidence-ledger.md` — Claim→Evidence→Pointer ledger

Proposals:
- `research/proposals/Pxx-*/proposal.md`
- `research/proposals/Pxx-*/experiment-plan.md`
- `research/proposals/Pxx-*/tasks.md`
- `research/proposals/Pxx-*/experiment-report.md`
- `research/proposals/Pxx-*/verify.md`

Amendments:
- `research/idea-amendments/Axx-*.md`

Paper:
- `research/paper/claim-evidence-map.md`
- `research/paper/manuscript.md`
- `research/paper/rebuttal.md`

## Commands

- `/discover` — create/update `research/idea.md`, initialize ledger, prepare to freeze
- `/experiment` — create/select a proposal folder and generate proposal+plan+tasks scaffolding
- `/apply` — execute tasks step-by-step (checkbox tracked)
- `/verify` — falsification + reproducibility + evidence-ledger audit, decide next action
- `/paper` — write paper using ONLY `verified` claims from the evidence ledger

## Migration (legacy → vNext)

If you previously used Scholar-3 v1 artifact names:
- `idea-proposal.md` → `research/idea.md` + `research/idea.meta.yaml`
- `experiment-report.md` → `research/proposals/Pxx-*/experiment-report.md`
- `manuscript.md` → `research/paper/manuscript.md`
- `rebuttal.md` → `research/paper/rebuttal.md`

## Installation

### Via Git Clone (Recommended)

```bash
cd ~/.claude
git clone https://github.com/XiaYiHann/scholar-3.git
```

### Manual Installation

Copy to your `.claude/` directory:

```bash
cp -r scholar-3/skills/* ~/.claude/skills/
cp -r scholar-3/commands/* ~/.claude/commands/
```

## Scholar-3 spec config & schema (optional)

This repo includes a schema/config/templates bundle under `scholar/`. It acts as a single, inspectable definition of:
- artifact DAG (what files exist, dependencies)
- per-artifact rules
- canonical templates

You can copy `scholar/` into your research project if you want your project to carry the workflow spec.

## License

MIT
