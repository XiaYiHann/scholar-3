# Scholar-3: Claude Code 简化研究工作流

一个结构化的三阶段研究工作流：发现、实验、论文。

```
/discover → /experiment → /paper → 发表
    ↑                          │
    └──────────────────────────┘
           新想法 (循环)
```

## 概述

Scholar-3 为使用 Claude Code 的学术研究提供了一种结构化的方法。它将研究过程分解为三个清晰的阶段，每个阶段都有专门的技能和模板：

- **发现** (`/discover`) - 探索想法、文献综述、公式推导、快速验证
- **实验** (`/experiment`) - 设计实验、编写代码、运行实验、分析结果
- **论文** (`/paper`) - 撰写论文、投稿、回复审稿、准备报告

## 特性

- **三阶段研究工作流** - 清晰分离研究生命周期的各个阶段
- **结构化模板** - 即用型模板，涵盖提案、实验报告、手稿和回复信
- **渐进式展示** - 从简单命令开始，需要时深入了解详细工作流
- **严格性机制** - 真话与可核验约束（不编造引用/结果、结论必须有证据指针、阶段闸门 Exit Criteria）
- **证据账本** - `research/evidence-ledger.md` 贯穿三阶段，把 Claim 与证据绑定，减少返工
- **代理集成（可选）** - 可利用现有 Claude 代理（literature-reviewer、data-analyst、rebuttal-writer 等）；若环境未配置也可降级运行

## 安装

### 通过 Git 克隆（推荐）

```bash
cd ~/.claude
git clone https://github.com/XiaYiHann/scholar-3.git
```

### 手动安装

将相关文件复制到项目的 `.claude/` 目录：

```bash
# 复制技能
cp -r scholar-3/skills/* ~/.claude/skills/

# 复制命令
cp -r scholar-3/commands/* ~/.claude/commands/
```

## 使用方法

安装后，您可以在 Claude Code 会话中使用三个命令：

### 第一阶段：发现

```
/discover
```

进入 Idea 探索模式。用于：
- 通过苏格拉底式对话探索新的研究想法
- 进行文献搜索
- 推导数学公式
- 设计快速验证实验

输出：`research/idea-proposal.md`、`research/evidence-ledger.md`

### 第二阶段：实验

```
/experiment
```

进入实验验证模式。用于：
- 设计对照实验
- 编写整洁、可复现的代码
- 运行实验并记录结果
- 进行统计分析

输出：`research/experiment-report.md`

### 第三阶段：论文

```
/paper
```

进入论文撰写模式。用于：
- 按照顶会标准撰写手稿
- 准备投稿材料
- 撰写专业的回复信
- 创建演示幻灯片和海报

输出：`research/manuscript.md`、`research/rebuttal.md`

## 工作流图

```
┌─────────────────────────────────────────────────────────────────┐
│                    Scholar-3 研究工作流                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│   │    发现     │───▶│    实验     │───▶│    论文     │       │
│   │  Discovery  │    │  Experiment │    │    Paper    │       │
│   │             │    │             │    │             │       │
│   │ • 对话探索  │    │ • 实验设计  │    │ • 论文写作  │       │
│   │ • 文献检索  │    │ • 代码实现  │    │ • 投稿准备  │       │
│   │ • 公式推导  │    │ • 实验执行  │    │ • 审稿回复  │       │
│   │ • 快速验证  │    │ • 结果分析  │    │ • 报告准备  │       │
│   └─────────────┘    └─────────────┘    └─────────────┘       │
│         │                                    │                │
│         └────────────────────────────────────┘                │
│                      新想法                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 目录结构

```
scholar-3/
├── README.md                   # 英文文档
├── README.zh-CN.md             # 本文件
├── LICENSE                     # MIT 许可证
├── .gitignore                  # 排除敏感文件
├── settings.json.template      # 配置模板
│
├── skills/                     # 核心技能
│   ├── research-discover/      # 发现阶段技能
│   ├── research-experiment/    # 实验阶段技能
│   └── research-paper/         # 论文阶段技能
│
├── commands/                   # 快捷入口命令
│   ├── discover/COMMAND.md
│   ├── experiment/COMMAND.md
│   └── paper/COMMAND.md
│
└── research/                   # 输出目录（用户创建）
```

## 模板

Scholar-3 为每个阶段包含结构化模板：

| 模板 | 用途 | 位置 |
|------|------|------|
| Idea Proposal | 记录研究想法 | `skills/research-discover/templates/` |
| Experiment Report | 记录实验结果 | `skills/research-experiment/templates/` |
| Manuscript | 学术论文结构 | `skills/research-paper/templates/` |
| Rebuttal | 审稿回复信 | `skills/research-paper/templates/` |

## 设计理念

Scholar-3 基于以下原则构建：

1. **简洁性** - 三个清晰的阶段，易于理解
2. **渐进性** - 每个阶段建立在前一个阶段之上
3. **迭代性** - 通过新见解循环回到早期阶段
4. **实用性** - 模板和工作流基于真实的研究实践

## 贡献

欢迎贡献！请随时提交问题或拉取请求。

## 许可证

MIT License - 详见 [LICENSE](LICENSE)。

## 致谢

灵感来自 [claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar)，旨在与 Claude Code 的可扩展技能和命令系统无缝协作。

## 链接

- [GitHub 仓库](https://github.com/XiaYiHann/scholar-3)
- [Claude Code 文档](https://docs.anthropic.com)

---

**标签**: `claude-code` `research-workflow` `academic-research` `ml-research`
