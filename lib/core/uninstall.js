import fs from "node:fs/promises";
import path from "node:path";

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function uninstall(options) {
  const { tool, toolHome, restore = true } = options ?? {};
  if (!tool || !toolHome) {
    throw new Error("uninstall requires { tool, toolHome }");
  }

  const manifestPath = path.join(toolHome, ".scholar3", "manifest.json");
  if (!(await pathExists(manifestPath))) {
    return { tool, toolHome, performed: false, restored: 0, removed: 0 };
  }

  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const installed = Array.isArray(manifest.installed) ? manifest.installed : [];

  let removed = 0;
  let restored = 0;

  for (const item of installed) {
    if (!item?.path) continue;
    const targetAbs = path.join(toolHome, item.path);

    // Remove installed target first.
    await fs.rm(targetAbs, { recursive: true, force: true });
    removed += 1;

    if (restore && item.backupPath) {
      const backupAbs = path.join(toolHome, item.backupPath);
      if (await pathExists(backupAbs)) {
        // Ensure parent dir exists before restoring.
        await fs.mkdir(path.dirname(targetAbs), { recursive: true });
        await fs.rename(backupAbs, targetAbs);
        restored += 1;
      }
    }
  }

  await fs.rm(manifestPath, { force: true });

  return { tool, toolHome, performed: true, removed, restored };
}
