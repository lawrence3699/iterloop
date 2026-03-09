import { spawn } from "node:child_process";
import { execFileSync } from "node:child_process";
import { stripAnsi } from "./colors.js";

const MAX_TIMEOUT = 3_600_000; // 1 hour

export type EngineName = "claude" | "gemini" | "codex";

export interface RunOptions {
  cwd?: string;
  verbose?: boolean;
}

export interface Engine {
  name: EngineName;
  label: string;
  checkVersion(): string;
  run(prompt: string, opts: RunOptions): Promise<string>;
}

// ── Claude ──────────────────────────────────────────

function createClaude(): Engine {
  return {
    name: "claude",
    label: "Claude",
    checkVersion() {
      return execFileSync("claude", ["--version"], { encoding: "utf-8" }).trim();
    },
    run(prompt, opts) {
      return spawnEngine("claude", ["-p", prompt], opts);
    },
  };
}

// ── Gemini ──────────────────────────────────────────

function createGemini(): Engine {
  return {
    name: "gemini",
    label: "Gemini",
    checkVersion() {
      return execFileSync("gemini", ["--version"], { encoding: "utf-8" }).trim();
    },
    run(prompt, opts) {
      return spawnEngine("gemini", ["-p", prompt], opts);
    },
  };
}

// ── Codex ───────────────────────────────────────────

function createCodex(): Engine {
  return {
    name: "codex",
    label: "Codex",
    checkVersion() {
      return execFileSync("codex", ["--version"], { encoding: "utf-8" }).trim();
    },
    run(prompt, opts) {
      const args = ["exec", "--full-auto", "--skip-git-repo-check"];
      if (opts.cwd) {
        args.push("-C", opts.cwd);
      }
      args.push(prompt);
      return spawnEngine("codex", args, opts);
    },
  };
}

// ── Factory ─────────────────────────────────────────

export function createEngine(name: EngineName): Engine {
  switch (name) {
    case "claude": return createClaude();
    case "gemini": return createGemini();
    case "codex":  return createCodex();
  }
}

export const ENGINE_NAMES: EngineName[] = ["claude", "gemini", "codex"];

// ── Shared spawn helper ─────────────────────────────

function spawnEngine(
  cmd: string,
  args: string[],
  opts: RunOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd: opts.cwd || process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, FORCE_COLOR: "0" },
    });

    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      proc.kill("SIGTERM");
      reject(new Error(`${cmd} timed out (1 hour limit)`));
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
        reject(new Error(`${cmd} exited with code ${code}\n${stderr}`));
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
