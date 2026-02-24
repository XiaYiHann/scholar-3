# Third-party skills (optional)

Scholar-3 intentionally keeps paper writing **evidence-gated** but does not try to re-implement every writing playbook.

## Recommended external sources (examples)
- `davila7/claude-code-templates` (contains ML paper writing skill templates; verify license and keep attribution).  
  Repo: https://github.com/davila7/claude-code-templates

## Integration options
### Option A: Git submodule (recommended for keeping upstream updates)
- Add as submodule under `third_party/vendor/claude-code-templates`
- Document exact commit hash
- Keep upstream LICENSE and attribution

### Option B: Copy specific skill folders (vendor minimal)
- Copy only the needed skill directory into `third_party/skills/...`
- Keep LICENSE + attribution notices
- Avoid modifying upstream code unless necessary; document diffs

## Non-negotiable
Even with external writing skills:
- Abstract/Contributions must still pass Scholar-3 evidence gate:
  only status=`verified` claims from `research/evidence-ledger.md`.
