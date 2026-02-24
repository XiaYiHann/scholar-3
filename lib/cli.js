import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { Command } from "commander";
import { checkbox, confirm, input } from "@inquirer/prompts";

import { init } from "./core/init.js";
import { status } from "./core/status.js";
import { uninstall } from "./core/uninstall.js";
import { projectInit } from "./core/projectInit.js";
import { detectToolHomes, expandUserPath, packageRootFromImportMeta } from "./core/paths.js";

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
    if (tool !== "claude" && tool !== "codex") {
      throw new Error(`Unknown tool: ${tool}`);
    }
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
      const detected = await detectToolHomes({
        claudeHome: options.claudeHome,
        codexHome: options.codexHome,
      });

      const selectedTools = options.tools
        ? normalizeTools(parseToolsCsv(options.tools))
        : options.yes
          ? (() => {
              const auto = [detected.claude.exists ? "claude" : null, detected.codex.exists ? "codex" : null].filter(Boolean);
              return normalizeTools(auto.length > 0 ? auto : ["claude", "codex"]);
            })()
          : normalizeTools(await selectToolsInteractive(detected));

      if (selectedTools.length === 0) {
        throw new Error("No tools selected.");
      }

      const homes = await resolveToolHomes({ selectedTools, detected, options });

      let allowOverwrite = Boolean(options.force || options.yes);
      if (!allowOverwrite && !options.tools) {
        allowOverwrite = await confirm({
          message: "Overwrite existing installed paths if present? (Backups will be created)",
          default: false,
        });
      }

      const result = await init({
        packageRoot,
        tools: selectedTools,
        claudeHome: selectedTools.includes("claude") ? homes.claudeHome : undefined,
        codexHome: selectedTools.includes("codex") ? homes.codexHome : undefined,
        mode: options.mode,
        force: Boolean(options.force),
        yes: allowOverwrite,
        dryRun: Boolean(options.dryRun),
      });

      if (options.json) {
        console.log(JSON.stringify({ command: "init", ...result }, null, 2));
      } else {
        printHumanInitSummary(result, { dryRun: options.dryRun });
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
