#!/usr/bin/env node

import { Command } from "commander";
import { bold, red } from "./colors.js";
import { preflight } from "./preflight.js";
import { runLoop } from "./loop.js";

const program = new Command();

program
  .name("cgloop")
  .description("Claude-Gemini iterative collaboration CLI tool")
  .argument("<task>", "Task description for Claude to execute")
  .option("-n, --iterations <number>", "Max number of iterations", "3")
  .option("-d, --dir <path>", "Working directory for Claude and Gemini")
  .option("-v, --verbose", "Stream real-time output from CLI tools")
  .action(
    async (
      task: string,
      options: { iterations: string; dir?: string; verbose?: boolean },
    ) => {
      try {
        console.log(bold("\nPreflight check...\n"));
        preflight();

        console.log(bold("\nStarting Claude-Gemini loop\n"));
        console.log(`  Task:       ${task}`);
        console.log(`  Iterations: ${options.iterations}`);
        console.log(`  Directory:  ${options.dir || process.cwd()}`);
        console.log(`  Verbose:    ${options.verbose ? "on" : "off"}`);

        await runLoop({
          task,
          maxIterations: parseInt(options.iterations, 10),
          cwd: options.dir,
          verbose: options.verbose ?? false,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(red(`\nError: ${msg}`));
        process.exit(1);
      }
    },
  );

program.parse();
