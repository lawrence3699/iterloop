# iterloop v0.15 — Multi-Engine + Interactive Mode

## Overview

在 v0.1 基础上引入 **Codex CLI** 作为第三个引擎，用户可以从 Claude / Gemini / Codex 中任选一个作为**执行者**，再任选一个作为**审查者**。

新增**交互引导模式**：无参数运行 `iterloop` 时进入交互式引导界面，逐步选择配置；同时保留命令行参数模式以便脚本化使用。

## Global Command: `iterloop`

全局安装后，在终端任意位置输入 `iterloop` 即可启动（类似 `claude` 或 `gemini` 的使用方式）：

```bash
# 全局安装（一次性）
cd iterloop-v0.15
npm install && npm run build && npm link

# 之后在任何目录直接使用
iterloop                              # 交互模式
iterloop "写一个快速排序"              # 命令行模式
iterloop -e codex -r claude "任务"    # 指定引擎
```

### 实现方式

`package.json` 中的 `bin` 字段注册全局命令：

```json
{
  "bin": {
    "iterloop": "dist/index.js"
  }
}
```

`dist/index.js` 顶部包含 shebang `#!/usr/bin/env node`，`npm link` 会在系统 PATH 中创建符号链接，使 `iterloop` 命令全局可用。

同时保留 `cgloop` 作为短别名：

```json
{
  "bin": {
    "iterloop": "dist/index.js",
    "cgloop": "dist/index.js"
  }
}
```

## Two Modes of Operation

### Mode 1: Interactive (无参数启动)

```bash
iterloop
```

进入交互引导界面：

```
  ╔══════════════════════════════════════════════════════════════╗
  ║                                                              ║
  ║   ██╗████████╗███████╗██████╗ ██╗      ██████╗  ██████╗ ██████╗  ║
  ║   ██║╚══██╔══╝██╔════╝██╔══██╗██║     ██╔═══██╗██╔═══██╗██╔══██╗ ║
  ║   ██║   ██║   █████╗  ██████╔╝██║     ██║   ██║██║   ██║██████╔╝ ║
  ║   ██║   ██║   ██╔══╝  ██╔══██╗██║     ██║   ██║██║   ██║██╔═══╝  ║
  ║   ██║   ██║   ███████╗██║  ██║███████╗╚██████╔╝╚██████╔╝██║      ║
  ║   ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝╚═╝      ║
  ║                                                              ║
  ║   AI-powered iterative collaboration                v0.15    ║
  ║                                                              ║
  ╠══════════════════════════════════════════════════════════════╣
  ║                                                              ║
  ║   Engines:   ● Claude (v2.1.71)                              ║
  ║              ● Gemini (v0.32.1)                              ║
  ║              ● Codex  (v0.111.0)                             ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝

  ◇  Working directory
  │  . (current)
  │  (路径无效时提示重新输入，不退出程序)
  │
  ◆  Select executor
  │
  │  ● Claude    ─── Anthropic Claude Code CLI
  │  ○ Gemini    ─── Google Gemini CLI
  │  ○ Codex     ─── OpenAI Codex CLI
  │
  ◆  Select reviewer
  │
  │  ○ Claude    ─── Anthropic Claude Code CLI
  │  ● Gemini    ─── Google Gemini CLI
  │  ○ Codex     ─── OpenAI Codex CLI
  │
  ◇  Enter your task
  │  Write a quicksort implementation in Python
  │
  ◇  Max iterations
  │  3
  │
  ◆  Stream verbose output?
  │  No / Yes
  │
  ╔════════════════════ Configuration ═════════════════════╗
  ║                                                        ║
  ║   Executor:    ● Claude  (v2.1.71)                     ║
  ║   Reviewer:    ● Gemini  (v0.32.1)                     ║
  ║                                                        ║
  ║   Task:        Write a quicksort implementation ...    ║
  ║   Iterations:  3                                       ║
  ║   Directory:   /Users/you/project                      ║
  ║   Verbose:     off                                     ║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
  │
  ◆  Launch?
  │  ● Yes, start
  │  ○ No, cancel
  │
  └  Launching iterloop...
```

交互界面设计要点：
- 启动时显示大号 block-letter 渐变 ASCII art banner（7 行高），视觉冲击力强
- Banner 下方实时显示引擎检测结果（带品牌色 ● 圆点 + 版本号），让用户立刻看到哪些引擎可用
- 整体用双线框 ╔═╗ 包裹 banner 和配置摘要，区别于 @clack 的单线流程线，层次分明
- Banner 和摘要框自适应终端宽度（窄终端回退为紧凑版）
- 引擎不可用时 ● 变为灰色 ○ 并标注 (not found)，在选择引擎步骤中自动禁用

### Mode 2: Command-line (带参数启动)

```bash
iterloop "写一个快速排序"
iterloop -e codex -r claude -n 5 -d ./my-project -v "添加单元测试"
```

### Mode Detection Logic

```
if (task argument provided)  → command-line mode
else                         → interactive mode
```

## Interactive UI Design

### Banner

大号 block-letter ASCII art（7 行高），使用 `gradient-string` 渲染三色渐变。
用双线框 `╔═╗` 包裹，下方紧跟引擎检测状态。根据终端宽度自适应。

```
宽终端 (>= 70 cols):
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   ██╗████████╗███████╗██████╗ ██╗      ...            ║
  ║   ...  (7-line block letters, gradient rendered)       ║
  ║                                                       ║
  ║   AI-powered iterative collaboration         v0.15    ║
  ║                                                       ║
  ╠═══════════════════════════════════════════════════════╣
  ║   Engines:  ● Claude (v2.1.71)                        ║
  ║             ● Gemini (v0.32.1)                        ║
  ║             ● Codex  (v0.111.0)                       ║
  ╚═══════════════════════════════════════════════════════╝

窄终端 (< 70 cols):
  ╔═══════════════════════════════╗
  ║  ◈ iterloop          v0.15   ║
  ║  AI-powered iteration        ║
  ╠═══════════════════════════════╣
  ║  ● Claude  ● Gemini  ● Codex║
  ╚═══════════════════════════════╝
```

渐变色方案：从橙色 (#F07623, Claude) → 蓝色 (#4285F4, Gemini) → 绿色 (#10A37F, Codex)
体现三个引擎的协作融合。

Banner 框内功能：
- 渐变色大字 logo，视觉冲击力强
- tagline + 版本号
- 实时检测已安装引擎，带品牌色圆点 + 版本号
- 引擎不可用时显示灰色 ○ + `(not found)`
- 双线框与后续 @clack 单线流程线形成层次对比

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
| Welcome | 自定义渲染 | 双线框包裹渐变大字 banner + 引擎检测状态面板 |
| Intro | `intro()` | 过渡到 @clack 流程线 |
| Directory | `text()` | 默认值 `.`，validate 检查路径是否存在，不存在则提示重新输入（不退出） |
| Executor | `select()` | 三选一，品牌色 ● + 引擎描述，不可用引擎自动标记禁用 |
| Reviewer | `select()` | 三选一，同上 |
| Task | `text()` | 必填，placeholder 提示用例 |
| Iterations | `text()` | 默认值 3，validate 数字 |
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

#### 1. `banner.ts` — Large Gradient Banner with Engine Status

渲染完整的欢迎界面，包含：
- 双线框 `╔═╗` 包裹
- 7 行高大号 block-letter ASCII art，`gradient-string` 三色渐变渲染
- tagline + 版本号
- 引擎检测面板：逐个尝试获取版本，品牌色 ● 表示可用，灰色 ○ 表示不可用
- 自适应终端宽度，窄终端回退紧凑版

```typescript
import gradient from "gradient-string";
import { execFileSync } from "node:child_process";

const LARGE_LOGO = [
  "██╗████████╗███████╗██████╗ ██╗      ██████╗  ██████╗ ██████╗ ",
  "██║╚══██╔══╝██╔════╝██╔══██╗██║     ██╔═══██╗██╔═══██╗██╔══██╗",
  "██║   ██║   █████╗  ██████╔╝██║     ██║   ██║██║   ██║██████╔╝",
  "██║   ██║   ██╔══╝  ██╔══██╗██║     ██║   ██║██║   ██║██╔═══╝ ",
  "██║   ██║   ███████╗██║  ██║███████╗╚██████╔╝╚██████╔╝██║     ",
  "╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝╚═╝     ",
];

const iterGradient = gradient(["#F07623", "#4285F4", "#10A37F"]);

// 检测引擎可用性，返回 { name, version | null }
function detectEngines(): { name: string; label: string; version: string | null }[] { ... }

export function renderBanner(): string {
  const cols = process.stdout.columns || 80;
  const engines = detectEngines();

  if (cols >= 70) {
    // 大号 banner + 引擎面板，双线框包裹
  } else {
    // 紧凑版
  }
}
```

Banner 在 `interactive.ts` 中调用，早于 @clack 流程线，形成两层视觉结构：
1. **双线框 banner** — 品牌展示 + 系统状态
2. **@clack 单线流程** — 用户配置步骤

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

  // Working directory 放在最前面，validate 检查路径存在性
  // 路径无效时返回错误提示，@clack/prompts 会自动要求用户重新输入，不会退出程序
  const dir = await p.text({
    message: "Working directory",
    defaultValue: ".",
    validate(value) {
      const resolved = resolve(value);
      if (!existsSync(resolved)) return `Directory not found: ${resolved}`;
    },
  });

  const executor = await p.select({
    message: "Select executor",
    options: [
      { value: "claude", label: "Claude", hint: "Anthropic Claude Code CLI" },
      { value: "gemini", label: "Gemini", hint: "Google Gemini CLI" },
      { value: "codex",  label: "Codex",  hint: "OpenAI Codex CLI" },
    ],
  });

  // ... reviewer, task, iterations, verbose ...

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
iterloop [task]                         # task 可选，无则进入交互模式
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
