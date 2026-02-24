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

export async function projectInit(options) {
  const {
    packageRoot,
    projectPath,
    force = false,
    dryRun = false,
  } = options ?? {};

  if (!packageRoot || !projectPath) {
    throw new Error("projectInit requires { packageRoot, projectPath }");
  }

  const actions = [];
  let performed = false;

  const sourceScholarDir = path.join(packageRoot, "scholar");
  const destScholarDir = path.join(projectPath, "scholar");
  const destResearchDir = path.join(projectPath, "research");
  const destGitkeep = path.join(destResearchDir, ".gitkeep");

  const scholarExists = await pathExists(destScholarDir);
  if (scholarExists && !force) {
    actions.push({
      type: "skip",
      reason: "exists",
      target: destScholarDir,
    });
  } else {
    actions.push({
      type: scholarExists ? "replace_dir" : "copy_dir",
      source: sourceScholarDir,
      target: destScholarDir,
    });
    if (!dryRun) {
      await fs.mkdir(projectPath, { recursive: true });
      if (scholarExists) {
        await fs.rm(destScholarDir, { recursive: true, force: true });
      }
      await fs.cp(sourceScholarDir, destScholarDir, { recursive: true });
      performed = true;
    }
  }

  const gitkeepExists = await pathExists(destGitkeep);
  if (gitkeepExists && !force) {
    actions.push({
      type: "skip",
      reason: "exists",
      target: destGitkeep,
    });
  } else {
    actions.push({
      type: gitkeepExists ? "replace_file" : "create_file",
      target: destGitkeep,
    });
    if (!dryRun) {
      await fs.mkdir(destResearchDir, { recursive: true });
      await fs.writeFile(destGitkeep, "", "utf8");
      performed = true;
    }
  }

  return { actions, performed };
}
