import fs from "node:fs/promises";
import path from "node:path";
import { backupIfExists, copyDir, ensureDir, pathExists, symlinkDir, writeTextFile } from "./fs.js";
import { writeManifest } from "./manifest.js";
import { renderClaudeCommand } from "./renderClaudeCommand.js";
import { renderCodexPrompt } from "./renderCodexPrompt.js";

function formatTimestamp(date) {
  const pad2 = (n) => String(n).padStart(2, "0");
  return [
    String(date.getUTCFullYear()),
    pad2(date.getUTCMonth() + 1),
    pad2(date.getUTCDate()),
    "-",
    pad2(date.getUTCHours()),
    pad2(date.getUTCMinutes()),
    pad2(date.getUTCSeconds()),
  ].join("");
}

export async function init(options) {
  const {
    packageRoot,
    tools,
    claudeHome,
    codexHome,
    mode = "copy",
    force = false,
    yes = false,
    dryRun = false,
    now,
  } = options ?? {};

  if (!packageRoot) throw new Error("init requires { packageRoot }");
  if (!Array.isArray(tools) || tools.length === 0) {
    throw new Error("init requires { tools: [...] }");
  }
  if (mode !== "copy" && mode !== "symlink") {
    throw new Error(`Unsupported mode: ${mode}`);
  }

  const settingsPath = path.join(packageRoot, "settings.json.template");
  const settings = JSON.parse(await fs.readFile(settingsPath, "utf8"));
  const skillDirs = Array.isArray(settings.skills) ? settings.skills : [];
  const commandDirs = Array.isArray(settings.commands) ? settings.commands : [];

  const ts = formatTimestamp((now ? now() : new Date()));
  const toolResults = [];
  let performed = false;

  for (const tool of tools) {
    if (tool !== "claude" && tool !== "codex") {
      throw new Error(`Unknown tool: ${tool}`);
    }

    if (tool === "claude") {
      if (!claudeHome) throw new Error("init: claudeHome is required for tool=claude");

      const backupRoot = path.join(claudeHome, ".scholar3", "backups", ts);
      const manifestPath = path.join(claudeHome, ".scholar3", "manifest.json");

      const actions = [];
      const installed = [];

      await ensureDir(path.join(claudeHome, ".scholar3"), { dryRun });
      await ensureDir(backupRoot, { dryRun });
      await ensureDir(path.join(claudeHome, "skills"), { dryRun });
      await ensureDir(path.join(claudeHome, "commands", "scholar3"), { dryRun });

      for (const relSkillDir of skillDirs) {
        const skillName = path.basename(relSkillDir);
        const source = path.join(packageRoot, relSkillDir);
        const targetRel = path.join("skills", skillName);
        const targetAbs = path.join(claudeHome, targetRel);

        const exists = await pathExists(targetAbs);
        if (exists && !(force || yes)) {
          actions.push({ type: "skip", reason: "exists", target: targetRel });
          continue;
        }

        const backupPath = await backupIfExists({
          toolHome: claudeHome,
          relativePath: targetRel,
          backupRoot,
          dryRun,
        });

        actions.push({
          type: exists ? "replace_dir" : "copy_dir",
          source,
          target: targetRel,
          backupPath: backupPath ? path.relative(claudeHome, backupPath) : null,
        });

        if (!dryRun) {
          if (mode === "symlink") {
            await symlinkDir({ source, target: targetAbs, dryRun });
          } else {
            await copyDir({ source, target: targetAbs, dryRun });
          }
          performed = true;
        }

        installed.push({
          type: "dir",
          path: targetRel,
          backupPath: backupPath ? path.relative(claudeHome, backupPath) : null,
        });
      }

      for (const relCommandDir of commandDirs) {
        const commandId = path.basename(relCommandDir);
        const targetRel = path.join("commands", "scholar3", `${commandId}.md`);
        const targetAbs = path.join(claudeHome, targetRel);

        const exists = await pathExists(targetAbs);
        if (exists && !(force || yes)) {
          actions.push({ type: "skip", reason: "exists", target: targetRel });
          continue;
        }

        const backupPath = await backupIfExists({
          toolHome: claudeHome,
          relativePath: targetRel,
          backupRoot,
          dryRun,
        });

        const content = await renderClaudeCommand({ packageRoot, commandId });
        actions.push({
          type: exists ? "replace_file" : "write_file",
          target: targetRel,
          backupPath: backupPath ? path.relative(claudeHome, backupPath) : null,
        });

        if (!dryRun) {
          await writeTextFile({ target: targetAbs, content, dryRun });
          performed = true;
        }

        installed.push({
          type: "file",
          path: targetRel,
          backupPath: backupPath ? path.relative(claudeHome, backupPath) : null,
        });
      }

      actions.push({ type: "write_json", target: path.relative(claudeHome, manifestPath) });
      await writeManifest({
        toolHome: claudeHome,
        dryRun,
        manifest: {
          schemaVersion: 1,
          tool: "claude",
          toolHome: claudeHome,
          installedAt: new Date().toISOString(),
          mode,
          installed,
        },
      });
      if (!dryRun) performed = true;

      toolResults.push({ tool: "claude", actions });
    }

    if (tool === "codex") {
      if (!codexHome) throw new Error("init: codexHome is required for tool=codex");

      const backupRoot = path.join(codexHome, ".scholar3", "backups", ts);
      const manifestPath = path.join(codexHome, ".scholar3", "manifest.json");

      const actions = [];
      const installed = [];

      await ensureDir(path.join(codexHome, ".scholar3"), { dryRun });
      await ensureDir(backupRoot, { dryRun });
      await ensureDir(path.join(codexHome, "skills"), { dryRun });
      await ensureDir(path.join(codexHome, "prompts"), { dryRun });

      for (const relSkillDir of skillDirs) {
        const skillName = path.basename(relSkillDir);
        const source = path.join(packageRoot, relSkillDir);
        const targetRel = path.join("skills", skillName);
        const targetAbs = path.join(codexHome, targetRel);

        const exists = await pathExists(targetAbs);
        if (exists && !(force || yes)) {
          actions.push({ type: "skip", reason: "exists", target: targetRel });
          continue;
        }

        const backupPath = await backupIfExists({
          toolHome: codexHome,
          relativePath: targetRel,
          backupRoot,
          dryRun,
        });

        actions.push({
          type: exists ? "replace_dir" : "copy_dir",
          source,
          target: targetRel,
          backupPath: backupPath ? path.relative(codexHome, backupPath) : null,
        });

        if (!dryRun) {
          if (mode === "symlink") {
            await symlinkDir({ source, target: targetAbs, dryRun });
          } else {
            await copyDir({ source, target: targetAbs, dryRun });
          }
          performed = true;
        }

        installed.push({
          type: "dir",
          path: targetRel,
          backupPath: backupPath ? path.relative(codexHome, backupPath) : null,
        });
      }

      for (const relCommandDir of commandDirs) {
        const commandId = path.basename(relCommandDir);
        const targetRel = path.join("prompts", `scholar3-${commandId}.md`);
        const targetAbs = path.join(codexHome, targetRel);

        const exists = await pathExists(targetAbs);
        if (exists && !(force || yes)) {
          actions.push({ type: "skip", reason: "exists", target: targetRel });
          continue;
        }

        const backupPath = await backupIfExists({
          toolHome: codexHome,
          relativePath: targetRel,
          backupRoot,
          dryRun,
        });

        const prompt = await renderCodexPrompt({ packageRoot, commandId });

        actions.push({
          type: exists ? "replace_file" : "write_file",
          target: targetRel,
          backupPath: backupPath ? path.relative(codexHome, backupPath) : null,
        });

        if (!dryRun) {
          await writeTextFile({ target: targetAbs, content: prompt, dryRun });
          performed = true;
        }

        installed.push({
          type: "file",
          path: targetRel,
          backupPath: backupPath ? path.relative(codexHome, backupPath) : null,
        });
      }

      actions.push({ type: "write_json", target: path.relative(codexHome, manifestPath) });
      await writeManifest({
        toolHome: codexHome,
        dryRun,
        manifest: {
          schemaVersion: 1,
          tool: "codex",
          toolHome: codexHome,
          installedAt: new Date().toISOString(),
          mode,
          installed,
        },
      });
      if (!dryRun) performed = true;

      toolResults.push({ tool: "codex", actions });
    }
  }

  return { performed: performed && !dryRun, toolResults };
}
