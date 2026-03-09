# iterloop v0.15 — Multi-Engine + Interactive Mode

## Overview

在 v0.1 基础上引入 **Codex CLI** 作为第三个引擎，用户可以从 Claude / Gemini / Codex 中任选一个作为**执行者**，再任选一个作为**审查者**。

新增**交互引导模式**：无参数运行 `cgloop` 时进入交互式引导界面，逐步选择配置；同时保留命令行参数模式以便脚本化使用。

## Two Modes of Operation

### Mode 1: Interactive (无参数启动)

```bash
cgloop
```

进入交互引导界面：

```
  ┌───────────────────────────────────────────────┐
  │                                               │
  │   ╦╔╦╗╔═╗╦═╗╦  ╔═╗╔═╗╔═╗                    │
  │   ║ ║ ║╣ ╠╦╝║  ║ ║║ ║╠═╝                     │
  │   ╩ ╩ ╚═╝╩╚═╩═╝╚═╝╚═╝╩    v0.15             │
  │                                               │
  │   AI-powered iterative collaboration          │
  │   Claude · Gemini · Codex                     │
  │                                               │
  └───────────────────────────────────────────────┘

  ◆  Select executor
  │  ● Claude    — Anthropic Claude Code CLI
  │  ○ Gemini    — Google Gemini CLI
  │  ○ Codex     — OpenAI Codex CLI
  │
  ◆  Select reviewer
  │  ○ Claude
  │  ● Gemini
  │  ○ Codex
  │
  ◇  Enter your task
  │  Write a quicksort implementation in Python
  │
  ◇  Max iterations
  │  3
  │
  ◇  Working directory
  │  . (current)
  │
  ◆  Stream verbose output?
  │  No / Yes
  │
  ├──────────────────────────────────────────┤
  │                                          │
  │  Executor:    ■ Claude  (v2.1.71)        │
  │  Reviewer:    ■ Gemini  (v0.32.1)        │
  │  Task:        Write a quicksort ...      │
  │  Iterations:  3                          │
  │  Directory:   /Users/you/project         │
  │  Verbose:     off                        │
  │                                          │
  ├──────────────────────────────────────────┤
  │
  ◆  Launch?
  │  Yes, start / No, cancel
  │
  └  Starting iterloop...
```

### Mode 2: Command-line (带参数启动)

```bash
cgloop "写一个快速排序"
cgloop -e codex -r claude -n 5 -d ./my-project -v "添加单元测试"
```

### Mode Detection Logic

```
if (task argument provided)  → command-line mode
else                         → interactive mode
```

## Interactive UI Design

### Banner

紧凑型 ASCII art（3-5 行），使用 `gradient-string` 渲染渐变色效果。
根据终端宽度自适应：宽终端显示完整 banner，窄终端显示简化版。

```
宽终端 (>= 60 cols):
  ╦╔╦╗╔═╗╦═╗╦  ╔═╗╔═╗╔═╗
  ║ ║ ║╣ ╠╦╝║  ║ ║║ ║╠═╝
  ╩ ╩ ╚═╝╩╚═╩═╝╚═╝╚═╝╩    v0.15

窄终端 (< 60 cols):
  ◈ iterloop v0.15
```

渐变色方案：从橙色 (#F07623, Claude) → 蓝色 (#4285F4, Gemini) → 绿色 (#10A37F, Codex)
体现三个引擎的协作融合。

### Color System

| Element | Color | Purpose |
|---------|-------|---------|
| Banner gradient | Orange → Blue → Green | 三引擎品牌色融合 |
| Claude sections | Orange (#F07623) | Claude 品牌色 |
| Gemini sections | Blue (#4285F4) | Gemini 品牌色 |
| Codex sections | Green (#10A37F) | Codex 品牌色 |
| iterloop chrome | Cyan | 工具自身标识 |
| Success / APPROVED | Green | 通过 |
| Warning / max iterations | Yellow | 警告 |
| Error | Red | 错误 |
| Metadata / elapsed time | Dim gray | 辅助信息 |

### Interactive Components (via @clack/prompts)

| Step | Component | Detail |
|------|-----------|--------|
| Welcome | `intro()` | 渐变 banner + 版本号 + tagline |
| Executor | `select()` | 三选一，每项带引擎描述和品牌色圆点 |
| Reviewer | `select()` | 三选一，同上 |
| Task | `text()` | 必填，placeholder 提示用例 |
| Iterations | `text()` | 默认值 3，validate 数字 |
| Directory | `text()` | 默认值 `.`，validate 路径存在 |
| Verbose | `confirm()` | 默认 No |
| Summary | `note()` | 用品牌色展示配置摘要 |
| Confirm | `confirm()` | "Launch?" |
| Start | `outro()` | 过渡到执行 |

### Loop Execution Display

迭代执行阶段使用品牌色区分不同引擎的输出区块：

```
  ══════════ Iteration 1 / 3 ══════════

  ┌─ ■ Claude 执行中... ──────────────────────┐
  │                                            │
  │  (Claude's output here)                    │
  │                                            │
  └──────────────────────── ✓ done (12.3s) ────┘

  ┌─ ■ Gemini 审查中... ──────────────────────┐
  │                                            │
  │  Score: 7/10                               │
  │  Issues: ...                               │
  │  Suggestions: ...                          │
  │                                            │
  └──────────────────────── ✓ done (8.1s) ─────┘

  → Gemini 未通过，进入下一轮...
```

引擎名称前的 `■` 色块使用对应品牌色渲染。

## Changes from v0.1

### New
- 新增 Codex CLI (`codex exec "prompt"`) 作为第三个引擎
- 新增 `--executor` / `-e` 参数：选择执行者 (claude | gemini | codex)
- 新增 `--reviewer` / `-r` 参数：选择审查者 (claude | gemini | codex)
- 新增交互引导模式（无参数启动）
- 预检模块只检查被选中的两个引擎
- 统一的引擎抽象层
- 新增依赖：`@clack/prompts`、`gradient-string`

### Changed
- 默认执行者: claude，默认审查者: gemini（兼容 v0.1）
- `package.json` 版本号升为 `0.15.0`

### Removed
- `claude-runner.ts` 和 `gemini-runner.ts` 合并为统一的 `engine.ts`

## Architecture

### Engine Abstraction

```typescript
type EngineName = "claude" | "gemini" | "codex";

interface Engine {
  name: EngineName;
  label: string;        // "Claude" / "Gemini" / "Codex"
  color: string;        // brand hex color
  checkVersion(): string;
  run(prompt: string, opts: RunOptions): Promise<string>;
}

function createEngine(name: EngineName): Engine;
```

各引擎 CLI 调用方式：

| Engine | Non-interactive Command | Working Dir | Version Check |
|--------|------------------------|-------------|---------------|
| Claude | `claude -p <prompt>` | inherits cwd | `claude --version` |
| Gemini | `gemini -p <prompt>` | inherits cwd | `gemini --version` |
| Codex  | `codex exec <prompt>` | `-C <dir>` | `codex --version` |

### Project Structure

```
iterloop-v0.15/
├── plan.md
├── package.json
├── tsconfig.json
├── .gitignore
├── src/
│   ├── index.ts          # Entry point: mode detection + CLI parsing
│   ├── interactive.ts    # Interactive guided mode (@clack/prompts)
│   ├── banner.ts         # ASCII art banner + gradient rendering
│   ├── engine.ts         # Engine abstraction: claude/gemini/codex
│   ├── preflight.ts      # Check selected engines availability
│   ├── loop.ts           # Iteration loop (engine-agnostic)
│   └── colors.ts         # Terminal colors, brand colors, ANSI stripping
```

### Key Implementation Details

#### 1. `banner.ts` — Responsive Gradient Banner

```typescript
import gradient from "gradient-string";

const FULL_BANNER = `
╦╔╦╗╔═╗╦═╗╦  ╔═╗╔═╗╔═╗
║ ║ ║╣ ╠╦╝║  ║ ║║ ║╠═╝
╩ ╩ ╚═╝╩╚═╩═╝╚═╝╚═╝╩  `;

const COMPACT_BANNER = "◈ iterloop";

// 三色渐变: Claude orange → Gemini blue → Codex green
const iterGradient = gradient(["#F07623", "#4285F4", "#10A37F"]);

export function renderBanner(): string {
  const cols = process.stdout.columns || 80;
  const art = cols >= 60 ? FULL_BANNER : COMPACT_BANNER;
  return iterGradient(art) + `  v0.15`;
}
```

#### 2. `engine.ts` — Unified Engine

三个引擎实现，每个引擎带品牌标识：

**Claude:**
- color: `#F07623` (orange)
- Version: `claude --version`
- Run: `spawn("claude", ["-p", prompt], { cwd })`

**Gemini:**
- color: `#4285F4` (blue)
- Version: `gemini --version`
- Run: `spawn("gemini", ["-p", prompt], { cwd })`

**Codex:**
- color: `#10A37F` (green)
- Version: `codex --version`
- Run: `spawn("codex", ["exec", prompt, "-C", cwd, "--full-auto"], { cwd })`
- 添加 `--skip-git-repo-check` 以兼容非 git 目录

#### 3. `interactive.ts` — Guided Mode

```typescript
import * as p from "@clack/prompts";
import { renderBanner } from "./banner.js";

export async function interactive(): Promise<LoopConfig | null> {
  console.log(renderBanner());
  p.intro("AI-powered iterative collaboration");

  const executor = await p.select({
    message: "Select executor",
    options: [
      { value: "claude", label: "Claude", hint: "Anthropic Claude Code CLI" },
      { value: "gemini", label: "Gemini", hint: "Google Gemini CLI" },
      { value: "codex",  label: "Codex",  hint: "OpenAI Codex CLI" },
    ],
  });

  // ... reviewer, task, iterations, dir, verbose ...

  // Summary note with brand colors
  p.note(summary, "Configuration");

  const confirmed = await p.confirm({ message: "Launch?" });
  if (!confirmed || p.isCancel(confirmed)) {
    p.cancel("Cancelled.");
    return null;
  }

  p.outro("Starting iterloop...");
  return config;
}
```

#### 4. `preflight.ts` — Smart Check

只检查用户选择的引擎，并在交互模式下使用 `@clack/prompts` 的 `spinner()` 显示检查进度。

#### 5. `loop.ts` — Engine-Agnostic Loop

与 v0.1 逻辑相同，但增强视觉效果：
- 每个引擎的输出用对应品牌色的边框包裹
- 引擎名称前加品牌色 `■` 色块
- 耗时显示用 dim gray
- APPROVED 用绿色高亮
- Prompt 模板中引擎名称动态替换

#### 6. `index.ts` — Entry Point

```typescript
const task = program.args[0];

if (task) {
  // Command-line mode: 解析参数，直接执行
} else {
  // Interactive mode: 启动引导界面
  const config = await interactive();
  if (config) {
    // 执行 loop
  }
}
```

CLI 参数（命令行模式）：
```
cgloop [task]                         # task 可选，无则进入交互模式
  -e, --executor <engine>             # claude | gemini | codex  (default: claude)
  -r, --reviewer <engine>             # claude | gemini | codex  (default: gemini)
  -n, --iterations <number>           # 最大迭代轮数 (default: 3)
  -d, --dir <path>                    # 工作目录
  -v, --verbose                       # 实时流式输出
  -h, --help                          # 帮助
```

### Dependencies

| Package | Purpose |
|---------|---------|
| `commander` | CLI 参数解析 |
| `@clack/prompts` | 交互式引导界面 |
| `gradient-string` | Banner 渐变色渲染 |
| `tsx` (dev) | 直接运行 TypeScript |
| `typescript` (dev) | 编译 |
| `@types/node` (dev) | Node.js 类型 |

## Notes

- 不调用任何 API，完全通过 CLI 子进程通信
- 超时策略不变：最大等待 1 小时 (3600 秒)
- ANSI 转义符在传递给下一个引擎前会被清除
- Codex exec 需要在 git 仓库中运行，添加 `--skip-git-repo-check` 兼容非 git 目录
- 审查 / 修正 prompt 模板动态使用引擎名称
- 交互模式下 Ctrl+C 随时取消，程序优雅退出
- Banner 渐变自适应终端宽度
