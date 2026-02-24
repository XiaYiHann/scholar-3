---
name: Verify
description: Verify 模式（证伪 + 可复现 + 证据闭环审计；决定下一步）
category: Research
tags: [verify, audit, falsification]
---

进入 `/verify`：对一个 proposal 做审计并输出 `verify.md`，决策只能三选一：
1) FIX PLAN
2) NEW PROPOSAL
3) IDEA AMENDMENT NEEDED（生成 idea-amendment 并请求用户批准）

输出：
- `research/proposals/Pxx-*/verify.md`
- （必要时）`research/idea-amendments/Axx-*.md`
