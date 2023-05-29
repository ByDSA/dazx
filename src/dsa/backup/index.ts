import path from "path";
import { $ } from "../../core.js";
import { isInstalledAsync } from "../bash/index.js";
import { forceSudoAsync } from "../bash/sudo.js";

type BackupThisFolderParams = Omit<BackupParams, "input">;
export async function backupThisFolderAsync(params?: BackupThisFolderParams) {
  return backupAsync({
    input: __dirname,
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
  /** @deprecated **/
  fromFolder?: string;
  input: string;
  /** @deprecated **/
  toFolder?: string;
  check?: boolean;
  deleteAfter?: boolean;
  deleteTreeAfter?: boolean;
  dontFollowISOs?: boolean;
  outName?: string;
  outFolder?: string;
};
export async function backupAsync(params: BackupParams) {
  const {
    type = "iso",
    check = false,
    deleteAfter = false,
    deleteTreeAfter = false,
    dontFollowISOs = false,
    outName,
  } = params;

  const input = params.input ?? params.fromFolder;
  const outFolder = params.toFolder ?? params.outFolder;

  if (!input)
    throw new Error("input is required");

  await forceSudoAsync();

  await forceBackupInstalledAsync();

  const flags = [];

  if (check)
    flags.push("--checkAfter");

  if (deleteAfter)
    flags.push("--deleteAfter");

  if (deleteTreeAfter)
    flags.push("--deleteTreeAfter");

  if (dontFollowISOs)
    flags.push("--dontFollowISOs");

    const nonBooleanFlasgs = {
      outName,
      outFolder,
      type,
    };

  const nonBooleanFlasgsStr = Object.entries(nonBooleanFlasgs).reduce((acc, [key, value]) => {
    if (value)
      return acc + ` --${key} ${value}`;
    return acc;
  }, "").trim();

  await $`sudo backup ${flags} ${nonBooleanFlasgsStr} ${input}`;

  if (outFolder) {
    const parentFromFolder = path.join(input, "..");
    const backupFile = (await $`cd ${parentFromFolder} && echo $(ls | grep ${path.basename(input)} | grep ".iso")`).stdout.trim();
    if (!backupFile)
      throw new Error("Backup file not found in parent folder: " + parentFromFolder);
    const origin = path.resolve(".", parentFromFolder, backupFile);
    const to = path.resolve(outFolder) + "/";
    await $`sudo mv ${origin} ${to}`;
  }
}