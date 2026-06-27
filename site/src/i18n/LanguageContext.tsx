import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang } from '../content/types'
import { resolveInitialLang } from './resolveInitialLang'

const STORAGE_KEY = 'iterloop-lang'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
}

const Ctx = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() =>
    resolveInitialLang(
      typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null,
      typeof navigator !== 'undefined' ? navigator.language : 'en',
    ),
  )

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage may be unavailable (private mode); ignore */
    }
  }, [lang])

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useLang must be used within LanguageProvider')
  return v
}
