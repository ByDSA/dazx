import { spawnOrFail } from "../bash/spawn.js";
import { forceSudoAsync } from "../bash/sudo.js";
import { forceBackupInstalledAsync } from "./index.js";

type BackupParams = {
  type?: "iso";
  /** @deprecated **/
  fromFolder?: string;
  input: string;
  /** @deprecated **/
  toFolder?: string;
  /** @deprecated **/
  check?: boolean;
  checkAfter?: boolean;
  deleteAfter?: boolean;
  deleteTreeAfter?: boolean;
  dontFollowISOs?: boolean;
  outName?: string;
  outFolder?: string;
};
export async function backupAsync(params: BackupParams) {
  const {
    type = "iso",
    deleteAfter = false,
    deleteTreeAfter = false,
    dontFollowISOs = false,
    outName,
  } = params;

  const input = params.input ?? params.fromFolder;
  const outFolder = params.toFolder ?? params.outFolder;
  const checkAfter = params.check ?? params.checkAfter ?? false;

  if (!input)
    throw new Error("input is required");

  await forceSudoAsync();

  await forceBackupInstalledAsync();

  const booleanFlags = [];

  if (checkAfter)
    booleanFlags.push("--checkAfter");

  if (deleteAfter)
    booleanFlags.push("--deleteAfter");

  if (deleteTreeAfter)
    booleanFlags.push("--deleteTreeAfter");

  if (dontFollowISOs)
    booleanFlags.push("--dontFollowISOs");

    const nonBooleanFlags = {
      outName,
      outFolder,
      type,
    };

    const nonBooleanFlagsStr = Object.entries(nonBooleanFlags)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `--${key}="${value}"`)
    .join(" ");

  const cmd = `sudo backup ${booleanFlags.join(" ")} ${nonBooleanFlagsStr} "${input}"`;

  spawnOrFail(cmd);
}


type BackupThisFolderParams = Omit<BackupParams, "input">;
export async function backupThisFolderAsync(params?: BackupThisFolderParams) {
  return backupAsync({
    input: __dirname,
    ...params
  });
}