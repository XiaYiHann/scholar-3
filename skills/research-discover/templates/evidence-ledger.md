# Evidence Ledger

**Created**: YYYY-MM-DD  
**Owner**: [Name/Team]  

> 目标：把“论文里想说的 Claim”与“需要的证据”绑定起来，贯穿 `/discover → /proposal → /paper`。

---

## Claims

| Claim（要写进论文的陈述） | Evidence（需要什么证据） | Pointer（表/图/日志路径） | Status | Risk（审稿人攻击点） | Next action |
|---|---|---|---|---|---|
| 我们的方法在 X 上优于 baseline | 主结果表 + 置信区间（≥3 seeds） | Table 1 / logs/run_001/metrics.json | planned | 可能是调参/数据泄漏 | 先做预注册 + 3 seeds |
| 组件 A 是关键 | 消融：w/o A 明显下降 | Fig 3 / Table 2 | planned | 交互效应未解释 | 设计 ablation + sanity |
| 机制解释成立 | 案例 + 诊断实验 | Fig 4 / Appendix A | planned | 只是相关性 | 做对照诊断实验 |

**Status 取值建议**：`planned` / `partial` / `verified` / `falsified`

---

## Notes

- 每次实验新增表/图/日志时，及时补 Pointer。
- 任何想写进 Abstract/Contributions 的内容，必须是 `verified`（或至少 `partial` 且明确标注不确定性）。
