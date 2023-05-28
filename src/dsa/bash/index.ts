
import { $ } from '../../core.js';
import { which } from '../../goods.js';

export * from "./input.js";
export * from "./sudo.js";


export async function isInstalledAsync(name: string): Promise<boolean> {
  try {
    await which(name)
    return true
  } catch (error) {
    return false
  }
}

export async function assertInstalledAsync(...names: string[]) {
  for (const name of names)
    if (!(await isInstalledAsync(name)))
      throw new Error(name + ' is not installed')
}

export async function dirSizeAsync(directory: string) {
  const verboseTmp = $.verbose;
  $.verbose = false;

  const ret = +(await $`du -sb ${directory}`).stdout.split('\t')[0];

  $.verbose = verboseTmp;

  return ret;
}