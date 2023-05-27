export function transformScript(source: string) {
  const NODE_PATH = process.env.NODE_PATH

  let modifiedContent = source;
  modifiedContent = replaceDSAJs(modifiedContent,"datest", "rclone");
  modifiedContent = replaceDSAIndex(modifiedContent, "bash");

  return modifiedContent
}

function replaceDSAJs(modifiedContent: string, ...cases: string[]) {
  const NODE_PATH = process.env.NODE_PATH;

  cases.forEach((name) => {
    modifiedContent = modifiedContent.replace(
      'from "dazx/' + name + '";',
      'from "' + NODE_PATH + '/dazx/build/dsa/' + name + '.js";'
    )
  });

  return modifiedContent;
}

function replaceDSAIndex(modifiedContent: string, ...cases: string[]) {
  const NODE_PATH = process.env.NODE_PATH;

  cases.forEach((name) => {
    modifiedContent = modifiedContent.replace(
      'from "dazx/' + name + '";',
      'from "' + NODE_PATH + '/dazx/build/dsa/' + name + '/index.js";'
    )
  });

  return modifiedContent;
}
