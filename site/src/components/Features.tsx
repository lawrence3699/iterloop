import {
  KeyRound,
  Users,
  Gauge,
  Repeat,
  FolderOpen,
  Radio,
  Clock,
  Scale,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { useContent } from '../i18n/useContent'
import { SectionReveal } from '../ui/SectionReveal'

// Explicit map (not `import *`) so Rollup keeps tree-shaking the icon set.
const ICONS: Record<string, LucideIcon> = {
  KeyRound,
  Users,
  Gauge,
  Repeat,
  FolderOpen,
  Radio,
  Clock,
  Scale,
}

export function Features() {
  const { features } = useContent()
  return (
    <section id="features" className="scroll-mt-24 bg-gray-50 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionReveal className="mb-12 text-center">
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">{features.heading}</h2>
          <p className="mt-3 text-gray-600">{features.subheading}</p>
        </SectionReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((f, i) => {
            const Icon = ICONS[f.icon] ?? Sparkles
            return (
              <SectionReveal key={i} delayMs={(i % 4) * 70}>
                <div className="h-full rounded-2xl bg-white p-5 ring-1 ring-gray-200">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-claude/15 to-gemini/15 text-gray-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-medium text-gray-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{f.desc}</p>
                </div>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
