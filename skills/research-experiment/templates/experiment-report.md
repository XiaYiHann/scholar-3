# Experiment Report: [实验名称]

**Date**: YYYY-MM-DD
**Idea**: [对应的研究想法]
**Status**: Running / Completed / Failed

---

## Setup

### 硬件
- GPU: [型号]
- CPU: [型号]
- Memory: [大小]

### 环境
```bash
# Python version
Python 3.x.x

# Key dependencies
torch=...
numpy=...
...
```

### 配置
```yaml
# config.yaml
experiment:
  name: ...
  seed: 42
  batch_size: ...
  learning_rate: ...
```

---

## Results

### 主要结果表格

| Method | Metric 1 | Metric 2 | Metric 3 |
|--------|----------|----------|----------|
| Baseline A | 0.75 | 0.68 | 1.23 |
| Baseline B | 0.78 | 0.71 | 1.15 |
| **Ours** | **0.82** | **0.76** | **1.05** |

### 可视化
```
[图表描述]
- 图 1: 训练曲线
- 图 2: 对比结果
- 图 3: 消融实验
```

---

## Analysis

### 统计显著性检验
- 方法: t-test / bootstrap
- 结果: p < 0.05 (显著)

### 消融实验

| 变体 | Metric | 说明 |
|-----|--------|-----|
| Full | 0.82 | 完整方法 |
| w/o component A | 0.79 | -0.03 |
| w/o component B | 0.77 | -0.05 |

### 与 Baseline 对比
- 相比 Baseline A 提升: +X%
- 相比 Baseline B 提升: +Y%
- 分析: [解释为什么有提升]

---

## Conclusion

### 假设是否成立
- 假设 1: ✓ 成立 / ✗ 未成立
- 假设 2: ✓ 成立 / ✗ 未成立

### 局限性分析
- 局限 1: [描述]
- 局限 2: [描述]

### 下一步行动
- [ ] 改进点 1
- [ ] 扩展实验 2
- [ ] 准备写论文

---

## Reproducibility

### 随机种子
```python
seed = 42
# torch, numpy, random 已设置
```

### Checkpoint 路径
```
checkpoints/
├── best_model.pt
├── checkpoint_epoch_50.pt
└── config.yaml
```

### 运行命令
```bash
# 训练
python train.py --config configs/experiment.yaml

# 评估
python eval.py --checkpoint checkpoints/best_model.pt
```

---

## Notes

*记录实验过程中的重要观察和问题*
