import { useLang } from './LanguageContext'
import { en } from '../content/en'
import { zh } from '../content/zh'
import type { Content } from '../content/types'

export function useContent(): Content {
  const { lang } = useLang()
  return lang === 'zh' ? zh : en
}
