---
name: research-experiment
description: 进入 Proposal/Experiment 模式 - 在单一冻结 Idea 下创建分阶段 Proposal（plan + tasks），并准备执行。
version: 2.0.0
metadata:
  phase: experiment
  outputs:
    - research/proposals/Pxx-*/proposal.md
    - research/proposals/Pxx-*/experiment-plan.md
    - research/proposals/Pxx-*/tasks.md
    - research/proposals/Pxx-*/experiment-report.md
    - research/proposals/Pxx-*/verify.md
    - research/evidence-ledger.md
---

进入实验模式（但本阶段首先是：**创建/维护分阶段 proposal 工件**）。

## 硬前置（默认严格）
- 必须存在：
  - `research/idea.md`
  - `research/idea.meta.yaml`
  - `research/evidence-ledger.md`
- 若 `research/idea.meta.yaml` 的 `state != frozen`：
  - 默认：拒绝进入正式实验执行
  - 只能给两个选项：
    1) 回 `/discover` 补齐并 freeze
    2) 用户明确选择 “继续在 draft 下做探索性实验”（必须在 report 里标注为 exploratory）

## 目标（本阶段你必须输出的工件）
对一个 proposal 目录（`research/proposals/Pxx-<slug>/`）生成/更新：
- `proposal.md`（意图、范围、目标 IDs、成功/停止条件）
- `experiment-plan.md`（预注册 + E* 映射，禁止写结果）
- `tasks.md`（checkbox 严格格式，apply 追踪）

模板来源：
- `scholar/schemas/scholar-research/templates/proposal.md`
- `scholar/schemas/scholar-research/templates/experiment-plan.md`
- `scholar/schemas/scholar-research/templates/tasks.md`

## 入口问诊（AskUserQuestion-first）
建议问：
1) 选择 proposal：新建 / 继续 Pxx / 查看已有列表
2) 本 proposal 的目标：验证哪个 H/F，支持哪个 C
3) 本次只做 planning 还是要进入执行（执行建议用 `/apply`）

## Proposal 编号规则（强制）
- 从 `research/idea.meta.yaml` 读取 `proposal_counter`
- 新建 proposal 时：
  - proposal_counter += 1
  - 生成 P01/P02...
  - proposal slug 用 kebab-case（简短）

## 对照规则（不可违反）
- proposal 的 Target IDs 必须来自 `research/idea.md` 的 H/F/C。
- 禁止在 experiment-plan 里改 primary metric / tuning protocol（除非走 amendment）。

## 输出策略（默认）
- 生成/更新 proposal 三件套后，建议用户运行：
  - `/apply` 执行 tasks
  - `/verify` 做审计与下一步决策
