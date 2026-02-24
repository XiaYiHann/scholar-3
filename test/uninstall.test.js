import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";

import { init } from "../lib/core/init.js";
import { uninstall } from "../lib/core/uninstall.js";
import { status } from "../lib/core/status.js";

async function readText(filePath) {
  return await fs.readFile(filePath, "utf8");
}

test("status reads manifest and reports installed files", async () => {
  const claudeHome = await fs.mkdtemp(path.join(os.tmpdir(), "scholar3-claude-"));
  await init({
    packageRoot: path.resolve("."),
    tools: ["claude"],
    claudeHome,
    mode: "copy",
    force: false,
    yes: true,
    dryRun: false,
    now: () => new Date("2026-02-24T00:00:00.000Z"),
  });

  const result = await status({ tool: "claude", toolHome: claudeHome });
  assert.equal(result.tool, "claude");
  assert.equal(result.missingCount, 0);
  assert.ok(result.installedCount > 0);
});

test("uninstall removes installed files and restores backups by default", async () => {
  const claudeHome = await fs.mkdtemp(path.join(os.tmpdir(), "scholar3-claude-"));
  const commandPath = path.join(claudeHome, "commands", "scholar3", "discover.md");
  await fs.mkdir(path.dirname(commandPath), { recursive: true });
  await fs.writeFile(commandPath, "OLD\n", "utf8");

  await init({
    packageRoot: path.resolve("."),
    tools: ["claude"],
    claudeHome,
    mode: "copy",
    force: false,
    yes: true,
    dryRun: false,
    now: () => new Date("2026-02-24T00:00:00.000Z"),
  });

  assert.notEqual(await readText(commandPath), "OLD\n");

  const result = await uninstall({ tool: "claude", toolHome: claudeHome, restore: true });
  assert.equal(result.tool, "claude");
  assert.equal(await readText(commandPath), "OLD\n");

  await assert.rejects(
    fs.stat(path.join(claudeHome, "skills", "research-discover", "SKILL.md")),
    /no such file/i,
  );
});

