import fs from "node:fs";
import path from "node:path";
import { spawnOrFail } from "../bash/spawn.js";
import { TreeGenConfig, treeGen } from "./tree.js";
import { ExtractOptionalPropsAsRequired } from "./utilityTypes.js";

type PartialTree = string | TreeGenConfig;
type Config = {
  srcFolder: string;
  outFolder: string;
  progress?: boolean;
  delete?: boolean;
  exclusion?: string[];
  ignoreTree?: boolean;
  partialTrees?: {
    list: PartialTree[];
    genOnSource?: boolean;
  };
};

type OptionalConfig = ExtractOptionalPropsAsRequired<Config>;

const DEFAULT_EXCLUSION = Object.freeze([
  "*.tree",
  "/backup.mjs-*.mjs",
  "/exclude/",
]);

const OPTIONAL_CONFIG_DEFAULT: OptionalConfig = {
  progress: true,
  delete: true,
  exclusion: [],
  ignoreTree: false,
  partialTrees: {
    list: [],
    genOnSource: false,
  }
};
export function backupRsync(config: Config) {
  const actualConfig: Required<Config> = {...OPTIONAL_CONFIG_DEFAULT, ...config};
  actualConfig.exclusion = config.exclusion ? [...DEFAULT_EXCLUSION, ...config.exclusion] : [...DEFAULT_EXCLUSION];
  const excludeStr = actualConfig.exclusion.map((e) => `--exclude ${e}`).join(" ");
  let cmd = "sudo rsync -aty";

  if (actualConfig.progress)
    cmd += " --progress";

  if (actualConfig.delete)
    cmd += " --delete";

  cmd += ` ${excludeStr} "${actualConfig.srcFolder}/" "${actualConfig.outFolder}/"`;

  spawnOrFail(cmd);

  const treeGenFolder = actualConfig.partialTrees.genOnSource ? actualConfig.srcFolder : actualConfig.outFolder;

  for (const partialTree of actualConfig.partialTrees.list) {
    const subPath = typeof partialTree === "string" ? partialTree : partialTree.inputPath;
    const inputPath = path.resolve(treeGenFolder, subPath);
    const outPath = path.resolve(inputPath, "index.tree");

    if (!fs.existsSync(outPath)) {
      treeGen({
        inputPath,
        outPath,
        dontFollowISOs: typeof partialTree === "object" && partialTree.dontFollowISOs,
      });
    }
  }

  const outPath = path.resolve(actualConfig.outFolder, "index.tree");
  treeGen({
    inputPath: treeGenFolder,
    outPath,
  });
}