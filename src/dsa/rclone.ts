import { $ } from "../core.js";
import { fs } from "../goods.js";

export async function assertRcloneAccountAsync(account: string) {
  if (!account)
    throw new Error("No account specified");

  const { stdout: rcloneConfig } = await $`rclone config file`;
  const rcloneConfigPath = rcloneConfig.split("\n")[1];
  const rcloneConfigFile = await fs.readFile(rcloneConfigPath, "utf8");
  if (!rcloneConfigFile.includes("["+account+"]"))
    throw new Error("Account " + account + " not found in rclone config");
}