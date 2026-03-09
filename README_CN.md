# iterloop

**[English](./README.md)**

一个命令行工具，将 **Claude CLI**、**Gemini CLI** 和 **Codex CLI** 编排为迭代协作循环。任选一个引擎作为执行者，任选一个作为审查者——反复迭代直到输出达到质量标准。

无需 API 密钥，完全通过各工具的命令行版本工作。

## 工作流程

```
用户输入任务
     |
     v
[预检] 确认选中的 CLI 可用
     |
     v
+--- 迭代循环 (可配置轮数) ---+
|                              |
|  1. 将任务发送给执行引擎     |
|     (首轮: 原始任务          |
|      后续轮: 任务+审查意见)  |
|            |                 |
|            v                 |
|  2. 执行引擎返回结果         |
|            |                 |
|            v                 |
|  3. 将结果发送给审查引擎     |
|            |                 |
|            v                 |
|  4. 审查引擎返回审查意见     |
|     - 评分 >= 9: 通过,       |
|       提前结束循环           |
|     - 否则进入下一轮迭代     |
|                              |
+------------------------------+
     |
     v
  输出最终结果
```

## 前置要求

- [Node.js](https://nodejs.org/) >= 18
- 至少安装并认证以下 CLI 中的两个：
  - [Claude CLI](https://docs.anthropic.com/en/docs/claude-code) (Anthropic)
  - [Gemini CLI](https://github.com/google-gemini/gemini-cli) (Google)
  - [Codex CLI](https://github.com/openai/codex) (OpenAI)

## 安装

```bash
git clone https://github.com/lawrence3699/iterloop.git
cd iterloop
npm install
```

### 直接运行（开发模式）

```bash
npx tsx src/index.ts           # 交互模式
npx tsx src/index.ts "任务"    # 命令行模式
```

### 编译并全局安装

```bash
npm run build
npm link

# 之后在任何目录直接使用
iterloop          # 交互模式
iterloop "任务"   # 命令行模式
cgloop "任务"     # 短别名同样可用
```

## 使用方法

### 交互模式

无参数运行，进入引导式配置界面：

```bash
iterloop
```

交互界面会引导你：
1. 选择执行引擎（Claude / Gemini / Codex）
2. 选择审查引擎
3. 输入任务描述
4. 配置迭代轮数、工作目录、是否详细输出
5. 确认配置并启动

### 命令行模式

直接传入任务，适合脚本化使用：

```bash
# 默认：Claude 执行，Gemini 审查
iterloop "写一个 Python 快速排序实现"

# 选择引擎
iterloop -e codex -r claude "用 Express 写一个 REST API"
iterloop -e gemini -r codex "修复认证模块的 bug"

# 完整选项
iterloop -e codex -r gemini -n 5 -d ./my-project -v "给用户服务添加单元测试"
```

### 选项说明

| 选项 | 说明 | 默认值 |
|---|---|---|
| `-e, --executor <engine>` | 执行引擎：`claude` \| `gemini` \| `codex` | `claude` |
| `-r, --reviewer <engine>` | 审查引擎：`claude` \| `gemini` \| `codex` | `gemini` |
| `-n, --iterations <number>` | 最大迭代轮数 | `3` |
| `-d, --dir <path>` | 工作目录 | 当前目录 |
| `-v, --verbose` | 实时流式显示 CLI 输出 | 关闭 |
| `-h, --help` | 显示帮助信息 | |

## 项目结构

```
iterloop/
├── src/
│   ├── index.ts            # 入口：模式检测 + CLI 解析
│   ├── interactive.ts      # 交互引导模式 (@clack/prompts)
│   ├── banner.ts           # ASCII art 渐变色 banner
│   ├── engine.ts           # 引擎抽象：Claude / Gemini / Codex
│   ├── preflight.ts        # 预检选中引擎的可用性
│   ├── loop.ts             # 迭代循环核心逻辑（引擎无关）
│   └── colors.ts           # 终端颜色、品牌色、ANSI 清理
├── package.json
├── tsconfig.json
└── plan.md
```

## 引擎详情

| 引擎 | CLI 命令 | 非交互模式 |
|------|---------|-----------|
| Claude | `claude` | `claude -p <prompt>` |
| Gemini | `gemini` | `gemini -p <prompt>` |
| Codex | `codex` | `codex exec <prompt> --full-auto` |

## 超时策略

每次 CLI 调用的最大超时时间为 **1 小时**（3600 秒）。只要子进程还在运行，iterloop 就会持续等待。

## 许可证

MIT
