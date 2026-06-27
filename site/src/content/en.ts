import type { Content } from './types'

const REPO = 'https://github.com/lawrence3699/iterloop'

export const en: Content = {
  nav: {
    links: [
      { id: 'how-it-works', label: 'How it works' },
      { id: 'features', label: 'Features' },
      { id: 'quickstart', label: 'Quick start' },
    ],
    getStarted: 'Get Started',
    githubAria: 'View iterloop on GitHub',
  },
  hero: {
    titleLine1: 'Two AIs.',
    titleLine2: 'One quality loop.',
    subhead:
      'iterloop runs the Claude and Gemini CLIs in an iterative loop — Claude executes, Gemini scores and critiques, Claude revises — until the work earns a 9/10 or hits your round limit. No API keys.',
    installCommand: 'cgloop "Build a REST API with Express"',
    installHint: '↓ Install in under a minute',
    ctaPrimary: 'Get Started',
    ctaSecondary: 'View on GitHub',
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
    heading: 'How it works',
    subheading: 'A configurable loop where two AIs check each other until the output is good enough.',
    steps: [
      { title: 'You provide a task', desc: 'Describe what you want built or fixed, in plain language.' },
      { title: 'Preflight', desc: 'iterloop verifies the claude and gemini CLIs are available.' },
      { title: 'Claude executes', desc: 'Round 1 runs your task; later rounds add Gemini’s feedback.' },
      { title: 'Gemini reviews & scores', desc: 'A 1–10 score with concrete issues and suggestions.' },
      { title: 'Approve or loop back', desc: 'Score ≥ 9 ends early as APPROVED; otherwise feedback returns to Claude.' },
      { title: 'Final output', desc: 'You get the refined result once it passes or hits the round limit.' },
    ],
  },
  features: {
    heading: 'Everything you need, nothing you don’t',
    subheading: 'A focused tool that does one thing well.',
    items: [
      { icon: 'KeyRound', title: 'No API keys', desc: 'Runs entirely through the Claude and Gemini CLIs you already use — nothing to provision.' },
      { icon: 'Users', title: 'Dual-AI collaboration', desc: 'Claude executes, Gemini reviews — two models checking each other’s work.' },
      { icon: 'Gauge', title: 'Score-driven early stop', desc: 'The loop ends the moment Gemini returns a 9/10 APPROVED verdict.' },
      { icon: 'Repeat', title: 'Configurable rounds', desc: 'Set the maximum number of iterations with -n (default 3).' },
      { icon: 'FolderOpen', title: 'Any working directory', desc: 'Point both CLIs at any project with -d.' },
      { icon: 'Radio', title: 'Live streaming', desc: 'Watch both CLIs work in real time with -v.' },
      { icon: 'Clock', title: 'Patient by design', desc: 'Up to a 1-hour timeout per call for deep, long-running tasks.' },
      { icon: 'Scale', title: 'MIT licensed', desc: 'Free and open source — read it, fork it, ship it.' },
    ],
  },
  quickStart: {
    heading: 'Quick start',
    subheading: 'From clone to your first loop in under a minute.',
    prerequisitesLabel: 'Prerequisites',
    prerequisites: [
      'Node.js ≥ 18',
      'Claude CLI — installed & authenticated',
      'Gemini CLI — installed & authenticated',
    ],
    steps: [
      { label: 'Clone the repo', code: 'git clone https://github.com/lawrence3699/iterloop.git' },
      { label: 'Install dependencies', code: 'cd iterloop && npm install' },
      { label: 'Run it (development)', code: 'npx tsx src/index.ts "Write a quicksort in Python"' },
      { label: 'Build & link globally', code: 'npm run build && npm link' },
      { label: 'Use it anywhere', code: 'cgloop "Build a REST API with Express"' },
    ],
  },
  usage: {
    heading: 'Usage & options',
    subheading: 'Tune the loop to the task.',
    examplesLabel: 'Examples',
    examples: [
      { label: 'Basic (3 iterations)', code: 'cgloop "Write a quicksort implementation in Python"' },
      { label: 'More iterations', code: 'cgloop -n 5 "Build a REST API with Express"' },
      { label: 'Target a project directory', code: 'cgloop -d ./my-project "Fix the authentication bug"' },
      { label: 'Stream real-time output', code: 'cgloop -v "Refactor the database module"' },
    ],
    optionsLabel: 'Options',
    options: [
      { flag: '-n, --iterations <n>', desc: 'Maximum number of iteration rounds', def: '3' },
      { flag: '-d, --dir <path>', desc: 'Working directory for Claude and Gemini', def: 'current dir' },
      { flag: '-v, --verbose', desc: 'Stream real-time output as the CLIs run', def: 'off' },
      { flag: '-h, --help', desc: 'Show help', def: '—' },
    ],
    reviewHeading: 'How the review works',
    reviewPoints: [
      'Score — an overall 1–10 quality rating',
      'Issues — problems found in the output',
      'Suggestions — specific corrections to make',
      'Verdict — APPROVED when the score reaches 9, ending the loop early',
    ],
  },
  footer: {
    tagline: 'Claude × Gemini iterative collaboration, on the command line.',
    links: [
      { label: 'GitHub', href: REPO },
      { label: 'README', href: `${REPO}#readme` },
      { label: '中文 README', href: `${REPO}/blob/main/README_CN.md` },
      { label: 'MIT License', href: `${REPO}#license` },
      { label: 'Claude CLI', href: 'https://docs.anthropic.com/en/docs/claude-code' },
      { label: 'Gemini CLI', href: 'https://github.com/anthropics/gemini-cli' },
    ],
    backToTop: 'Back to top',
    madeBy: 'Built by lawrence3699',
  },
}
