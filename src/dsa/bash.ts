import { $ } from "../core.js";
import { which } from "../goods.js";
export async function assertSudo() {
  try {
    $.verbose = false;
    await $`sudo echo "Sudo OK" > /dev/null 2>&1`;
    $.verbose = true;
  } catch (error) {
    throw new Error("You need to be sudo to run this script");
  }
}

export async function isInstalledAsync(name: string): Promise<boolean> {
  try {
    await which(name);
    return true;
  } catch (error) {
    return false;
  }
}

export async function assertInstalledAsync(...names: string[]) {
  for (const name of names)
    if (!await isInstalledAsync(name))
      throw new Error(name + " is not installed");
}