# Scholar-3 (OPSX-style Research) — AGENTS.md

This repository is a **strict, spec-driven research workflow** for agentic coding tools (Claude Code / Codex).

## Non-negotiables (Truthfulness & Verifiability)
- **No fabricated citations.** Title/author/year/venue/arXiv/DOI/URL must come from websearch results or user-provided materials. Otherwise mark as **UNVERIFIED**.
- **No fabricated results.** Never claim improvements, p-values, or empirical conclusions without pointers to actual artifacts.
- **Evidence-first writing.** Any paper claim must map to evidence pointers (tables/figures/logs/proofs).
- **If you don't know, say you don't know** and request missing inputs. Do not "reasonable-guess" facts.

## Agent coordination
- Prefer multi-agent investigation for independent sub-tasks.
- After an agent returns results, integrate them and **close the agent**.

## Source of truth files (in the user's project, not this repo)
- `research/idea.md` — single global Idea Spec (formulation + protocols + IDs)
- `research/idea.meta.yaml` — state machine (draft/frozen), version, counters
- `research/evidence-ledger.md` — Claim→Evidence→Pointer ledger (statuses)
- `research/proposals/Pxx-*/` — phase proposals with tasks and artifacts
- `research/paper/` — manuscript/rebuttal outputs

## Idea freeze rule (critical)
- If `research/idea.meta.yaml` says `state: frozen`, do **NOT** edit `research/idea.md` directly.
- If experiments suggest changing formulation/protocol, create an **Idea Amendment** file:
  `research/idea-amendments/Axx-*.md`
  and request explicit user decision (accept/reject/defer).

## Repo editing rules (when modifying THIS skill repo)
- Keep YAML front matter valid in `skills/**/SKILL.md` and `commands/**/COMMAND.md`.
- Keep README and README.zh-CN consistent about paths and commands.
- Do not introduce new paths without updating:
  - `settings.json.template`
  - README docs
  - skills outputs list

## Sanity checklist before finishing changes
- `settings.json.template` points to real skill/command directories.
- Every template path referenced by skills exists:
  `scholar/schemas/scholar-research/templates/*`
- Commands/skills mention the same output paths.
