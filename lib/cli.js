import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { Command } from "commander";
import { checkbox, confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { z } from "zod";

import { init } from "./core/init.js";
import { status } from "./core/status.js";
import { uninstall } from "./core/uninstall.js";
import { projectInit } from "./core/projectInit.js";
import { detectToolHomes, expandUserPath, packageRootFromImportMeta } from "./core/paths.js";
import { showWelcomeScreen } from "./ui/welcomeScreen.js";

const TOOL_IDS = ["claude", "codex"];
const ToolIdSchema = z.enum(TOOL_IDS);
const ModeSchema = z.enum(["copy", "symlink"]);

function parseToolsCsv(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function uniq(list) {
  return [...new Set(list)];
}

function normalizeTools(tools) {
  const normalized = uniq(tools.map((t) => t.toLowerCase()));
  for (const tool of normalized) {
    ToolIdSchema.parse(tool);
  }
  return normalized;
}

async function selectToolsInteractive(detected) {
  return await checkbox({
    message: "Select tools to install Scholar-3 into",
    choices: [
      {
        name: `Claude Code (${detected.claude.home})${detected.claude.exists ? "" : " (not found)"}`,
        value: "claude",
        checked: detected.claude.exists,
      },
      {
        name: `Codex (${detected.codex.home})${detected.codex.exists ? "" : " (not found)"}`,
        value: "codex",
        checked: detected.codex.exists,
      },
    ],
  });
}

async function resolveToolHomes({ selectedTools, detected, options }) {
  let claudeHome = detected.claude.home;
  let codexHome = detected.codex.home;

  if (selectedTools.includes("claude")) {
    if (options.claudeHome) {
      claudeHome = expandUserPath(options.claudeHome);
    } else if (!options.yes && !options.tools) {
      claudeHome = expandUserPath(
        await input({
          message: "Claude home directory",
          default: claudeHome,
        }),
      );
    }
  }

  if (selectedTools.includes("codex")) {
    if (options.codexHome) {
      codexHome = expandUserPath(options.codexHome);
    } else if (!options.yes && !options.tools) {
      codexHome = expandUserPath(
        await input({
          message: "Codex home directory (uses $CODEX_HOME if set)",
          default: codexHome,
        }),
      );
    }
  }

  return { claudeHome, codexHome };
}

function canPromptInteractively(options) {
  if (options?.yes) return false;
  if (options?.tools) return false;
  if (options?.json) return false;
  if (!process.stdout.isTTY) return false;
  if (!process.stdin.isTTY) return false;
  return true;
}

function formatToolLabel(tool) {
  if (tool === "claude") return "Claude Code";
  if (tool === "codex") return "Codex";
  return tool;
}

function summarizeActions(actions) {
  const counts = new Map();
  for (const a of actions) {
    const key = a?.type || "unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function formatCounts(counts) {
  const parts = [];
  const entries = [...counts.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  for (const [k, v] of entries) {
    parts.push(`${k}:${v}`);
  }
  return parts.join("  ");
}

function toolCommandList(tool) {
  if (tool === "claude") {
    return [
      "/scholar3:discover",
      "/scholar3:proposal",
      "/scholar3:apply",
      "/scholar3:verify",
      "/scholar3:paper",
    ];
  }
  if (tool === "codex") {
    return [
      "/scholar3-discover",
      "/scholar3-proposal",
      "/scholar3-apply",
      "/scholar3-verify",
      "/scholar3-paper",
    ];
  }
  return [];
}

function plannedWriteCount(actions) {
  return (actions ?? []).filter((a) => a.type !== "skip").length;
}

function plannedOverwriteCount(actions) {
  return (actions ?? []).filter((a) => a.backupPath).length;
}

function printInstallSummary({ selectedTools, homes, mode, plan, dryRun }) {
  console.log();
  console.log(chalk.white.bold("Install Summary"));
  console.log(chalk.dim(`mode=${mode}  dry-run=${dryRun ? "yes" : "no"}`));

  for (const tool of selectedTools) {
    const tr = (plan.toolResults ?? []).find((x) => x.tool === tool);
    const actions = tr?.actions ?? [];
    const writes = plannedWriteCount(actions);
    const overwrites = plannedOverwriteCount(actions);
    const home = tool === "claude" ? homes.claudeHome : homes.codexHome;
    const cmds = toolCommandList(tool);

    console.log();
    console.log(chalk.cyan(`${formatToolLabel(tool)} (${home})`));
    console.log(chalk.dim(`writes=${writes}  overwrites(with backup)=${overwrites}`));
    console.log(chalk.dim(`backup root: ${home}/.scholar3/backups/<timestamp>/`));
    console.log(chalk.dim(`commands: ${cmds.join("  ")}`));
  }
  console.log();
}

function printPlan(result) {
  for (const tr of result.toolResults ?? []) {
    const tool = tr.tool;
    const actions = Array.isArray(tr.actions) ? tr.actions : [];
    const counts = summarizeActions(actions);

    console.log();
    console.log(chalk.white.bold(`${formatToolLabel(tool)} plan`));
    console.log(chalk.dim(formatCounts(counts)));

    for (const action of actions) {
      const type = action?.type ?? "unknown";
      if (type === "skip") {
        console.log(chalk.dim(`  - skip (${action.reason}): ${action.target}`));
        continue;
      }
      if (type === "copy_dir" || type === "replace_dir") {
        console.log(`  - ${chalk.cyan(type)}: ${chalk.dim(action.source)} -> ${action.target}`);
        continue;
      }
      if (type === "write_file" || type === "replace_file") {
        console.log(`  - ${chalk.cyan(type)}: ${action.target}`);
        continue;
      }
      if (type === "write_json") {
        console.log(`  - ${chalk.cyan(type)}: ${action.target}`);
        continue;
      }
      console.log(`  - ${chalk.cyan(type)}: ${action.target ?? ""}`.trimEnd());
    }
  }
  console.log();
}

function printHumanInitSummary(result, { dryRun }) {
  for (const toolResult of result.toolResults ?? []) {
    const tool = toolResult.tool;
    const actions = Array.isArray(toolResult.actions) ? toolResult.actions : [];
    const skipped = actions.filter((a) => a.type === "skip").length;
    const writes = actions.length - skipped;
    console.log(`${tool}: ${writes} action(s), ${skipped} skipped`);
  }
  if (dryRun) console.log("dry-run: no files were written");
}

export async function runCli(argv) {
  const packageRoot = await packageRootFromImportMeta(import.meta.url);
  const pkg = JSON.parse(await fs.readFile(path.join(packageRoot, "package.json"), "utf8"));

  const program = new Command()
    .name("scholar3")
    .description("Scholar-3 CLI installer for Claude Code and Codex")
    .version(pkg.version);

  program.option("--no-color", "Disable color output");
  program.hook("preAction", async (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.color === false) {
      process.env.NO_COLOR = "1";
    }
  });

  program
    .command("init")
    .description("Install Scholar-3 skills and tool-specific commands/prompts")
    .option("--tools <claude,codex>", "Comma-separated tools list (non-interactive)")
    .option("--claude-home <path>", "Override Claude home (default ~/.claude)")
    .option("--codex-home <path>", "Override Codex home (default $CODEX_HOME or ~/.codex)")
    .option("--mode <copy|symlink>", "Install mode", "copy")
    .option("--force", "Overwrite existing files without prompting", false)
    .option("--yes", "Accept prompts (safe defaults)", false)
    .option("--dry-run", "Print planned actions, write nothing", false)
    .option("--json", "Machine-readable output", false)
    .action(async (options) => {
      ModeSchema.parse(options.mode);

      const interactive = canPromptInteractively(options);
      if (interactive) {
        await showWelcomeScreen();
      }

      const detected = await detectToolHomes({
        claudeHome: options.claudeHome,
        codexHome: options.codexHome,
      });

      const selectedTools = options.tools
        ? normalizeTools(parseToolsCsv(options.tools))
        : (options.yes || options.json)
          ? (() => {
              const auto = [detected.claude.exists ? "claude" : null, detected.codex.exists ? "codex" : null].filter(Boolean);
              return normalizeTools(auto.length > 0 ? auto : ["claude", "codex"]);
            })()
          : normalizeTools(await selectToolsInteractive(detected));

      if (selectedTools.length === 0) {
        throw new Error("No tools selected.");
      }

      let mode = options.mode;
      if (interactive && !options.mode) {
        mode = await select({
          message: "Install mode",
          default: "copy",
          choices: [
            { name: "Copy (recommended)", value: "copy" },
            { name: "Symlink (advanced)", value: "symlink" },
          ],
        });
      }
      ModeSchema.parse(mode);

      const homes = await resolveToolHomes({ selectedTools, detected, options });

      let allowOverwrite = Boolean(options.force || options.yes);
      if (!allowOverwrite && interactive) {
        allowOverwrite = await confirm({
          message: "Overwrite existing installed paths if present? (Backups will be created)",
          default: false,
        });
      }

      const startedAt = new Date();
      const now = () => startedAt;

      const plan = await init({
        packageRoot,
        tools: selectedTools,
        claudeHome: selectedTools.includes("claude") ? homes.claudeHome : undefined,
        codexHome: selectedTools.includes("codex") ? homes.codexHome : undefined,
        mode,
        force: Boolean(options.force),
        yes: allowOverwrite,
        dryRun: true,
        now,
      });

      if (options.dryRun) {
        if (options.json) {
          console.log(JSON.stringify({ command: "init", ...plan }, null, 2));
        } else {
          printInstallSummary({ selectedTools, homes, mode, plan, dryRun: true });
          printPlan(plan);
          console.log(chalk.dim("dry-run: no files were written"));
        }
        return;
      }

      if (interactive) {
        printInstallSummary({ selectedTools, homes, mode, plan, dryRun: false });
        printPlan(plan);
        const proceed = await confirm({ message: "Proceed with installation?", default: true });
        if (!proceed) {
          console.log(chalk.dim("Canceled."));
          return;
        }
      }

      const spinner = options.json ? null : ora("Installing Scholar-3...").start();
      try {
        const result = await init({
          packageRoot,
          tools: selectedTools,
          claudeHome: selectedTools.includes("claude") ? homes.claudeHome : undefined,
          codexHome: selectedTools.includes("codex") ? homes.codexHome : undefined,
          mode,
          force: Boolean(options.force),
          yes: allowOverwrite,
          dryRun: false,
          now,
        });

        spinner?.succeed("Installed");

        if (options.json) {
          console.log(JSON.stringify({ command: "init", ...result }, null, 2));
        } else {
          printHumanInitSummary(result, { dryRun: false });
          console.log(chalk.dim("Available commands:"));
          if (selectedTools.includes("claude")) {
            for (const cmd of toolCommandList("claude")) {
              console.log(`  ${chalk.yellow(cmd)}  ${chalk.dim("(Claude Code)")}`);
            }
          }
          if (selectedTools.includes("codex")) {
            for (const cmd of toolCommandList("codex")) {
              console.log(`  ${chalk.yellow(cmd)}  ${chalk.dim("(Codex)")}`);
            }
          }
        }
      } catch (error) {
        spinner?.fail(error instanceof Error ? error.message : String(error));
        throw error;
      }
    });

  program
    .command("status")
    .description("Show Scholar-3 installation status")
    .option("--tools <claude,codex>", "Comma-separated tools list (default: detected tools)")
    .option("--claude-home <path>", "Override Claude home (default ~/.claude)")
    .option("--codex-home <path>", "Override Codex home (default $CODEX_HOME or ~/.codex)")
    .option("--json", "Machine-readable output", false)
    .action(async (options) => {
      const detected = await detectToolHomes({
        claudeHome: options.claudeHome,
        codexHome: options.codexHome,
      });

      const selectedTools = options.tools
        ? normalizeTools(parseToolsCsv(options.tools))
        : normalizeTools(
            [detected.claude.exists ? "claude" : null, detected.codex.exists ? "codex" : null].filter(Boolean),
          );

      if (selectedTools.length === 0) {
        throw new Error("No tools detected. Use --tools and --<tool>-home to specify targets.");
      }

      const homes = await resolveToolHomes({ selectedTools, detected, options: { ...options, yes: true, tools: true } });

      const results = [];
      for (const tool of selectedTools) {
        results.push(
          await status({
            tool,
            toolHome: tool === "claude" ? homes.claudeHome : homes.codexHome,
          }),
        );
      }

      if (options.json) {
        console.log(JSON.stringify({ command: "status", results }, null, 2));
        return;
      }

      for (const r of results) {
        if (!r.hasManifest) {
          console.log(`${r.tool}: not installed (no manifest)`);
          continue;
        }
        console.log(`${r.tool}: ${r.installedCount} present, ${r.missingCount} missing`);
      }
    });

  program
    .command("uninstall")
    .description("Remove installed assets using the manifest; restore backups by default")
    .option("--tools <claude,codex>", "Comma-separated tools list (default: detected tools)")
    .option("--claude-home <path>", "Override Claude home (default ~/.claude)")
    .option("--codex-home <path>", "Override Codex home (default $CODEX_HOME or ~/.codex)")
    .option("--yes", "Skip confirmation prompts", false)
    .option("--no-restore", "Do not restore backups")
    .option("--json", "Machine-readable output", false)
    .action(async (options) => {
      const detected = await detectToolHomes({
        claudeHome: options.claudeHome,
        codexHome: options.codexHome,
      });

      const selectedTools = options.tools
        ? normalizeTools(parseToolsCsv(options.tools))
        : normalizeTools(
            [detected.claude.exists ? "claude" : null, detected.codex.exists ? "codex" : null].filter(Boolean),
          );

      if (selectedTools.length === 0) {
        throw new Error("No tools detected. Use --tools and --<tool>-home to specify targets.");
      }

      if (!options.yes) {
        const ok = await confirm({
          message: `Uninstall from: ${selectedTools.join(", ")} ?`,
          default: false,
        });
        if (!ok) {
          if (options.json) {
            console.log(JSON.stringify({ command: "uninstall", performed: false }, null, 2));
          } else {
            console.log("Canceled.");
          }
          return;
        }
      }

      const homes = await resolveToolHomes({ selectedTools, detected, options: { ...options, yes: true, tools: true } });

      const results = [];
      for (const tool of selectedTools) {
        results.push(
          await uninstall({
            tool,
            toolHome: tool === "claude" ? homes.claudeHome : homes.codexHome,
            restore: Boolean(options.restore),
          }),
        );
      }

      if (options.json) {
        console.log(JSON.stringify({ command: "uninstall", results }, null, 2));
        return;
      }

      for (const r of results) {
        console.log(`${r.tool}: removed ${r.removed}, restored ${r.restored}`);
      }
    });

  program
    .command("project-init")
    .description("Scaffold a project with Scholar-3 spec bundle only (scholar/ + research/.gitkeep)")
    .option("--path <dir>", "Target project directory", process.cwd())
    .option("--force", "Overwrite existing files", false)
    .option("--dry-run", "Print planned actions, write nothing", false)
    .option("--json", "Machine-readable output", false)
    .action(async (options) => {
      const projectPath = expandUserPath(options.path);
      const result = await projectInit({
        packageRoot,
        projectPath,
        force: Boolean(options.force),
        dryRun: Boolean(options.dryRun),
      });

      if (options.json) {
        console.log(JSON.stringify({ command: "project-init", ...result }, null, 2));
        return;
      }

      for (const a of result.actions ?? []) {
        if (a.type === "skip") console.log(`skip: ${a.target}`);
        if (a.type === "copy_dir" || a.type === "replace_dir") console.log(`${a.type}: ${a.target}`);
        if (a.type === "create_file" || a.type === "replace_file") console.log(`${a.type}: ${a.target}`);
      }
      if (options.dryRun) console.log("dry-run: no files were written");
    });

  await program.parseAsync(argv);
}
