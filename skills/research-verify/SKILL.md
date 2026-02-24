---
name: research-verify
description: 进入 Verify 模式 - 审计证伪条件、可复现性、证据闭环，并决定：修计划 / 新 proposal / 发起 Idea Amendment。
version: 1.0.0
metadata:
  phase: verify
  outputs:
    - research/proposals/Pxx-*/verify.md
    - research/idea-amendments/Axx-*.md
    - research/evidence-ledger.md
---

进入 Verify 模式（审计优先）。

## 前置
- 必须定位到一个 proposal：`research/proposals/Pxx-*/`
- 必须读取：
  - `proposal.md`
  - `experiment-plan.md`
  - `tasks.md`
  - `experiment-report.md`（若已有）
  - `research/evidence-ledger.md`
  - `research/idea.meta.yaml`

## 核心输出
- 生成/更新 `research/proposals/Pxx-*/verify.md`（使用 `scholar/schemas/scholar-research/templates/verify.md`）
- 给出明确决策（只能选一个）：
  1) FIX PLAN
  2) NEW PROPOSAL
  3) IDEA AMENDMENT NEEDED

## 冻结 Idea 的强规则
- 若 idea 是 frozen：
  - 不得改 `research/idea.md`
  - 若需要改 formulation/protocol，必须创建 `research/idea-amendments/Axx-*.md`
  - 并请求用户显式 accept/reject/defer
