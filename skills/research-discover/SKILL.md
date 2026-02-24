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

进入 Idea 模式（严格、规范驱动）。

你要做的不是“生成一份新 proposal”，而是维护一个**单一的、可冻结的** `research/idea.md`（Idea Spec）。
所有后续实验/论文都必须对照它。

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

建议默认问：
1) 当前是 draft 还是要 freeze（若已有 idea）
2) 本次目标：补 formulation / 补文献 / 补证伪条件 / 补评测协议
3) 文献检索可用性：能 websearch 还是用户提供链接

## Exit Criteria（允许进入实验的闸门）
满足以下条件才建议进入 `/experiment`：
- 至少 1 个主假设 H1 + 至少 1 条证伪条件 F1（可操作阈值）
- Evaluation Protocol 写死：dataset/setting + primary metric + tuning protocol
- >= 6 篇核心文献（>=2 强 baseline），每条有可核验指针或明确 UNVERIFIED
- Evidence ledger 至少包含 C1/C2（planned 也可，但 evidence 要写清楚）

## 产出动作（强制顺序）
1) 确保 `research/idea.meta.yaml` 存在（无则创建为 draft）
2) 创建/更新 `research/idea.md`
3) 创建/更新 `research/evidence-ledger.md`
4) 若用户决定 freeze：把 meta.yaml state 改为 frozen 并 bump version
