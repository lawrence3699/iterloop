import type { Content } from './types'

const REPO = 'https://github.com/lawrence3699/iterloop'

export const zh: Content = {
  nav: {
    links: [
      { id: 'how-it-works', label: '工作原理' },
      { id: 'features', label: '特性' },
      { id: 'quickstart', label: '快速开始' },
    ],
    getStarted: '快速开始',
    githubAria: '在 GitHub 上查看 iterloop',
  },
  hero: {
    titleLine1: '两个 AI，',
    titleLine2: '一个质量闭环。',
    subhead:
      'iterloop 把 Claude 与 Gemini 的命令行工具串成迭代循环——Claude 执行、Gemini 打分点评、Claude 修改——直到拿到 9/10 或达到你设定的轮次。无需 API key。',
    installCommand: 'cgloop "Build a REST API with Express"',
    installHint: '↓ 一分钟内装好',
    ctaPrimary: '快速开始',
    ctaSecondary: '在 GitHub 查看',
  },
  terminal: {
    windowTitle: 'iterloop',
    lines: [
      { kind: 'command', text: '$ cgloop "Build a REST API with Express"' },
      { kind: 'meta', text: '✓ Preflight: claude & gemini detected' },
      { kind: 'meta', text: '── Round 1 ──────────────────────────────' },
      { kind: 'claude', text: '▸ Claude   scaffolded an Express app — 4 routes, no tests' },
      { kind: 'gemini', text: '▸ Gemini   reviewing…' },
      { kind: 'score', text: '  Score 7/10 · no input validation, missing error handler' },
      { kind: 'meta', text: '── Round 2 ──────────────────────────────' },
      { kind: 'claude', text: '▸ Claude   added zod validation + central error middleware' },
      { kind: 'gemini', text: '▸ Gemini   reviewing…' },
      { kind: 'score', text: '  Score 9/10' },
      { kind: 'approved', text: '✓ APPROVED — final output ready' },
    ],
  },
  howItWorks: {
    heading: '工作原理',
    subheading: '一个可配置的循环：两个 AI 互相校验，直到结果足够好。',
    steps: [
      { title: '你提供任务', desc: '用自然语言描述你想构建或修复的东西。' },
      { title: '预检', desc: 'iterloop 确认 claude 与 gemini 命令行可用。' },
      { title: 'Claude 执行', desc: '第 1 轮跑你的任务；之后每轮带上 Gemini 的反馈。' },
      { title: 'Gemini 评审打分', desc: '给出 1–10 分，并列出具体问题与建议。' },
      { title: '通过或回流', desc: '评分 ≥ 9 直接 APPROVED 提前结束；否则反馈回传给 Claude。' },
      { title: '最终输出', desc: '通过或达到轮次上限后，你拿到打磨后的结果。' },
    ],
  },
  features: {
    heading: '需要的都在，多余的都没有',
    subheading: '一个把一件事做好的专注工具。',
    items: [
      { icon: 'KeyRound', title: '无需 API key', desc: '完全走你已经在用的 Claude 与 Gemini 命令行，无需另行申请。' },
      { icon: 'Users', title: '双 AI 协作', desc: 'Claude 执行、Gemini 评审——两个模型互相把关。' },
      { icon: 'Gauge', title: '评分驱动早停', desc: 'Gemini 一旦给出 9/10 的 APPROVED，循环立即结束。' },
      { icon: 'Repeat', title: '轮次可配置', desc: '用 -n 设置最大迭代次数（默认 3）。' },
      { icon: 'FolderOpen', title: '任意工作目录', desc: '用 -d 让两个命令行在任意项目目录中运行。' },
      { icon: 'Radio', title: '实时流式输出', desc: '用 -v 实时观察两个命令行的执行过程。' },
      { icon: 'Clock', title: '为深度任务而生', desc: '每次调用最长 1 小时超时，从容应对长耗时任务。' },
      { icon: 'Scale', title: 'MIT 开源', desc: '自由开源——随便读、随便 fork、随便用。' },
    ],
  },
  quickStart: {
    heading: '快速开始',
    subheading: '从克隆到第一次循环，一分钟搞定。',
    prerequisitesLabel: '前置依赖',
    prerequisites: [
      'Node.js ≥ 18',
      'Claude CLI——已安装并完成认证',
      'Gemini CLI——已安装并完成认证',
    ],
    steps: [
      { label: '克隆仓库', code: 'git clone https://github.com/lawrence3699/iterloop.git' },
      { label: '安装依赖', code: 'cd iterloop && npm install' },
      { label: '开发模式运行', code: 'npx tsx src/index.ts "Write a quicksort in Python"' },
      { label: '构建并全局链接', code: 'npm run build && npm link' },
      { label: '随处使用', code: 'cgloop "Build a REST API with Express"' },
    ],
  },
  usage: {
    heading: '用法与参数',
    subheading: '按任务调整循环。',
    examplesLabel: '示例',
    examples: [
      { label: '基础（3 轮）', code: 'cgloop "Write a quicksort implementation in Python"' },
      { label: '更多轮次', code: 'cgloop -n 5 "Build a REST API with Express"' },
      { label: '指定项目目录', code: 'cgloop -d ./my-project "Fix the authentication bug"' },
      { label: '实时流式输出', code: 'cgloop -v "Refactor the database module"' },
    ],
    optionsLabel: '参数',
    options: [
      { flag: '-n, --iterations <n>', desc: '最大迭代轮数', def: '3' },
      { flag: '-d, --dir <path>', desc: 'Claude 与 Gemini 的工作目录', def: '当前目录' },
      { flag: '-v, --verbose', desc: '运行时实时输出', def: '关闭' },
      { flag: '-h, --help', desc: '显示帮助', def: '—' },
    ],
    reviewHeading: '评审机制',
    reviewPoints: [
      'Score——1–10 的总体质量评分',
      'Issues——输出中发现的问题',
      'Suggestions——具体的修改建议',
      'Verdict——评分达到 9 即 APPROVED，提前结束循环',
    ],
  },
  footer: {
    tagline: 'Claude × Gemini 迭代协作，就在命令行里。',
    links: [
      { label: 'GitHub', href: REPO },
      { label: 'README', href: `${REPO}#readme` },
      { label: '中文 README', href: `${REPO}/blob/main/README_CN.md` },
      { label: 'MIT 许可证', href: `${REPO}#license` },
      { label: 'Claude CLI', href: 'https://docs.anthropic.com/en/docs/claude-code' },
      { label: 'Gemini CLI', href: 'https://github.com/anthropics/gemini-cli' },
    ],
    backToTop: '回到顶部',
    madeBy: '由 lawrence3699 打造',
  },
}
