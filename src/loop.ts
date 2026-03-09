import { type Engine } from "./engine.js";
import { bold, dim, green, yellow, brandColor } from "./colors.js";
import { runConversation } from "./conversation.js";

export interface LoopOptions {
  task: string;
  maxIterations: number;
  executor: Engine;
  reviewer: Engine;
  cwd?: string;
  verbose?: boolean;
}

function elapsed(startMs: number): string {
  const sec = ((Date.now() - startMs) / 1000).toFixed(1);
  return dim(`(${sec}s)`);
}

function reviewerHeader(engine: Engine): string {
  const color = brandColor(engine.name);
  return color(`  ┌─ ■ ${engine.label} (reviewer) ${"─".repeat(Math.max(0, 44 - engine.label.length))}┐`);
}

function reviewerFooter(engine: Engine, timeStr: string): string {
  const color = brandColor(engine.name);
  return color(`  └${"─".repeat(42)} ✓ done ${timeStr} ─┘`);
}

export async function runLoop(options: LoopOptions): Promise<void> {
  const { task, maxIterations, executor, reviewer, cwd, verbose } = options;

  const revColor = brandColor(reviewer.name);

  let executorOutput = "";
  let reviewerFeedback = "";

  for (let i = 1; i <= maxIterations; i++) {
    console.log(bold(`\n  ${"═".repeat(12)} Iteration ${i} / ${maxIterations} ${"═".repeat(12)}\n`));

    // ── Multi-turn conversation with executor ───
    let initialPrompt: string;
    if (i === 1) {
      initialPrompt = task;
    } else {
      initialPrompt = [
        `Please revise your previous work based on the following review feedback.`,
        "",
        "## Original Task",
        task,
        "",
        "## Your Previous Output",
        executorOutput,
        "",
        `## Review Feedback from ${reviewer.label}`,
        reviewerFeedback,
        "",
        "Please make corrections based on the feedback and output the complete revised result.",
      ].join("\n");
    }

    const conversation = await runConversation(executor, initialPrompt, { cwd, verbose });
    executorOutput = conversation.finalOutput;

    // ── Reviewer ────────────────────────────────
    const reviewPrompt = [
      "You are a code review expert. Please review the following task completion.",
      "",
      "## Original Task",
      task,
      "",
      `## ${executor.label}'s Execution Result`,
      executorOutput,
      "",
      "Please provide:",
      "1. Score (1-10, 10 being perfect)",
      "2. Issues found",
      "3. Specific correction suggestions",
      '4. If score >= 9, output "APPROVED" on the last line',
    ].join("\n");

    console.log("");
    console.log(reviewerHeader(reviewer));
    console.log(revColor("  │"));

    const revStart = Date.now();
    reviewerFeedback = await reviewer.run(reviewPrompt, { cwd, verbose });
    console.log(revColor("  │"));

    for (const line of reviewerFeedback.split("\n")) {
      console.log(revColor("  │") + `  ${line}`);
    }
    console.log(revColor("  │"));
    console.log(reviewerFooter(reviewer, elapsed(revStart)));

    // ── Check approval ──────────────────────────
    if (reviewerFeedback.includes("APPROVED")) {
      console.log(green(bold(`\n  ✓ ${reviewer.label} approved! Completed after iteration ${i}.\n`)));
      break;
    }

    if (i === maxIterations) {
      console.log(yellow(`\n  ⚠ Reached max iterations (${maxIterations}).\n`));
    } else {
      console.log(dim(`\n  → Not approved, proceeding to iteration ${i + 1}...\n`));
    }
  }

  console.log(bold(`\n  ${"═".repeat(12)} Final Result ${"═".repeat(12)}\n`));
  console.log(executorOutput);
  console.log("");
}
