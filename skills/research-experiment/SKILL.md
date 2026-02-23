---
name: research-experiment
description: 进入实验验证模式 - 设计实验、编写代码、运行实验和分析结果。当用户想要实现研究想法、运行实验、分析数据或验证假设时使用。
version: 1.0.0
metadata:
  phase: experiment
  inputs:
    - research/idea-proposal.md
  outputs:
    - research/experiment-report.md
    - research/evidence-ledger.md
---

进入实验验证模式。设计实验。实现代码。运行并分析结果。

**这是研究的第二阶段：实验与验证。** 目标是将研究想法转化为可执行的实验，收集数据并分析结果。应该遵循代码规范、确保可复现性、并进行系统的实验分析。

---

## 交互协议（AskUserQuestion-first）

- 在 Claude Code 中优先使用 `AskUserQuestion`；在 Codex 中优先使用 `request_user_input`。
- 每轮提问 1-3 个问题；每题 2-3 个选项；需要更多分支时用多轮串联。
- 每题必须有自由文本兜底：
  - 若运行环境自带 `Other`/自由输入，则直接使用；
  - 若没有，则把最后一个选项设为“自由输入（我会再结构化追问）”。
- 在调用子 agent（如 `architect`、`data-analyst`）前，先通过结构化提问收集参数；子 agent 不再向用户反问。
- 用户每次选择后，先复述“你选择了 X，所以接下来我会做 Y”，再开始写代码、跑实验或做分析。

## Truthfulness & Verification Contract（不可协商）

- **不编造文献**：论文标题/作者/年份/venue/arXiv/DOI/链接只能来自检索结果或用户材料；否则必须标注为“未验证候选”，并继续检索/追问核验信息。
- **不编造实验结果**：没有日志/表格/代码运行输出，就只能写“计划/预期/假设”，不得写“提升了 X%”等确定性结论。
- **每个关键结论必须有证据指针**：例如 `Table 2 / Fig 3 / logs/run_042/metrics.json`。没有指针就不能下结论。
- **信息不足就停**：先用结构化提问补齐，再继续推进；禁止用“合理猜测”冒充事实。

## 子 agent 可用性与降级策略

- 若 `architect` 可用：先用结构化提问明确框架/数据/指标/预算，再调用 `architect` 输出架构。
- 若 `architect` 不可用：由主 agent 输出同等结构的架构设计，至少包含：
  - 模块划分（data/model/train/eval/utils）
  - 关键接口（输入/输出/配置 schema）
  - 数据流（从数据到指标的路径）
  - 风险点与验证点（最小 smoke test）
- 若 `data-analyst` 可用：在收集好产物类型（表格/日志/曲线）后调用。
- 若 `data-analyst` 不可用：由主 agent 输出固定结构的分析：
  - 指标定义与统计检验建议（t-test/bootstrap/CI）
  - 可视化清单（训练曲线、对比柱状、消融）
  - 结论边界（哪些结论能下，哪些需要更多证据）

## 入口问诊（先问再做）

按顺序询问（可一次问 1-3 题，回答后再进入下一步）：

### exp_input（输入材料）
- 有 `research/idea-proposal.md`（推荐）：以 proposal 为基线开展实验
- 只有口头描述：先把关键变量/指标补齐，再进入实验
- 想先回 discover：先把问题与假设收敛后再做实验

### exp_focus（本次重点）
- 实验设计（推荐）：变量、对照组、指标、消融与统计检验
- 代码实现与可复现：架构、实现、测试、可复现实验脚本
- 分析已有结果：读取已有日志/表格/曲线，给出结论与下一步

### exp_rigor（可复现要求）
- 标准可复现（推荐）：固定种子 + 记录配置 + 保存命令/环境
- 快速跑通优先：最小配置先验证方向，后续再补严谨记录
- 严格记录：标准可复现 + 完整日志/版本信息 + 关键中间产物归档

## 分岔追问模板（按需，多轮）

仅在相关分支触发下面的追问；每轮保持 2-3 选项。

### 实验设计分支（exp_focus=实验设计）

#### exp_metric_axis（指标侧重点）
- 主性能指标（推荐）：准确率/损失/任务分数等
- 效率与成本：吞吐、延迟、显存、算力成本等
- 鲁棒性与泛化：分布外、噪声、对抗、稳定性等

#### exp_baseline_scope（baseline 范围）
- 2-3 个强 baseline（推荐）
- 更全面对比（5+ baseline）
- 先做一个 baseline 跑通

### 代码实现分支（exp_focus=代码实现与可复现）

#### exp_framework（实现框架）
- PyTorch（推荐）
- JAX
- TensorFlow/其他

#### exp_budget（运行预算）
- 单机/单卡为主（推荐）
- 多卡/集群
- 不确定（先做最小可运行版本）

#### exp_output_now（本次是否生成报告）
- 生成 `research/experiment-report.md`（推荐）
- 先不生成（先把实现与跑通完成）
- 不确定（先推进一段再决定）

### 结果分析分支（exp_focus=分析已有结果）

#### exp_artifacts（你已有的材料）
- 结果表格/CSV（推荐）
- 训练日志/曲线
- checkpoint/模型输出样例

#### exp_analysis_goal（你希望我给什么）
- 结论摘要 + 下一步实验建议（推荐）
- 图表整理 + 统计检验
- 问题诊断：失败原因与修复路径

## 输出策略（强制）

- 若 `exp_input=有 idea-proposal.md`：先读取 `research/idea-proposal.md`，抽取“假设、变量、指标、验证计划”，再进入实验设计或实现。
- 若需要生成报告：使用 `templates/experiment-report.md` 作为结构生成 `research/experiment-report.md`，并在末尾写清“种子、命令、环境、产物路径”。
- `exp_rigor=严格记录` 时，优先保证：命令可复跑、配置可追溯、结果可复现，再追求更多实验规模。
- 在本阶段创建/更新 `research/evidence-ledger.md`：把每个 Claim 绑定到对应证据（表/图/日志路径），并维护 `planned/verified/falsified` 状态。

## 核心活动

根据实验需求，可能会进行以下活动：

**实验设计**
- 根据 proposal 设计实验方案
- 定义对照组和实验组
- 确定评估指标
- 规划消融实验

**代码实现**
- 调用 architect agent 设计项目架构
- 遵循 `references/coding-style.md` 编写代码
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

---

## 姿态

- **系统化** - 实验设计应该系统完整，而非零散
- **可复现** - 确保实验可以被复现
- **数据驱动** - 让数据说话，不要过度解读
- **严谨** - 遵循科学实验的最佳实践

---

## 实验流程

**1. 设计阶段**
```
┌─────────────────────────────────────────────────┐
│              实 验 设 计                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  输入: idea-proposal.md                         │
│       │                                        │
│       ▼                                        │
│  ┌──────────────┐    ┌──────────────┐         │
│  │  实验设计    │───▶│  架构设计    │         │
│  │  (变量/指标) │    │  (architect) │         │
│  └──────────────┘    └──────────────┘         │
│                                                 │
└─────────────────────────────────────────────────┘
```

**2. 实现阶段**
- 使用 openspec-new-change 或 openspec-ff-change 开始实现
- 遵循代码规范（小文件原则、类型提示、docstring）
- 编写测试确保代码质量

**3. 运行阶段**
- 设置随机种子确保可复现
- 记录环境信息（GPU、依赖版本）
- 保存 checkpoint

**4. 分析阶段**
- 使用 data-analyst agent 分析结果
- 生成图表和表格
- 进行统计检验

---

## 代码规范检查清单

实现代码时，确保：
- [ ] 每个文件不超过 400 行
- [ ] 使用 dataclass 作为配置（不可变）
- [ ] 所有函数有类型提示
- [ ] 有明确的错误处理
- [ ] 使用 logger 而非 print
- [ ] 设置随机种子

---

## 可复现性要求

- 设置随机种子与复现记录（见 `references/experiment-reproducibility.md`）
- 记录环境信息（pip freeze）
- 保存完整配置
- 保存 checkpoint
- 记录运行命令

---

## 输出模板

实验完成后，生成 `research/experiment-report.md`：

```markdown
# Experiment Report: [实验名称]

## Setup
- 硬件: GPU/CPU
- 环境: pip freeze 输出
- 配置: config.yaml

## Results
- 定量结果表格
- 可视化图表

## Analysis
- 统计显著性检验
- 消融实验结果
- 与 baseline 对比

## Conclusion
- 假设是否成立
- 局限性分析
- 下一步行动

## Reproducibility
- 随机种子
- checkpoint 路径
- 运行命令
```

---

## Exit Criteria（Experiment → Paper，顶会偏严默认）

只有满足以下条件，才允许进入 `/paper`：
- [ ] 主结果至少 3 个 seeds（或等价 bootstrap），并报告方差或置信区间（CI）
- [ ] 至少 1 个 sanity check（如标签打乱/输入随机化/容量极端对照）
- [ ] 至少 1 个消融实验（ablation）
- [ ] 至少 1 个失败案例或局限性（写进报告与 `research/evidence-ledger.md`）
- [ ] 可复现包完整：命令、配置、环境、产物路径齐全（见 `references/experiment-reproducibility.md`）

## 护栏

- **不要跳过设计** - 在开始编码前，先设计好实验
- **不要忽略可复现性** - 确保实验可以被复现
- **不要过度解读结果** - 让数据说话
- **要记录一切** - 环境、配置、命令、结果

---

## 相关资源

- 详见 `references/experiment-workflow.md` 了解详细工作流
- 使用 `templates/experiment-report.md` 作为输出模板
- 上一阶段：使用 `/discover` 回到探索模式
- 下一阶段：使用 `/paper` 进入论文撰写模式
