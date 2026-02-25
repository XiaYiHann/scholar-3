# Idea Spec: [Title]

**Created**: YYYY-MM-DD  
**Last Updated**: YYYY-MM-DD  
**State**: draft | frozen  
**Idea Version**: vX.Y (from `research/idea.meta.yaml`)  
**Owner**: [Name/Team]

---

## 0) Contract (Non-negotiable)
- This file is the **single source of truth** for formulation and evaluation protocol.
- Stable IDs:
  - Hypotheses: H1, H2, ...
  - Falsification criteria: F1, F2, ... (each references exactly one H*)
  - Paper-facing claims/contributions: C1, C2, ...
- If `research/idea.meta.yaml` says `state: frozen`:
  - Do **NOT** edit this file directly.
  - Use `research/idea-amendments/Axx-*.md` and require explicit user decision.

## 0.5) Plain-language Rule (for Formulation)
- If you write any formal definition / equation / threshold, you must also add:
  - `Symbols:` what each symbol means.
  - `Plain-language explanation (大白话):` 1–3 lines explaining what this means in practice.
- If no formalism is used in a subsection, write `N/A (no new formalism)`.

---

## 1) Problem Statement
### 1.1 Research question
- What is the exact question?

### 1.2 Why it matters
- Why is this important now?

### 1.3 Gap
- What is missing in existing work?

### 1.4 Candidate Directions (Divergence Log)
> Record at least 3 candidate directions before convergence.

| Idea ID | Direction summary | Expected upside | Main risk | Keep / Drop |
|---|---|---|---|---|
| I1 | ... | ... | ... | keep/drop |
| I2 | ... | ... | ... | keep/drop |
| I3 | ... | ... | ... | keep/drop |

### 1.5 System View (ASCII)
```text
+----------------+      +------------------+      +------------------+      +-------------------+
| Problem & Gap  | ---> | H/F/C Formulation| ---> | Evidence Planning | ---> | Proposal Handoff  |
+----------------+      +------------------+      +------------------+      +-------------------+
```
Plain-language summary: We start from a real problem, define testable hypotheses/claims, pre-plan evidence, then hand off to `/proposal`.

---

## 2) Problem Normal Form (Strict)
> Reduce the idea to a falsifiable, evaluable, reproducible core.

### 2.1 Task / Setting
- Task type: [...]
- Setting: [...]
- Dataset(s) / environment(s): [...]
- Primary metric (single, locked): [...]
- Plain-language explanation (大白话): [Explain why this setting/metric is the right one.]

### 2.2 Input / Output
- Input: [...]
- Output: [...]
- Plain-language explanation (大白话): [Explain in plain language what goes in and what comes out.]

### 2.3 Baselines (>= 2 strong baselines)
- Baseline A: [verifiable reference] — why it is strong
- Baseline B: [verifiable reference] — why it is strong

### 2.4 Constraints
- Compute budget:
- Data constraints:
- Safety/ethics constraints (if any):

### 2.5 Formal Definition Snippet (optional but recommended)
- Formal definition (optional):
- Symbols:
- Plain-language explanation (大白话, required if formal definition is used):
- What would falsify this definition?

---

## 3) Hypotheses (H*)
### H1: [one-sentence hypothesis]
- Mechanism intuition:
- Assumptions:
- Predicted observable effect:
- Scope (in/out):
- Formal definition (optional):
- Symbols:
- Plain-language explanation (大白话, required if formalism is used):

### H2: ...
...

### 3.5 Assumptions & Risk Register
> Make reviewer-attack surfaces explicit before freeze.

| Risk ID | Linked H/F/C | Assumption | Failure mode | Detection signal | Mitigation |
|---|---|---|---|---|---|
| R1 | H1/F1/C1 | ... | ... | ... | ... |
| R2 | ... | ... | ... | ... | ... |

### 3.6 Causal Path (ASCII)
```text
[Input/Intervention] -> [Mechanism] -> [Observable Effect]
                              |
                        [Failure Signal]
```
Plain-language summary: This shows what we change, why it should work, what we observe, and what signal counts as failure.

---

## 4) Falsification Criteria (F*)
> Each F* references exactly one H* and defines a concrete failure signal.

### F1 (tests H1):
- If [observable condition + threshold], then H1 is considered **falsified**.
- Plain-language explanation (大白话): [Explain why this threshold means the hypothesis failed.]

### F2 (tests H2):
- ...

---

## 5) Paper-facing Claims / Contributions (C*)
> These are what you want to write in the paper, but they are NOT "true" yet.

### C1: [claim statement]
- Minimum evidence required:
- Strong evidence (stretch):
- Expected artifacts (tables/figures/log paths):
- Plain-language explanation (大白话): [Explain what this claim really says for a non-expert.]

### C2: ...
...

---

## 6) Literature Map (verifiable)
> No fabricated citations. If a reference is not fully verifiable, mark **UNVERIFIED**.

For each entry:
- Title:
- Authors:
- Year:
- Venue/arXiv/DOI:
- URL:
- Verification: VERIFIED | UNVERIFIED
- 1–2 sentence takeaway:
- Relation: baseline | gap | technique | negative result

### Core set (seed papers)
1) ...

### Extended set
- ...

---

## 7) Evaluation Protocol (Lock this before freeze)
- Data split protocol (train/val/test or equivalent):
- Hyperparameter tuning protocol (must not touch test):
- Reporting rule (no cherry-picking; report failures):
- Seeds / repeats:
- Statistical reporting:
- Leakage checks:
- Baseline fairness protocol:
- Plain-language explanation (大白话): [Explain this protocol as step-by-step execution rules.]

### 7.5 Evaluation Pipeline (ASCII)
```text
Data -> Split(train/val/test) -> Tune(val only) -> Run(seeds)
     -> Report(metrics + uncertainty) -> Leakage/Fairness checks
```
Plain-language summary: First lock data and tuning rules, then run repeated experiments, report uncertainty, and audit leakage/fairness.

---

## 8) Proposal Roadmap (phases)
> List the planned proposals (P01, P02, ...) and which IDs they target.

- P01: targets H1/F1, supports C1
- P02: targets H2/F2, supports C2

### 8.5 Proposal Handoff Capsule (for `/proposal`)
> Keep this concise so proposal phase can start without re-discovery.

- Candidate selected: I?
- Target IDs for next phase: H* / F* / C*
- Locked protocol summary:
  - dataset/setting:
  - primary metric:
  - tuning protocol:
- Baseline set (must include >=2 strong baselines):
- Evidence ledger focus (which claims to move from planned -> partial/verified):
- Top 3 risks (from risk register):
- Open questions that block execution:

---

## 9) Decision Log (append-only)
- YYYY-MM-DD: decision ... (why)

---

## 10) Open Questions / Missing Inputs
- Q1:
- Q2:
