# Research Idea: [标题]

**Created**: YYYY-MM-DD
**Status**: Exploring / Proposal Ready / Ready for Experiment

---

## Problem Statement

### 核心问题
- 描述具体要解决的研究问题

### 为什么重要
- 解释这个问题的重要性和影响
- 说明研究动机

### 研究缺口
- 当前研究的不足
- 我们要填补的空白

---

## Problem Normal Form（强制）

> 目的：把“模糊想法”压缩成可证伪、可评估、可复现的最小问题形式。

### 任务定义（Task / Dataset / Metric）
- Task: [分类/生成/检索/预测/控制/理论命题...]
- Dataset / Setting: [数据集名称或理论设定]
- Primary Metric: [唯一主指标，写死]

### 输入/输出（Input / Output）
- Input: [输入是什么？形状/类型/范围]
- Output: [输出是什么？形状/类型/范围]

### Baselines（至少 2 个强 baseline）
- Baseline A: [可核验引用 + 为什么是强 baseline]
- Baseline B: [可核验引用 + 为什么是强 baseline]

### Hypothesis（主假设）
- H1: [一句话写清楚]

### Falsification（证伪条件，至少 1 条）
- 如果出现以下现象，则判定 H1 不成立并停止/回退：
  - [具体阈值/现象/对照结果]

---

## Literature Review

### 核心论文 (X 篇)
> 每条文献必须可核验：标题、作者、年份、venue/arXiv号、可点击链接 + 1-2 句总结 + 与本工作关系。

1. **Title** (Author, Year, Venue/arXiv)  
   Link: [URL]  
   Key takeaway: ...  
   Why relevant (baseline/gap/technique): ...

### Gap 分析
| 现有方法 | 局限性 | 我们的改进 |
|---------|--------|-----------|
| Method A | 问题1 | 改进方案 |
| Method B | 问题2 | 改进方案 |

### 主要参考文献
- [1] Citation format
- [2] Citation format

---

## Mathematical Foundation

### 符号定义
- $x$: 输入
- $y$: 输出
- $\theta$: 参数

### 关键公式推导
```
[推导过程]

公式 1: $f(x) = ...$

证明:
...
```

### 理论保证
- 定理陈述
- 直观解释
- 证明思路（可选）

---

## Validation Plan

### 小型验证实验设计
1. **实验目的**: 验证什么假设
2. **实验设置**: 数据、指标、baseline
3. **预期结果**: 假设成立时的预期

### 验证方法
- 如何衡量成功
- 统计检验方法

### Kill Criteria（停止条件，强制）
- 如果出现以下情况，则停止该方向或回到 `/discover` 重构假设：
  - [现象/阈值 1]
  - [现象/阈值 2]

---

## Next Steps

### 进入实验阶段
- [ ] 任务 1: 具体实现步骤
- [ ] 任务 2: 具体实现步骤
- [ ] 任务 3: 具体实现步骤

### 预计时间
- 总计: X 周

---

## Notes

*记录探索过程中的重要见解和决策*
