import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";

import { init } from "../lib/core/init.js";

test("init (dry-run) does not write files", async () => {
  const claudeHome = await fs.mkdtemp(path.join(os.tmpdir(), "scholar3-claude-"));
  const result = await init({
    packageRoot: path.resolve("."),
    tools: ["claude"],
    claudeHome,
    mode: "copy",
    force: false,
    yes: true,
    dryRun: true,
  });

  assert.equal(result.performed, false);
  await assert.rejects(
    fs.stat(path.join(claudeHome, "commands", "scholar3", "discover.md")),
    /no such file/i,
  );
});

test("init installs claude skills + namespaced commands + manifest", async () => {
  const claudeHome = await fs.mkdtemp(path.join(os.tmpdir(), "scholar3-claude-"));
  const result = await init({
    packageRoot: path.resolve("."),
    tools: ["claude"],
    claudeHome,
    mode: "copy",
    force: false,
    yes: true,
    dryRun: false,
    now: () => new Date("2026-02-24T00:00:00.000Z"),
  });

  assert.equal(result.performed, true);
  await fs.stat(path.join(claudeHome, "skills", "research-discover", "SKILL.md"));
  await fs.stat(path.join(claudeHome, "skills", "research-proposal", "SKILL.md"));
  await fs.stat(path.join(claudeHome, "skills", "research-experiment", "SKILL.md"));
  await fs.stat(path.join(claudeHome, "commands", "scholar3", "discover.md"));
  await fs.stat(path.join(claudeHome, "commands", "scholar3", "proposal.md"));
  await assert.rejects(
    fs.stat(path.join(claudeHome, "commands", "scholar3", "experiment.md")),
    /no such file/i,
  );
  await fs.stat(path.join(claudeHome, ".scholar3", "manifest.json"));
});

test("init installs codex skills + prompts + manifest", async () => {
  const codexHome = await fs.mkdtemp(path.join(os.tmpdir(), "scholar3-codex-"));
  const result = await init({
    packageRoot: path.resolve("."),
    tools: ["codex"],
    codexHome,
    mode: "copy",
    force: false,
    yes: true,
    dryRun: false,
    now: () => new Date("2026-02-24T00:00:00.000Z"),
  });

  assert.equal(result.performed, true);
  await fs.stat(path.join(codexHome, "skills", "research-discover", "SKILL.md"));
  await fs.stat(path.join(codexHome, "skills", "research-proposal", "SKILL.md"));
  await fs.stat(path.join(codexHome, "skills", "research-experiment", "SKILL.md"));
  const discoverPromptPath = path.join(codexHome, "prompts", "scholar3-discover.md");
  const proposalPromptPath = path.join(codexHome, "prompts", "scholar3-proposal.md");
  await fs.stat(discoverPromptPath);
  await fs.stat(proposalPromptPath);
  await assert.rejects(
    fs.stat(path.join(codexHome, "prompts", "scholar3-experiment.md")),
    /no such file/i,
  );
  await fs.stat(path.join(codexHome, ".scholar3", "manifest.json"));

  const discoverPromptText = await fs.readFile(discoverPromptPath, "utf8");
  const proposalPromptText = await fs.readFile(proposalPromptPath, "utf8");
  assert.match(discoverPromptText, /\/scholar3-discover/);
  assert.match(proposalPromptText, /\/scholar3-proposal/);
});

test("init twice backs up overwritten files", async () => {
  const claudeHome = await fs.mkdtemp(path.join(os.tmpdir(), "scholar3-claude-"));
  const commandPath = path.join(claudeHome, "commands", "scholar3", "discover.md");

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

  await fs.writeFile(commandPath, "CUSTOM\n", "utf8");

  await init({
    packageRoot: path.resolve("."),
    tools: ["claude"],
    claudeHome,
    mode: "copy",
    force: false,
    yes: true,
    dryRun: false,
    now: () => new Date("2026-02-24T00:00:01.000Z"),
  });

  const backupPath = path.join(
    claudeHome,
    ".scholar3",
    "backups",
    "20260224-000001",
    "commands",
    "scholar3",
    "discover.md",
  );

  assert.equal(await fs.readFile(backupPath, "utf8"), "CUSTOM\n");
  assert.notEqual(await fs.readFile(commandPath, "utf8"), "CUSTOM\n");
});
