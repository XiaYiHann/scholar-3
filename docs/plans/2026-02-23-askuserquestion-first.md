# AskUserQuestion-first Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 让三阶段研究工作流尽量使用 `AskUserQuestion` / `request_user_input` 进行结构化交互，而不是依赖用户自由输入。

**Architecture:** 仅修改三份阶段技能文档，在每个阶段加入统一“交互协议 + 入口问诊 + 分岔追问模板”，并将子 agent 调用前的参数收集改为选项式多轮提问。

**Tech Stack:** Markdown (`skills/research-*/SKILL.md`)，Claude Code skills/commands 约定，Codex CLI `request_user_input` 约定。

---

### Task 1: 更新 Discovery 阶段技能（discover）

**Files:**
- Modify: `skills/research-discover/SKILL.md`

**Step 1: 插入 AskUserQuestion-first 交互协议**
- 在“简介”后、进入正文活动前加入：工具映射、2-3 选项约束、`Other` 兜底、子 agent 不反问约束。

**Step 2: 插入入口问诊（3 问）与决策映射**
- 增加 `discover_start` / `discover_goal` / `discover_output_now` 的问题集。
- 补充基于 `discover_goal` 的后续追问模板（文献检索深度、时间窗、关键词来源等），保持每轮 2-3 选项。

**Step 3: 校对现有示例与输出模板说明**
- 确保示例不再鼓励“直接开放式提问”，而是指向先问诊再展开。

---

### Task 2: 更新 Experiment 阶段技能（experiment）

**Files:**
- Modify: `skills/research-experiment/SKILL.md`

**Step 1: 插入 AskUserQuestion-first 交互协议**
- 同 Task 1 的协议，强调：派发 `architect` / `data-analyst` 前先结构化收集参数。

**Step 2: 插入入口问诊（3 问）与决策映射**
- 增加 `exp_input` / `exp_focus` / `exp_rigor`。
- 针对 `exp_focus` 给出分支追问模板：框架偏好、基线范围、指标类型、运行预算（每轮 2-3 选项）。

**Step 3: 输出与可复现性段落对齐**
- 把“可复现性要求”与 `exp_rigor` 对齐（快速/标准/严格）。

---

### Task 3: 更新 Paper 阶段技能（paper）

**Files:**
- Modify: `skills/research-paper/SKILL.md`

**Step 1: 插入 AskUserQuestion-first 交互协议**
- 同 Task 1 的协议，强调：长文本生成前先确认写作状态/风格/本次重点。

**Step 2: 插入入口问诊（3 问）与决策映射**
- 增加 `paper_state` / `paper_style` / `paper_focus`。
- 针对 `paper_state=rebuttal` 添加追问模板：是否需要补实验、回复结构优先级等（每轮 2-3 选项）。

**Step 3: 输出模板指引更明确**
- 明确：优先使用 `templates/manuscript.md` 与 `templates/rebuttal.md` 作为骨架。

---

### Task 4: 一致性检查与手动验证清单

**Files:**
- Check: `skills/research-discover/SKILL.md`
- Check: `skills/research-experiment/SKILL.md`
- Check: `skills/research-paper/SKILL.md`

**Step 1: 一致性搜索**
- Run: `rg -n \"AskUserQuestion|request_user_input|入口问诊|问题集\" skills -S`
- Expected: 三个阶段技能都包含协议与入口问诊，并出现对应 `id`。

**Step 2: 手动验证（在 Claude Code / Codex 执行）**
- 运行 `/discover`、`/experiment`、`/paper`，观察是否先出现入口问诊（选项式）。
- 选择不同路径，确认关键分岔点继续用选项式追问而非自由输入。

**Step 3: 可选提交**
- 如需提交变更：`git add skills docs/plans && git commit -m \"docs: askuserquestion-first flows\"`

