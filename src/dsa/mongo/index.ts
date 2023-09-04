import { $, } from "../../core.js";
import { chalk } from "../../goods.js";
import { isInstalledAsync } from "../bash/index.js";
import { spawnOrFail } from "../bash/spawn.js";

async function requireMongoTools() {
  if (!(await isInstalledMongoTools())) {
    console.log("mongodb-org-tools is not installed. Installing...");

    // Import the public key used by the package management system.
    await $`wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -`;

    // Create a list file for MongoDB.
    await $`echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list`;

    // Reload local package database.
    await $`sudo apt-get update`;

    // Install the MongoDB packages.
    await $`sudo apt install -y mongodb-org-tools`;

    if (!(await isInstalledMongoTools())) {
      console.log(chalk.red("mongodb-org-tools is not installed. Aborting..."));
      process.exit(1);
    }
  }
}

async function isInstalledMongoTools() {
  return isInstalledAsync("mongodump");
}

type Params = {
  uri?: string;
  archive?: boolean;
  outFile?: string;
};
export async function mongodump(params: Params) {
  await requireMongoTools();

  const { uri, archive, outFile } = params;
  const cmd = ["mongodump"];

  if (uri)
    cmd.push("--uri", uri);

  if (archive)
    cmd.push("--archive");

  if (outFile)
    cmd.push(">", outFile);

  const cmdName = cmd[0];
  const cmdArgs = cmd.slice(1).join(" ");
  const cmdStr = `${cmdName} ${cmdArgs}`;

  console.log("cmd:", chalk.green(cmdName, cmdArgs));
  spawnOrFail(cmdStr, {
    showCommand: $.verbose,
  } );
}