import { ExtractOptionalPropsAsRequired } from "../backup/utilityTypes.js";
import { spawnOrFail } from "./spawn.js";

const DEFAULT_CONFIG: ExtractOptionalPropsAsRequired<Config> = Object.freeze<ExtractOptionalPropsAsRequired<Config>>({
  progress: true,
  delete: true,
  noPerms: false,
  recursive: true,
  exclude: [] as string[],
  links: true,
  times: true,
  devices: true,
  specials: true,
  perms: true,
  owner: true,
  group: true,
});

type Config = {
  progress?: boolean;
  delete?: boolean;
  noPerms?: boolean;
  recursive?: boolean;
  origin: string;
  dest: string;
  exclude?: string[];
  links?: boolean;
  times?: boolean;
  devices?: boolean;
  specials?: boolean;
  perms?: boolean;
  owner?: boolean;
  group?: boolean;
}
export function rsync(config: Config) {
  const actualConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  let cmd = "sudo rsync";

  if (actualConfig.progress)
    cmd += " --progress";

  if (actualConfig.delete)
    cmd += " --delete";

  if (actualConfig.noPerms)
    cmd += " --no-perms";

  if (actualConfig.recursive)
    cmd += " --recursive";

  if (actualConfig.links)
    cmd += " --links";

  if (actualConfig.times)
    cmd += " --times";

  if (actualConfig.devices)
    cmd += " --devices";

  if (actualConfig.specials)
    cmd += " --specials";

  if (actualConfig.perms)
    cmd += " --perms";

  if (actualConfig.owner)
    cmd += " --owner";

  if (actualConfig.group)
    cmd += " --group";

  if (actualConfig.exclude)
    cmd += ` ${actualConfig.exclude.map((e) => `--exclude ${e}`).join(" ")}`;

  cmd += ` "${actualConfig.origin}/" "${actualConfig.dest}/"`;

  spawnOrFail(cmd, {
    showCommand: true,
  });
}

export {
  Config as RsyncConfig
};
