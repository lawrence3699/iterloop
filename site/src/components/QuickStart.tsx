import { Check } from 'lucide-react'
import { useContent } from '../i18n/useContent'
import { CodeBlock } from '../ui/CodeBlock'
import { SectionReveal } from '../ui/SectionReveal'

export function QuickStart() {
  const { quickStart } = useContent()
  return (
    <section id="quickstart" className="scroll-mt-24 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionReveal className="text-center">
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">{quickStart.heading}</h2>
          <p className="mt-3 text-gray-600">{quickStart.subheading}</p>
        </SectionReveal>

        <SectionReveal className="mt-10 rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-200">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {quickStart.prerequisitesLabel}
          </h3>
          <ul className="mt-3 space-y-2">
            {quickStart.prerequisites.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                {p}
              </li>
            ))}
          </ul>
        </SectionReveal>

        <ol className="mt-6 space-y-4">
          {quickStart.steps.map((step, i) => (
            <SectionReveal as="li" key={i} className="flex gap-4" delayMs={(i % 5) * 50}>
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <CodeBlock code={step.code} label={step.label} />
              </div>
            </SectionReveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
