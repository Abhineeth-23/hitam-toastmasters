import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import './preloader.css'

const LINES = ['Ladies and gentlemen,', 'fellow Toastmasters,', 'and most welcome guests —']

/**
 * Plays over the closed curtain: the three timing lights come on one by one
 * while the Toastmaster of the Day opens the meeting. Then the curtain rises.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const el = root.current!
    const reduced = prefersReducedMotion()
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const counter = { v: 0 }
    const tl = gsap.timeline({ paused: true })

    let cancelled = false
    if (reduced) {
      fontsReady.then(() => {
        if (!cancelled) gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete: onDone })
      })
      return () => {
        cancelled = true
      }
    }

    tl.to(counter, { v: 100, duration: 2.6, ease: 'power2.inOut', onUpdate: () => setCount(Math.round(counter.v)) }, 0)
    tl.fromTo('.pre__line > span', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.55, ease: 'expo' }, 0.1)
    const on = (c: string) => () => el.querySelector(c)?.classList.add('is-on')
    tl.call(on('.pre__light--g'), [], 0.6)
    tl.call(on('.pre__light--y'), [], 1.4)
    tl.call(on('.pre__light--r'), [], 2.2)
    tl.to('.pre__line > span', { yPercent: -110, duration: 0.6, stagger: 0.05, ease: 'power3.in' }, 2.8)
    tl.to('.pre__lights, .pre__count', { autoAlpha: 0, y: -20, duration: 0.5 }, 2.8)
    tl.call(onDone, [], 3.25)
    tl.to(el, { autoAlpha: 0, duration: 0.4 }, 3.3)

    fontsReady.then(() => {
      if (!cancelled) tl.play()
    })
    return () => {
      cancelled = true
      tl.kill()
    }
  }, [onDone])

  return (
    <div ref={root} className="pre" role="status" aria-label="Loading HITAM Toastmasters">
      <div className="pre__lights" aria-hidden="true">
        <span className="pre__light pre__light--g" />
        <span className="pre__light pre__light--y" />
        <span className="pre__light pre__light--r" />
      </div>
      <div className="pre__speech serif" aria-hidden="true">
        {LINES.map((l) => (
          <span key={l} className="pre__line">
            <span>{l}</span>
          </span>
        ))}
      </div>
      <div className="pre__count mono" aria-hidden="true">
        <span>{String(count).padStart(3, '0')}</span>
        <span className="muted">
          <span className="campus">HITAM</span> TMC · EST 2018
        </span>
      </div>
    </div>
  )
}
