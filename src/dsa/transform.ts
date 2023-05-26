export function transformScript(source: string) {
  const NODE_PATH = process.env.NODE_PATH

  let modifiedContent = source
  ;['datest', 'bash', 'rclone'].forEach((name) => {
    modifiedContent = modifiedContent.replace(
      'from "dazx/' + name + '";',
      'from "' + NODE_PATH + '/dazx/build/dsa/' + name + '.js";'
    )
  })
  return modifiedContent
}
