import fs from "node:fs/promises";
import path from "node:path";

export async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath, { dryRun = false } = {}) {
  if (dryRun) return;
  await fs.mkdir(dirPath, { recursive: true });
}

export async function removePath(targetPath, { dryRun = false } = {}) {
  if (dryRun) return;
  await fs.rm(targetPath, { recursive: true, force: true });
}

export async function backupIfExists({
  toolHome,
  relativePath,
  backupRoot,
  dryRun = false,
}) {
  const target = path.join(toolHome, relativePath);
  if (!(await pathExists(target))) return null;

  const backupPath = path.join(backupRoot, relativePath);
  if (dryRun) return backupPath;

  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  await fs.rename(target, backupPath);
  return backupPath;
}

export async function copyDir({ source, target, dryRun = false }) {
  if (dryRun) return;
  await fs.cp(source, target, { recursive: true });
}

export async function symlinkDir({ source, target, dryRun = false }) {
  if (dryRun) return;
  await fs.symlink(source, target, "dir");
}

export async function writeTextFile({ target, content, dryRun = false }) {
  if (dryRun) return;
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, "utf8");
}

export async function writeJsonFile({ target, data, dryRun = false }) {
  if (dryRun) return;
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(data, null, 2) + "\n", "utf8");
}

