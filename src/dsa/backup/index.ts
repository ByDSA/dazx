import { isInstalledAsync } from "../bash/index.js";

export async function forceBackupInstalledAsync() {
  if (!await isInstalledAsync("backup")) {
    throw new Error("Not Implemented");
  }
}

export {
  backupAsync,
  backupThisFolderAsync
} from "./backup.js";
export {
  backupRsync
} from "./backupRsync.js";


