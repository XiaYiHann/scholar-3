---
name: research-paper
description: 进入论文撰写模式 - 写作、投稿、回审和报告。当用户想要撰写学术论文、准备投稿材料、回复审稿意见或生成报告时使用。
version: 1.0.0
metadata:
  phase: paper
  inputs:
    - research/experiment-report.md
  outputs:
    - research/manuscript.md
---

进入论文撰写模式。撰写论文。准备投稿。回复审稿。

**这是研究的第三阶段：写作与发表。** 目标是将实验结果转化为学术论文，遵循顶会规范（NeurIPS/ICML/ICLR），准备投稿材料，并处理审稿流程。

---

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
- 投稿 venue: NeurIPS 2025
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
