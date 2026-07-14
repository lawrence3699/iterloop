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
    lead: string
    primaryAction: string
    secondaryAction: string
    protocolsLabel: string
  }
  preview: {
    status: string
    navigation: string[]
    workspace: string
    title: string
    active: string
    metrics: { label: string; value: string }[]
    issueTitle: string
    profile: string
    fields: { label: string; value: string }[]
    delivery: string
    ready: string
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
      capabilities: '平台能力',
      pricing: '模型价格',
      docs: '开发文档',
      signIn: '登录',
      register: '注册',
      openMenu: '打开菜单',
      closeMenu: '关闭菜单',
    },
    hero: {
      eyebrow: '统一的 Codex 与 Claude API 平台',
      lead: '用一个稳定入口管理模型访问、余额、API Key 和调用记录。权限清晰，配置直接交付，适合个人与团队持续使用。',
      primaryAction: '注册获取 API',
      secondaryAction: '查看开发文档',
      protocolsLabel: '兼容协议',
    },
    preview: {
      status: '上游运行正常',
      navigation: ['概览', 'API Key', '调用日志', 'API 发放', '上游健康'],
      workspace: '管理工作区',
      title: 'API 发放',
      active: '183 个存活账号',
      metrics: [
        { label: '存活账号', value: '183' },
        { label: '5 小时剩余', value: '78%' },
        { label: '周剩余', value: '64%' },
        { label: '异常账号', value: '3' },
      ],
      issueTitle: '发放访问权限',
      profile: '混合标准方案',
      fields: [
        { label: '接收邮箱', value: 'client@example.com' },
        { label: '账户余额', value: '¥ 3,000.00' },
        { label: '有效期', value: '90 天' },
      ],
      delivery: '客户交付预览',
      ready: '已就绪',
    },
    metrics: {
      aria: '平台兼容能力',
      items: [
        { label: '兼容接口', value: 'Responses · Chat · Messages' },
        { label: '传输方式', value: 'HTTP · SSE' },
        { label: 'Key 策略', value: '模型 · IP · 有效期' },
        { label: '用量记录', value: 'Token · 费用 · Request ID' },
      ],
    },
    capabilities: {
      kicker: '平台能力',
      title: 'API 的权限、用量和交付，在同一个控制台完成。',
      description: '为不同用户发放不同范围的 Key，并持续掌握每一次调用的状态和费用。',
      items: [
        { title: '精细权限', description: '支持仅 Claude、仅 Codex 或混合 Key，并限制模型、IP、额度与有效期。' },
        { title: '透明用量', description: '查看请求量、Token、延迟、费用、错误和 Request ID，不保存提示词与响应正文。' },
        { title: '隔离管理', description: '用户控制台、模型接口与管理后台按域名和角色隔离，降低误操作风险。' },
      ],
    },
    pricing: {
      kicker: '模型价格',
      title: '按模型计费，规则简单透明。',
      description: '账户余额统一管理，混合 Key 会根据实际请求的模型系列应用对应倍率。',
      tableLabel: 'IterLoop API 模型价格',
      columns: { model: '模型', provider: '系列', protocol: '兼容接口', ratio: '标准倍率' },
      models: [
        { name: 'gpt-5.5', provider: 'Codex', protocol: 'Responses', ratio: '0.4x' },
        { name: 'gpt-5.6-sol', provider: 'Codex', protocol: 'Responses', ratio: '0.4x' },
        { name: 'claude-sonnet-4-6', provider: 'Claude', protocol: 'Messages', ratio: '0.7x' },
      ],
      note: '新模型完成上游可用性与计费验证后才会开放。',
      action: '查看完整价格',
    },
    docs: {
      kicker: '快速接入',
      title: '保持原来的客户端，只替换 API 配置。',
      description: '支持 Codex CLI、Claude Code 和常用 OpenAI SDK。控制台会为每个 Key 生成可直接使用的配置。',
      openDocs: '打开开发文档',
      openSource: '查看 AGPL 源码',
      codeLabel: 'Codex 配置示例',
    },
    cta: {
      title: '创建账户，开始使用统一 AI API。',
      description: '注册后可管理余额、创建 Key、查看日志并获取客户端配置。',
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
      capabilities: 'Platform',
      pricing: 'Pricing',
      docs: 'Docs',
      signIn: 'Sign in',
      register: 'Register',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    hero: {
      eyebrow: 'One API platform for Codex and Claude',
      lead: 'Manage model access, balances, API keys, and request history through one stable endpoint. Clear permissions and delivery-ready configuration for individuals and teams.',
      primaryAction: 'Create API account',
      secondaryAction: 'Read the docs',
      protocolsLabel: 'Protocols',
    },
    preview: {
      status: 'Upstream healthy',
      navigation: ['Overview', 'API Keys', 'Usage logs', 'Issuance', 'Upstream'],
      workspace: 'Admin workspace',
      title: 'API issuance',
      active: '183 active accounts',
      metrics: [
        { label: 'Active accounts', value: '183' },
        { label: '5-hour remaining', value: '78%' },
        { label: 'Weekly remaining', value: '64%' },
        { label: 'Error accounts', value: '3' },
      ],
      issueTitle: 'Issue access',
      profile: 'Combined standard',
      fields: [
        { label: 'Recipient email', value: 'client@example.com' },
        { label: 'Account balance', value: '¥ 3,000.00' },
        { label: 'Expires', value: '90 days' },
      ],
      delivery: 'Client delivery preview',
      ready: 'Ready',
    },
    metrics: {
      aria: 'Platform compatibility',
      items: [
        { label: 'Endpoints', value: 'Responses · Chat · Messages' },
        { label: 'Transport', value: 'HTTP · SSE' },
        { label: 'Key policy', value: 'Model · IP · Expiry' },
        { label: 'Usage records', value: 'Tokens · Cost · Request ID' },
      ],
    },
    capabilities: {
      kicker: 'Platform capabilities',
      title: 'Permissions, usage, and delivery in one console.',
      description: 'Issue keys with different access scopes and keep every request, status, and cost visible.',
      items: [
        { title: 'Scoped credentials', description: 'Create Claude-only, Codex-only, or combined keys with model, IP, quota, and expiry limits.' },
        { title: 'Visible consumption', description: 'Inspect requests, tokens, latency, cost, errors, and Request IDs without storing prompts or response bodies.' },
        { title: 'Isolated operations', description: 'Separate the user console, model traffic, and administration by hostname and role.' },
      ],
    },
    pricing: {
      kicker: 'Model pricing',
      title: 'Simple model-level billing.',
      description: 'Balances are managed in one place. Combined keys apply the ratio of the model family actually requested.',
      tableLabel: 'IterLoop API model pricing',
      columns: { model: 'Model', provider: 'Family', protocol: 'Endpoint', ratio: 'Standard ratio' },
      models: [
        { name: 'gpt-5.5', provider: 'Codex', protocol: 'Responses', ratio: '0.4x' },
        { name: 'gpt-5.6-sol', provider: 'Codex', protocol: 'Responses', ratio: '0.4x' },
        { name: 'claude-sonnet-4-6', provider: 'Claude', protocol: 'Messages', ratio: '0.7x' },
      ],
      note: 'New models are enabled only after upstream availability and billing are verified.',
      action: 'View full pricing',
    },
    docs: {
      kicker: 'Quick integration',
      title: 'Keep your client. Replace the API configuration.',
      description: 'Works with Codex CLI, Claude Code, and common OpenAI SDKs. The console generates ready-to-use configuration for every key.',
      openDocs: 'Open documentation',
      openSource: 'View AGPL source',
      codeLabel: 'Codex configuration example',
    },
    cta: {
      title: 'Create an account and use one AI API.',
      description: 'Manage balances, create keys, inspect logs, and generate client configuration after registration.',
      action: 'Open console',
    },
    footer: { aria: 'Footer navigation', tagline: 'One API platform for Codex and Claude' },
  },
}
