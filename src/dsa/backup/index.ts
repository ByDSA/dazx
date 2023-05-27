import { $ } from "../../core.js";
import { isInstalledAsync } from "../bash/index.js";
import { forceSudoAsync } from "../bash/sudo.js";

export async function backupThisFolderAsync() {
  await forceSudoAsync();

  await forceBackupInstalledAsync();

  await $`sudo backup -c -t iso ${__dirname}`;
}

export async function forceBackupInstalledAsync() {
  if (!await isInstalledAsync("backup")) {
    throw new Error("Not Implemented");
  }
}