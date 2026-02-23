# Experiment Report: [实验名称]

**Date**: YYYY-MM-DD
**Idea**: [对应的研究想法]
**Status**: Running / Completed / Failed

---

## Setup
### Pre-registration（最低限度，强制）

- Primary metric（唯一主指标）: [写死，不随意更换]
- Tuning protocol（调参协议）: [只在 val 上调参，不触碰 test]
- Number of runs（默认 ≥3 seeds）: [3 / 5 / ...]
- Stopping rule（early stop 规则）: [规则 + patience]
- Report rule（报告规则）: [失败也要记录；不许只挑最好]

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
| Baseline A | [mean±std/CI] | ... | ... |
| Baseline B | [mean±std/CI] | ... | ... |
| **Ours** | **[mean±std/CI]** | ... | ... |

**Evidence pointers（强制）**
- Table: [Table X]
- Logs: `logs/run_xxx/metrics.json`
- Config: `logs/run_xxx/config.yaml`

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
- 结果: [p-value / CI / effect size]

### 消融实验

| 变体 | Metric | 说明 |
|-----|--------|-----|
| Full | [value] | 完整方法 |
| w/o component A | [value] | [delta] |
| w/o component B | [value] | [delta] |

### 与 Baseline 对比
- 相比 Baseline A 提升: [+X% / CI]
- 相比 Baseline B 提升: [+Y% / CI]
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

## Sanity Checks（至少 1 个，强制）

- [ ] Label shuffle（标签打乱）
- [ ] Input randomization（输入随机化/置零）
- [ ] Capacity sanity（极小/极大模型对照）
- [ ] Overfit tiny subset（极小子集拟合）

记录：
- 现象/结论: ...
- Evidence pointer: [Fig/Table/路径]

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
