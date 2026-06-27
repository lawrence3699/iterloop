import type { Lang } from '../content/types'

/**
 * Decide the initial UI language.
 * Prefers a previously stored choice; otherwise infers from the browser language,
 * defaulting to English for anything that is not Chinese.
 */
export function resolveInitialLang(stored: string | null, navigatorLang: string): Lang {
  if (stored === 'en' || stored === 'zh') return stored
  return navigatorLang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}
