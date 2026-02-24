# Tasks: Pxx-[slug]

**Rule**: Use strict checkbox format `- [ ] X.Y ...` or progress tracking breaks.

---

## 1) Setup & Repro
- [ ] 1.1 Capture environment snapshot
  - Command: `python -V && pip freeze > artifacts/logs/env.txt`
  - Outputs: `artifacts/logs/env.txt`
  - Accept: file exists, includes key deps
  - Links: E1

- [ ] 1.2 Create config files for runs (baseline + ours)
  - Command: `mkdir -p artifacts/configs && cp -r configs/* artifacts/configs/`
  - Outputs: `artifacts/configs/`
  - Accept: configs present and referenced by run commands
  - Links: E1 supports C1

## 2) Baselines
- [ ] 2.1 Run baseline A (>=3 seeds)
  - Command: `python run.py --config configs/baseline_a.yaml --seeds 0 1 2`
  - Outputs: `artifacts/logs/baseline_a/*/metrics.json`
  - Accept: 3 metrics.json exist + aggregated table generated
  - Links: E1 tests H1 via F1

## 3) Ours
- [ ] 3.1 Run ours (>=3 seeds)
  - Command: `python run.py --config configs/ours.yaml --seeds 0 1 2`
  - Outputs: `artifacts/logs/ours/*/metrics.json`
  - Accept: 3 metrics.json exist + aggregated table generated
  - Links: E1 supports C1

## 4) Analysis & Artifacts
- [ ] 4.1 Generate main table + CI
  - Command: `python tools/summarize.py --in artifacts/logs --out artifacts/tables/main.csv`
  - Outputs: `artifacts/tables/main.csv`
  - Accept: table exists and includes CI/std + seed count
  - Links: C1

- [ ] 4.2 Produce figures (curves/ablation)
  - Command: `python tools/plot.py --in artifacts/logs --out artifacts/figures/`
  - Outputs: `artifacts/figures/*`
  - Accept: figures exist with captions in filenames
  - Links: C2

## 5) Report & Ledger
- [ ] 5.1 Update experiment-report.md with pointers
  - Outputs: `experiment-report.md`
  - Accept: all result statements include pointers to artifacts
  - Links: C1,C2

- [ ] 5.2 Update evidence-ledger statuses and pointers
  - Outputs: `research/evidence-ledger.md`
  - Accept: C* entries updated to partial/verified/falsified with pointers
  - Links: ledger
