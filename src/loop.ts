import { runClaude } from "./claude-runner.js";
import { runGemini } from "./gemini-runner.js";
import { bold, blue, green, yellow, dim, cyan } from "./colors.js";

export interface LoopOptions {
  task: string;
  maxIterations: number;
  cwd?: string;
  verbose?: boolean;
}

function separator(label: string, color: (s: string) => string): void {
  console.log(color(`\n${"─".repeat(60)}`));
  console.log(color(`  ${label}`));
  console.log(color(`${"─".repeat(60)}\n`));
}

function elapsed(startMs: number): string {
  const sec = ((Date.now() - startMs) / 1000).toFixed(1);
  return dim(`(${sec}s)`);
}

export async function runLoop(options: LoopOptions): Promise<void> {
  const { task, maxIterations, cwd, verbose } = options;

  let claudeOutput = "";
  let geminiFeedback = "";

  for (let i = 1; i <= maxIterations; i++) {
    console.log(bold(blue(`\n══════════ Iteration ${i} / ${maxIterations} ══════════\n`)));

    // --- Claude execution ---
    let claudePrompt: string;
    if (i === 1) {
      claudePrompt = task;
    } else {
      claudePrompt = [
        "请根据以下审查意见修改你之前的工作。",
        "",
        "## 原始任务",
        task,
        "",
        "## 你之前的输出",
        claudeOutput,
        "",
        "## 审查意见",
        geminiFeedback,
        "",
        "请根据审查意见进行修改，输出完整的修改后结果。",
      ].join("\n");
    }

    separator("▶ Claude 执行中...", green);
    const claudeStart = Date.now();
    claudeOutput = await runClaude(claudePrompt, { cwd, verbose });
    console.log(green(`✓ Claude 完成 ${elapsed(claudeStart)}`));

    if (!verbose) {
      separator("Claude 输出", cyan);
      console.log(claudeOutput);
    }

    // --- Gemini review ---
    const geminiPrompt = [
      "你是一个代码审查专家。请审查以下任务的完成情况。",
      "",
      "## 原始任务",
      task,
      "",
      "## Claude 的执行结果",
      claudeOutput,
      "",
      "请给出:",
      "1. 评分 (1-10，10 为完美)",
      "2. 存在的问题",
      "3. 具体的修正建议",
      '4. 如果评分 >= 9，在最后一行输出 "APPROVED"',
    ].join("\n");

    separator("▶ Gemini 审查中...", yellow);
    const geminiStart = Date.now();
    geminiFeedback = await runGemini(geminiPrompt, { cwd, verbose });
    console.log(yellow(`✓ Gemini 审查完成 ${elapsed(geminiStart)}`));

    separator("Gemini 审查", yellow);
    console.log(geminiFeedback);

    // --- Check approval ---
    if (geminiFeedback.includes("APPROVED")) {
      console.log(
        green(bold(`\n✓ Gemini 审查通过！在第 ${i} 轮迭代后完成。\n`)),
      );
      break;
    }

    if (i === maxIterations) {
      console.log(yellow(`\n⚠ 已达到最大迭代次数 (${maxIterations})。\n`));
    }
  }

  separator("最终结果", blue);
  console.log(claudeOutput);
  console.log("");
}
