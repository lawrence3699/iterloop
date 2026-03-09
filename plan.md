# Claude-Gemini Loop CLI Tool

## 概述

一个命令行工具，让 Claude CLI 和 Gemini CLI 协作完成任务。Claude 负责执行任务，Gemini 负责审查并给出修正意见，形成迭代循环。

## 工作流程

```
用户输入任务
    │
    ▼
[预检] 确认 claude 和 gemini CLI 可用
    │
    ▼
┌─── 迭代循环 (可配置轮数) ───┐
│                              │
│  1. 将任务发送给 Claude CLI  │
│     (首轮发原始任务,         │
│      后续轮附带 Gemini 的    │
│      修正意见)               │
│         │                    │
│         ▼                    │
│  2. Claude 返回执行结果      │
│         │                    │
│         ▼                    │
│  3. 将 Claude 的结果发送给   │
│     Gemini CLI 进行审查      │
│         │                    │
│         ▼                    │
│  4. Gemini 返回审查意见      │
│     - 如果 Gemini 认为完美,  │
│       提前结束循环           │
│     - 否则进入下一轮迭代     │
│                              │
└──────────────────────────────┘
    │
    ▼
输出最终结果
```

## 技术方案

### 语言选择
- **Node.js (TypeScript)** — 两个 CLI 都已在 Node 环境中可用

### 项目结构
```
claude-gemini-loop/
├── plan.md
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          # 入口 + CLI 参数解析
│   ├── preflight.ts      # 预检：确认 claude/gemini 可用
│   ├── claude-runner.ts  # 调用 claude CLI
│   ├── gemini-runner.ts  # 调用 gemini CLI
│   └── loop.ts           # 迭代循环主逻辑
└── README.md (不创建)
```

### CLI 接口设计
```bash
# 基本用法
cgloop "请写一个快速排序的 Python 实现"

# 指定迭代轮数 (默认 3 轮)
cgloop -n 5 "请写一个 REST API"

# 指定工作目录 (让 claude 在该目录下工作)
cgloop -d ./my-project "修复 bug"

# 显示详细输出
cgloop -v "重构这个函数"
```

### 核心实现细节

#### 1. 预检模块 (`preflight.ts`)
- 运行 `claude --version` 和 `gemini --version`
- 确认两者都可用且版本正常
- 失败则给出明确错误提示并退出

#### 2. Claude 调用 (`claude-runner.ts`)
- 使用 `claude -p "prompt"` 以非交互模式运行
- 首轮 prompt: 用户的原始任务
- 后续轮 prompt: 原始任务 + Gemini 的修正意见
- 捕获 stdout 作为执行结果

#### 3. Gemini 调用 (`gemini-runner.ts`)
- 使用 `gemini -p "prompt"` 以非交互模式运行
- prompt 包含: 原始任务 + Claude 的执行结果
- 要求 Gemini 给出结构化审查:
  - 评分 (1-10)
  - 问题列表
  - 修正建议
  - 是否已完美 (用于提前终止)

#### 4. 迭代循环 (`loop.ts`)
- 接收: 任务描述、最大迭代次数
- 每轮迭代:
  1. 调用 Claude (附带上轮反馈)
  2. 调用 Gemini 审查
  3. 解析 Gemini 的评分，判断是否提前终止
  4. 打印本轮摘要
- 循环结束后输出最终结果

### 依赖
- `commander` — CLI 参数解析
- `chalk` — 终端彩色输出
- `tsx` — 直接运行 TypeScript
- 无需 API SDK，全部通过 `child_process.execFile` 调用 CLI

### Gemini 审查 Prompt 模板
```
你是一个代码审查专家。请审查以下任务的完成情况。

## 原始任务
{task}

## Claude 的执行结果
{claude_output}

请给出:
1. 评分 (1-10，10 为完美)
2. 存在的问题
3. 具体的修正建议
4. 如果评分 >= 9，在最后一行输出 "APPROVED"
```

### Claude 修正 Prompt 模板
```
请根据以下审查意见修改你之前的工作。

## 原始任务
{task}

## 你之前的输出
{previous_output}

## 审查意见
{gemini_feedback}

请根据审查意见进行修改，输出完整的修改后结果。
```

## 注意事项
- 不调用任何 API，完全通过 CLI 子进程通信
- Claude CLI 使用 `claude -p` 的 print mode (非交互)
- Gemini CLI 使用 `gemini -p` 的非交互模式
- 每轮迭代的输入输出都打印到终端，方便用户观察进展
- 超时策略：只要子进程还在运行就持续等待，最大等待时间 1 小时 (3600 秒)
