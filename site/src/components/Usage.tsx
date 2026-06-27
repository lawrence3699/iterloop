import { useContent } from '../i18n/useContent'
import { CodeBlock } from '../ui/CodeBlock'
import { SectionReveal } from '../ui/SectionReveal'

export function Usage() {
  const { usage } = useContent()
  return (
    <section id="usage" className="scroll-mt-24 bg-gray-50 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionReveal className="text-center">
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">{usage.heading}</h2>
          <p className="mt-3 text-gray-600">{usage.subheading}</p>
        </SectionReveal>

        <SectionReveal className="mt-10">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {usage.examplesLabel}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {usage.examples.map((ex, i) => (
              <CodeBlock key={i} code={ex.code} label={ex.label} />
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="mt-10">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {usage.optionsLabel}
          </h3>
          <div className="divide-y divide-gray-200 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
            {usage.options.map((o, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <code className="font-mono text-sm font-medium text-gray-900 sm:w-48 sm:shrink-0">
                  {o.flag}
                </code>
                <span className="flex-1 text-sm text-gray-600">{o.desc}</span>
                <code className="font-mono text-xs text-gray-400">{o.def}</code>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="mt-10">
          <h3 className="text-lg font-medium text-gray-900">{usage.reviewHeading}</h3>
          <ul className="mt-3 space-y-2">
            {usage.reviewPoints.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-claude to-gemini" />
                {p}
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  )
}
