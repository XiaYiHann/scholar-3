---
name: Experiment
description: Proposal/Experiment 模式（分阶段 proposal：plan + tasks）
category: Research
tags: [proposal, experiment-plan, tasks]
---

进入 `/experiment`：在冻结的 `research/idea.md` 下创建/选择一个 proposal 目录，并生成：
- `proposal.md`
- `experiment-plan.md`（禁止写结果）
- `tasks.md`（checkbox 严格格式）

输出：
- `research/proposals/Pxx-*/proposal.md`
- `research/proposals/Pxx-*/experiment-plan.md`
- `research/proposals/Pxx-*/tasks.md`

建议下一步：
- `/apply` 执行 tasks
- `/verify` 审计证伪 + 可复现 + 证据闭环
