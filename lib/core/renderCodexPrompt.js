import fs from "node:fs/promises";
import path from "node:path";

function parseFrontMatter(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return { frontMatter: "", body: markdown };

  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) return { frontMatter: "", body: markdown };

  const frontMatter = normalized.slice(4, end);
  const body = normalized.slice(end + "\n---\n".length);
  return { frontMatter, body };
}

function parseSimpleYaml(frontMatter) {
  const result = {};
  for (const line of frontMatter.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(trimmed);
    if (!match) continue;
    const [, key, rawValue] = match;
    result[key] = rawValue.trim();
  }
  return result;
}

function rewriteSlashCommands(text, mapping) {
  let rewritten = text;
  for (const [from, to] of Object.entries(mapping)) {
    rewritten = rewritten.split(from).join(to);
  }
  return rewritten;
}

export async function renderCodexPrompt({ packageRoot, commandId }) {
  const sourcePath = path.join(packageRoot, "commands", commandId, "COMMAND.md");
  const raw = await fs.readFile(sourcePath, "utf8");
  const { frontMatter, body } = parseFrontMatter(raw);
  const meta = parseSimpleYaml(frontMatter);

  const mapping = {
    "/discover": "/scholar3-discover",
    "/proposal": "/scholar3-proposal",
    "/experiment": "/scholar3-proposal",
    "/apply": "/scholar3-apply",
    "/verify": "/scholar3-verify",
    "/paper": "/scholar3-paper",
  };

  const rewrittenBody = rewriteSlashCommands(body, mapping).trimStart();
  const description = meta.description ?? "";

  return [
    "---",
    `description: ${description}`,
    "argument-hint: command arguments",
    "---",
    "",
    rewrittenBody.trimEnd(),
    "",
  ].join("\n");
}
