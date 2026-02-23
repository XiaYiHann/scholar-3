---
name: research-paper
description: 进入论文撰写模式 - 写作、投稿、回审和报告。当用户想要撰写学术论文、准备投稿材料、回复审稿意见或生成报告时使用。
version: 1.0.0
metadata:
  phase: paper
  inputs:
    - research/experiment-report.md
    - research/evidence-ledger.md
  outputs:
    - research/manuscript.md
    - research/rebuttal.md
    - research/evidence-ledger.md
---

进入论文撰写模式。撰写论文。准备投稿。回复审稿。

**这是研究的第三阶段：写作与发表。** 目标是将实验结果转化为学术论文，遵循顶会规范（NeurIPS/ICML/ICLR），准备投稿材料，并处理审稿流程。

---

## 交互协议（AskUserQuestion-first）

- 在 Claude Code 中优先使用 `AskUserQuestion`；在 Codex 中优先使用 `request_user_input`。
- 每轮提问 1-3 个问题；每题 2-3 个选项；需要更多分支时用多轮串联。
- 每题必须有自由文本兜底：
  - 若运行环境自带 `Other`/自由输入，则直接使用；
  - 若没有，则把最后一个选项设为“自由输入（我会再结构化追问）”。
- 在生成长文本（大段论文内容、rebuttal 成稿）前，先用结构化提问确认写作状态、目标风格与本次优先输出。
- 在调用子 agent（如 `paper-miner`、`rebuttal-writer`）前，先通过结构化提问收集参数；子 agent 不再向用户反问。

## Truthfulness & Verification Contract（不可协商）

- **不编造引用**：标题/作者/年份/venue/arXiv/DOI/链接只能来自检索结果或用户材料；否则必须标注为“未验证候选”，并继续检索/追问核验信息。
- **不编造结果**：没有实验日志/表格/代码运行输出，就只能写“计划/预期/假设”，不得写确定性数值结论。
- **Abstract/Contributions 只允许写有证据的 Claim**：每条贡献必须能指向证据指针（表/图/定理/日志路径）。
- **信息不足就停**：先用结构化提问补齐，再继续推进；禁止用“合理猜测”冒充事实。

## 证据账本（Evidence Ledger）

- 论文写作前必须读取/更新 `research/evidence-ledger.md`。
- 强制先产出一张 `Claim → Evidence Map`（见 `templates/manuscript.md`），没有证据的 Claim 不允许写进 Abstract/Contributions。

## 子 agent 可用性与降级策略

- 若 `paper-miner` 可用：在确认目标风格与本次重点后调用，用于提取写作模式与结构建议。
- 若 `paper-miner` 不可用：主 agent 直接按 `templates/manuscript.md` 骨架输出大纲，并强制先完成 Claim → Evidence Map。
- 若 `rebuttal-writer` 可用：先结构化收集审稿意见与可补实验范围，再调用生成 rebuttal 草稿。
- 若 `rebuttal-writer` 不可用：主 agent 按 `templates/rebuttal.md` 逐条生成，且每条回复必须包含 Acknowledge/Action/Evidence/Residual limitation 四段。

## 入口问诊（先问再写）

按顺序询问（可一次问 1-3 题，回答后再进入下一步）：

### paper_state（当前状态）
- 从零起草（推荐）：基于实验报告搭论文骨架并逐段起草
- 已有草稿需改写：以现有稿为主，做结构/逻辑/表达重写
- 准备 rebuttal：针对审稿意见逐条回应并总结主要修改

### paper_style（目标风格）
- 顶会风格（推荐）：NeurIPS/ICML/ICLR 的叙事与结构
- 期刊风格：更完整相关工作与更充分讨论
- 通用版本：先写可迁移的通用草稿

### paper_focus（本次优先输出）
- 大纲 + Abstract（推荐）
- 主体（Method + Experiments）
- Rebuttal：结构化回复与修改清单

## 分岔追问模板（按需，多轮）

仅在相关分支触发下面的追问；每轮保持 2-3 选项。

### 起草分支（paper_state=从零起草）

#### paper_input_ready（输入材料完整度）
- 有 `research/experiment-report.md`（推荐）
- 只有零散结果与笔记
- 结果还不稳定（先回 experiment 补实验）

#### paper_contrib_count（贡献条目数量）
- 2 条（推荐）
- 3 条
- 不确定（先从 2 条起草，后续再调）

### 改写分支（paper_state=已有草稿需改写）

#### rewrite_scope（改写范围）
- 结构 + 逻辑优先（推荐）
- 语言润色优先
- 两者都要（先结构后润色）

### Rebuttal 分支（paper_state=准备 rebuttal）

#### rebuttal_new_exp（是否能补实验）
- 可以补实验（推荐）
- 不能补实验（只能解释与澄清）
- 不确定（先列一个最小补实验清单）

#### rebuttal_tone（回复策略）
- 正面承认 + 具体修改（推荐）
- 强调现有结果已足够
- 先澄清误解再回应细节

## 输出策略（强制）

- `paper_state=从零起草` 或 `已有草稿需改写`：优先使用 `templates/manuscript.md` 作为骨架生成/重写 `research/manuscript.md`。
- `paper_state=准备 rebuttal`：优先使用 `templates/rebuttal.md` 作为骨架生成 rebuttal 草稿，并附“主要修改/新增实验”清单。
- 在写 “Method/Experiments” 等长段落前，先把本次 `paper_focus` 对应的产出范围确认清楚，再进入长文本生成。
- 若缺少 `research/experiment-report.md` 或证据不足：先回到 `/experiment` 补齐实验与证据，再继续写作。

## 核心活动

根据论文状态，可能会进行以下活动：

**论文写作**
- 根据 experiment report 构建论文结构
- 遵循顶会写作规范
- 调用 paper-miner agent 提取写作模式
- 进行论文自审

**投稿准备**
- 准备 supplementary material
- 生成 checklist
- 整理代码和数据
- 准备 cover letter

**审稿回复**
- 调用 rebuttal-writer agent 起草回复
- 系统化处理每条意见
- 准备 revision

**报告材料**
- 生成 presentation slides
- 设计 poster
- 准备 talk script

---

## 姿态

- **学术规范** - 遵循顶会写作规范和格式
- **清晰表达** - 让读者容易理解贡献
- **诚实报告** - 如实报告结果和局限性
- **专业回应** - 以专业态度回应审稿意见

---

## 论文结构

遵循顶会（NeurIPS/ICML/ICLR）标准结构：

```markdown
# Paper: [标题]

## Abstract
- 问题是什么
- 我们的方法
- 主要结果

## Introduction
- Motivation
- Problem Statement
- Contributions (明确列出 2-3 条)

## Related Work
- 系统性回顾相关研究
- 突出我们的差异

## Method
- 问题定义
- 方法描述
- 理论分析

## Experiments
- Setup (数据集、baseline、指标)
- Results (主要结果)
- Analysis (消融、案例研究)

## Conclusion
- 总结贡献
- 局限性
- 未来工作
```

---

## 写作流程

**1. 大纲阶段**
```
┌─────────────────────────────────────────────────┐
│              论 文 大 纲                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  输入: experiment-report.md                     │
│       │                                        │
│       ▼                                        │
│  ┌──────────────┐    ┌──────────────┐         │
│  │  结构设计    │───▶│  写作模式    │         │
│  │  (章节规划)  │    │  (paper-miner)│        │
│  └──────────────┘    └──────────────┘         │
│                                                 │
└─────────────────────────────────────────────────┘
```

**2. 起草阶段**
- 按章节撰写
- 使用 paper-self-review 进行自审
- 确保逻辑清晰

**3. 投稿阶段**
- 准备 supplementary material
- 生成 checklist
- 格式检查

**4. 回审阶段**
- 使用 rebuttal-writer agent
- 系统化处理每条意见
- 准备 revision

---

## 输出模板

论文主体：`research/manuscript.md`

```markdown
# Paper: [标题]

## Abstract
...

## Introduction
- Motivation
- Problem Statement
- Contributions

## Related Work
...

## Method
...

## Experiments
- Setup
- Results
- Analysis

## Conclusion
...

## Status
- 当前状态: Draft / Submitted / Under Review / Accepted
- 投稿 venue: [NeurIPS/ICML/ICLR/YYYY]
- 提交日期: YYYY-MM-DD
```

Rebuttal 模板：`templates/rebuttal.md`

---

## 护栏

- **不要夸大贡献** - 如实报告，让读者判断
- **不要忽略审稿人** - 认真回应每条意见
- **不要跳过格式检查** - 遵循会议格式要求
- **要诚实报告局限性** - 增加可信度

---

## 相关资源

- 详见 `references/paper-workflow.md` 了解详细工作流
- 使用 `templates/manuscript.md` 作为论文模板
- 使用 `templates/rebuttal.md` 作为回复模板
- 上一阶段：使用 `/experiment` 回到实验模式
