import * as p from "@clack/prompts";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { renderBanner } from "./banner.js";
import { type EngineName } from "./engine.js";
import { orange, gBlue, gGreen } from "./colors.js";

export interface LoopConfig {
  executor: EngineName;
  reviewer: EngineName;
  task: string;
  iterations: number;
  dir?: string;
  verbose: boolean;
}

export async function interactive(): Promise<LoopConfig | null> {
  // ── Banner ──────────────────────────────────
  console.log(renderBanner());

  p.intro("Configure your iterloop session");

  // ── Working directory (first) ─────────────────
  const dirChoice = await p.select({
    message: "Working directory",
    options: [
      { value: "cwd" as const, label: `Current directory (${process.cwd()})`, hint: "recommended" },
      { value: "custom" as const, label: "Custom path" },
    ],
  });
  if (p.isCancel(dirChoice)) { p.cancel("Cancelled."); return null; }

  let dir = ".";
  if (dirChoice === "custom") {
    while (true) {
      const dirInput = await p.text({
        message: "Enter path",
        placeholder: "/path/to/your/project",
      });
      if (p.isCancel(dirInput)) { p.cancel("Cancelled."); return null; }
      if (existsSync(resolve(dirInput))) {
        dir = dirInput;
        break;
      }
      p.log.error(`Directory not found: ${resolve(dirInput)}. Please try again.`);
    }
  }

  // ── Executor ────────────────────────────────
  const executor = await p.select({
    message: "Select executor",
    options: [
      { value: "claude" as const, label: orange("●") + " Claude", hint: "Anthropic Claude Code CLI" },
      { value: "gemini" as const, label: gBlue("●") + " Gemini", hint: "Google Gemini CLI" },
      { value: "codex" as const,  label: gGreen("●") + " Codex",  hint: "OpenAI Codex CLI" },
    ],
  });
  if (p.isCancel(executor)) { p.cancel("Cancelled."); return null; }

  // ── Reviewer ────────────────────────────────
  const reviewer = await p.select({
    message: "Select reviewer",
    options: [
      { value: "claude" as const, label: orange("●") + " Claude", hint: "Anthropic Claude Code CLI" },
      { value: "gemini" as const, label: gBlue("●") + " Gemini", hint: "Google Gemini CLI" },
      { value: "codex" as const,  label: gGreen("●") + " Codex",  hint: "OpenAI Codex CLI" },
    ],
    initialValue: (executor === "claude" ? "gemini" : "claude") as EngineName,
  });
  if (p.isCancel(reviewer)) { p.cancel("Cancelled."); return null; }

  // ── Task ────────────────────────────────────
  const task = await p.text({
    message: "Enter your task",
    placeholder: "e.g. Write a quicksort implementation in Python",
    validate(value) {
      if (!value.trim()) return "Task cannot be empty";
    },
  });
  if (p.isCancel(task)) { p.cancel("Cancelled."); return null; }

  // ── Iterations ──────────────────────────────
  const iterations = await p.text({
    message: "Max iterations",
    placeholder: "3",
    defaultValue: "3",
    validate(value) {
      const n = parseInt(value, 10);
      if (isNaN(n) || n < 1 || n > 20) return "Enter a number between 1 and 20";
    },
  });
  if (p.isCancel(iterations)) { p.cancel("Cancelled."); return null; }

  // ── Verbose ─────────────────────────────────
  const verbose = await p.confirm({
    message: "Stream verbose output?",
    initialValue: false,
  });
  if (p.isCancel(verbose)) { p.cancel("Cancelled."); return null; }

  // ── Summary ─────────────────────────────────
  const resolvedDir = resolve(dir || ".");

  const engineLabel = (name: string) => {
    switch (name) {
      case "claude": return orange("●") + " Claude";
      case "gemini": return gBlue("●") + " Gemini";
      case "codex":  return gGreen("●") + " Codex";
      default: return name;
    }
  };

  const summary = [
    `  Executor:    ${engineLabel(executor)}`,
    `  Reviewer:    ${engineLabel(reviewer)}`,
    "",
    `  Task:        ${task.length > 40 ? task.slice(0, 40) + "..." : task}`,
    `  Iterations:  ${iterations}`,
    `  Directory:   ${resolvedDir}`,
    `  Verbose:     ${verbose ? "on" : "off"}`,
  ].join("\n");

  p.note(summary, "Configuration");

  // ── Confirm ─────────────────────────────────
  const confirmed = await p.confirm({
    message: "Launch?",
    initialValue: true,
  });
  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel("Cancelled.");
    return null;
  }

  p.outro("Launching iterloop...");

  return {
    executor,
    reviewer,
    task,
    iterations: parseInt(iterations, 10),
    dir: resolvedDir === resolve(".") ? undefined : resolvedDir,
    verbose,
  };
}
