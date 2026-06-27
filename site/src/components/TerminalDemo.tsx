import { useEffect, useState } from 'react'
import { useContent } from '../i18n/useContent'
import { ScaledFrame } from './ScaledFrame'
import type { TerminalLineKind } from '../content/types'

const COLOR: Record<TerminalLineKind, string> = {
  command: 'text-white/90',
  meta: 'text-white/40',
  claude: 'text-claude',
  gemini: 'text-gemini',
  score: 'text-amber-300',
  approved: 'text-emerald-400 font-semibold',
}

export function TerminalDemo() {
  const { terminal } = useContent()
  const total = terminal.lines.length
  const [count, setCount] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setCount(total)
      return
    }
    setCount(0)
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= total) {
          clearInterval(id)
          return c
        }
        return c + 1
      })
    }, 260)
    return () => clearInterval(id)
  }, [total])

  return (
    <div className="animate-hero-rise relative z-0 mx-auto w-[94%] max-w-4xl [animation-delay:300ms] sm:w-[84%] lg:w-[72%]">
      <ScaledFrame designWidth={760}>
        <div className="overflow-hidden rounded-xl bg-[#1a1a1c] text-left shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center gap-2 border-b border-white/5 bg-[#242427] px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="flex-1 text-center text-[11px] text-white/50">{terminal.windowTitle}</span>
            <span className="w-12" />
          </div>
          <div className="space-y-1 whitespace-pre p-5 font-mono text-[13px] leading-relaxed">
            {terminal.lines.slice(0, count).map((line, i) => (
              <div key={i} className={COLOR[line.kind]}>
                {line.text}
              </div>
            ))}
            {count < total && (
              <span className="inline-block h-4 w-2 animate-pulse bg-white/60 align-middle" aria-hidden="true" />
            )}
          </div>
        </div>
      </ScaledFrame>
    </div>
  )
}
