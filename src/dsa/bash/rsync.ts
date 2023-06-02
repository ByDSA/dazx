import { spawnOrFail } from "./spawn.js";

type Config = {
  progress?: boolean;
  delete?: boolean;
  noPerms?: boolean;
  origin: string;
  dest: string;
  exclude?: string[];
}
export function rsync(config: Config) {
  let cmd = "sudo rsync -aty";

  if (config.progress)
    cmd += " --progress";

  if (config.delete)
    cmd += " --delete";

  if (config.noPerms)
    cmd += " --no-perms";

  if (config.exclude)
    cmd += ` ${config.exclude.map((e) => `--exclude ${e}`).join(" ")}`;

  cmd += ` "${config.origin}/" "${config.dest}/"`;

  spawnOrFail(cmd, {
    showCommand: true,
  });
}

export {
  Config as RsyncConfig
};
