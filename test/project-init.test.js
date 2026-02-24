import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";

import { projectInit } from "../lib/core/projectInit.js";

test("project-init (dry-run) does not write files", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "scholar3-project-init-"));
  const result = await projectInit({
    packageRoot: path.resolve("."),
    projectPath: tmpDir,
    dryRun: true,
    force: false,
  });

  assert.equal(result.performed, false);
  await assert.rejects(fs.stat(path.join(tmpDir, "scholar")), /no such file/i);
});

test("project-init copies scholar/ and ensures research/.gitkeep", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "scholar3-project-init-"));
  const result = await projectInit({
    packageRoot: path.resolve("."),
    projectPath: tmpDir,
    dryRun: false,
    force: false,
  });

  assert.equal(result.performed, true);
  await fs.stat(path.join(tmpDir, "scholar", "config.yaml"));
  await fs.stat(path.join(tmpDir, "research", ".gitkeep"));
});

