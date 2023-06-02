import { spawnSync } from "node:child_process";


type Config = {
  showCommand?: boolean;
}
export function spawnOrFail(cmd: string, config?: Config) {
  if (config?.showCommand)
    console.log(cmd);
  const process = spawnSync(cmd, { shell: true, stdio: 'inherit' });

  if (process.error || process.status !== 0) {
    if (process.error)
      throw process.error;
    else
      throw new Error(`Process failed with status code ${process.status}`);
  }

  return process;
}