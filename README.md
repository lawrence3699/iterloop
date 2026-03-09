# iterloop

**[中文版](./README_CN.md)**

A CLI tool that orchestrates **Claude CLI**, **Gemini CLI**, and **Codex CLI** into an iterative collaboration loop. Pick any engine as the executor, pick another as the reviewer — they iterate until the output meets quality standards.

No API keys needed. Works entirely through command-line versions of each tool.

## How It Works

```
User provides a task
        |
        v
[Preflight] Verify selected CLIs are available
        |
        v
+--- Iteration Loop (configurable rounds) ---+
|                                             |
|  1. Send task to Executor engine            |
|     (round 1: original task                 |
|      round 2+: task + reviewer feedback)    |
|              |                              |
|              v                              |
|  2. Executor returns result                 |
|              |                              |
|              v                              |
|  3. Send result to Reviewer engine          |
|              |                              |
|              v                              |
|  4. Reviewer returns review                 |
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
- At least two of the following CLIs installed and authenticated:
  - [Claude CLI](https://docs.anthropic.com/en/docs/claude-code) (Anthropic)
  - [Gemini CLI](https://github.com/google-gemini/gemini-cli) (Google)
  - [Codex CLI](https://github.com/openai/codex) (OpenAI)

## Installation

```bash
git clone https://github.com/lawrence3699/iterloop.git
cd iterloop
npm install
```

### Run directly (development)

```bash
npx tsx src/index.ts           # interactive mode
npx tsx src/index.ts "task"    # command-line mode
```

### Build & install globally

```bash
npm run build
npm link

# Now use from anywhere:
iterloop          # interactive mode
iterloop "task"   # command-line mode
cgloop "task"     # short alias also works
```

## Usage

### Interactive Mode

Run without arguments to get a guided setup experience:

```bash
iterloop
```

The interactive UI will walk you through:
1. Select executor engine (Claude / Gemini / Codex)
2. Select reviewer engine
3. Enter your task
4. Configure iterations, directory, and verbose mode
5. Review configuration and launch

### Command-Line Mode

Pass a task directly for scriptable usage:

```bash
# Default: Claude executes, Gemini reviews
iterloop "Write a quicksort implementation in Python"

# Choose engines
iterloop -e codex -r claude "Build a REST API with Express"
iterloop -e gemini -r codex "Fix the authentication bug"

# Full options
iterloop -e codex -r gemini -n 5 -d ./my-project -v "Add unit tests"
```

### Options

| Option | Description | Default |
|---|---|---|
| `-e, --executor <engine>` | Executor engine: `claude` \| `gemini` \| `codex` | `claude` |
| `-r, --reviewer <engine>` | Reviewer engine: `claude` \| `gemini` \| `codex` | `gemini` |
| `-n, --iterations <number>` | Max number of iteration rounds | `3` |
| `-d, --dir <path>` | Working directory | Current directory |
| `-v, --verbose` | Stream real-time output as CLIs execute | Off |
| `-h, --help` | Show help | |

## Project Structure

```
iterloop/
├── src/
│   ├── index.ts            # Entry point: mode detection + CLI parsing
│   ├── interactive.ts      # Interactive guided mode (@clack/prompts)
│   ├── banner.ts           # ASCII art banner with gradient rendering
│   ├── engine.ts           # Engine abstraction: Claude / Gemini / Codex
│   ├── preflight.ts        # Verify selected engine availability
│   ├── loop.ts             # Core iteration loop (engine-agnostic)
│   └── colors.ts           # Terminal colors, brand colors, ANSI stripping
├── package.json
├── tsconfig.json
└── plan.md
```

## Engine Details

| Engine | CLI Command | Non-interactive Mode |
|--------|------------|---------------------|
| Claude | `claude` | `claude -p <prompt>` |
| Gemini | `gemini` | `gemini -p <prompt>` |
| Codex | `codex` | `codex exec <prompt> --full-auto` |

## Timeout

Each CLI invocation has a maximum timeout of **1 hour** (3600s). As long as the subprocess is running, iterloop will wait.

## License

MIT
