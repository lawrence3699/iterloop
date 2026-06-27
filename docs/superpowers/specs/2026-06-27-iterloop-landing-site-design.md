# iterloop 官网（落地页）— 设计文档

- **日期**：2026-06-27
- **状态**：待用户复核
- **仓库**：`lawrence3699/iterloop`（默认分支 `main`，Pages 尚未启用）
- **分支**：`feat/landing-site`
- **域名**：`iter-loop.com`（裸域 / apex）

> 语境备注：本站是给 **GitHub 上的 CLI 工具**（`lawrence3699/iterloop`，"CLI tool for Claude-Gemini iterative collaboration"）做的官网。用户本地另有一个**同名但不同**的 Electron DAG 编辑器项目（`~/Desktop/iterloop`，未提交、未发布），与本站无关，不触碰。

---

## 1. 目标与受众

为 iterloop 做一个面向开发者（中英双语）的单页落地页：讲清它**是什么、怎么运行、如何安装**，并导流到 GitHub。站点放在 iterloop 仓库内（`site/` 子目录），GitHub Actions 自动构建并部署到 GitHub Pages，挂自定义域名 `iter-loop.com`。

iterloop 一句话价值：**把 Claude CLI 与 Gemini CLI 串成迭代协作循环**——Claude 执行任务，Gemini 打分（1–10）与点评，Claude 据反馈修改，循环到评分 ≥9（`APPROVED`）或达到轮次上限。**无需 API key**，完全走两个工具的命令行版本。

## 2. 关键决策汇总

| 决策项 | 选择 |
|---|---|
| 托管位置 | iterloop 仓库内 `site/` 子目录（独立 Vite 应用，隔离于 CLI） |
| 语言 | 中英双语，导航栏可切换（EN / 中） |
| 视觉方向 | "Questly 结构 + iterloop 身份"：沿用参考稿布局/导航/hero 节奏/动效；背景与主视觉换成 iterloop 自有风格 |
| 字体 | Inter（自托管，OFL），栈 `'Inter','Helvetica Neue',Helvetica,Arial,sans-serif` |
| 安装方式 | **git clone + npm install + npm link**（iterloop 未发布到 npm，已核实 404） |
| 部署 | GitHub Actions 构建 `site/` → 部署到 Pages；不提交构建产物 |
| 域名 | `iter-loop.com`（apex），Vite `base:'/'` |

## 3. 技术栈

- **React 18 + TypeScript + Vite**（产物纯静态，适合 Pages）
- **Tailwind CSS 3** + PostCSS/autoprefixer
- **lucide-react** 图标
- **@fontsource/inter** 自托管字体
- 轻量自建 i18n（不引 i18next 等重型库）
- 无后端、无路由（单页锚点滚动）

## 4. 视觉身份

- **基调**：浅色（近白底，文字 `gray-900/700/600`，与参考稿一致的克制现代感）。
- **强调色渐变**＝"两个 AI 汇合"的隐喻：暖珊瑚/橙（Claude 调，≈`#E8855F`）→ 蓝/靛/紫（Gemini 调，≈`#4F86F7`→`#7C5CFF`）。用于 Logo、关键按钮 hover、循环图、hero 光晕。
- **Hero 背景**：纯 CSS 柔和 aurora（一侧珊瑚、一侧蓝紫，中间交汇＝"循环/收敛"）＋淡点阵网格遮罩；**不外链任何图片**。放弃参考稿底部的草地叠层，改为柔和渐变过渡 / 终端 mockup 上浮叠压。
- **Logo**：循环标——两个箭头首尾相追成环（↻）或双 chevron 收敛，`viewBox 0 0 256 256`，`currentColor` 或强调色渐变。实现阶段定稿。
- **窗口/终端 chrome**：深色 `#1a1a1c`（与浅色页面形成对比，沿用参考稿 mockup 质感）。

## 5. 信息架构（从上到下）

1. **Navbar** — Logo · 锚点导航(How it works / Features / Quickstart) · **语言切换 EN/中** · GitHub 图标 · 主 CTA「Get Started」；移动端汉堡抽屉。
2. **Hero** — 两行大标题（交错入场）＋副标题；参考稿的搜索 pill 换成**可复制的命令 pill**（展示 `cgloop "…"` 用法，带"已复制"反馈）＋一个"↓ 60 秒安装"小链接到 Quickstart；双 CTA：`Get Started`(深色 pill→#quickstart) / `View on GitHub`(描边)。
3. **终端实况 mockup**（核心主视觉，替代参考稿仪表盘）— 深色终端窗口（红黄绿灯＋标题 iterloop），**逐行动画**演示一次会话：`cgloop "Build a REST API with Express"` → Round 1 → Gemini 评分 7/10（Issues/Suggestions）→ Round 2 → **9/10 ✅ APPROVED**。用参考稿的 `ScaledFrame`(ResizeObserver) 等比缩放。
4. **How It Works** — 把 README 的 ASCII 循环图重做成干净的**动画化循环图**：① 提供任务 → ② Preflight 校验 claude/gemini → ③ Claude 执行(轮1:任务；轮2+:任务+Gemini 反馈) → ④ Gemini 评审(Score/Issues/Suggestions/Verdict) → ⑤ ≥9 则 `APPROVED` 早停，否则带反馈回流 → ⑥ Final output。
5. **Features** — 卡片网格(lucide 图标)：无需 API key · 双 AI 协作 · 评分驱动早停(≥9) · 可配置轮次 `-n` · 指定工作目录 `-d` · 实时流式 `-v` · 单次 1 小时超时 · MIT 开源。
6. **Quick Start** — 带复制按钮的代码块：前置依赖(Node≥18 / Claude CLI / Gemini CLI，`claude --version`·`gemini --version`) → `git clone …` → `cd iterloop && npm install` → 开发跑 `npx tsx src/index.ts "…"` → 构建并链接 `npm run build && npm link` → `cgloop "…"`。
7. **Usage & Options** — 示例命令(基础 / `-n 5` / `-d ./my-project` / `-v` / 组合)＋参数表(`-n/--iterations` 默认3、`-d/--dir` 当前目录、`-v/--verbose` 关、`-h/--help`)＋评审机制说明。
8. **Footer** — GitHub · README(EN/中) · MIT · Claude/Gemini 链接 · 语言切换 · 回到顶部 · made by lawrence3699。

## 6. 文案草案（实现阶段可再改）

**Hero 标题**
- EN: "Two AIs." / "One quality loop."
- 中: "两个 AI，" / "一个质量闭环。"

**Hero 副标题**
- EN: "iterloop runs the Claude and Gemini CLIs in an iterative loop — Claude executes, Gemini scores and critiques, Claude revises — until the work earns a 9/10 or hits your round limit. No API keys."
- 中: "iterloop 把 Claude 与 Gemini 的命令行工具串成迭代循环——Claude 执行、Gemini 打分点评、Claude 修改——直到拿到 9/10 或达到你设定的轮次。无需 API key。"

**CTA**：`Get Started` / `View on GitHub`（中：`快速开始` / `在 GitHub 查看`）。

其余分区文案在实现阶段补全，全部进 `src/content/{en,zh}.ts`。

## 7. 双语 i18n 设计

- `src/i18n/LanguageContext.tsx`：提供 `lang`('en'|'zh') 与 `setLang`。初值＝`localStorage['iterloop-lang']`，否则 `navigator.language.startsWith('zh') ? 'zh' : 'en'`；变更时写回 localStorage 并更新 `document.documentElement.lang`。
- `src/content/{types.ts,en.ts,zh.ts}`：同一份类型、两份取值的文案字典；`useContent()` 钩子按当前 `lang` 返回对应字典。组件只读字典，不内联文案。
- `LangToggle` 出现在 Navbar 与 Footer。

## 8. 动效与可达性

- 复用参考稿 keyframes：`fade-up` / `fade-down` / `hero-rise`，同款 `cubic-bezier(0.22,1,0.36,1)`，交错 `[animation-delay]`。
- 终端 demo 逐行揭示（小型 JS 定时器）。区块进入用 IntersectionObserver 轻量触发。
- **全部受 `prefers-reduced-motion: reduce` 兜底**：弱化时禁用位移/打字，直接显示终态。

## 9. 文件结构（仓库内新增）

```
iterloop/
├─ src/                                  # 现有 CLI，原封不动
├─ docs/superpowers/specs/               # 本设计文档
├─ .github/workflows/deploy-site.yml     # 新增：构建 site/ 并部署到 Pages
└─ site/                                 # 新增：独立 Vite 应用（自带 package.json）
   ├─ index.html
   ├─ package.json
   ├─ vite.config.ts                     # base:'/'
   ├─ tailwind.config.js / postcss.config.js
   ├─ tsconfig.json / tsconfig.node.json
   ├─ public/{CNAME, favicon.svg, og-image.png}
   └─ src/
      ├─ main.tsx / App.tsx / index.css
      ├─ i18n/{LanguageContext.tsx, useContent.ts}
      ├─ content/{types.ts, en.ts, zh.ts}
      ├─ components/{Navbar, Logo, LangToggle, Hero, InstallPill,
      │             TerminalDemo, ScaledFrame, HowItWorks,
      │             Features, QuickStart, Usage, Footer}.tsx
      └─ ui/{CodeBlock, CopyButton, SectionReveal}.tsx
```
站点用**独立的 `site/package.json`**，React/Vite 依赖不污染 CLI（CLI 仅依赖 commander）。

## 10. 构建与部署

- **`.github/workflows/deploy-site.yml`**：触发＝push 到 `main` 且改动 `site/**`（含 workflow 自身）＋ `workflow_dispatch` 手动。步骤：checkout → setup-node 20(cache) → `cd site && npm ci && npm run build` → `actions/configure-pages` → `actions/upload-pages-artifact`(path `site/dist`) → `actions/deploy-pages`。权限：`pages: write`、`id-token: write`；concurrency group `pages`。
- **Pages 源**＝GitHub Actions（仓库设置里切换）。
- **自定义域名**：`site/public/CNAME` 内容＝`iter-loop.com`（Vite 自动把 `public/` 拷进 `dist/`）；仓库 Pages 设置填同一域名并启用 *Enforce HTTPS*。
- **Vite `base:'/'`**（apex 根路径）。
- **DNS（用户在域名注册商处添加）**——apex `iter-loop.com`：
  - A 记录 → `185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153`
  - AAAA 记录 → `2606:50c0:8000::153` / `2606:50c0:8001::153` / `2606:50c0:8002::153` / `2606:50c0:8003::153`
  - （可选）`www` 子域 CNAME → `lawrence3699.github.io`
  - 说明：GitHub 对 apex 自定义域名的 HTTPS 证书签发可能需要一段时间生效。

## 11. 验收方式（务实，已显式偏离全局 TDD 规则）

这是静态营销页，全量 80% 单测＋TDD 并不适配。建议：
- **构建门禁**：`tsc --noEmit` 与 `vite build` 必须通过。
- **少量 Vitest 单测**：只覆盖纯逻辑（i18n 初始语言选择、复制工具），不强凑 80%。
- **人工核验**：响应式(移动/平板/桌面)、双语渲染、复制按钮、`prefers-reduced-motion`、全部链接/锚点、Lighthouse 可达性/性能 sanity。
- **收尾本地预览**（`vite preview`）＋截图给用户确认后再正式发布。
- 若用户要求按全局全量 TDD 执行，可改。

## 12. 待办 / 需用户提供

- 最终标题/副标题文案（已给草案，用户可改）。
- 域名 `iter-loop.com` 已确认；DNS 记录由用户在注册商处添加。
- favicon / og-image 由我生成简版。
- 是否需要 `www` 跳转。

## 13. 范围之外（YAGNI v1）

博客/文档系统、统计分析、暗色模式切换（本页设计为浅色，后续可加）、多页路由、CMS、以及那个本地 Electron DAG 编辑器产品——均不在本站范围内。
