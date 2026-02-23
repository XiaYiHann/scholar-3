# Scholar-3: Simplified Research Workflow for Claude Code

A streamlined research workflow organized into three phases: Discovery, Experiment, and Paper.

```
/discover → /experiment → /paper → Published
    ↑                          │
    └──────────────────────────┘
           New idea (cycle)
```

## Overview

Scholar-3 provides a structured approach to academic research using Claude Code. It breaks down the research process into three distinct phases, each with dedicated skills and templates:

- **Discovery** (`/discover`) - Explore ideas, conduct literature review, derive formulas, design quick validations
- **Experiment** (`/experiment`) - Design experiments, write code, run experiments, analyze results
- **Paper** (`/paper`) - Write papers, submit, respond to reviewers, prepare presentations

## Features

- **Three-phase research workflow** - Clear separation of concerns across the research lifecycle
- **Structured templates** - Ready-to-use templates for proposals, experiment reports, manuscripts, and rebuttals
- **Progressive disclosure** - Start with simple commands, dive into detailed workflows when needed
- **Agent integration** - Leverages existing Claude agents (literature-reviewer, data-analyst, rebuttal-writer, etc.)

## Installation

### Via Git Clone (Recommended)

```bash
cd ~/.claude
git clone https://github.com/XiaYiHann/scholar-3.git
```

### Manual Installation

Copy the relevant files to your project's `.claude/` directory:

```bash
# Copy skills
cp -r scholar-3/skills/* ~/.claude/skills/

# Copy commands
cp -r scholar-3/commands/* ~/.claude/commands/
```

## Usage

Once installed, you can use the three commands in your Claude Code session:

### Phase 1: Discovery

```
/discover
```

Enter Idea exploration mode. Use this to:
- Explore new research ideas through Socratic dialogue
- Conduct literature searches
- Derive mathematical formulas
- Design quick validation experiments

Output: `research/idea-proposal.md`

### Phase 2: Experiment

```
/experiment
```

Enter experiment validation mode. Use this to:
- Design controlled experiments
- Write clean, reproducible code
- Run experiments and log results
- Analyze data with statistical tests

Output: `research/experiment-report.md`

### Phase 3: Paper

```
/paper
```

Enter paper writing mode. Use this to:
- Write manuscripts following top-conference standards
- Prepare submission materials
- Write professional rebuttal letters
- Create presentation slides and posters

Output: `research/manuscript.md`, `research/rebuttal.md`

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Scholar-3 Research Workflow                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│   │  Discovery  │───▶│  Experiment │───▶│    Paper    │       │
│   │             │    │             │    │             │       │
│   │ • Dialogue  │    │ • Design    │    │ • Write     │       │
│   │ • Literature│    │ • Code      │    │ • Submit    │       │
│   │ • Math      │    │ • Run       │    │ • Rebuttal  │       │
│   │ • Validate  │    │ • Analyze   │    │ • Present   │       │
│   └─────────────┘    └─────────────┘    └─────────────┘       │
│         │                                    │                │
│         └────────────────────────────────────┘                │
│                      New Ideas                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
scholar-3/
├── README.md                   # This file
├── README.zh-CN.md             # Chinese documentation
├── LICENSE                     # MIT License
├── .gitignore                  # Exclude sensitive files
├── settings.json.template      # Configuration template
│
├── skills/                     # Core skills
│   ├── research-discover/      # Discovery phase skill
│   │   ├── SKILL.md
│   │   ├── templates/
│   │   │   └── idea-proposal.md
│   │   └── references/
│   │       └── discovery-workflow.md
│   ├── research-experiment/    # Experiment phase skill
│   │   ├── SKILL.md
│   │   ├── templates/
│   │   │   └── experiment-report.md
│   │   └── references/
│   │       └── experiment-workflow.md
│   └── research-paper/         # Paper phase skill
│       ├── SKILL.md
│       ├── templates/
│       │   ├── manuscript.md
│       │   └── rebuttal.md
│       └── references/
│           └── paper-workflow.md
│
├── commands/                   # Quick entry commands
│   ├── discover/COMMAND.md
│   ├── experiment/COMMAND.md
│   └── paper/COMMAND.md
│
└── research/                   # Output directory (user creates)
    └── .gitkeep
```

## Templates

Scholar-3 includes structured templates for each phase:

| Template | Purpose | Location |
|----------|---------|----------|
| Idea Proposal | Document research ideas | `skills/research-discover/templates/` |
| Experiment Report | Document experiment results | `skills/research-experiment/templates/` |
| Manuscript | Academic paper structure | `skills/research-paper/templates/` |
| Rebuttal | Review response letter | `skills/research-paper/templates/` |

## Design Philosophy

Scholar-3 is built on these principles:

1. **Simplicity** - Three clear phases, easy to understand
2. **Progressive** - Each phase builds on the previous
3. **Iterative** - Cycle back with new insights
4. **Practical** - Templates and workflows grounded in real research practice

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Inspired by [claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar) and designed to work seamlessly with Claude Code's extensible skill and command system.

## Links

- [GitHub Repository](https://github.com/XiaYiHann/scholar-3)
- [Claude Code Documentation](https://docs.anthropic.com)

---

**Tags**: `claude-code` `research-workflow` `academic-research` `ml-research`
