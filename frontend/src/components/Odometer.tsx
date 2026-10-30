import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import './odometer.css'

/** Slot-machine digits that roll into place when scrolled into view. */
export default function Odometer({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const cols = gsap.utils.toArray<HTMLElement>('.odo__col', ref.current)
      if (prefersReducedMotion()) {
        cols.forEach((c) => gsap.set(c, { yPercent: -(Number(c.dataset.d) / 30) * 100 }))
        return
      }
      cols.forEach((c, i) => {
        const d = Number(c.dataset.d)
        // two full spins + the digit
        gsap.fromTo(
          c,
          { yPercent: 0 },
          {
            yPercent: -((20 + d) / 30) * 100,
            duration: 2.2 + i * 0.25,
            ease: 'expo.out',
            scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
          },
        )
      })
    },
    { scope: ref, dependencies: [value] },
  )

  return (
    <span ref={ref} className={`odo ${className}`} aria-label={value}>
      {[...value].map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="odo__digit" aria-hidden="true">
            <span className="odo__col" data-d={ch}>
              {Array.from({ length: 30 }, (_, k) => (
                <span key={k}>{k % 10}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} className="odo__static" aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </span>
  )
}
