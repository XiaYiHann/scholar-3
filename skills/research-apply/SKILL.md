---
name: research-apply
description: 进入 Apply 模式 - 逐条执行 proposal 的 tasks.md（checkbox 追踪），产出可复现实验工件并更新报告与证据账本。
version: 1.0.0
metadata:
  phase: apply
  outputs:
    - research/proposals/Pxx-*/tasks.md
    - research/proposals/Pxx-*/experiment-report.md
    - research/evidence-ledger.md
---

进入 Apply 模式（严格执行，不做空谈）。

## 输入前置
必须存在：
- `research/idea.md`（且通常应 frozen）
- `research/proposals/Pxx-*/tasks.md`
- `research/proposals/Pxx-*/experiment-plan.md`

若存在多个 proposal，必须先要求用户选择 Pxx（或由上下文明确）。

## 规则（不可协商）
- 只做 tasks.md 里**未完成**的 checkbox 项。
- 只有当“预期输出路径的文件/目录确实存在”时，才允许把 `- [ ]` 改成 `- [x]`。
- 每完成一组关键任务，必须同步更新：
  - `experiment-report.md`（写 pointers）
  - `research/evidence-ledger.md`（更新 status + pointers）
- 遇到阻塞必须停止，明确提出阻塞原因与需要的用户输入。

## 代码与实验规范
- 代码风格参考：`skills/research-experiment/references/coding-style.md`
- 可复现要求参考：`skills/research-experiment/references/experiment-reproducibility.md`
