import { fs, path } from "../index.js";

export function transformScript(source: string) {
  let modifiedContent = source;
  modifiedContent = replaceDSAJs(modifiedContent,"datest", "rclone");
  modifiedContent = replaceDSAIndex(modifiedContent, "bash", "backup", "node", "git", "fs", "mongo");

  return modifiedContent
}

function findInNodePath(file: string): string {
  const NODE_PATH = process.env.NODE_PATH;

  if (!NODE_PATH) throw new Error("NODE_PATH not defined");

  const nodePaths = NODE_PATH.split(":");

  for (const candidateNodePath of nodePaths) {
    const candidateFile = path.join(candidateNodePath,file);

    if (fs.existsSync(candidateFile)) {
      return candidateFile;
    }
  }

  throw new Error(`File ${file} not found in NODE_PATH`);
}

function replaceDSAJs(modifiedContent: string, ...cases: string[]) {
  cases.forEach((name) => {
    const newFile = findInNodePath(`dazx/build/dsa/${name}.js`);

    modifiedContent = modifiedContent.replaceAll(
      'from "dazx/' + name + '";',
      'from "' + newFile + '";'
    )
  });

  return modifiedContent;
}

function replaceDSAIndex(modifiedContent: string, ...cases: string[]) {
  cases.forEach((name) => {
    const newFile = findInNodePath(`dazx/build/dsa/${name}/index.js`);
    modifiedContent = modifiedContent.replaceAll(
      'from "dazx/' + name + '";',
      'from "' + newFile + '";'
    )
  });

  return modifiedContent;
}
