import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

async function readRepoFile(relPath) {
  return await fs.readFile(path.join(path.resolve("."), relPath), "utf8");
}

test("discover skill defines structured ideation gate IDs", async () => {
  const skill = await readRepoFile("skills/research-discover/SKILL.md");
  assert.match(skill, /Diverge → Challenge → Converge → Handoff/);
  assert.match(skill, /discover_start/);
  assert.match(skill, /discover_goal/);
  assert.match(skill, /discover_constraints/);
  assert.match(skill, /discover_diverge_lens/);
  assert.match(skill, /discover_freeze_decision/);
});

test("idea template includes divergence, risk register, and proposal handoff", async () => {
  const ideaTemplate = await readRepoFile("scholar/schemas/scholar-research/templates/idea.md");
  assert.match(ideaTemplate, /Candidate Directions \(Divergence Log\)/);
  assert.match(ideaTemplate, /Assumptions & Risk Register/);
  assert.match(ideaTemplate, /Proposal Handoff Capsule/);
});

test("proposal template requires discover handoff input", async () => {
  const proposalTemplate = await readRepoFile("scholar/schemas/scholar-research/templates/proposal.md");
  assert.match(proposalTemplate, /Input Handoff \(from `research\/idea\.md`\)/);
});
