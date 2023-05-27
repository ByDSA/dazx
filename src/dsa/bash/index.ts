
import { which } from '../../goods.js';

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
