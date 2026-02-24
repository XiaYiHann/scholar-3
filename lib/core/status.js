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

export async function status(options) {
  const { tool, toolHome } = options ?? {};
  if (!tool || !toolHome) {
    throw new Error("status requires { tool, toolHome }");
  }

  const manifestPath = path.join(toolHome, ".scholar3", "manifest.json");
  if (!(await pathExists(manifestPath))) {
    return {
      tool,
      toolHome,
      hasManifest: false,
      installedCount: 0,
      missingCount: 0,
      installed: [],
      missing: [],
    };
  }

  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const installed = Array.isArray(manifest.installed) ? manifest.installed : [];

  const missing = [];
  let presentCount = 0;
  for (const item of installed) {
    if (!item?.path) continue;
    const abs = path.join(toolHome, item.path);
    const exists = await pathExists(abs);
    if (exists) {
      presentCount += 1;
    } else {
      missing.push(item);
    }
  }

  return {
    tool,
    toolHome,
    hasManifest: true,
    installedCount: presentCount,
    missingCount: missing.length,
    installed,
    missing,
  };
}
