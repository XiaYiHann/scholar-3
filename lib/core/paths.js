import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export function expandUserPath(inputPath) {
  if (!inputPath) return inputPath;
  const trimmed = String(inputPath).trim();
  if (!trimmed) return trimmed;

  if (trimmed === "~") return os.homedir();
  if (trimmed.startsWith("~/")) return path.join(os.homedir(), trimmed.slice(2));

  return path.resolve(trimmed);
}

export function defaultClaudeHome() {
  return path.join(os.homedir(), ".claude");
}

export function defaultCodexHome(env = process.env) {
  const raw = env?.CODEX_HOME;
  if (raw) return expandUserPath(raw);
  return path.join(os.homedir(), ".codex");
}

export async function detectToolHomes({ claudeHome, codexHome } = {}) {
  const resolvedClaudeHome = expandUserPath(claudeHome ?? defaultClaudeHome());
  const resolvedCodexHome = expandUserPath(codexHome ?? defaultCodexHome());

  return {
    claude: {
      home: resolvedClaudeHome,
      exists: await pathExists(resolvedClaudeHome),
    },
    codex: {
      home: resolvedCodexHome,
      exists: await pathExists(resolvedCodexHome),
    },
  };
}

export async function findPackageRoot(startDir) {
  let dir = path.resolve(startDir);
  for (;;) {
    const candidate = path.join(dir, "package.json");
    if (await pathExists(candidate)) return dir;

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error(`Could not find package.json above: ${startDir}`);
}

export async function packageRootFromImportMeta(metaUrl) {
  const startDir = path.dirname(fileURLToPath(metaUrl));
  return await findPackageRoot(startDir);
}

