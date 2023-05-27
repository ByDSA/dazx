import { $ } from '../../core.js';

export function checkSudo() {
  const uid = process.env.SUDO_UID;

  return !!uid;
}

export function assertSudo() {
  if (!checkSudo()) {
    console.log("Please run this script with sudo.");
    process.exit(1);
  }
}
export async function forceSudoAsync() {
  if (!checkSudo()) {
    try {
      $.verbose = false
      await $`sudo echo "Sudo OK" > /dev/null 2>&1`
      $.verbose = true
    } catch (error) {
      throw new Error('You need to be sudo to run this script')
    }
  }
}