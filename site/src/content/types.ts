export type Lang = 'en' | 'zh'

export interface NavLink {
  id: string // 'how-it-works' | 'features' | 'quickstart'
  label: string
}
export interface NavContent {
  links: NavLink[]
  getStarted: string
  githubAria: string
}

export interface HeroContent {
  titleLine1: string
  titleLine2: string
  subhead: string
  installCommand: string
  installHint: string
  ctaPrimary: string
  ctaSecondary: string
}

export type TerminalLineKind = 'command' | 'meta' | 'claude' | 'gemini' | 'score' | 'approved'
export interface TerminalLine {
  kind: TerminalLineKind
  text: string
}
export interface TerminalContent {
  windowTitle: string
  lines: TerminalLine[]
}

export interface StepItem {
  title: string
  desc: string
}
export interface HowItWorksContent {
  heading: string
  subheading: string
  steps: StepItem[]
}

export interface FeatureItem {
  icon: string // lucide-react icon name
  title: string
  desc: string
}
export interface FeaturesContent {
  heading: string
  subheading: string
  items: FeatureItem[]
}

export interface QuickStartStep {
  label: string
  code: string
}
export interface QuickStartContent {
  heading: string
  subheading: string
  prerequisitesLabel: string
  prerequisites: string[]
  steps: QuickStartStep[]
}

export interface UsageExample {
  label: string
  code: string
}
export interface UsageOption {
  flag: string
  desc: string
  def: string
}
export interface UsageContent {
  heading: string
  subheading: string
  examplesLabel: string
  examples: UsageExample[]
  optionsLabel: string
  options: UsageOption[]
  reviewHeading: string
  reviewPoints: string[]
}

export interface FooterLink {
  label: string
  href: string
}
export interface FooterContent {
  tagline: string
  links: FooterLink[]
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
