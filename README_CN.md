# iterloop

**[English](./README.md)**

一个命令行工具，将 **Claude CLI** 和 **Gemini CLI** 编排为迭代协作循环。Claude 负责执行任务，Gemini 负责审查结果并给出修正意见，Claude 再根据意见修改——如此反复，直到输出达到质量标准或达到迭代上限。

无需 API 密钥，完全通过两者的命令行版本工作。

## 工作流程

```
用户输入任务
     |
     v
[预检] 确认 claude 和 gemini CLI 可用
     |
     v
+--- 迭代循环 (可配置轮数) ---+
|                              |
|  1. 将任务发送给 Claude CLI  |
|     (首轮: 原始任务          |
|      后续轮: 任务+审查意见)  |
|            |                 |
|            v                 |
|  2. Claude 返回执行结果      |
|            |                 |
|            v                 |
|  3. 将结果发送给 Gemini 审查 |
|            |                 |
|            v                 |
|  4. Gemini 返回审查意见      |
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
- [Claude CLI](https://docs.anthropic.com/en/docs/claude-code) 已安装并完成认证
- [Gemini CLI](https://github.com/anthropics/gemini-cli) 已安装并完成认证

确认两者可用：

```bash
claude --version
gemini --version
```

## 安装

```bash
git clone https://github.com/lawrence3699/iterloop.git
cd iterloop
npm install
```

### 直接运行（开发模式）

```bash
npx tsx src/index.ts "你的任务描述"
```

### 编译并全局安装

```bash
npm run build
npm link
cgloop "你的任务描述"
```

## 使用方法

```bash
# 基本用法（默认 3 轮迭代）
cgloop "写一个 Python 快速排序实现"

# 指定最大迭代轮数
cgloop -n 5 "用 Express 写一个 REST API"

# 指定工作目录（Claude 和 Gemini 在该目录下工作）
cgloop -d ./my-project "修复认证模块的 bug"

# 实时流式输出
cgloop -v "重构数据库模块"

# 组合选项
cgloop -n 4 -d ./my-app -v "给用户服务添加单元测试"
```

### 选项说明

| 选项 | 说明 | 默认值 |
|---|---|---|
| `-n, --iterations <number>` | 最大迭代轮数 | `3` |
| `-d, --dir <path>` | Claude 和 Gemini 的工作目录 | 当前目录 |
| `-v, --verbose` | 实时流式显示 CLI 输出 | 关闭 |
| `-h, --help` | 显示帮助信息 | |

## 项目结构

```
iterloop/
├── src/
│   ├── index.ts            # CLI 入口 + 参数解析
│   ├── preflight.ts        # 预检 claude/gemini 可用性
│   ├── claude-runner.ts    # 调用 claude CLI 子进程
│   ├── gemini-runner.ts    # 调用 gemini CLI 子进程
│   ├── loop.ts             # 迭代循环核心逻辑
│   └── colors.ts           # 终端颜色 + ANSI 清理
├── package.json
├── tsconfig.json
└── plan.md                 # 原始设计文档
```

## 审查机制

每轮迭代中，Gemini 会收到包含原始任务和 Claude 输出的结构化审查提示，并返回：

1. **评分**（1-10）— 整体质量评级
2. **问题**— 发现的问题列表
3. **建议**— 具体的修正意见
4. **结论**— 评分 >= 9 时输出 `APPROVED`，循环提前终止

如果未通过，审查意见会和原始任务一起打包发回给 Claude，进入下一轮修改。

## 超时策略

每次 CLI 调用的最大超时时间为 **1 小时**（3600 秒）。只要子进程还在运行，iterloop 就会持续等待。这样可以兼容需要长时间思考的复杂任务。

## 许可证

MIT
