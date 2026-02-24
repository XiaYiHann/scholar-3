---
name: research-paper
description: 进入 Paper 模式 - 基于 `verified` 证据写作（Claim→Evidence→Pointer 闸门），并可生成 rebuttal。
version: 2.0.0
metadata:
  phase: paper
  outputs:
    - research/paper/claim-evidence-map.md
    - research/paper/manuscript.md
    - research/paper/rebuttal.md
---

进入论文写作模式（证据链闸门优先）。

## 不可协商规则
- 不编造引用：所有关键引用必须可核验（URL/arXiv/DOI）。
- Abstract/Contributions **只能**使用 `research/evidence-ledger.md` 中 status=`verified` 的 claim。
- 每条贡献必须有 pointer（表/图/日志/证明路径）。

## 输入工件
- `research/evidence-ledger.md`
- 至少一个 proposal 的 `experiment-report.md` 与 artifacts pointers
- （可选）`research/idea.md` 用于写 Problem Setup 与 Protocol

## 输出顺序（强制）
1) 生成/更新 `research/paper/claim-evidence-map.md`
2) 生成/更新 `research/paper/manuscript.md`
3) 若用户要 rebuttal：生成/更新 `research/paper/rebuttal.md`

模板来源：
- `scholar/schemas/scholar-research/templates/claim-evidence-map.md`
- `scholar/schemas/scholar-research/templates/manuscript.md`
- `scholar/schemas/scholar-research/templates/rebuttal.md`

## 外部写作技能（可选）
如果用户项目中已安装外部 paper-writing skill，可使用它来生成正文草稿；
但“证据链闸门”仍由本 skill 执行（不满足则拒绝把句子写进 Abstract/Contributions）。
