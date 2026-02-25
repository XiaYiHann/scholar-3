---
name: research-experiment
description: Deprecated alias of `research-proposal` for backward compatibility.
version: 2.1.0
metadata:
  phase: proposal
  deprecated: true
  alias_of: research-proposal
  outputs:
    - research/proposals/Pxx-*/proposal.md
    - research/proposals/Pxx-*/experiment-plan.md
    - research/proposals/Pxx-*/tasks.md
    - research/proposals/Pxx-*/experiment-report.md
    - research/proposals/Pxx-*/verify.md
    - research/evidence-ledger.md
---

`research-experiment` 已弃用，请使用 `research-proposal`。

兼容规则：
- 命令入口统一使用 `/proposal`（`/experiment` 仅兼容保留）。
- 产物路径与规则不变，仍使用 proposal 包结构。
- 模板与规范以 `skills/research-proposal/SKILL.md` 为准。
