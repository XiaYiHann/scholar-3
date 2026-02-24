# Experiment Reproducibility (Minimal)

本文件定义研究执行阶段的最小可复现要求：**别人能用你的命令和配置复跑，得到统计上可比较的结果**。

## 1) 必须记录的四件事

- **命令**：完整运行命令（含参数）。
- **配置**：完整配置（可被版本控制或被归档）。
- **环境**：依赖版本与硬件信息（最低限度）。
- **产物**：日志、指标文件、checkpoint、图表的路径约定。

## 2) Seed 与确定性（按使用的库选择）

如果使用 Python 随机数：
- `random.seed(seed)`
- `PYTHONHASHSEED`

如果使用 NumPy：
- `np.random.seed(seed)`

如果使用 PyTorch：
- `torch.manual_seed(seed)`
- `torch.cuda.manual_seed_all(seed)`
- 记录是否启用确定性选项（如 cuDNN deterministic / benchmark）

如果使用 JAX / TF：
- 记录对应的 PRNG key / seed 设置方式

要求：
- [ ] 把 seed 写进配置
- [ ] 把 seed 写进报告与日志

## 3) 多次运行与不确定性报告（顶会偏严默认）

- 主结果默认至少 **3 个 seeds**（或等价的 bootstrap）。
- 必须报告：
  - 均值 ± 标准差，或
  - 置信区间（CI）

如果只跑 1 次：
- 必须在报告中标注为 `single-run (not reliable)`，不得写成最终结论。

## 4) Sanity Checks（至少 1 个）

每个项目至少做一个 sanity check，并写入报告：
- 标签打乱（label shuffle）
- 输入随机化/置零
- 极小模型/极大模型对照（容量 sanity）
- 训练集上过拟合检查（能否拟合极小子集）

## 5) 环境记录（最低限度）

- 依赖版本：`pip freeze` 或等价导出
- 硬件信息：GPU/CPU 型号、显存/内存
- 代码版本：git commit hash（如果可用）

## 6) 产物路径建议（推荐）

建议把可复现产物归档在 proposal 目录内：

```
research/
  proposals/
    Pxx-some-phase/
      proposal.md
      experiment-plan.md
      tasks.md
      experiment-report.md
      verify.md
      artifacts/
        logs/
          run_001/
            config.yaml
            metrics.json
            stdout.log
        checkpoints/
          run_001/
            best.pt
            last.pt
        figures/
          run_001/
            curve.png
        tables/
          main.csv
```

`experiment-report.md` 中的每个结果陈述都必须能指向：
- `artifacts/tables/*` / `artifacts/figures/*` / `artifacts/logs/*` 等精确路径

## 7) 报告写法（防止“看起来像结果”的编造）

- 任何数字都要能指向证据：
  - `Table/Figure 编号` 或 `artifacts/logs/.../metrics.json`
- 没有证据的内容只能写：
  - 计划（plan）/ 预期（expected）/ 假设（hypothesis）
