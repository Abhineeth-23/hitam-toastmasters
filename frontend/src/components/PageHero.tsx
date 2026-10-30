import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, SplitText, prefersReducedMotion } from '../lib/gsap'
import './pagehero.css'

/**
 * Shared editorial opener for inner pages: index number, giant split title,
 * serif kicker and a lede — all animate in as the curtain rises.
 */
export default function PageHero({
  index,
  kicker,
  title,
  lede,
  aside,
  theme = 'dark',
}: {
  index: string
  kicker: string
  title: string
  lede?: ReactNode
  aside?: ReactNode
  theme?: string
}) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const title = root.current!.querySelector('.ph__title')!
      const split = SplitText.create(title, { type: 'chars,lines', mask: 'lines' })
      const tl = gsap.timeline({ delay: 0.75 })
      tl.from(split.chars, { yPercent: 110, rotate: 10, duration: 1.3, stagger: 0.025 }, 0)
      tl.from('.ph__fade', { y: 30, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.3)
      tl.from('.ph__index', { xPercent: -20, opacity: 0, duration: 1.6 }, 0)
      gsap.to('.ph__index', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="ph" data-theme={theme}>
      <span className="ph__index display" aria-hidden="true">
        {index}
      </span>
      <div className="wrap ph__inner">
        <p className="eyebrow ph__fade">{kicker}</p>
        <h1 className="ph__title display" style={{ ['--len' as string]: Math.max(4, title.length) }}>
          {title}
        </h1>
        <div className="ph__bottom">
          {lede && <div className="ph__lede ph__fade">{lede}</div>}
          {aside && <div className="ph__aside ph__fade">{aside}</div>}
        </div>
      </div>
    </section>
  )
}
