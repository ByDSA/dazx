import { question } from "../../goods.js";

export async function questionYNAsync(questionStr: string) {
  const answer = await question(questionStr + " (y/n): ", { choices: ['y', 'n'] });

  return answer.toLowerCase() === 'y';
}