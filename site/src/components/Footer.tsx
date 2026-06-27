import { useContent } from '../i18n/useContent'
import { Logo } from './Logo'
import { LangToggle } from './LangToggle'

export function Footer() {
  const { footer } = useContent()
  return (
    <footer className="border-t border-gray-200 px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 text-gray-900">
              <Logo className="h-6 w-6" />
              <span className="text-lg font-semibold tracking-tight">iterloop</span>
            </div>
            <p className="mt-3 text-sm text-gray-600">{footer.tagline}</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2.5 sm:flex sm:flex-wrap sm:gap-x-6">
            {footer.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-500">{footer.madeBy}</p>
          <div className="flex items-center gap-4">
            <a href="#top" className="text-xs text-gray-500 transition-colors hover:text-gray-900">
              {footer.backToTop}
            </a>
            <LangToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
