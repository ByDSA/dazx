import { spawnSync } from "node:child_process";

export function spawnOrFail(cmd: string) {
  const process = spawnSync(cmd, { shell: true, stdio: 'inherit' });

  if (process.error || process.status !== 0) {
    if (process.error)
      throw process.error;
    else
      throw new Error(`Process failed with status code ${process.status}`);
  }

  return process;
}