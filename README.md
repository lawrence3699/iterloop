# iterloop

**[中文版](./README_CN.md)**

A CLI tool that orchestrates **Claude CLI** and **Gemini CLI** into an iterative collaboration loop. Claude executes tasks, Gemini reviews the results and provides feedback, and Claude revises — repeating until the output meets quality standards or the iteration limit is reached.

No API keys needed. It works entirely through the command-line versions of both tools.

## How It Works

```
User provides a task
        |
        v
[Preflight] Verify claude & gemini CLIs are available
        |
        v
+--- Iteration Loop (configurable rounds) ---+
|                                             |
|  1. Send task to Claude CLI                 |
|     (round 1: original task                 |
|      round 2+: task + Gemini's feedback)    |
|              |                              |
|              v                              |
|  2. Claude returns execution result         |
|              |                              |
|              v                              |
|  3. Send result to Gemini CLI for review    |
|              |                              |
|              v                              |
|  4. Gemini returns review                   |
|     - Score >= 9: APPROVED, loop ends early |
|     - Otherwise: next iteration             |
|                                             |
+---------------------------------------------+
        |
        v
   Final output
```

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Claude CLI](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated
- [Gemini CLI](https://github.com/anthropics/gemini-cli) installed and authenticated

Verify both are working:

```bash
claude --version
gemini --version
```

## Installation

```bash
git clone https://github.com/lawrence3699/iterloop.git
cd iterloop
npm install
```

### Run directly (development)

```bash
npx tsx src/index.ts "your task here"
```

### Build & install globally

```bash
npm run build
npm link
cgloop "your task here"
```

## Usage

```bash
# Basic usage (default: 3 iterations)
cgloop "Write a quicksort implementation in Python"

# Set max iterations
cgloop -n 5 "Build a REST API with Express"

# Specify working directory (Claude & Gemini operate in this directory)
cgloop -d ./my-project "Fix the authentication bug"

# Stream real-time output from both CLIs
cgloop -v "Refactor the database module"

# Combine options
cgloop -n 4 -d ./my-app -v "Add unit tests for the user service"
```

### Options

| Option | Description | Default |
|---|---|---|
| `-n, --iterations <number>` | Max number of iteration rounds | `3` |
| `-d, --dir <path>` | Working directory for Claude and Gemini | Current directory |
| `-v, --verbose` | Stream real-time output as CLIs execute | Off |
| `-h, --help` | Show help | |

## Project Structure

```
iterloop/
├── src/
│   ├── index.ts            # CLI entry point & argument parsing
│   ├── preflight.ts        # Verify claude/gemini CLI availability
│   ├── claude-runner.ts    # Spawn claude CLI subprocess
│   ├── gemini-runner.ts    # Spawn gemini CLI subprocess
│   ├── loop.ts             # Core iteration loop logic
│   └── colors.ts           # Terminal colors & ANSI stripping
├── package.json
├── tsconfig.json
└── plan.md                 # Original design document
```

## How the Review Works

Each iteration, Gemini receives a structured review prompt containing the original task and Claude's output. Gemini responds with:

1. **Score** (1-10) — overall quality rating
2. **Issues** — problems found in the output
3. **Suggestions** — specific corrections to make
4. **Verdict** — if score >= 9, Gemini outputs `APPROVED` and the loop terminates early

If not approved, the feedback is bundled with the original task and sent back to Claude for revision in the next iteration.

## Timeout

Each CLI invocation has a maximum timeout of **1 hour** (3600s). As long as the subprocess is still running, iterloop will wait. This accommodates complex tasks where the AI needs extended thinking time.

## License

MIT
