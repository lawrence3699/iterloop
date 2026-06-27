import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ScaledFrameProps {
  /** The fixed width the children are designed at; scaled down to fit the container. */
  designWidth?: number
  children: ReactNode
}

/**
 * Renders children at a fixed design width and scales them down with CSS transform
 * to fit the available width, keeping the layout pixel-stable across breakpoints.
 */
export function ScaledFrame({ designWidth = 880, children }: ScaledFrameProps) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    const update = () => {
      const s = Math.min(1, o.clientWidth / designWidth)
      setScale(s)
      setHeight(i.offsetHeight * s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(o)
    ro.observe(i)
    return () => ro.disconnect()
  }, [designWidth])

  return (
    <div ref={outer} style={{ height }} className="w-full">
      <div
        ref={inner}
        style={{ width: designWidth, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  )
}
