import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

async function readRepoFile(relPath) {
  return await fs.readFile(path.join(path.resolve("."), relPath), "utf8");
}

test("idea template includes required ASCII framework diagrams", async () => {
  const ideaTemplate = await readRepoFile("scholar/schemas/scholar-research/templates/idea.md");
  assert.match(ideaTemplate, /1\.5 System View \(ASCII\)/);
  assert.match(ideaTemplate, /3\.6 Causal Path \(ASCII\)/);
  assert.match(ideaTemplate, /7\.5 Evaluation Pipeline \(ASCII\)/);
});

test("idea template enforces plain-language explanations for formulation", async () => {
  const ideaTemplate = await readRepoFile("scholar/schemas/scholar-research/templates/idea.md");
  assert.match(ideaTemplate, /0\.5\) Plain-language Rule/);
  assert.match(ideaTemplate, /Symbols:/);
  assert.match(ideaTemplate, /Plain-language explanation \(大白话\)/);
  assert.match(ideaTemplate, /Formal definition \(optional\)/);
});

