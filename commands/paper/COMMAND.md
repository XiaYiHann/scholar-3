---
name: Paper
description: Paper 模式（只用 `verified` 证据写作；生成 manuscript/rebuttal）
category: Research
tags: [paper, writing, rebuttal]
---

进入 `/paper`：先生成 `research/paper/claim-evidence-map.md`，再写 `research/paper/manuscript.md`。
硬规则：
- Abstract/Contributions 只能用 ledger 中 status=`verified` 的 claims
- 不编造引用

输出：
- `research/paper/claim-evidence-map.md`
- `research/paper/manuscript.md`
- `research/paper/rebuttal.md`（按需）
