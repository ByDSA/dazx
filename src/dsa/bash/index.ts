
import { $ } from '../../core.js';
import { fs, which } from '../../goods.js';

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

async function loadEnv(pathFile: string) {
  console.log(`Loading env file ${pathFile}`);

  const envFile = fs.readFileSync(pathFile);
  const envFileLines = envFile.toString().split("\n");
  const envFileLinesFiltered = envFileLines.filter((line: string) => {
    const trimmedLine = line.trim();

    return trimmedLine.length > 0 && !trimmedLine.startsWith("#");
  } );
  const envVars = envFileLinesFiltered.reduce((acc: {[key: string]: string}, line: string) => {
    const [key, ...valueSplited] = line.split("=");
    const value = valueSplited.join("=");

    acc[key] = value;

    return acc;
  }, {
  } );

  process.env = {
    ...process.env,
    ...envVars,
  };
}