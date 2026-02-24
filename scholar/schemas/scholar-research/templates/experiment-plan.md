# Experiment Plan: Pxx-[slug]

**Date**: YYYY-MM-DD  
**Idea Version**: vX.Y  
**Rule**: This file contains plans only — **NO results**.

---

## 1) Experiment Map (E* -> H/F/C)
| Experiment | Tests hypothesis | Falsification | Supports claim(s) | Primary metric | Datasets/setting |
|---|---|---|---|---|---|
| E1 | H1 | F1 | C1 | ... | ... |
| E2 | H1 | (sanity) | C1 | ... | ... |
| E3 | ... | ... | ... | ... | ... |

---

## 2) Pre-registration (minimum)
- Primary metric (locked): ...
- Tuning protocol (val only): ...
- # runs / seeds: ...
- Early stopping rule: ...
- Reporting rule (no cherry-pick; failures included): ...

---

## 3) Data & Leakage Controls (mandatory)
- Split protocol:
- Preprocessing fit scope (train-only):
- Test access policy (final-only):
- Data version identifiers:

---

## 4) Baseline Fairness Protocol
- Baseline sources (official code/paper):
- Tuning budget parity:
- If baseline reproduction fails: how we report it

---

## 5) Reproducibility Plan (mandatory)
- Environment snapshot (pip freeze / conda env export):
- Deterministic seeds policy:
- Config logging:
- Output directory conventions:
- Commands to reproduce:

---

## 6) Expected Artifacts (paths)
- logs: `artifacts/logs/...`
- configs: `artifacts/configs/...`
- figures: `artifacts/figures/...`
- tables: `artifacts/tables/...`
