import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

interface SectionRevealProps {
  as?: ElementType
  className?: string
  /** Stagger delay applied once the element reveals (ms). */
  delayMs?: number
  children: ReactNode
}

export function SectionReveal({ as: Tag = 'div', className = '', delayMs = 0, children }: SectionRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={shown && delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
      className={`${className} ${shown ? 'animate-fade-up' : 'opacity-0'}`}
    >
      {children}
    </Tag>
  )
}
