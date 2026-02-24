import fs from "node:fs/promises";
import path from "node:path";
import { pathExists, writeJsonFile } from "./fs.js";

export function manifestPath(toolHome) {
  return path.join(toolHome, ".scholar3", "manifest.json");
}

export async function readManifest(toolHome) {
  const target = manifestPath(toolHome);
  if (!(await pathExists(target))) return null;
  return JSON.parse(await fs.readFile(target, "utf8"));
}

export async function writeManifest({ toolHome, manifest, dryRun = false }) {
  await writeJsonFile({ target: manifestPath(toolHome), data: manifest, dryRun });
}

