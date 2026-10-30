import { useEffect, useRef, type CSSProperties } from 'react'
import { isTouch, prefersReducedMotion } from '../lib/gsap'

/**
 * Variable-font letters that swell toward the pointer — type that "listens".
 * Montserrat Variable spans weight 100–900.
 */
export default function ProximityText({
  text,
  className = '',
  min = 300,
  max = 900,
  radius = 260,
  style,
  lift = 0,
}: {
  text: string
  className?: string
  min?: number
  max?: number
  radius?: number
  style?: CSSProperties
  lift?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const chars = Array.from(el.querySelectorAll<HTMLElement>('.px__c'))
    let mx = -9999
    let my = -9999
    let raf = 0
    const current = chars.map(() => min)
    const currentY = chars.map(() => 0)
    let centers: { x: number; y: number }[] = []
    const measure = () => {
      centers = chars.map((c) => {
        const r = c.getBoundingClientRect()
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      })
    }
    const loop = () => {
      measure()
      let moving = false
      chars.forEach((c, i) => {
        const d = Math.hypot(mx - centers[i].x, my - centers[i].y)
        const k = Math.max(0, 1 - d / radius)
        const ease = k * k * (3 - 2 * k)
        const target = min + (max - min) * ease
        const ty = -lift * ease
        current[i] += (target - current[i]) * 0.14
        currentY[i] += (ty - currentY[i]) * 0.14
        if (Math.abs(target - current[i]) > 0.5) moving = true
        c.style.fontVariationSettings = `'wght' ${current[i].toFixed(0)}`
        c.style.transform = lift ? `translateY(${currentY[i].toFixed(2)}px)` : ''
      })
      raf = moving ? requestAnimationFrame(loop) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const move = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      kick()
    }
    const leave = () => {
      mx = -9999
      my = -9999
      kick()
    }
    if (isTouch()) {
      // On touch, breathe on a slow wave instead.
      let t = 0
      const wave = () => {
        t += 0.02
        chars.forEach((c, i) => {
          const k = (Math.sin(t + i * 0.5) + 1) / 2
          c.style.fontVariationSettings = `'wght' ${(min + (max - min) * k * 0.7).toFixed(0)}`
        })
        raf = requestAnimationFrame(wave)
      }
      raf = requestAnimationFrame(wave)
      return () => cancelAnimationFrame(raf)
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    chars.forEach((c) => (c.style.fontVariationSettings = `'wght' ${min}`))
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [text, min, max, radius, lift])

  return (
    <span ref={ref} className={`px ${className}`} style={style} aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} className="px__c" aria-hidden="true" style={{ display: 'inline-block', fontVariationSettings: `'wght' ${min}` }}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  )
}
