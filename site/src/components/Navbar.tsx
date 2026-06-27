import { useState } from 'react'
import { Github, Menu, X } from 'lucide-react'
import { useContent } from '../i18n/useContent'
import { Logo } from './Logo'
import { LangToggle } from './LangToggle'

const REPO = 'https://github.com/lawrence3699/iterloop'

export function Navbar() {
  const { nav } = useContent()
  const [open, setOpen] = useState(false)

  return (
    <header className="animate-fade-down sticky top-0 z-20 border-b border-transparent bg-white/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
        <a href="#top" className="flex items-center gap-2 text-gray-900">
          <Logo className="h-6 w-6" />
          <span className="text-lg font-semibold tracking-tight">iterloop</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="text-[13px] text-gray-700 transition-colors hover:text-gray-900"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangToggle />
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            aria-label={nav.githubAria}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:inline-flex"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          <a
            href="#quickstart"
            className="hidden rounded-full bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 sm:inline-block sm:px-5"
          >
            {nav.getStarted}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-900 hover:bg-gray-900/10 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="animate-fade-up absolute left-4 right-4 top-full z-30 rounded-2xl bg-white/90 px-5 py-3 ring-1 ring-gray-200 backdrop-blur-xl md:hidden">
          {nav.links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className="block border-b border-gray-200 py-2.5 text-[15px] text-gray-700 transition-colors last:border-b-0 hover:text-gray-900"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#quickstart"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-gray-900 px-4 py-2 text-center text-[14px] font-medium text-white"
          >
            {nav.getStarted}
          </a>
        </div>
      )}
    </header>
  )
}
