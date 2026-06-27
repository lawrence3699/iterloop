import { Github } from 'lucide-react'
import { useContent } from '../i18n/useContent'
import { InstallPill } from './InstallPill'

const REPO = 'https://github.com/lawrence3699/iterloop'

export function Hero() {
  const { hero } = useContent()
  return (
    <section className="hero-aurora relative overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-16 text-center sm:pt-24">
        <h1 className="font-normal leading-[1.05] tracking-tight text-gray-900">
          <span className="animate-fade-up block text-[40px] sm:text-6xl lg:text-7xl">
            {hero.titleLine1}
          </span>
          <span className="animate-fade-up block bg-gradient-to-r from-claude via-gemini-violet to-gemini bg-clip-text text-[40px] text-transparent [animation-delay:100ms] sm:text-6xl lg:text-7xl">
            {hero.titleLine2}
          </span>
        </h1>

        <p className="animate-fade-up mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-600 [animation-delay:220ms] sm:text-lg">
          {hero.subhead}
        </p>

        <div className="animate-fade-up mx-auto mt-6 max-w-xl [animation-delay:340ms]">
          <InstallPill command={hero.installCommand} />
          <a
            href="#quickstart"
            className="mt-3 inline-block text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            {hero.installHint}
          </a>
        </div>

        <div className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-3 [animation-delay:460ms]">
          <a
            href="#quickstart"
            className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg"
          >
            {hero.ctaPrimary}
          </a>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition-colors hover:bg-gray-100"
          >
            <Github className="h-4 w-4" />
            {hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  )
}
