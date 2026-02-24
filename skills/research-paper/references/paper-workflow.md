# Paper Workflow (Evidence-gated)

本文档提供 `research-paper` 技能的详细工作流程说明。

> 核心原则：先做 Claim→Evidence→Pointer 闸门，再写任何 Abstract/Contributions。

## 输入（最小）

- `research/evidence-ledger.md`
- 至少一个 proposal 的：
  - `research/proposals/Pxx-*/experiment-report.md`
  - `research/proposals/Pxx-*/artifacts/**`（logs/tables/figures 等）

（可选）：
- `research/idea.md`（Problem Setup / Protocol）

## 强制流程

### 1) 生成 Claim → Evidence Map

输出：
- `research/paper/claim-evidence-map.md`

硬规则：
- Abstract/Contributions 只能引用 ledger 中 status=`verified` 的 claim。
- 每条贡献必须包含可复现 pointer（表/图/日志/证明路径）。

### 2) 写 Manuscript

输出：
- `research/paper/manuscript.md`

要求：
- Related Work 不得编造引用；每条关键引用必须可核验（URL/arXiv/DOI）。
- Experiments 章节中所有数字都必须可追溯到 `research/proposals/Pxx-*/artifacts/**`。

### 3)（可选）写 Rebuttal

输出：
- `research/paper/rebuttal.md`

规则：
- 不得发明新结果；任何新主张必须有证据指针。

## 常见错误（Fail-fast）

- 在没有完成 claim-evidence map 前写 Abstract（违规）
- 用没有 pointer 的句子写贡献点（违规）
- 引用条目缺 URL/arXiv/DOI（不可核验）
