import { $ } from '../../core.js';

type Params = {
  fromFolder?: string;
  folder?: string;
};
const DEFAULT_FIND_FOLDER_ARGS = {
  fromFolder: './',
};
export async function findFolderAsync(params: Params = {}) {
  const { fromFolder, folder } = { ...DEFAULT_FIND_FOLDER_ARGS, ...params };

  if (!folder)
    throw new Error('folder is required');

  const verboseTmp = $.verbose;
  $.verbose = false;
  const outStr = (await $`find ${fromFolder} -name '${folder}' -type d -prune`).stdout;
  let outArray = outStr.split('\n') ?? [];
  outArray = outArray.filter((x) => x);
  $.verbose = verboseTmp;

  return outArray;
}

export async function rmRF(...files: string[]) {
  const promises = []
  for (const file of files) {
    const p = $`rm -rf ${file}`;
    promises.push(p);
  }

  await Promise.all(promises);
}