# Experiment Workflow (Proposal Package)

本文档提供 `research-experiment`（Proposal/Experiment 规划阶段）的工作流程说明。

> 核心定位：本阶段主要负责“把一个 phase 变成可执行的 proposal 包（proposal + plan + tasks）”，实际执行与审计分别交给 `/apply` 与 `/verify`。

## 输入前置

必须存在：
- `research/idea.md`
- `research/idea.meta.yaml`
- `research/evidence-ledger.md`

默认要求：
- `research/idea.meta.yaml` 的 `state: frozen`（否则只能做 exploratory，并在后续 report/verify 中明确标注）

## 产出（proposal 包）

对一个目录 `research/proposals/Pxx-<slug>/` 生成/更新：
- `proposal.md`：意图、范围、目标 IDs、成功/停止条件、风险
- `experiment-plan.md`：预注册（NO results）、E* 映射、泄漏控制、baseline 公平性、可复现计划
- `tasks.md`：严格 checkbox 清单（用于 `/apply` 逐条执行）

建议把实验产物统一放在 proposal 目录内：
- `artifacts/logs/`
- `artifacts/configs/`
- `artifacts/figures/`
- `artifacts/tables/`

## 步骤

### 1) 选择或新建 proposal（Pxx）

编号规则（强制）：
- 从 `research/idea.meta.yaml` 读取 `proposal_counter`
- 新建时 `proposal_counter += 1`，生成 `P01/P02/...`

### 2) 写 `proposal.md`

要求：
- 明确 intent（要证伪/支持什么）
- Target IDs 必须来自 `research/idea.md`（H*/F*/C*）
- 写清 success / kill criteria
- 明确依赖与风险（泄漏、baseline 公平性、统计功效、复现性缺口）

### 3) 写 `experiment-plan.md`（计划-only）

硬规则：
- 只写计划，不写任何结果（NO results）
- 预注册至少包含：
  - primary metric（唯一主指标，写死）
  - tuning protocol（val-only，不触碰 test）
  - seeds/repeats（默认 >= 3）
  - reporting rule（失败也要记录，不许 cherry-pick）

### 4) 写 `tasks.md`（可追踪执行清单）

硬规则：
- 必须使用 `- [ ] X.Y ...` 的 checkbox 格式（否则进度追踪会失效）
- 每个任务必须包含：
  - Command
  - Outputs（路径）
  - Accept（验收标准）
  - Links（E*/H*/F*/C*）

### 5) 交接到 `/apply` 与 `/verify`

- `/apply`：按 tasks.md 的未完成项逐条执行；只有输出存在才允许勾选。
- `/verify`：审计证伪条件、可复现性、证据账本闭环，并给出下一步决策（FIX PLAN / NEW PROPOSAL / IDEA AMENDMENT）。

## 常见错误（Fail-fast）

- 把结果写进 `experiment-plan.md`（违规）
- 在 plan 阶段偷偷改 primary metric 或 tuning protocol（应走 amendment）
- tasks.md 没有 outputs/acceptance/links（无法审计）
- 产物路径不稳定、指针不精确（ledger 无法闭环）
