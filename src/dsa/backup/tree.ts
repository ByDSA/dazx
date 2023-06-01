import { spawnOrFail } from "../bash/spawn.js";

type Config = {
  inputPath: string;
  outPath?: string;
  dontFollowISOs?: boolean;
}
export function treeGen(config: Config) {
  let treeCmd = "sudo backup tree gen \"" + config.inputPath + "\"";

  if (config.dontFollowISOs)
    treeCmd += " --dontFollowISOs";

  if (config.outPath)
    treeCmd += " --out \"" + config.outPath + "\"";

  spawnOrFail(treeCmd);
}

export {
  Config as TreeGenConfig
};
