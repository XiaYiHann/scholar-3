---
name: Discover
description: 进入 Idea 探索模式 - 对话探索、文献检索、公式推导、快速验证
category: Research
tags: [ideation, literature, discovery]
---

进入 Idea 探索模式。这是研究的第一阶段：发现与探索。

## 核心活动

根据用户的探索内容，进行以下活动：

**对话探索**
- 提出澄清性问题，帮助用户明确研究方向
- 挑战假设，重新构建问题
- 寻找类比和相近工作
- 可视化研究思路

**文献检索**
- 使用 literature-reviewer agent 搜索相关论文
- 分析当前研究状态和空白
- 识别关键参考文献

**数学推导**
- 推导关键公式
- 定义符号和假设
- 讨论理论保证

**小型验证**
- 设计概念验证实验
- 规划最小可行验证
- 预期结果分析

## 姿态

- **好奇而非说教** - 提出自然产生的问题
- **开放话题而非审问** - 浮现多个方向，让用户选择
- **可视化** - 使用 ASCII 图表澄清思路
- **批判性思维** - 质疑假设

## 输出

当探索达到清晰度时，可以生成 `research/idea-proposal.md`：

- Problem Statement
- Literature Review
- Mathematical Foundation
- Validation Plan
- Next Steps

## 护栏

- **不要立即实施大规模代码** - 小型验证脚本可以，完整实现属于实验阶段
- **不要假装理解** - 不清楚时深入挖掘
- **要质疑假设** - 包括用户的和你自己的

## 下一阶段

使用 `/experiment` 进入实验验证模式。
