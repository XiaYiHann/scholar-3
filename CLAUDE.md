# Scholar-3

A simplified three-phase research workflow for Claude Code.

## Overview

Scholar-3 organizes academic research into three phases:
1. **Discovery** - Explore ideas, literature review, formula derivation
2. **Experiment** - Design experiments, write code, analyze results
3. **Paper** - Write papers, submit, respond to reviewers

## Quick Start

```bash
# Install
cd ~/.claude
git clone https://github.com/XiaYiHann/scholar-3.git

# Use in Claude Code
/discover    # Enter discovery mode
/experiment  # Enter experiment mode
/paper       # Enter paper writing mode
```

## Workflow

```
/discover → /experiment → /paper → Published
    ↑                          │
    └──────────────────────────┘
           New idea (cycle)
```

## Structure

- `skills/` - Three research skills with templates and workflows
- `commands/` - Quick entry commands for each phase
- `research/` - Output directory for generated documents

## License

MIT
