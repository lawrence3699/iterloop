import { spawn } from "node:child_process";
import { stripAnsi } from "./colors.js";

const MAX_TIMEOUT = 3_600_000; // 1 hour

export interface RunOptions {
  cwd?: string;
  verbose?: boolean;
}

export function runClaude(prompt: string, opts: RunOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("claude", ["-p", prompt], {
      cwd: opts.cwd || process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, FORCE_COLOR: "0" },
    });

    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      proc.kill("SIGTERM");
      reject(new Error("Claude CLI timed out (1 hour limit)"));
    }, MAX_TIMEOUT);

    proc.stdout.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stdout += text;
      if (opts.verbose) {
        process.stdout.write(text);
      }
    });

    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`Claude exited with code ${code}\n${stderr}`));
      } else {
        resolve(stripAnsi(stdout).trim());
      }
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}
