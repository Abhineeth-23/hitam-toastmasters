import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { onScroll } from '../lib/scroll'
import './marquee.css'

/**
 * Infinite marquee whose speed and direction respond to scroll velocity,
 * with a subtle skew that makes fast scrolling feel physical.
 */
export default function Marquee({ children, speed = 60, reverse = false, className = '' }: { children: ReactNode; speed?: number; reverse?: boolean; className?: string }) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const reduced = prefersReducedMotion()
    let x = 0
    let boost = 0
    let skew = 0
    let dir = reverse ? 1 : -1
    let width = el.scrollWidth / 2
    const ro = new ResizeObserver(() => (width = el.scrollWidth / 2))
    ro.observe(el)

    const off = onScroll((l) => {
      const v = l.velocity
      boost = Math.max(-40, Math.min(40, v))
      if (Math.abs(v) > 0.5) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1)
    })

    const tick = (_t: number, dt: number) => {
      if (reduced) return
      const s = (speed + Math.abs(boost) * 18) * (dt / 1000)
      x += s * dir
      if (x <= -width) x += width
      if (x > 0) x -= width
      boost *= 0.92
      skew += (boost * 0.25 - skew) * 0.1
      gsap.set(el, { x, skewX: skew })
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      off()
      ro.disconnect()
    }
  }, [speed, reverse])

  return (
    <div className={`marquee ${className}`}>
      <div ref={track} className="marquee__track">
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
