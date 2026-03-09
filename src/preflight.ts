import { execFileSync } from "node:child_process";
import { green, red } from "./colors.js";

export function preflight(): void {
  let ok = true;

  try {
    const v = execFileSync("claude", ["--version"], {
      encoding: "utf-8",
    }).trim();
    console.log(green(`  ✓ Claude CLI: ${v}`));
  } catch {
    console.error(red("  ✗ Claude CLI not found"));
    ok = false;
  }

  try {
    const v = execFileSync("gemini", ["--version"], {
      encoding: "utf-8",
    }).trim();
    console.log(green(`  ✓ Gemini CLI: ${v}`));
  } catch {
    console.error(red("  ✗ Gemini CLI not found"));
    ok = false;
  }

  if (!ok) {
    process.exit(1);
  }
}
