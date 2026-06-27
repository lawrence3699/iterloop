import { RefreshCw } from 'lucide-react'
import { useContent } from '../i18n/useContent'
import { SectionReveal } from '../ui/SectionReveal'

export function HowItWorks() {
  const { howItWorks } = useContent()
  return (
    <section id="how-it-works" className="scroll-mt-24 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionReveal className="text-center">
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-claude to-gemini text-white">
            <RefreshCw className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">{howItWorks.heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">{howItWorks.subheading}</p>
        </SectionReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {howItWorks.steps.map((step, i) => {
            const inLoop = i >= 2 && i <= 4
            return (
              <SectionReveal key={i} delayMs={(i % 3) * 80}>
                <div
                  className={`h-full rounded-2xl bg-white p-5 ring-1 ${
                    inLoop ? 'ring-gemini-violet/25' : 'ring-gray-200'
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-claude to-gemini text-sm font-semibold text-white">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-medium text-gray-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{step.desc}</p>
                </div>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
