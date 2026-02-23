# Experiment Workflow 详细指南

本文档提供 `research-experiment` 技能的详细工作流程说明。

## 工作流概述

```
┌─────────────────────────────────────────────────────────────────┐
│                   Experiment Phase Workflow                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│   │  实验设计   │───▶│  架构设计   │───▶│  代码实现   │       │
│   └─────────────┘    └─────────────┘    └─────────────┘       │
│          │                                    │                │
│          │                                    ▼                │
│          │                            ┌─────────────┐          │
│          │                            │  实验执行   │          │
│          │                            └─────────────┘          │
│          │                                    │                │
│          ▼                                    ▼                │
│   ┌─────────────┐                    ┌─────────────┐          │
│   │  结果分析   │◀───────────────────│  数据记录   │          │
│   └─────────────┘                    └─────────────┘          │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────┐                                               │
│   │  生成报告   │                                                │
│   └─────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 阶段 1: 实验设计

### 目标
将研究想法转化为可执行的实验方案。

### 设计要素
1. **实验变量**
   - 自变量: 控制变化的因素
   - 因变量: 衡量结果的指标
   - 控制变量: 保持恒定的因素

2. **对照组设置**
   - Baseline A: 现有最佳方法
   - Baseline B: 常用方法
   - Ablation: 消融实验设计

3. **评估指标**
   - 主要指标: 最关注的指标
   - 次要指标: 辅助分析指标
   - 统计检验方法

### 输出
- 实验设计文档
- 变量定义表
- 评估计划

## 阶段 2: 架构设计

### 使用 architect agent
调用 `architect` agent 进行系统架构设计。

### 设计原则
1. **模块化** - 小文件原则 (200-400 行)
2. **可配置** - 使用 dataclass 作为配置
3. **可测试** - 遵循 TDD 原则

### 目录结构
```
src/
├── data_module/
│   ├── dataset/
│   ├── augmentation/
│   └── utils.py
├── model_module/
│   ├── base_model.py
│   ├── transformer.py
│   └── cnn.py
├── trainer_module/
│   └── trainer.py
└── utils/
    └── logger.py
```

### 输出
- 架构设计文档
- 目录结构
- 接口定义

## 阶段 3: 代码实现

### 遵循代码规范
参考 `coding-style.md` 中的规范。

### 核心规范
1. **文件大小** - 不超过 400 行
2. **类型提示** - 所有函数必须有类型提示
3. **文档字符串** - 使用 docstring 说明功能
4. **错误处理** - 捕获特定异常，记录日志
5. **不可变配置** - 使用 `@dataclass(frozen=True)`

### 使用 openspec 工作流
- `/opsx:new` - 创建新变更
- `/opsx:apply` - 实现任务
- `/opsx:ff` - 快进模式

### 输出
- 实现的代码
- 单元测试
- 代码审查通过

## 阶段 4: 实验执行

### 可复现性设置
```python
def set_seed(seed: int = 42) -> None:
    """Set random seeds for reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    os.environ["PYTHONHASHSEED"] = str(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
```

### 环境记录
```bash
# 记录环境信息
pip freeze > requirements.txt

# 记录 GPU 信息
nvidia-smi
```

### Checkpoint 管理
```
checkpoints/
├── best_model.pt          # 最佳模型
├── checkpoint_epoch_50.pt # 定期保存
├── checkpoint_latest.pt   # 最新检查点
└── config.yaml            # 配置文件
```

### 输出
- 实验日志
- Checkpoint 文件
- 环境信息

## 阶段 5: 结果分析

### 使用 data-analyst agent
调用 `data-analyst` agent 进行数据分析。

### 分析内容
1. **主要结果**
   - 各方法的定量结果
   - 结果表格
   - 可视化图表

2. **统计检验**
   - t-test / bootstrap
   - 显著性水平
   - 置信区间

3. **消融实验**
   - 各组件贡献分析
   - 组件交互分析

4. **对比分析**
   - 与 baseline 对比
   - 优势与劣势分析

### 输出
- 结果表格
- 可视化图表
- 统计分析报告

## 阶段 6: 生成报告

### 使用模板
使用 `templates/experiment-report.md` 生成报告。

### 报告内容
1. Setup - 硬件、环境、配置
2. Results - 结果表格、图表
3. Analysis - 统计检验、消融实验
4. Conclusion - 假设验证、局限性
5. Reproducibility - 种子、路径、命令

### 输出位置
`research/experiment-report.md`

## 向下一阶段过渡

当满足以下条件时，可以进入论文撰写阶段：
- [ ] 实验完成
- [ ] 结果分析完整
- [ ] 假设得到验证
- [ ] 报告生成完毕

使用 `/paper` 命令进入论文撰写模式。
