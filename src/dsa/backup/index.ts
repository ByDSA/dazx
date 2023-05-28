import path from "path";
import { $ } from "../../core.js";
import { isInstalledAsync } from "../bash/index.js";
import { forceSudoAsync } from "../bash/sudo.js";

type BackupThisFolderParams = Omit<BackupParams, "fromFolder">;
export async function backupThisFolderAsync(params?: BackupThisFolderParams) {
  return backupAsync({
    fromFolder: __dirname,
    ...params
  });
}

export async function forceBackupInstalledAsync() {
  if (!await isInstalledAsync("backup")) {
    throw new Error("Not Implemented");
  }
}

type BackupParams = {
  type?: "iso";
  fromFolder: string;
  toFolder?: string;
  check?: boolean;
  deleteAfter?: boolean;
};
export async function backupAsync(params: BackupParams) {
  const { type = "iso", fromFolder, toFolder, check = false, deleteAfter = false } = params;

  if (!fromFolder)
    throw new Error("fromFolder is required");

  await forceSudoAsync();

  await forceBackupInstalledAsync();

  const flags = [];

  if (check)
    flags.push("--checkAfter");

  if (deleteAfter)
    flags.push("--deleteAfter");

  await $`sudo backup ${flags} -t ${type} ${fromFolder}`;

  if (toFolder) {
    const parentFromFolder = path.join(fromFolder, "..");
    const backupFile = (await $`cd ${parentFromFolder} && echo $(ls | grep ${path.basename(fromFolder)} | grep ".iso")`).stdout.trim();
    if (!backupFile)
      throw new Error("Backup file not found in parent folder: " + parentFromFolder);
    const origin = path.resolve(".", parentFromFolder, backupFile);
    const to = path.resolve(toFolder) + "/";
    await $`sudo mv ${origin} ${to}`;
  }
}