import * as readline from "node:readline";
import { dim, cyan } from "./colors.js";

export async function promptUser(hint?: string): Promise<string> {
  const cols = process.stdout.columns || 80;
  const tag = hint ? ` ${hint} ` : " ▪▪▪ ";
  const barLen = Math.max(0, cols - tag.length - 4);
  const leftBar = "─".repeat(Math.floor(barLen * 0.85));
  const rightBar = "─".repeat(barLen - leftBar.length);

  console.log(dim(`  ${leftBar}${tag}${rightBar}`));

  const answer = await new Promise<string>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(cyan("  ❯ "), (ans) => {
      rl.close();
      resolve(ans);
    });
  });

  console.log(dim(`  ${"─".repeat(cols - 4)}`));
  return answer.trim();
}
