import { $ } from "../../core.js";
import { findFolderAsync } from "../fs/index.js";

export async function checkGitProjectRemoteUpdatedAsync(projectPath: string) {
  const toDoThings = [];

    const outStr = (await $`cd ${projectPath} && LANG=en_US git status -uno --porcelain`).stdout;

    let behindCount = 0;
    let aheadCount = 0;
    try {
      behindCount = +(await $`cd ${projectPath} && LANG=en_US git rev-list --count @{upstream}..HEAD`).stdout;
      aheadCount = +(await $`cd ${projectPath} && LANG=en_US git rev-list --count HEAD..@{upstream}`).stdout;
    } catch (e) {
      const outStr = "Error al verificar la rama remota";
      toDoThings.push(outStr);
    }

    if (outStr)
      toDoThings.push("Uncommited changes");

    if (behindCount > 0)
      toDoThings.push("Behind commits: " + behindCount);

    if (aheadCount > 0)
      toDoThings.push("Ahead commits: " + aheadCount);

  return toDoThings;
}

export async function checkAllGitProjectsRemoteUpdatedAsync() {
  const gitFolders = await findFolderAsync({ folder: '.git' });
  const gitProjects = gitFolders.map((x) => x.replace(/\/\.git$/, ''));

  const verboseTmp = $.verbose;
  $.verbose = false;
  const toDoThings: Record<string, string[]> = {};
  for (const project of gitProjects) {
    const toDoProjectThing = await checkGitProjectRemoteUpdatedAsync(project);
    if (toDoProjectThing.length) {
      toDoThings[project] = toDoProjectThing;
    }
  }
  $.verbose = verboseTmp;

  return {
    gitProjects,
    toDoThings,
  };
}