# iterloop Landing Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (EN/中) single-page marketing site for the iterloop CLI, hosted from `site/` in the iterloop repo and deployed to GitHub Pages at `iter-loop.com`.

**Architecture:** A self-contained Vite + React + TypeScript app under `site/` (isolated from the CLI, own `package.json`). All copy lives in typed bilingual content dictionaries consumed via a lightweight i18n context. Visuals are pure-CSS (no hotlinked images); the centerpiece is an animated terminal demo of the Claude→Gemini→score loop. A GitHub Actions workflow builds `site/` and deploys the static output to Pages.

**Tech Stack:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, lucide-react, @fontsource/inter, Vitest + @testing-library/react.

## Global Constraints

Every task implicitly includes these (exact values from the spec):

- **Isolation:** All new app code lives under `site/` with its own `package.json`. Do **not** modify the CLI under `src/` or the root `package.json`.
- **Node:** ≥18 locally; CI uses Node 20.
- **Tailwind:** v3 (NOT v4 — config/PostCSS differ).
- **Vite base:** `'/'` (apex custom domain serves at root).
- **Font stack:** `'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif`; self-hosted via `@fontsource/inter`. Enable `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` on `html`.
- **Accent colors:** Claude coral `#E8855F`, Gemini blue `#4F86F7` → violet `#7C5CFF`. Base text `gray-900/700/600` on near-white.
- **No external image hotlinking.** Backgrounds are pure CSS. Fonts/icons are bundled.
- **Accessibility:** All motion gated behind `prefers-reduced-motion: reduce` (show terminal/reveals in final state, no transforms/typing).
- **Bilingual:** No hardcoded user-facing copy in components — everything comes from `content/{en,zh}.ts` through `useContent()`.
- **Install method:** git clone + `npm install` + `npm link` (iterloop is NOT on npm). Never show `npm i -g iterloop`.
- **Domain:** `iter-loop.com` (apex). `site/public/CNAME` contains exactly `iter-loop.com`.
- **User code rules:** immutable updates (no in-place mutation); functions <50 lines; files <800 lines; explicit error handling; no hardcoded secrets.

**Working directory:** `~/Desktop/iterloop-cli` (clone of `lawrence3699/iterloop`), branch `feat/landing-site`.

---

## File Structure

```
iterloop/
├─ .github/workflows/deploy-site.yml      # T11: build site/ → deploy Pages
├─ docs/superpowers/{specs,plans}/        # design + this plan
└─ site/                                  # the app (T1 scaffolds)
   ├─ index.html
   ├─ package.json / vite.config.ts
   ├─ tailwind.config.js / postcss.config.js
   ├─ tsconfig.json / tsconfig.node.json / .gitignore
   ├─ public/{CNAME, favicon.svg}
   └─ src/
      ├─ main.tsx / App.tsx / index.css / vite-env.d.ts
      ├─ i18n/{LanguageContext.tsx, useContent.ts, resolveInitialLang.ts}   # T2
      ├─ content/{types.ts, en.ts, zh.ts}                                   # T2
      ├─ lib/{clipboard.ts}                                                 # T3
      ├─ ui/{CopyButton.tsx, CodeBlock.tsx, SectionReveal.tsx}              # T3
      └─ components/
         ├─ Logo.tsx, Navbar.tsx, LangToggle.tsx                           # T4
         ├─ Hero.tsx, InstallPill.tsx                                      # T5
         ├─ ScaledFrame.tsx, TerminalDemo.tsx                              # T6
         ├─ HowItWorks.tsx                                                 # T7
         ├─ Features.tsx                                                   # T8
         ├─ QuickStart.tsx, Usage.tsx                                      # T9
         └─ Footer.tsx                                                     # T10
```

**Verification note:** Per the spec (§11), this is a static marketing page; full 80% TDD does not apply. Genuine unit tests are written for pure logic (T2 `resolveInitialLang`, T3 `clipboard`) and key interaction (T3 CopyButton, T4 LangToggle) via Vitest + Testing Library. Presentational components are verified by: `tsc --noEmit` + `vite build` passing, rendering in both languages, and visual review. Every task ends green on `npm run build`.

---

## Task 1: Scaffold the Vite + React + Tailwind app

**Files:**
- Create: `site/package.json`, `site/vite.config.ts`, `site/tsconfig.json`, `site/tsconfig.node.json`, `site/tailwind.config.js`, `site/postcss.config.js`, `site/index.html`, `site/.gitignore`, `site/public/CNAME`, `site/src/main.tsx`, `site/src/App.tsx`, `site/src/index.css`, `site/src/vite-env.d.ts`

**Interfaces:**
- Produces: a buildable app shell. `App` is the root component rendered by `main.tsx`. Tailwind exposes utilities `animate-fade-up`, `animate-fade-down`, `animate-hero-rise` and colors `claude`, `gemini`, `gemini-violet`.

- [ ] **Step 1: Create `site/package.json`**

```json
{
  "name": "iterloop-site",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@fontsource/inter": "^5.0.0",
    "lucide-react": "^0.400.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `site/vite.config.ts`** (base `/`, react plugin, vitest jsdom)

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 3: Create tsconfig files**

`site/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`site/tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create Tailwind + PostCSS config**

`site/tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        claude: '#E8855F',
        gemini: '#4F86F7',
        'gemini-violet': '#7C5CFF',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)', filter: 'blur(6px)' },
          to: { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'hero-rise': {
          from: { opacity: '0', transform: 'translateY(64px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both',
        'fade-down': 'fade-down 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'hero-rise': 'hero-rise 1.1s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
```

`site/postcss.config.js`:
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

- [ ] **Step 5: Create `site/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>iterloop — Claude × Gemini iterative collaboration CLI</title>
    <meta name="description" content="iterloop runs the Claude and Gemini CLIs in an iterative loop until the work earns a 9/10. No API keys." />
    <meta property="og:title" content="iterloop" />
    <meta property="og:description" content="Claude executes, Gemini reviews, Claude revises — until it's right. No API keys." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://iter-loop.com" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`, `src/test-setup.ts`, `public/CNAME`, `.gitignore`**

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-up, .animate-fade-down, .animate-hero-rise {
    animation: none !important;
  }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

`src/main.tsx`:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

`src/App.tsx` (placeholder for now):
```tsx
export default function App() {
  return <div className="font-sans text-gray-900">iterloop</div>
}
```

`src/vite-env.d.ts`: `/// <reference types="vite/client" />`

`src/test-setup.ts`: `import '@testing-library/jest-dom'`

`public/CNAME` (exact, single line, no trailing blank semantics): `iter-loop.com`

`.gitignore`:
```
node_modules
dist
*.local
```

- [ ] **Step 7: Install and verify build**

Run:
```bash
cd ~/Desktop/iterloop-cli/site && npm install && npm run build
```
Expected: install succeeds; `tsc -b` no errors; `vite build` writes `site/dist/` including `dist/CNAME`. Confirm `test -f dist/CNAME && cat dist/CNAME` prints `iter-loop.com`.

- [ ] **Step 8: Commit**

```bash
cd ~/Desktop/iterloop-cli
git add site/ && git commit -m "feat(site): scaffold Vite + React + Tailwind app"
```

---

## Task 2: i18n foundation + bilingual content dictionaries

**Files:**
- Create: `site/src/content/types.ts`, `site/src/i18n/resolveInitialLang.ts`, `site/src/i18n/resolveInitialLang.test.ts`, `site/src/content/en.ts`, `site/src/content/zh.ts`, `site/src/i18n/LanguageContext.tsx`, `site/src/i18n/useContent.ts`

**Interfaces:**
- Produces:
  - `type Lang = 'en' | 'zh'`
  - `interface Content { nav; hero; terminal; howItWorks; features; quickStart; usage; footer }` (full shape below) — every later task reads its strings from here.
  - `resolveInitialLang(stored: string | null, navigatorLang: string): Lang`
  - `<LanguageProvider>` + `useLang(): { lang: Lang; setLang: (l: Lang) => void }`
  - `useContent(): Content` (returns dict for current lang)

- [ ] **Step 1: Write `content/types.ts`** (the shared shape all components consume)

```ts
export type Lang = 'en' | 'zh'

export interface NavContent {
  links: { id: string; label: string }[] // ids: 'how-it-works' | 'features' | 'quickstart'
  getStarted: string
  githubAria: string
}
export interface HeroContent {
  titleLine1: string
  titleLine2: string
  subhead: string
  installCommand: string // shown in InstallPill
  installHint: string
  ctaPrimary: string
  ctaSecondary: string
}
export type TerminalLineKind = 'command' | 'meta' | 'claude' | 'gemini' | 'score' | 'approved'
export interface TerminalLine { kind: TerminalLineKind; text: string }
export interface TerminalContent { windowTitle: string; lines: TerminalLine[] }
export interface StepItem { title: string; desc: string }
export interface HowItWorksContent { heading: string; subheading: string; steps: StepItem[] }
export interface FeatureItem { icon: string; title: string; desc: string } // icon = lucide-react name
export interface FeaturesContent { heading: string; subheading: string; items: FeatureItem[] }
export interface QuickStartContent {
  heading: string
  prerequisitesLabel: string
  prerequisites: string[]
  steps: { label: string; code: string }[]
}
export interface UsageContent {
  heading: string
  examplesLabel: string
  examples: { label: string; code: string }[]
  optionsLabel: string
  options: { flag: string; desc: string; def: string }[]
  reviewHeading: string
  reviewPoints: string[]
}
export interface FooterContent {
  tagline: string
  links: { label: string; href: string }[]
  backToTop: string
  madeBy: string
}
export interface Content {
  nav: NavContent
  hero: HeroContent
  terminal: TerminalContent
  howItWorks: HowItWorksContent
  features: FeaturesContent
  quickStart: QuickStartContent
  usage: UsageContent
  footer: FooterContent
}
```

- [ ] **Step 2: Write the failing test `i18n/resolveInitialLang.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { resolveInitialLang } from './resolveInitialLang'

describe('resolveInitialLang', () => {
  it('honors a valid stored value', () => {
    expect(resolveInitialLang('zh', 'en-US')).toBe('zh')
    expect(resolveInitialLang('en', 'zh-CN')).toBe('en')
  })
  it('falls back to navigator when stored is missing/invalid', () => {
    expect(resolveInitialLang(null, 'zh-CN')).toBe('zh')
    expect(resolveInitialLang('garbage', 'zh')).toBe('zh')
    expect(resolveInitialLang(null, 'en-GB')).toBe('en')
  })
  it('defaults to en for non-zh navigator languages', () => {
    expect(resolveInitialLang(null, 'fr-FR')).toBe('en')
    expect(resolveInitialLang(null, '')).toBe('en')
  })
})
```

- [ ] **Step 3: Run it, verify it fails**

Run: `cd site && npx vitest run src/i18n/resolveInitialLang.test.ts`
Expected: FAIL — `resolveInitialLang` not found.

- [ ] **Step 4: Implement `i18n/resolveInitialLang.ts`**

```ts
import type { Lang } from '../content/types'

export function resolveInitialLang(stored: string | null, navigatorLang: string): Lang {
  if (stored === 'en' || stored === 'zh') return stored
  return navigatorLang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}
```

- [ ] **Step 5: Run test, verify pass**

Run: `cd site && npx vitest run src/i18n/resolveInitialLang.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Write `content/en.ts` and `content/zh.ts`**

Both export `const en: Content` / `const zh: Content` matching `types.ts` exactly. Use the spec §6 copy drafts. Key values (English; mirror in Chinese):
- `hero.titleLine1='Two AIs.'`, `titleLine2='One quality loop.'`
- `hero.subhead='iterloop runs the Claude and Gemini CLIs in an iterative loop — Claude executes, Gemini scores and critiques, Claude revises — until the work earns a 9/10 or hits your round limit. No API keys.'`
- `hero.installCommand='cgloop "Build a REST API with Express"'`, `installHint='↓ Install in under a minute'`
- `hero.ctaPrimary='Get Started'`, `ctaSecondary='View on GitHub'`
- `nav.links=[{id:'how-it-works',label:'How it works'},{id:'features',label:'Features'},{id:'quickstart',label:'Quick start'}]`, `getStarted='Get Started'`
- `terminal.windowTitle='iterloop'`, `terminal.lines` = scripted session (see Task 6 for the exact lines; define them here):
  ```
  {command} $ cgloop "Build a REST API with Express"
  {meta}    ✓ Preflight: claude & gemini detected
  {meta}    ── Round 1 ──────────────────────────
  {claude}  ▸ Claude: scaffolded Express app, 4 routes, no tests
  {gemini}  ▸ Gemini review — Score 7/10
  {gemini}    Issues: no input validation; missing error handler
  {meta}    ── Round 2 ──────────────────────────
  {claude}  ▸ Claude: added zod validation + central error middleware
  {gemini}  ▸ Gemini review — Score 9/10
  {approved}✓ APPROVED — final output ready
  ```
- `howItWorks.steps` (6): Provide a task / Preflight check / Claude executes / Gemini reviews & scores / ≥9 approved, else loop back / Final output — each with one-line desc from README.
- `features.items` (8) with lucide icon names:
  `{icon:'KeyRound',...No API keys}`, `{icon:'Users',...Dual-AI collaboration}`, `{icon:'Gauge',...Score-driven early stop}`, `{icon:'Repeat',...Configurable rounds (-n)}`, `{icon:'FolderOpen',...Any working directory (-d)}`, `{icon:'Radio',...Live streaming (-v)}`, `{icon:'Clock',...1-hour timeout per call}`, `{icon:'Scale',...MIT licensed}`.
- `quickStart.prerequisites=['Node.js ≥ 18','Claude CLI (installed & authenticated)','Gemini CLI (installed & authenticated)']`
- `quickStart.steps`: `git clone https://github.com/lawrence3699/iterloop.git` / `cd iterloop && npm install` / `npx tsx src/index.ts "your task here"` / `npm run build && npm link` / `cgloop "your task here"`
- `usage.examples`: basic / `cgloop -n 5 "Build a REST API with Express"` / `cgloop -d ./my-project "Fix the auth bug"` / `cgloop -v "Refactor the database module"`
- `usage.options`: `-n, --iterations` (Max iteration rounds / `3`), `-d, --dir` (Working dir for both CLIs / current dir), `-v, --verbose` (Stream real-time output / off), `-h, --help` (Show help / —)
- `usage.reviewPoints`: Score (1–10) / Issues / Suggestions / Verdict (APPROVED if ≥9)
- `footer.links`: GitHub repo, README (EN), README (中文) `README_CN.md`, MIT License, Claude CLI, Gemini CLI. `madeBy='Built by lawrence3699'`.

> All `href`s: repo = `https://github.com/lawrence3699/iterloop`. Keep both files structurally identical (same array lengths/order) so components index safely.

- [ ] **Step 7: Implement `i18n/LanguageContext.tsx` and `i18n/useContent.ts`**

```tsx
// LanguageContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang } from '../content/types'
import { resolveInitialLang } from './resolveInitialLang'

const STORAGE_KEY = 'iterloop-lang'
interface LangCtx { lang: Lang; setLang: (l: Lang) => void }
const Ctx = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    resolveInitialLang(
      typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null,
      typeof navigator !== 'undefined' ? navigator.language : 'en',
    ),
  )
  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* ignore */ }
  }, [lang])
  return <Ctx.Provider value={{ lang, setLang: setLangState }}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useLang must be used within LanguageProvider')
  return v
}
```

```ts
// useContent.ts
import { useLang } from './LanguageContext'
import { en } from '../content/en'
import { zh } from '../content/zh'
import type { Content } from '../content/types'

export function useContent(): Content {
  const { lang } = useLang()
  return lang === 'zh' ? zh : en
}
```

- [ ] **Step 8: Verify typecheck + tests, then commit**

Run: `cd site && npm run typecheck && npx vitest run`
Expected: typecheck clean; tests PASS.
```bash
git add site/src && git commit -m "feat(site): bilingual i18n context + content dictionaries"
```

---

## Task 3: UI primitives — clipboard, CopyButton, CodeBlock, SectionReveal

**Files:**
- Create: `site/src/lib/clipboard.ts`, `site/src/lib/clipboard.test.ts`, `site/src/ui/CopyButton.tsx`, `site/src/ui/CopyButton.test.tsx`, `site/src/ui/CodeBlock.tsx`, `site/src/ui/SectionReveal.tsx`

**Interfaces:**
- Produces:
  - `copyText(text: string): Promise<boolean>`
  - `<CopyButton text={string} className?={string} />` — copies, shows check icon ~1.5s
  - `<CodeBlock code={string} label?={string} />` — monospace block with a CopyButton
  - `<SectionReveal as?={tag} className?={string}>{children}</SectionReveal>` — fades children up when scrolled into view (IntersectionObserver), reduced-motion → immediately visible

- [ ] **Step 1: Write failing test `lib/clipboard.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { copyText } from './clipboard'

describe('copyText', () => {
  beforeEach(() => vi.restoreAllMocks())
  it('returns true when clipboard write succeeds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    expect(await copyText('hi')).toBe(true)
    expect(writeText).toHaveBeenCalledWith('hi')
  })
  it('returns false when clipboard write rejects', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('x')) } })
    expect(await copyText('hi')).toBe(false)
  })
  it('returns false when clipboard API is missing', async () => {
    vi.stubGlobal('navigator', {})
    expect(await copyText('hi')).toBe(false)
  })
})
```

- [ ] **Step 2: Run, verify fail.** `cd site && npx vitest run src/lib/clipboard.test.ts` → FAIL (not defined).

- [ ] **Step 3: Implement `lib/clipboard.ts`**

```ts
export async function copyText(text: string): Promise<boolean> {
  try {
    if (!navigator?.clipboard?.writeText) return false
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
```

- [ ] **Step 4: Run, verify pass** (3 tests).

- [ ] **Step 5: Write `CopyButton.test.tsx` (failing)**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopyButton } from './CopyButton'

it('copies text and shows copied state on click', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { clipboard: { writeText } })
  render(<CopyButton text="hello" />)
  await userEvent.click(screen.getByRole('button'))
  expect(writeText).toHaveBeenCalledWith('hello')
  expect(await screen.findByLabelText(/copied/i)).toBeInTheDocument()
})
```

- [ ] **Step 6: Run, verify fail.**

- [ ] **Step 7: Implement `CopyButton.tsx`**

```tsx
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { copyText } from '../lib/clipboard'

export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  async function onClick() {
    if (await copyText(text)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors ${className}`}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    </button>
  )
}
```

- [ ] **Step 8: Run, verify pass.**

- [ ] **Step 9: Implement `CodeBlock.tsx` and `SectionReveal.tsx`** (presentational; verified by build + later visual review)

`CodeBlock.tsx`: a `<div>` with dark bg `bg-[#1a1a1c] ring-1 ring-white/10 rounded-lg`, optional label row, a `<pre><code>` (`font-mono text-sm text-white/90 overflow-x-auto`), and a `CopyButton text={code}` top-right. No mutation of props.

`SectionReveal.tsx`:
```tsx
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

export function SectionReveal({ as: Tag = 'div', className = '', children }:
  { as?: ElementType; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setShown(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`${className} ${shown ? 'animate-fade-up' : 'opacity-0'}`}>
      {children}
    </Tag>
  )
}
```

- [ ] **Step 10: Verify + commit**

Run: `cd site && npm run typecheck && npx vitest run && npm run build`
```bash
git add site/src && git commit -m "feat(site): clipboard util + CopyButton/CodeBlock/SectionReveal primitives"
```

---

## Task 4: Logo, LangToggle, Navbar

**Files:**
- Create: `site/src/components/Logo.tsx`, `site/src/components/LangToggle.tsx`, `site/src/components/Navbar.tsx`, `site/src/components/LangToggle.test.tsx`
- Modify: `site/src/App.tsx` (wrap in `LanguageProvider`, render `Navbar`)

**Interfaces:**
- Consumes: `useContent()`, `useLang()`, `LanguageProvider`.
- Produces: `<Logo className?/>`, `<LangToggle />`, `<Navbar />`.

- [ ] **Step 1: Write failing `LangToggle.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from '../i18n/LanguageContext'
import { LangToggle } from './LangToggle'
import { useContent } from '../i18n/useContent'

function Probe() { return <span>{useContent().hero.ctaPrimary}</span> }

it('switches content language when toggled', async () => {
  render(<LanguageProvider><LangToggle /><Probe /></LanguageProvider>)
  // default en
  expect(screen.getByText('Get Started')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /中文|中/ }))
  expect(screen.getByText('快速开始')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run, verify fail.**

- [ ] **Step 3: Implement `LangToggle.tsx`**

```tsx
import { useLang } from '../i18n/LanguageContext'

export function LangToggle() {
  const { lang, setLang } = useLang()
  const next = lang === 'en' ? 'zh' : 'en'
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={lang === 'en' ? '切换到中文' : 'Switch to English'}
      className="text-[13px] font-medium text-gray-700 hover:text-gray-900 px-2.5 py-1 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors"
    >
      {lang === 'en' ? '中' : 'EN'}
    </button>
  )
}
```

- [ ] **Step 4: Run, verify pass.** (`hero.ctaPrimary` must be `快速开始` in `zh.ts` — fix content if needed.)

- [ ] **Step 5: Implement `Logo.tsx`** — SVG loop mark, `viewBox="0 0 256 256"`, `fill="currentColor"`. Two arrowheads chasing around a ring (circular-arrow / refresh motif). Accept `className` for sizing.

- [ ] **Step 6: Implement `Navbar.tsx`**

Structure (adapt the reference's navbar; light theme):
- `animate-fade-down relative z-20` flex row, `px-5 sm:px-8 lg:px-10 py-4 sm:py-5`.
- Left: `<Logo className="w-6 h-6 text-gray-900" />` + wordmark `iterloop` (`font-semibold text-gray-900`).
- Center (hidden `< md`): nav links from `content.nav.links`, each `<a href={'#'+id}>` `text-[13px] text-gray-700 hover:text-gray-900`, `gap-8`.
- Right: `<LangToggle />`, GitHub icon link (`lucide Github`, `aria-label={content.nav.githubAria}`, href repo), primary CTA `<a href="#quickstart">` `bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800`. Hamburger (`md:hidden`, toggles `Menu`/`X`) opening a mobile dropdown (`absolute left-4 right-4 top-full rounded-2xl bg-white/80 backdrop-blur-xl ring-1 ring-gray-200`) listing the same links + toggle. Use local `useState` for open/close; immutable toggle.

- [ ] **Step 7: Update `App.tsx`**

```tsx
import { LanguageProvider } from './i18n/LanguageContext'
import { Navbar } from './components/Navbar'

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen font-sans text-gray-900 bg-white">
        <Navbar />
      </div>
    </LanguageProvider>
  )
}
```

- [ ] **Step 8: Verify + commit**

Run: `cd site && npm run typecheck && npx vitest run && npm run build`
```bash
git add site/src && git commit -m "feat(site): Logo, LangToggle, Navbar"
```

---

## Task 5: Hero + InstallPill (with CSS aurora background)

**Files:**
- Create: `site/src/components/InstallPill.tsx`, `site/src/components/Hero.tsx`
- Modify: `site/src/index.css` (aurora + dot-grid utilities), `site/src/App.tsx` (render `<Hero />`)

**Interfaces:**
- Consumes: `useContent()`, `CopyButton`.
- Produces: `<Hero />`, `<InstallPill command={string} />`.

- [ ] **Step 1: Add background utilities to `index.css`** (pure CSS, no images)

```css
@layer components {
  .hero-aurora {
    background:
      radial-gradient(50% 55% at 18% 12%, rgba(232,133,95,0.22), transparent 70%),
      radial-gradient(48% 52% at 84% 16%, rgba(79,134,247,0.20), transparent 70%),
      radial-gradient(60% 60% at 52% 0%, rgba(124,92,255,0.16), transparent 72%),
      #ffffff;
  }
  .dot-grid {
    background-image: radial-gradient(rgba(17,24,39,0.06) 1px, transparent 1px);
    background-size: 22px 22px;
  }
}
```

- [ ] **Step 2: Implement `InstallPill.tsx`** — pill `flex items-center gap-3 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200 pl-5 pr-1.5 py-1.5`, a `$` prompt span (`text-gray-400 font-mono`), the command (`font-mono text-sm text-gray-900 truncate`), and `<CopyButton text={command} className="text-gray-500 hover:text-gray-900 hover:bg-gray-900/5" />`.

- [ ] **Step 3: Implement `Hero.tsx`**

- Section: `relative overflow-hidden hero-aurora`. Inner absolute `dot-grid` layer `opacity-60 pointer-events-none`.
- Content `relative z-10 max-w-3xl mx-auto px-5 text-center pt-16 sm:pt-24 pb-20`.
- H1 two `<span class="block">` lines, `text-gray-900 font-normal leading-[1.05] tracking-tight text-[40px] sm:text-6xl lg:text-7xl`, each `animate-fade-up`, line 2 `[animation-delay:100ms]`. Text from `content.hero.titleLine1/2`.
- Subhead `<p>` `animate-fade-up [animation-delay:220ms] mt-5 text-gray-600 text-base sm:text-lg max-w-xl mx-auto`.
- `<InstallPill command={content.hero.installCommand} />` wrapper `animate-fade-up [animation-delay:340ms] mt-6 max-w-xl mx-auto`; under it a small `installHint` link to `#quickstart`.
- CTA row `animate-fade-up [animation-delay:460ms] mt-6 flex flex-wrap justify-center gap-3`: primary `<a href="#quickstart">` (`bg-gray-900 text-white ... rounded-full`), secondary `<a href={repo}>` with `lucide Github` icon (`ring-1 ring-gray-300 ...`). Labels from content.

- [ ] **Step 4: Render `<Hero />` after `<Navbar />` in `App.tsx`.**

- [ ] **Step 5: Verify + commit**

Run: `cd site && npm run build && npm run typecheck`. Manually `npm run dev` and confirm both languages render and the install command copies.
```bash
git add site/src && git commit -m "feat(site): Hero with CSS aurora background + InstallPill"
```

---

## Task 6: ScaledFrame + animated TerminalDemo (centerpiece)

**Files:**
- Create: `site/src/components/ScaledFrame.tsx`, `site/src/components/TerminalDemo.tsx`
- Modify: `site/src/App.tsx`

**Interfaces:**
- Consumes: `useContent().terminal`.
- Produces: `<ScaledFrame designWidth={number}>{children}</ScaledFrame>`, `<TerminalDemo />`.

- [ ] **Step 1: Implement `ScaledFrame.tsx`** — ResizeObserver scaler (from reference): renders children at fixed `designWidth` (default 880) and scales down via `transform: scale()` with `transformOrigin: 'top left'`; outer height = `inner.offsetHeight * scale`. Clean up observer on unmount.

```tsx
import { useEffect, useRef, useState, type ReactNode } from 'react'

export function ScaledFrame({ designWidth = 880, children }: { designWidth?: number; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number | undefined>()
  useEffect(() => {
    const o = outer.current, i = inner.current
    if (!o || !i) return
    const update = () => {
      const s = Math.min(1, o.clientWidth / designWidth)
      setScale(s)
      setHeight(i.offsetHeight * s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(o); ro.observe(i)
    return () => ro.disconnect()
  }, [designWidth])
  return (
    <div ref={outer} style={{ height }} className="w-full">
      <div ref={inner} style={{ width: designWidth, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Implement `TerminalDemo.tsx`**

- Window chrome: `rounded-xl overflow-hidden bg-[#1a1a1c] ring-1 ring-white/10 shadow-2xl text-left`. Title bar `bg-[#242427] px-4 py-2.5 flex items-center gap-2`: three traffic-light dots (`#ff5f57/#febc2e/#28c840`), centered `windowTitle` (`text-[11px] text-white/50`).
- Body `<div className="font-mono text-[13px] leading-relaxed p-4 space-y-1">` rendering `content.terminal.lines`. Color per `kind`: `command`→`text-white/90`, `meta`→`text-white/40`, `claude`→`text-claude`, `gemini`→`text-gemini`, `score`→`text-amber-300`, `approved`→`text-emerald-400 font-semibold`.
- **Animation:** reveal lines progressively. On mount, if `prefers-reduced-motion` → render all lines immediately. Else use a `useEffect` timer (immutably append indices, e.g. `setVisible(v => [...v, i])`) ~200ms apart; only render `lines.slice(0, count)`. No mutation of `lines`.
- Wrap in `<ScaledFrame>` inside a `relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto animate-hero-rise [animation-delay:300ms]` container.

- [ ] **Step 3: Render `<TerminalDemo />` below `<Hero />`** (slight negative top margin to overlap the hero base, e.g. `-mt-8 sm:-mt-12`).

- [ ] **Step 4: Verify + commit**

Run: `cd site && npm run build && npm run typecheck`. `npm run dev`: confirm lines animate in, then check `prefers-reduced-motion` (DevTools rendering emulation) shows all lines at once.
```bash
git add site/src && git commit -m "feat(site): ScaledFrame + animated TerminalDemo centerpiece"
```

---

## Task 7: How It Works (animated loop diagram)

**Files:**
- Create: `site/src/components/HowItWorks.tsx`
- Modify: `site/src/App.tsx`

**Interfaces:** Consumes `useContent().howItWorks`, `SectionReveal`. Produces `<HowItWorks />` with `id="how-it-works"`.

- [ ] **Step 1: Implement `HowItWorks.tsx`**

- `<section id="how-it-works" className="py-20 sm:py-28 px-5">`, centered heading + subheading from content (`SectionReveal`).
- Render the 6 `steps` as a connected flow: numbered nodes (`1..6`) with the step title/desc, connectors between them. Use a responsive layout — vertical on mobile, a wrapped horizontal stepper on `lg`. Highlight the loop-back from step 5 → step 3 with an accent arrow (`lucide RefreshCw` or a curved SVG) tinted with the claude→gemini gradient.
- Each node wrapped in `SectionReveal` with a staggered class delay (`[animation-delay:${i*80}ms]`).
- Use a small gradient text/border accent (`bg-gradient-to-r from-claude via-gemini-violet to-gemini`) on the node numbers or the loop arrow to carry the identity.

- [ ] **Step 2: Render `<HowItWorks />` after the terminal section.**

- [ ] **Step 3: Verify + commit**

Run: `cd site && npm run build`. `npm run dev`: both languages, anchor `#how-it-works` scrolls here, reveals fire.
```bash
git add site/src && git commit -m "feat(site): How It Works animated loop diagram"
```

---

## Task 8: Features grid

**Files:**
- Create: `site/src/components/Features.tsx`
- Modify: `site/src/App.tsx`

**Interfaces:** Consumes `useContent().features`, `SectionReveal`, `lucide-react`. Produces `<Features />` with `id="features"`.

- [ ] **Step 1: Implement `Features.tsx`** — dynamic lucide icon lookup

```tsx
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useContent } from '../i18n/useContent'
import { SectionReveal } from '../ui/SectionReveal'

export function Features() {
  const { features } = useContent()
  return (
    <section id="features" className="py-20 sm:py-28 px-5 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <SectionReveal className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight">{features.heading}</h2>
          <p className="mt-3 text-gray-600">{features.subheading}</p>
        </SectionReveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((f, i) => {
            const Icon = (Icons[f.icon as keyof typeof Icons] as LucideIcon) ?? Icons.Sparkles
            return (
              <SectionReveal key={i} className={`[animation-delay:${(i % 4) * 70}ms]`}>
                <div className="h-full rounded-2xl bg-white ring-1 ring-gray-200 p-5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-claude/15 to-gemini/15 text-gray-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-medium text-gray-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Render `<Features />` after How It Works.**

- [ ] **Step 3: Verify + commit**

Run: `cd site && npm run build && npm run typecheck`. Confirm all 8 icons resolve (no fallback Sparkles unexpectedly) in `npm run dev`.
```bash
git add site/src && git commit -m "feat(site): Features grid"
```

---

## Task 9: Quick Start + Usage/Options

**Files:**
- Create: `site/src/components/QuickStart.tsx`, `site/src/components/Usage.tsx`
- Modify: `site/src/App.tsx`

**Interfaces:** Consumes `useContent().quickStart` / `.usage`, `CodeBlock`, `SectionReveal`. Produces `<QuickStart />` (`id="quickstart"`), `<Usage />` (`id="usage"`).

- [ ] **Step 1: Implement `QuickStart.tsx`** — `<section id="quickstart" className="py-20 sm:py-28 px-5">`, heading, a prerequisites list (`prerequisitesLabel` + checelist of `prerequisites` with `lucide Check`), then the ordered `steps` each rendered with a step number + `<CodeBlock code={step.code} label={step.label} />`.

- [ ] **Step 2: Implement `Usage.tsx`** — `<section id="usage" ...>`: `examples` as `CodeBlock`s; an options table (`options`: columns Flag / Description / Default) styled `text-sm`, monospace flags; the review mechanism (`reviewHeading` + `reviewPoints` as a list). Semantic `<table>` with `<thead>`.

- [ ] **Step 3: Render `<QuickStart />` then `<Usage />` after Features.**

- [ ] **Step 4: Verify + commit**

Run: `cd site && npm run build`. `npm run dev`: copy buttons work; anchor `#quickstart` from navbar/hero scrolls here; table readable on mobile (horizontal scroll ok).
```bash
git add site/src && git commit -m "feat(site): Quick Start + Usage/Options sections"
```

---

## Task 10: Footer, favicon, final assembly + meta

**Files:**
- Create: `site/src/components/Footer.tsx`, `site/public/favicon.svg`
- Modify: `site/src/App.tsx` (final order + `scroll-smooth`), `site/index.html` (confirm meta/OG)

**Interfaces:** Consumes `useContent().footer`, `Logo`, `LangToggle`. Produces `<Footer />`.

- [ ] **Step 1: Implement `Footer.tsx`** — `<footer className="border-t border-gray-200 py-12 px-5">`: left `<Logo>` + `iterloop` + `footer.tagline`; a link list from `footer.links` (`text-sm text-gray-600 hover:text-gray-900`); `LangToggle`; a back-to-top link (`href="#top"`, `footer.backToTop`); `footer.madeBy`. All `href`s open external in new tab with `rel="noreferrer"`.

- [ ] **Step 2: Create `public/favicon.svg`** — the Logo mark on a transparent or rounded gradient tile (claude→gemini). Keep it a tiny standalone SVG.

- [ ] **Step 3: Finalize `App.tsx`**

```tsx
import { LanguageProvider } from './i18n/LanguageContext'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { TerminalDemo } from './components/TerminalDemo'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { QuickStart } from './components/QuickStart'
import { Usage } from './components/Usage'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <LanguageProvider>
      <div id="top" className="min-h-screen font-sans text-gray-900 bg-white scroll-smooth">
        <Navbar />
        <main>
          <Hero />
          <div className="-mt-8 sm:-mt-12 px-5"><TerminalDemo /></div>
          <HowItWorks />
          <Features />
          <QuickStart />
          <Usage />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
```
(Add `scroll-smooth` and `scroll-mt-20` on each `section` id target so the sticky navbar doesn't cover headings — add `scroll-mt-24` utility to each section wrapper.)

- [ ] **Step 4: Full verification**

Run:
```bash
cd ~/Desktop/iterloop-cli/site && npm run typecheck && npx vitest run && npm run build && npm run preview
```
Manual checklist (record results): both languages across all sections; every navbar/hero anchor scrolls correctly; all copy buttons work; options table; `prefers-reduced-motion` shows static terminal + no reveal jank; responsive at 375px / 768px / 1280px; no console errors; `dist/CNAME` == `iter-loop.com`.

- [ ] **Step 5: Commit**

```bash
git add site/ && git commit -m "feat(site): Footer, favicon, final page assembly"
```

---

## Task 11: GitHub Actions deploy workflow + Pages/DNS runbook

**Files:**
- Create: `.github/workflows/deploy-site.yml`, `docs/superpowers/plans/DEPLOY-RUNBOOK.md`

**Interfaces:** Produces a CI workflow that builds `site/` and deploys `site/dist` to Pages on push to `main`.

- [ ] **Step 1: Create `.github/workflows/deploy-site.yml`**

```yaml
name: Deploy site
on:
  push:
    branches: [main]
    paths: ['site/**', '.github/workflows/deploy-site.yml']
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: site/package-lock.json
      - run: npm ci
        working-directory: site
      - run: npm run build
        working-directory: site
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Generate `site/package-lock.json`** (required by `npm ci`)

Run: `cd site && npm install` (already run in T1; ensure `package-lock.json` exists and is committed).

- [ ] **Step 3: Validate workflow YAML**

Run: `cd ~/Desktop/iterloop-cli && (actionlint .github/workflows/deploy-site.yml 2>/dev/null || python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy-site.yml')); print('yaml ok')")`
Expected: `yaml ok` (or actionlint clean).

- [ ] **Step 4: Write `DEPLOY-RUNBOOK.md`** documenting the manual, access-gated steps (cannot be done from code):

```
1. Push branch & open PR; merge to main (or push site/ to main).
2. Repo Settings → Pages → Source = "GitHub Actions".
3. After first successful deploy: Settings → Pages → Custom domain = iter-loop.com → Save. Tick "Enforce HTTPS" once the cert is issued.
   (CNAME file already in dist guarantees the domain sticks across deploys.)
4. At the domain registrar for iter-loop.com, add DNS:
   A    @  185.199.108.153
   A    @  185.199.109.153
   A    @  185.199.110.153
   A    @  185.199.111.153
   AAAA @  2606:50c0:8000::153
   AAAA @  2606:50c0:8001::153
   AAAA @  2606:50c0:8002::153
   AAAA @  2606:50c0:8003::153
   (optional) CNAME www  lawrence3699.github.io
5. Verify: `dig +short iter-loop.com` shows the 4 A records; `curl -I https://iter-loop.com` returns 200 after propagation + cert issuance.
```

- [ ] **Step 5: Commit**

```bash
git add .github site/package-lock.json docs && git commit -m "ci(site): GitHub Actions Pages deploy + deploy runbook"
```

---

## Task 12: Go live (operational — gated on user confirmation)

> This task performs outward-facing actions (push to the user's GitHub, enable Pages). **Confirm with the user before pushing.** DNS edits are done by the user at their registrar.

**Steps:**

- [ ] **Step 1: Push branch & integrate** — push `feat/landing-site`, open PR to `main` (per user's git workflow), or fast-forward `main` if the user prefers. `gh pr create` with a summary of the site.
- [ ] **Step 2: Enable Pages via API** — `gh api -X POST repos/lawrence3699/iterloop/pages -f build_type=workflow` (or set Source=GitHub Actions in Settings). Trigger/confirm the `Deploy site` workflow run is green: `gh run watch`.
- [ ] **Step 3: Set custom domain** — `gh api -X PUT repos/lawrence3699/iterloop/pages -f cname=iter-loop.com -F https_enforced=true` (or via Settings → Pages). Confirm the live `*.github.io` URL serves the site first.
- [ ] **Step 4: Hand the DNS records to the user** (from the runbook) and wait for propagation.
- [ ] **Step 5: Verify live** — `curl -I https://iter-loop.com` → 200; spot-check both languages and the terminal animation in a browser; capture a screenshot for the user.

---

## Self-Review (completed by author)

- **Spec coverage:** §1 goal → T1/T10; §2 decisions → all tasks honor Global Constraints; §3 stack → T1; §4 visual identity → T1 (colors/keyframes), T5 (aurora), T6 (terminal); §5 sections 1–8 → T4,T5,T6,T7,T8,T9,T10; §6 copy → T2; §7 i18n → T2; §8 motion/a11y → T1 (reduced-motion CSS), T3 (SectionReveal), T6 (terminal); §9 file structure → File Structure + per-task Files; §10 deploy/DNS → T11/T12; §11 verification → per-task build/test + T10 manual checklist; §12 open items → noted (copy in T2, favicon T10, www optional in T11); §13 out-of-scope → not built.
- **Placeholder scan:** logic tasks (T2 resolver, T3 clipboard/CopyButton, T4 LangToggle) carry complete test+impl code; presentational components specify structure + exact Tailwind classes + content keys (consistent with spec's pragmatic verification, not vague "add styling").
- **Type consistency:** `Content` shape defined in T2 `types.ts`; all consumers (`useContent()`) use the same keys (`hero.ctaPrimary`, `features.items[].icon`, `terminal.lines[].kind`, `usage.options[].flag/desc/def`). `resolveInitialLang`, `copyText`, `ScaledFrame designWidth`, `SectionReveal as/className` signatures match across tasks.

---

## Execution Handoff

(Posted to the user after saving.)
