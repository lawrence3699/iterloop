import { useLang } from '../i18n/LanguageContext'

export function LangToggle() {
  const { lang, setLang } = useLang()
  const next = lang === 'en' ? 'zh' : 'en'
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={lang === 'en' ? '切换到中文' : 'Switch to English'}
      className="rounded-full px-2.5 py-1 text-[13px] font-medium text-gray-700 ring-1 ring-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-900"
    >
      {lang === 'en' ? '中' : 'EN'}
    </button>
  )
}
