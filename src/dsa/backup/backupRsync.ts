import fs from "node:fs";
import path from "node:path";
import { RsyncConfig, rsync } from "../bash/rsync.js";
import { TreeGenConfig, treeGen } from "./tree.js";
import { ExtractOptionalPropsAsRequired } from "./utilityTypes.js";

type PartialTree = string | TreeGenConfig;
type TreeGenConfigForRsync = Omit<TreeGenConfig, "inputPath" | "outPath">;
type PartialTreesType = {
  list: PartialTree[];
  useSources?: boolean;
} & TreeGenConfigForRsync;
type TreeType = {
  partialTrees?: PartialTreesType;
  useSources?: boolean;
  noGenerate?: boolean;
} & TreeGenConfigForRsync;
type Config = {
  srcFolder: string;
  outFolder: string;
  exclusion?: string[];
  tree?: TreeType;
  rsync?: Omit<RsyncConfig, "origin" | "dest">;
};

type OptionalConfig = ExtractOptionalPropsAsRequired<Config>;

const DEFAULT_EXCLUSION = Object.freeze([
  "*.tree",
  "/backup.mjs-*.mjs",
  "/exclude/",
]);

const OPTIONAL_CONFIG_DEFAULT: OptionalConfig = {
  exclusion: [] as string[],
  tree: {
    partialTrees: {
      list: [] as PartialTree[],
      useSources: false,
    },
    useSources: false,
    dontFollowISOs: false,
    noGenerate: false,
  },
  rsync: {
    progress: true,
    delete: true,
    noPerms: false,
  }
} as const;

function mergeConfigWithDefaults(config: Config): Required<Config> {
  const ret = {
    ...OPTIONAL_CONFIG_DEFAULT,
    ...config,
  };

  ret.exclusion = config.exclusion ? [...DEFAULT_EXCLUSION, ...config.exclusion] : [...DEFAULT_EXCLUSION];
  ret.tree = {
    ...OPTIONAL_CONFIG_DEFAULT.tree,
    ...config.tree,
  };
  ret.tree.partialTrees = config.tree?.partialTrees ? {
    ...(OPTIONAL_CONFIG_DEFAULT.tree.partialTrees as PartialTreesType),
    ...config.tree?.partialTrees,
  } : OPTIONAL_CONFIG_DEFAULT.tree.partialTrees as PartialTreesType;

  ret.tree.partialTrees.list = ret.tree?.partialTrees?.list
  ? [...ret.tree.partialTrees.list]
  : [...OPTIONAL_CONFIG_DEFAULT.tree.partialTrees?.list as PartialTree[]];

  ret.rsync = {
    ...OPTIONAL_CONFIG_DEFAULT.rsync,
    ...config.rsync,
  };

  return ret;
}

export function backupRsync(config: Config) {
  const actualConfig: Required<Config> = mergeConfigWithDefaults(config);

  rsync({
    ...actualConfig.rsync,
    origin: actualConfig.srcFolder,
    dest: actualConfig.outFolder
  });

  const treeGenFolder = actualConfig.tree.partialTrees?.useSources ? actualConfig.srcFolder : actualConfig.outFolder;

  for (const partialTree of actualConfig.tree?.partialTrees?.list ?? []) {
    const subPath = typeof partialTree === "string" ? partialTree : partialTree.inputPath;
    const inputPath = path.resolve(treeGenFolder, subPath);
    const outPath = path.resolve(inputPath, "index.tree");

    if (!fs.existsSync(outPath)) {
      const { useSources, partialTrees, ...treeConfig } = actualConfig.tree;
      treeGen({
        inputPath,
        outPath,
        ...treeConfig,
      });
    }
  }

  const outPath = path.resolve(actualConfig.outFolder, "index.tree");
  const { useSources, partialTrees, ...treeConfig } = actualConfig.tree;

  treeGen({
    inputPath: treeGenFolder,
    outPath,
    ...treeConfig,
  });
}