#!/usr/bin/env node

import { Command } from "commander";
import { bold, red } from "./colors.js";
import { type EngineName, createEngine, ENGINE_NAMES } from "./engine.js";
import { preflight } from "./preflight.js";
import { runLoop } from "./loop.js";
import { interactive } from "./interactive.js";

const program = new Command();

program
  .name("iterloop")
  .description("AI-powered iterative collaboration CLI — Claude, Gemini, Codex")
  .argument("[task]", "Task description (omit to enter interactive mode)")
  .option("-e, --executor <engine>", "Executor engine: claude | gemini | codex", "claude")
  .option("-r, --reviewer <engine>", "Reviewer engine: claude | gemini | codex", "gemini")
  .option("-n, --iterations <number>", "Max number of iterations", "3")
  .option("-d, --dir <path>", "Working directory")
  .option("-v, --verbose", "Stream real-time output from CLI tools")
  .action(async (task: string | undefined, options: {
    executor: string;
    reviewer: string;
    iterations: string;
    dir?: string;
    verbose?: boolean;
  }) => {
    try {
      if (!task) {
        // ── Interactive mode ──────────────────────
        const config = await interactive();
        if (!config) process.exit(0);

        console.log(bold("\n  Preflight check...\n"));
        preflight(config.executor, config.reviewer);

        await runLoop({
          task: config.task,
          maxIterations: config.iterations,
          executor: createEngine(config.executor),
          reviewer: createEngine(config.reviewer),
          cwd: config.dir,
          verbose: config.verbose,
        });
      } else {
        // ── Command-line mode ─────────────────────
        const executorName = options.executor as EngineName;
        const reviewerName = options.reviewer as EngineName;

        if (!ENGINE_NAMES.includes(executorName)) {
          console.error(red(`Invalid executor: ${options.executor}. Choose: claude | gemini | codex`));
          process.exit(1);
        }
        if (!ENGINE_NAMES.includes(reviewerName)) {
          console.error(red(`Invalid reviewer: ${options.reviewer}. Choose: claude | gemini | codex`));
          process.exit(1);
        }

        console.log(bold("\n  Preflight check...\n"));
        preflight(executorName, reviewerName);

        console.log(bold("\n  Starting iterloop\n"));
        console.log(`  Executor:    ${executorName}`);
        console.log(`  Reviewer:    ${reviewerName}`);
        console.log(`  Task:        ${task}`);
        console.log(`  Iterations:  ${options.iterations}`);
        console.log(`  Directory:   ${options.dir || process.cwd()}`);
        console.log(`  Verbose:     ${options.verbose ? "on" : "off"}`);

        await runLoop({
          task,
          maxIterations: parseInt(options.iterations, 10),
          executor: createEngine(executorName),
          reviewer: createEngine(reviewerName),
          cwd: options.dir,
          verbose: options.verbose ?? false,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(red(`\n  Error: ${msg}`));
      process.exit(1);
    }
  });

program.parse();
