---
name: research-discover
description: 进入 Idea 模式 - 构建/更新单一 Idea Spec（可冻结），并初始化 Evidence Ledger。
version: 2.0.0
metadata:
  phase: idea
  outputs:
    - research/idea.md
    - research/idea.meta.yaml
    - research/evidence-ledger.md
---

进入 Idea 模式（严格、规范驱动，Discover v2）。

你要做的不是“生成一份新 proposal”，而是维护一个**单一的、可冻结的** `research/idea.md`（Idea Spec）。
所有后续实验/论文都必须对照它。  
本阶段内部流程固定为：**Diverge → Challenge → Converge → Handoff**。

## Truthfulness & Verification Contract（不可协商）
- 不编造文献：题目/作者/年份/venue/arXiv/DOI/链接只能来自检索结果或用户材料；否则标 UNVERIFIED。
- 不编造结果：Idea 阶段只能写假设/计划/证伪条件，不得写“提升了 X%”。
- 信息不足就停：先结构化追问补齐，再推进。

## 核心工件（必须）
- `research/idea.md`：单一 Idea Spec（含 H*/F*/C* IDs 与 Evaluation Protocol）
- `research/idea.meta.yaml`：state(draft|frozen)、version、计数器
- `research/evidence-ledger.md`：Claim→Evidence→Pointer 账本

模板来源（仓库内）：
- `scholar/schemas/scholar-research/templates/idea.md`
- `scholar/schemas/scholar-research/templates/idea.meta.yaml`
- `scholar/schemas/scholar-research/templates/evidence-ledger.md`

## Discover v2 阶段闸门（强制）
1) **Gate 0 — Intake**
   - 读取 `idea.meta.yaml`，确认 `draft|frozen`。
   - 若 frozen：禁止直接修改 formulation/protocol，改为 amendment 路径。
2) **Gate 1 — Diverge（至少 3 个候选）**
   - 在 `idea.md` 的 Candidate Directions 记录 I1/I2/I3（方向、机制、收益、主要风险）。
3) **Gate 2 — Challenge（逐项挑战）**
   - 为候选方向补齐反例/失败模式、关键假设、可观测失败信号。
4) **Gate 3 — Converge（收敛为单一主线）**
   - 固化 H*/F*/C* 与评测协议；未选方向写入 Decision Log（为何淘汰）。
5) **Gate 4 — Handoff**
   - 生成 Proposal Handoff Capsule，交给 `/proposal` 直接消费。

## Idea-as-Spec 协议（强制）
- 每轮与用户交互后，必须把新增信息写回 `research/idea.md` 的：
  - Decision Log（新增/修改了什么）
  - Open Questions（缺什么会阻塞下一步）
  - Literature Map（新增条目，VERIFIED/UNVERIFIED）
- 必须维护稳定 IDs：H*, F*, C*。
- 若 `idea.meta.yaml` 为 frozen：
  - 不得直接改 `idea.md`
  - 只能创建 `research/idea-amendments/Axx-*.md` 并请求用户明确决策

## 入口问诊（AskUserQuestion-first）
在 Claude Code 中优先使用 AskUserQuestion；在 Codex 中优先 request_user_input。
每轮 1–3 题，每题 2–3 选项，并提供自由输入兜底。

建议默认问（固定 ID）：
1) `discover_start`：当前状态是什么  
   - 从零开始新想法
   - 延续当前 draft idea
   - frozen 后评估是否要 amendment
2) `discover_goal`：本轮目标是什么  
   - 发散候选方向（Diverge）
   - 收敛并冻结主线（Converge）
   - 补文献与证据账本（Literature/Ledger）
3) `discover_constraints`：本轮约束优先级  
   - novelty 优先
   - feasibility 优先（算力/时间）
   - reproducibility 优先（可复现/可审计）
4) `discover_diverge_lens`（当 goal=发散时追问）  
   - problem-first
   - solution-first
   - contradiction/failure-first
5) `discover_freeze_decision`（当可收敛时）  
   - 继续 draft，补缺口
   - freeze 并进入 `/proposal`
   - 需要 amendment 决策

## Exit Criteria（允许进入 proposal 的闸门）
满足以下条件才建议进入 `/proposal`：
- 至少 3 个候选方向已完成 Diverge/Challenge 记录，且有 1 个收敛主线
- 至少 1 个主假设 H1 + 至少 1 条证伪条件 F1（含可操作阈值）
- Evaluation Protocol 写死：dataset/setting + primary metric + tuning protocol
- >= 6 篇核心文献（>=2 强 baseline），每条有可核验指针或明确 UNVERIFIED
- Evidence ledger 至少包含 C1/C2（planned 可接受，但 evidence 需求要写清）
- `idea.md` 已填写 Proposal Handoff Capsule（目标 IDs、风险 top3、未决问题）

## 产出动作（强制顺序）
1) 确保 `research/idea.meta.yaml` 存在（无则创建为 draft）
2) 创建/更新 `research/idea.md`
3) 创建/更新 `research/evidence-ledger.md`
4) 若用户决定 freeze：把 meta.yaml state 改为 frozen 并 bump version
