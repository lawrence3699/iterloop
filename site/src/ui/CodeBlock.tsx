import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  code: string
  label?: string
  className?: string
}

export function CodeBlock({ code, label, className = '' }: CodeBlockProps) {
  return (
    <div className={`overflow-hidden rounded-lg bg-[#1a1a1c] ring-1 ring-white/10 ${className}`}>
      {label && (
        <div className="border-b border-white/5 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
          {label}
        </div>
      )}
      <div className="flex items-start gap-2 px-4 py-3">
        <pre className="flex-1 overflow-x-auto font-mono text-[13px] leading-relaxed text-white/90">
          <code>{code}</code>
        </pre>
        <CopyButton text={code} className="text-white/55 hover:bg-white/10 hover:text-white" />
      </div>
    </div>
  )
}
