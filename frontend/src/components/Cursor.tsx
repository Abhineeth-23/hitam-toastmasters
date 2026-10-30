import { useEffect, useRef, useState } from 'react'
import { gsap, isTouch } from '../lib/gsap'
import './cursor.css'

/**
 * Two-part cursor: a precise dot and a lagging ring that grows over links
 * and shows contextual labels via `data-cursor="Label"` on any element.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(() => !isTouch())

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })
    let visible = false

    const move = (e: PointerEvent) => {
      if (!visible) {
        visible = true
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      const labelled = t.closest<HTMLElement>('[data-cursor]')
      const interactive = t.closest('a, button, [role="button"], label, summary, select')
      const text = t.closest('input, textarea')
      const r = ring.current!
      r.dataset.state = text ? 'text' : labelled ? 'label' : interactive ? 'link' : ''
      setLabel(labelled?.dataset.cursor ?? '')
      if (labelled?.dataset.cursorTone) r.dataset.tone = labelled.dataset.cursorTone
      else delete r.dataset.tone
    }
    const leave = () => {
      visible = false
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 })
    }
    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2 })
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span className="cursor-ring__label">{label}</span>
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
