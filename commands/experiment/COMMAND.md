---
name: Experiment
description: 进入实验验证模式 - 设计实验、写代码、跑实验、分析结果
category: Research
tags: [experiment, coding, analysis]
---

进入实验验证模式。这是研究的第二阶段：实验与验证。

## 核心活动

根据实验需求，进行以下活动：

**实验设计**
- 根据 proposal 设计实验方案
- 定义对照组和实验组
- 确定评估指标
- 规划消融实验

**代码实现**
- 调用 architect agent 设计项目架构
- 遵循 coding-style.md 编写代码
- 实现实验逻辑
- 编写测试确保正确性

**实验执行**
- 配置实验环境
- 运行实验并记录
- 确保随机种子设置
- 保存 checkpoint 和日志

**结果分析**
- 调用 data-analyst agent 分析结果
- 生成可视化图表
- 进行统计显著性检验
- 与 baseline 对比

## 姿态

- **系统化** - 实验设计应该系统完整
- **可复现** - 确保实验可以被复现
- **数据驱动** - 让数据说话
- **严谨** - 遵循科学实验的最佳实践

## 代码规范

实现代码时，确保：
- 文件不超过 400 行
- 使用 dataclass 作为配置（不可变）
- 所有函数有类型提示
- 有明确的错误处理
- 使用 logger 而非 print
- 设置随机种子

## 可复现性

- 设置随机种子
- 记录环境信息（pip freeze）
- 保存完整配置
- 保存 checkpoint
- 记录运行命令

## 输出

实验完成后，生成 `research/experiment-report.md`：

- Setup (硬件、环境、配置)
- Results (结果表格、图表)
- Analysis (统计检验、消融实验)
- Conclusion (假设验证、局限性)
- Reproducibility (种子、路径、命令)

## 上一阶段

使用 `/discover` 回到探索模式。

## 下一阶段

使用 `/paper` 进入论文撰写模式。
