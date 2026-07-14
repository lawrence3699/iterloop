import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleGauge,
  ClipboardCheck,
  Code2,
  FileText,
  GitFork,
  KeyRound,
  Languages,
  Menu,
  RadioTower,
  ShieldCheck,
  UserRoundPlus,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { CONTENT, type Locale } from './content'

const CONSOLE_URL = 'https://console.iter-loop.com'
const API_URL = 'https://api.iter-loop.com/v1'
const GITHUB_URL = 'https://github.com/lawrence3699/iterloop-api'

function getInitialLocale(): Locale {
  try {
    const saved = window.localStorage.getItem('iterloop-locale')
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    // Local storage can be unavailable in privacy-focused browser modes.
  }
  return 'zh'
}

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span />
      <span />
    </span>
  )
}

function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)
  const [menuOpen, setMenuOpen] = useState(false)
  const copy = CONTENT[locale]

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    document.title = copy.meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', copy.meta.description)
    try {
      window.localStorage.setItem('iterloop-locale', locale)
    } catch {
      // The language still works for this visit when persistence is blocked.
    }
  }, [copy.meta.description, copy.meta.title, locale])

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale)
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" onClick={closeMenu}>
            <LogoMark />
            <span>IterLoop API</span>
          </a>

          <nav className="desktop-nav" aria-label={copy.nav.aria}>
            <a href="#capabilities">{copy.nav.capabilities}</a>
            <a href="#pricing">{copy.nav.pricing}</a>
            <a href={`${CONSOLE_URL}/docs`}>{copy.nav.docs}</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </nav>

          <div className="header-actions">
            <div className="language-switch" aria-label={copy.language.label}>
              <Languages size={16} aria-hidden="true" />
              <button
                type="button"
                className={locale === 'zh' ? 'is-active' : ''}
                onClick={() => changeLocale('zh')}
                aria-pressed={locale === 'zh'}
              >
                中文
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                className={locale === 'en' ? 'is-active' : ''}
                onClick={() => changeLocale('en')}
                aria-pressed={locale === 'en'}
              >
                EN
              </button>
            </div>
            <a className="header-sign-in" href={`${CONSOLE_URL}/sign-in`}>
              {copy.nav.signIn}
            </a>
            <a className="button button-primary button-compact" href={`${CONSOLE_URL}/sign-up`}>
              {copy.nav.register}
            </a>
            <button
              type="button"
              className="menu-button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? copy.nav.closeMenu : copy.nav.openMenu}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-language-row">
              <span>
                <Languages size={17} aria-hidden="true" />
                {copy.language.label}
              </span>
              <div className="mobile-language-actions">
                <button
                  type="button"
                  className={locale === 'zh' ? 'is-active' : ''}
                  onClick={() => changeLocale('zh')}
                  aria-pressed={locale === 'zh'}
                >
                  中文
                </button>
                <button
                  type="button"
                  className={locale === 'en' ? 'is-active' : ''}
                  onClick={() => changeLocale('en')}
                  aria-pressed={locale === 'en'}
                >
                  English
                </button>
              </div>
            </div>
            <nav aria-label={copy.nav.aria}>
              <a href="#capabilities" onClick={closeMenu}>
                {copy.nav.capabilities}
              </a>
              <a href="#pricing" onClick={closeMenu}>
                {copy.nav.pricing}
              </a>
              <a href={`${CONSOLE_URL}/docs`} onClick={closeMenu}>
                {copy.nav.docs}
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>
                GitHub
              </a>
            </nav>
            <div className="mobile-menu-actions">
              <a className="button button-secondary" href={`${CONSOLE_URL}/sign-in`}>
                {copy.nav.signIn}
              </a>
              <a className="button button-primary" href={`${CONSOLE_URL}/sign-up`}>
                {copy.nav.register}
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="page-width hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <RadioTower size={16} aria-hidden="true" />
                {copy.hero.eyebrow}
              </div>
              <h1>
                <span>{copy.hero.title}</span>
                <strong>{copy.hero.accent}</strong>
              </h1>
              <p className="hero-lead">{copy.hero.lead}</p>
              <div className="hero-actions">
                <a className="button button-primary" href={`${CONSOLE_URL}/sign-up`}>
                  {copy.hero.primaryAction}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a className="button button-secondary" href="#pricing">
                  <CircleGauge size={17} aria-hidden="true" />
                  {copy.hero.secondaryAction}
                </a>
              </div>
              <div className="hero-trust" aria-label={copy.hero.protocolsLabel}>
                <span>{copy.hero.protocolsLabel}</span>
                <strong>OpenAI Responses</strong>
                <strong>Anthropic Messages</strong>
                <strong>HTTP / SSE</strong>
              </div>
            </div>

            <figure className="hero-product-media">
              <figcaption>
                <span>{copy.hero.imageLabel}</span>
                <strong>
                  <span className="status-dot" aria-hidden="true" />
                  {copy.hero.imageStatus}
                </strong>
              </figcaption>
              <img src="/iterloop-console-issuance.jpg" alt={copy.hero.imageAlt} />
            </figure>
          </div>
        </section>

        <section className="metric-band" aria-label={copy.metrics.aria}>
          <div className="page-width metric-grid">
            {copy.metrics.items.map((item) => (
              <div className="metric-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="capabilities">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <span className="section-index">01</span>
                <p className="section-kicker">{copy.capabilities.kicker}</p>
              </div>
              <h2>{copy.capabilities.title}</h2>
              <p>{copy.capabilities.description}</p>
            </div>

            <div className="feature-list">
              {copy.capabilities.items.map((item, index) => {
                const icons = [KeyRound, CircleGauge, ShieldCheck]
                const Icon = icons[index] ?? KeyRound
                return (
                  <article className="feature-row" key={item.title}>
                    <span className="feature-icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <ChevronRight size={18} aria-hidden="true" />
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section section-soft" id="pricing">
          <div className="page-width">
            <div className="section-heading pricing-heading">
              <div>
                <span className="section-index">02</span>
                <p className="section-kicker">{copy.pricing.kicker}</p>
              </div>
              <h2>{copy.pricing.title}</h2>
              <p>{copy.pricing.description}</p>
            </div>

            <div className="pricing-table" role="table" aria-label={copy.pricing.tableLabel}>
              <div className="pricing-row pricing-header" role="row">
                <span role="columnheader">{copy.pricing.columns.model}</span>
                <span role="columnheader">{copy.pricing.columns.provider}</span>
                <span role="columnheader">{copy.pricing.columns.protocol}</span>
                <span role="columnheader">{copy.pricing.columns.ratio}</span>
              </div>
              {copy.pricing.models.map((model) => (
                <div className="pricing-row" role="row" key={model.name}>
                  <code role="cell">{model.name}</code>
                  <span role="cell">{model.provider}</span>
                  <span role="cell">{model.protocol}</span>
                  <strong role="cell">{model.ratio}</strong>
                </div>
              ))}
            </div>
            <div className="pricing-note">
              <Check size={17} aria-hidden="true" />
              <span>{copy.pricing.note}</span>
              <a href={`${CONSOLE_URL}/pricing`}>
                {copy.pricing.action}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="section onboarding-section" id="onboarding">
          <div className="page-width">
            <div className="section-heading onboarding-heading">
              <div>
                <span className="section-index">03</span>
                <p className="section-kicker">{copy.onboarding.kicker}</p>
              </div>
              <h2>{copy.onboarding.title}</h2>
              <p>{copy.onboarding.description}</p>
            </div>

            <div className="onboarding-grid">
              {copy.onboarding.items.map((item, index) => {
                const icons = [UserRoundPlus, KeyRound, ClipboardCheck]
                const Icon = icons[index] ?? ClipboardCheck
                return (
                  <article className="onboarding-step" key={item.title}>
                    <div className="onboarding-step-heading">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <Icon size={21} aria-hidden="true" />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                )
              })}
            </div>

            <a className="onboarding-link" href={`${CONSOLE_URL}/docs`}>
              <BookOpen size={17} aria-hidden="true" />
              {copy.onboarding.action}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="section docs-section" id="docs">
          <div className="page-width docs-grid">
            <div className="docs-copy">
              <span className="section-index">04</span>
              <p className="section-kicker">{copy.docs.kicker}</p>
              <h2>{copy.docs.title}</h2>
              <p>{copy.docs.description}</p>
              <div className="docs-links">
                <a href={`${CONSOLE_URL}/docs`}>
                  <FileText size={18} aria-hidden="true" />
                  {copy.docs.openDocs}
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                  <GitFork size={18} aria-hidden="true" />
                  {copy.docs.openSource}
                </a>
              </div>
            </div>
            <div className="code-panel" aria-label={copy.docs.codeLabel}>
              <div className="code-panel-header">
                <span>config.toml</span>
                <span>Codex</span>
              </div>
              <pre>{`model_provider = "iterloop"
supports_websockets = false

[model_providers.iterloop]
base_url = "${API_URL}"
wire_api = "responses"
requires_openai_auth = true`}</pre>
            </div>
          </div>
        </section>

        <section className="supply-section">
          <div className="page-width supply-grid">
            <div className="supply-copy">
              <p className="section-kicker">{copy.supply.kicker}</p>
              <h2>{copy.supply.title}</h2>
              <p>{copy.supply.description}</p>
            </div>
            <div className="supply-list">
              {copy.supply.models.map((item) => (
                <div className="supply-row" key={item.family}>
                  <span className="supply-family">
                    <Activity size={18} aria-hidden="true" />
                    {item.family}
                  </span>
                  <code>{item.models}</code>
                  <strong>
                    <span className="status-dot" aria-hidden="true" />
                    {copy.supply.status}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="page-width cta-inner">
            <div>
              <Code2 size={26} aria-hidden="true" />
              <h2>{copy.cta.title}</h2>
              <p>{copy.cta.description}</p>
            </div>
            <a className="button button-primary" href={`${CONSOLE_URL}/sign-up`}>
              {copy.cta.action}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <div className="footer-brand">
            <LogoMark />
            <div>
              <strong>IterLoop API</strong>
              <span>{copy.footer.tagline}</span>
            </div>
          </div>
          <nav aria-label={copy.footer.aria}>
            <a href={`${CONSOLE_URL}/pricing`}>{copy.nav.pricing}</a>
            <a href={`${CONSOLE_URL}/docs`}>{copy.nav.docs}</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              AGPL Source
            </a>
          </nav>
          <span className="footer-domain">iter-loop.com</span>
        </div>
      </footer>
    </div>
  )
}

export default App
