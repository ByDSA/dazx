import { question } from "../../goods.js";

export async function questionYNAsync(questionStr: string) {
  const answer = await question(questionStr, { choices: ['y', 'n'] });

  return answer.toLowerCase() === 'y';
}