# AskUserQuestion-first 交互优化设计

**日期**: 2026-02-23  
**范围**: `scholar-3` 阶段工作流（`/discover`、`/proposal`、`/apply`、`/verify`、`/paper`）  

## 背景与问题

当前工作流在关键阶段仍较依赖用户自由输入。对“意图澄清、分岔选择、参数收集”等场景，用户需要自己组织文本回答，导致：
- 交互成本高、回答不稳定（缺信息、顺序混乱）
- 子 agent 往往还要反问，回合变多
- 不同平台（Claude Code / Codex）体验不一致

目标是把这些“可结构化”的交互尽量改成 `AskUserQuestion`（Claude Code）/`request_user_input`（Codex）的选项式回答。

## 目标

- 在核心决策阶段（discover/proposal/paper）中，尽可能用结构化提问替代自由输入（必要时仍允许 `Other` 文本兜底）
- 每次提问 1-3 个问题；每题 2-3 个选项；需要更多分支时用多轮串联
- 中文优先（选项与问题均中文）
- 子 agent 不再向用户反问；主 agent 在派发前通过提问把参数收集完整

## 非目标

- 不实现/修改任何平台工具本身，只调整本仓库的 `SKILL.md` 行为指引与问题集
- 不新增总入口命令（如 `/scholar`）；本次仅优化各阶段命令/技能内部交互

## 工具与兼容性约定

- **Claude Code**: 使用工具 `AskUserQuestion`（名称以平台为准）
- **Codex**: 使用工具 `request_user_input`
- 选项式提问不显式包含 “Other”，由平台 UI 提供文本兜底；收到 `Other` 时，继续追问把答案结构化（仍遵循 2-3 选项）

## 总体交互协议（写入每个阶段 SKILL）

1. 任何分岔/澄清/参数收集，默认先用结构化提问
2. 先问“意图/目标/材料状态”，再做任何长输出或子 agent 调用
3. 子 agent 一律不向用户询问；主 agent 在调用前通过结构化提问收集必要参数
4. 问题 `id` 使用 `snake_case`，带阶段前缀（`discover_*`/`proposal_*`/`paper_*`）

## 阶段入口问诊（v1）

### /discover

- `discover_start`（起点）: 模糊想法 / 具体问题或假设 / 已有 proposal 想改
- `discover_goal`（目标）: 清晰问题+假设 / 文献地图+Gap / 验证计划(含小实验)
- `discover_output_now`（输出）: 生成 proposal / 先不生成 / 不确定

### /proposal

- `proposal_input`（材料）: 有 frozen idea + ledger / 只有口头描述 / 想先回 discover
- `proposal_focus`（重点）: 规划实验设计 / 细化任务清单 / 评估是否可执行
- `proposal_rigor`（可复现）: 标准可复现 / 快速探索优先 / 严格记录

### /paper

- `paper_state`（状态）: 从零起草 / 已有草稿需改写 / 准备 rebuttal
- `paper_style`（风格）: 顶会 / 期刊 / 通用版本
- `paper_focus`（优先）: 大纲+Abstract / 主体(Method+Experiments) / Rebuttal 结构化回复

## 决策映射（摘要）

- `/discover`: 根据 `discover_goal` 决定主路径；如选择文献检索/验证计划，在调用 `literature-reviewer` 等子 agent 前先问关键词、时间窗、检索深度等（多轮、每轮 2-3 选项）
- `/proposal`: 先确认输入材料与本次重点，再决定是只产出 proposal+plan+tasks，还是紧接着进入 `/apply`；所有实验参数（框架、数据集、指标、baseline 范围）优先结构化收集
- `/paper`: 根据写作状态与本次优先输出，决定生成 `research/paper/manuscript.md` 还是 `research/paper/rebuttal.md` 路径；先结构化确认 venue/篇幅/重点后再开始长文本生成

## 验证方式

- 在 Claude Code 与 Codex 中分别运行 `/discover`、`/proposal`、`/paper` 观察（`/experiment` 仅作兼容别名验证）：
  - 是否首先出现入口问诊（选项式）
  - 是否在关键分岔点继续使用选项式追问
  - 是否将 `Other` 回答进一步结构化（而不是直接进入长输出）
