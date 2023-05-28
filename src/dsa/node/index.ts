import { echo } from "../../goods.js";
import { questionYNAsync } from "../bash/input.js";
import { findFolderAsync, rmRF } from "../fs/index.js";

type Params = {
  fromFolder?: string;
};

export async function findNodeModulesAsync(params: Params = {}) {
  return findFolderAsync({ folder: 'node_modules', ...params });
}

export async function askForpurgeNodeModulesFoldersAsync() {
  const list = await findNodeModulesAsync();
  if (list.length) {
    echo("Se han encontrado " + list.length + " carpetas node_modules");
    console.log(list);
    const mustDelete = await questionYNAsync("Borrarlas antes de hacer el backup?");

    if (mustDelete) {
     await rmRF(...list);
    }
  }
}