---
name: Paper
description: 进入论文撰写模式 - 写作、投稿、回审、报告
category: Research
tags: [writing, paper, rebuttal]
---

进入论文撰写模式。这是研究的第三阶段：写作与发表。

## 交互协议（AskUserQuestion-first）

- 在 Claude Code 中优先使用 `AskUserQuestion`；在 Codex 中优先使用 `request_user_input`。
- 每轮提问 1-3 个问题；每题 2-3 个选项；需要更多分支时用多轮串联。
- 每题必须有自由文本兜底：
  - 若运行环境自带 `Other`/自由输入，则直接使用；
  - 若没有，则把最后一个选项设为“自由输入（我会再结构化追问）”。
- 在生成长文本（大段论文内容、rebuttal 成稿）前，先用结构化提问确认写作状态、目标风格与本次优先输出。

## 入口问诊（先问再写）

按顺序询问（可一次问 1-3 题，回答后再进入下一步）：

### paper_state（当前状态）
- 从零起草（推荐）
- 已有草稿需改写
- 准备 rebuttal

### paper_style（目标风格）
- 顶会风格（推荐）
- 期刊风格
- 通用版本

### paper_focus（本次优先输出）
- 大纲 + Abstract（推荐）
- 主体（Method + Experiments）
- Rebuttal：结构化回复与修改清单

## 核心活动

根据论文状态，进行以下活动：

**论文写作**
- 根据 experiment report 构建论文结构
- 遵循顶会写作规范（NeurIPS/ICML/ICLR）
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

## 姿态

- **学术规范** - 遵循顶会写作规范和格式
- **清晰表达** - 让读者容易理解贡献
- **诚实报告** - 如实报告结果和局限性
- **专业回应** - 以专业态度回应审稿意见

## 论文结构

遵循顶会标准结构：

- Abstract (200-250 words)
- Introduction (Motivation, Problem, Contributions)
- Related Work
- Method
- Experiments (Setup, Results, Analysis)
- Conclusion
- Appendix

## 输出

输出产物（按需生成）：
- `research/manuscript.md`
- `research/rebuttal.md`
- `research/evidence-ledger.md`（Claim → Evidence 指针更新）

- Abstract
- Introduction
- Related Work
- Method
- Experiments
- Conclusion
- Status

Rebuttal: 使用 `templates/rebuttal.md` 作为骨架

## 护栏

- **不要夸大贡献** - 如实报告，让读者判断
- **不要忽略审稿人** - 认真回应每条意见
- **不要跳过格式检查** - 遵循会议格式要求
- **要诚实报告局限性** - 增加可信度

## 上一阶段

使用 `/experiment` 回到实验模式。

## 工作流循环

```
/discover ──▶ /experiment ──▶ /paper ──▶ Published
     ▲                                     │
     └─────────────────────────────────────┘
                  新的想法
```
