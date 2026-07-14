export type Locale = 'zh' | 'en'

type SiteContent = {
  meta: { title: string; description: string }
  language: { label: string }
  nav: {
    aria: string
    capabilities: string
    pricing: string
    docs: string
    signIn: string
    register: string
    openMenu: string
    closeMenu: string
  }
  hero: {
    eyebrow: string
    title: string
    accent: string
    lead: string
    primaryAction: string
    secondaryAction: string
    protocolsLabel: string
    imageAlt: string
    imageLabel: string
    imageStatus: string
  }
  metrics: {
    aria: string
    items: { label: string; value: string }[]
  }
  capabilities: {
    kicker: string
    title: string
    description: string
    items: { title: string; description: string }[]
  }
  onboarding: {
    kicker: string
    title: string
    description: string
    items: { title: string; description: string }[]
    action: string
  }
  pricing: {
    kicker: string
    title: string
    description: string
    tableLabel: string
    columns: { model: string; provider: string; protocol: string; ratio: string }
    models: { name: string; provider: string; protocol: string; ratio: string }[]
    note: string
    action: string
  }
  docs: {
    kicker: string
    title: string
    description: string
    openDocs: string
    openSource: string
    codeLabel: string
  }
  supply: {
    kicker: string
    title: string
    description: string
    status: string
    models: { family: string; models: string }[]
  }
  cta: { title: string; description: string; action: string }
  footer: { aria: string; tagline: string }
}

export const CONTENT: Record<Locale, SiteContent> = {
  zh: {
    meta: {
      title: 'IterLoop API - Codex 与 Claude 统一 API 平台',
      description: '通过统一 API 使用 Codex 与 Claude，集中管理余额、API Key、调用日志与访问策略。',
    },
    language: { label: '选择语言' },
    nav: {
      aria: '主导航',
      capabilities: '为什么选择',
      pricing: '价格',
      docs: '文档',
      signIn: '登录',
      register: '注册',
      openMenu: '打开菜单',
      closeMenu: '关闭菜单',
    },
    hero: {
      eyebrow: '统一 AI API 网关',
      title: '一个入口，用好',
      accent: 'Codex 与 Claude',
      lead: '充值余额、创建 API Key、复制客户端配置，几分钟内完成接入。Responses、Chat 与 Messages 使用同一个平台管理。',
      primaryAction: '立即开始',
      secondaryAction: '查看价格',
      protocolsLabel: '兼容接口',
      imageAlt: 'IterLoop API 发放与客户端配置控制台',
      imageLabel: '真实控制台界面',
      imageStatus: 'Codex 与 Claude 已验证',
    },
    metrics: {
      aria: '平台兼容能力',
      items: [
        { label: '统一入口', value: 'Responses · Chat · Messages' },
        { label: '流式输出', value: 'HTTP · SSE' },
        { label: 'Key 控制', value: '模型 · IP · 额度 · 有效期' },
        { label: '用量明细', value: 'Token · 费用 · Request ID' },
      ],
    },
    capabilities: {
      kicker: '新用户接入',
      title: '从注册到发出第一条请求，路径足够直接。',
      description: '控制台把余额、密钥、客户端配置和调用记录放在同一个工作区，不需要反复切换系统。',
      items: [
        { title: '按需求创建 Key', description: '可选择仅 Codex、仅 Claude 或混合访问，并限制模型、IP、额度与有效期。' },
        { title: '配置直接交付', description: '为 Codex CLI、Claude Code 和 OpenAI SDK 生成可直接使用的 Base URL 与配置。' },
        { title: '每次调用可追踪', description: '集中查看 Token、费用、延迟、错误与 Request ID，不保存提示词和响应正文。' },
      ],
    },
    onboarding: {
      kicker: '三步接入',
      title: '不超过几分钟，就能开始调用。',
      description: '保留你熟悉的客户端，只替换 API 地址和 Key。',
      items: [
        { title: '注册并充值', description: '创建 IterLoop 账户，通过余额或兑换码获得可用额度。' },
        { title: '创建 API Key', description: '选择模型范围、有效期和访问策略，生成独立凭据。' },
        { title: '复制配置', description: '将控制台生成的配置放入 Codex、Claude Code 或 SDK。' },
      ],
      action: '打开接入文档',
    },
    pricing: {
      kicker: '按量价格',
      title: '实际调用多少，就从余额扣多少。',
      description: '混合 Key 会根据请求的模型系列应用对应倍率，价格与调用记录可以在控制台核对。',
      tableLabel: 'IterLoop API 模型价格',
      columns: { model: '模型', provider: '系列', protocol: '兼容接口', ratio: '标准倍率' },
      models: [
        { name: 'gpt-5.5', provider: 'Codex', protocol: 'Responses', ratio: '0.4x' },
        { name: 'gpt-5.4', provider: 'Codex', protocol: 'Responses / Chat', ratio: '0.4x' },
        { name: 'claude-sonnet-4-6', provider: 'Claude', protocol: 'Messages', ratio: '0.7x' },
        { name: 'claude-opus-4-6', provider: 'Claude', protocol: 'Messages', ratio: '0.7x' },
        { name: 'claude-haiku-4-5-20251001', provider: 'Claude', protocol: 'Messages', ratio: '0.7x' },
      ],
      note: '余额按实际 API 用量扣减，新模型通过可用性与计费验证后开放。',
      action: '查看完整价格',
    },
    docs: {
      kicker: '开发文档',
      title: '沿用原来的工具，只替换 API 配置。',
      description: '文档提供 Codex、Claude Code、curl 和常用 SDK 的配置示例，以及错误排查和模型列表。',
      openDocs: '打开开发文档',
      openSource: '查看 AGPL 源码',
      codeLabel: 'Codex 配置示例',
    },
    supply: {
      kicker: '当前供应',
      title: '主流 Codex 与 Claude 模型已经完成上游验证。',
      description: '模型是否开放以控制台实时列表为准，新增模型会先完成可用性和计费测试。',
      status: '已验证',
      models: [
        { family: 'OpenAI / Codex', models: 'gpt-5.4 · gpt-5.5' },
        { family: 'Anthropic / Claude', models: 'Sonnet 4.6 · Opus 4.6 · Haiku 4.5' },
      ],
    },
    cta: {
      title: '现在创建账户，开始调用统一 AI API。',
      description: '创建 Key 后即可获得 Base URL 与客户端配置。',
      action: '进入控制台',
    },
    footer: { aria: '页脚导航', tagline: 'Codex 与 Claude 统一 API 平台' },
  },
  en: {
    meta: {
      title: 'IterLoop API - One API for Codex and Claude',
      description: 'Use Codex and Claude through one API with managed balances, scoped keys, usage logs, and access policies.',
    },
    language: { label: 'Select language' },
    nav: {
      aria: 'Primary navigation',
      capabilities: 'Why IterLoop',
      pricing: 'Pricing',
      docs: 'Docs',
      signIn: 'Sign in',
      register: 'Register',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    hero: {
      eyebrow: 'Unified AI API gateway',
      title: 'One endpoint for',
      accent: 'Codex and Claude',
      lead: 'Fund a balance, create an API key, and copy a client configuration. Responses, Chat, and Messages are managed from one platform.',
      primaryAction: 'Get started',
      secondaryAction: 'View pricing',
      protocolsLabel: 'Compatible endpoints',
      imageAlt: 'IterLoop API issuance and client configuration console',
      imageLabel: 'Real console interface',
      imageStatus: 'Codex and Claude verified',
    },
    metrics: {
      aria: 'Platform compatibility',
      items: [
        { label: 'One endpoint', value: 'Responses · Chat · Messages' },
        { label: 'Streaming', value: 'HTTP · SSE' },
        { label: 'Key controls', value: 'Model · IP · Quota · Expiry' },
        { label: 'Usage detail', value: 'Tokens · Cost · Request ID' },
      ],
    },
    capabilities: {
      kicker: 'New user flow',
      title: 'A direct path from registration to the first request.',
      description: 'Balances, credentials, client configuration, and request records live in one workspace.',
      items: [
        { title: 'Create the right key', description: 'Choose Codex-only, Claude-only, or combined access with model, IP, quota, and expiry controls.' },
        { title: 'Deliver ready configuration', description: 'Generate Base URLs and settings for Codex CLI, Claude Code, and OpenAI-compatible SDKs.' },
        { title: 'Trace every request', description: 'Inspect tokens, cost, latency, errors, and Request IDs without storing prompts or response bodies.' },
      ],
    },
    onboarding: {
      kicker: 'Three steps',
      title: 'Start calling models in a few minutes.',
      description: 'Keep the client you already use and replace only the API endpoint and key.',
      items: [
        { title: 'Register and fund', description: 'Create an IterLoop account and add usable balance through funding or a redemption code.' },
        { title: 'Create an API key', description: 'Select models, expiry, and access policy to generate an isolated credential.' },
        { title: 'Copy the configuration', description: 'Use the generated setup in Codex, Claude Code, curl, or your SDK.' },
      ],
      action: 'Open onboarding docs',
    },
    pricing: {
      kicker: 'Usage pricing',
      title: 'Your balance follows actual API usage.',
      description: 'Combined keys apply the ratio of the model family requested, with every charge visible in the console.',
      tableLabel: 'IterLoop API model pricing',
      columns: { model: 'Model', provider: 'Family', protocol: 'Endpoint', ratio: 'Standard ratio' },
      models: [
        { name: 'gpt-5.5', provider: 'Codex', protocol: 'Responses', ratio: '0.4x' },
        { name: 'gpt-5.4', provider: 'Codex', protocol: 'Responses / Chat', ratio: '0.4x' },
        { name: 'claude-sonnet-4-6', provider: 'Claude', protocol: 'Messages', ratio: '0.7x' },
        { name: 'claude-opus-4-6', provider: 'Claude', protocol: 'Messages', ratio: '0.7x' },
        { name: 'claude-haiku-4-5-20251001', provider: 'Claude', protocol: 'Messages', ratio: '0.7x' },
      ],
      note: 'Balances are deducted from real API usage. New models open after availability and billing verification.',
      action: 'View full pricing',
    },
    docs: {
      kicker: 'Documentation',
      title: 'Keep your tools and replace the API configuration.',
      description: 'Documentation covers Codex, Claude Code, curl, common SDKs, troubleshooting, and the available model list.',
      openDocs: 'Open documentation',
      openSource: 'View AGPL source',
      codeLabel: 'Codex configuration example',
    },
    supply: {
      kicker: 'Current supply',
      title: 'Core Codex and Claude models have passed upstream checks.',
      description: 'The live console model list is authoritative. New models are tested for availability and billing first.',
      status: 'Verified',
      models: [
        { family: 'OpenAI / Codex', models: 'gpt-5.4 · gpt-5.5' },
        { family: 'Anthropic / Claude', models: 'Sonnet 4.6 · Opus 4.6 · Haiku 4.5' },
      ],
    },
    cta: {
      title: 'Create an account and start using one AI API.',
      description: 'Every key includes a Base URL and ready-to-use client configuration.',
      action: 'Open console',
    },
    footer: { aria: 'Footer navigation', tagline: 'One API platform for Codex and Claude' },
  },
}
