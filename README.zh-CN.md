# Scholar-3：面向 Claude Code / Codex 的 OPSX 风格科研工作流

Scholar-3 是一个**严格、规范驱动**的科研工作流，目标是让 agentic coding 工具真正按“工件（artifact）+ 依赖（DAG）+ 审计（verify）”推进科研，而不是靠感觉写论文。

它强制：
- **一个全局 Idea Spec**（单文件 formulation + protocol，可冻结）
- 多个 **分阶段 Proposal**（plan → tasks → report → verify）
- **Evidence Ledger**（论文 Claim 必须绑定证据指针）
- **不编造**引用与实验结果

## 工作流

```text
/discover  ->  Idea Spec（draft） -> freeze ->  多个 Proposal（P01,P02,...）
                     |                               |
                     |（amendment gate）             v
                     +------------------------ /verify 决策
/experiment -> /apply -> /verify -> /paper
```

## 产物路径（在你的项目里生成）

Idea：
- `research/idea.md`：唯一的研究真相来源（formulation、H/F/C IDs、评测协议）
- `research/idea.meta.yaml`：状态机（draft/frozen）、版本号、计数器
- `research/evidence-ledger.md`：Claim→Evidence→Pointer 账本

Proposals：
- `research/proposals/Pxx-*/proposal.md`
- `research/proposals/Pxx-*/experiment-plan.md`
- `research/proposals/Pxx-*/tasks.md`
- `research/proposals/Pxx-*/experiment-report.md`
- `research/proposals/Pxx-*/verify.md`

Amendments：
- `research/idea-amendments/Axx-*.md`

Paper：
- `research/paper/claim-evidence-map.md`
- `research/paper/manuscript.md`
- `research/paper/rebuttal.md`

## 命令

- `/discover`：创建/更新 idea spec，初始化 ledger，准备 freeze
- `/experiment`：创建/选择 proposal，生成 proposal + plan + tasks
- `/apply`：按 tasks 逐条执行（checkbox 追踪）
- `/verify`：证伪 + 可复现 + 证据账本审计，给出下一步决策
- `/paper`：只用 ledger 中 `verified` 的主张写论文

## 迁移（旧路径 → vNext）

如果你之前使用 Scholar-3 v1：
- `idea-proposal.md` → `research/idea.md` + `research/idea.meta.yaml`
- `experiment-report.md` → `research/proposals/Pxx-*/experiment-report.md`
- `manuscript.md` → `research/paper/manuscript.md`
- `rebuttal.md` → `research/paper/rebuttal.md`

## 安装

```bash
cd ~/.claude
git clone https://github.com/XiaYiHann/scholar-3.git
```

或手动复制：

```bash
cp -r scholar-3/skills/* ~/.claude/skills/
cp -r scholar-3/commands/* ~/.claude/commands/
```

## Scholar-3 spec config/schema（可选）

仓库内包含 `scholar/`，作为可检查的“总领配置 + 工件 DAG + 模板集合”。
你可以把 `scholar/` 复制到自己的科研项目根目录，用它携带这套工作流规范。

## 许可证

MIT
