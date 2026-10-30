import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import './manifesto.css'

type Seg = { t: string; cls?: string }

const TEXT: Seg[] = [
  { t: 'Every confident speaker you’ve ever' },
  { t: 'admired', cls: 'serif hl' },
  { t: 'once stood exactly where you are —' },
  { t: 'palms sweaty, heart racing, mind blank.', cls: 'strike' },
  { t: 'Here, we turn that moment into' },
  { t: 'momentum.', cls: 'serif hl-y' },
  { t: 'One speech. One evaluation. One Saturday at a time.' },
]

// Kept in the padding bands above and below the copy so they never sit on the words.
const FILLERS = [
  { w: 'um…', x: '4%', y: '10%' },
  { w: 'like,', x: '82%', y: '9%' },
  { w: 'ah—', x: '88%', y: '90%' },
  { w: 'so, basically', x: '30%', y: '92%' },
  { w: 'you know?', x: '62%', y: '93%' },
  { w: 'uhh', x: '46%', y: '11%' },
]

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const words = gsap.utils.toArray<HTMLElement>('.mani__w')
      const fillers = gsap.utils.toArray<HTMLElement>('.mani__filler')
      const counter = root.current!.querySelector<HTMLElement>('.mani__count b')!
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const left = Math.round(fillers.length * (1 - Math.min(1, self.progress / 0.85)))
            counter.textContent = String(left)
          },
        },
      })
      tl.fromTo(words, { opacity: 0.1, y: 8 }, { opacity: 1, y: 0, stagger: 0.05, ease: 'none', duration: 0.4 }, 0)
      tl.fromTo('.mani__seg.strike', { '--strike': 0 }, { '--strike': 1, ease: 'none', duration: 0.6 } as gsap.TweenVars, words.length * 0.05 * 0.55)
      fillers.forEach((f, i) => {
        tl.to(f, { '--cross': 1, duration: 0.3, ease: 'none' } as gsap.TweenVars, 0.15 + i * 0.28)
        tl.to(f, { opacity: 0, y: -30, filter: 'blur(6px)', duration: 0.3 }, 0.45 + i * 0.28)
      })
      // ambient drift
      fillers.forEach((f, i) => gsap.to(f, { x: i % 2 ? 14 : -14, y: '+=10', duration: 3 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }))
    },
    { scope: root },
  )

  let wi = 0
  return (
    <section ref={root} id="manifesto" className="mani" data-theme="light" aria-label="Manifesto">
      <div className="mani__inner wrap">
        <p className="eyebrow mani__eyebrow">The Toastmaster of the Day says</p>
        <p className="mani__text">
          {TEXT.map((seg, si) => (
            <span key={si} className={`mani__seg ${seg.cls ?? ''}`}>
              {seg.t.split(' ').map((w) => (
                <span key={wi++} className="mani__w">
                  {w}{' '}
                </span>
              ))}
            </span>
          ))}
        </p>
        <div className="mani__fillers" aria-hidden="true">
          {FILLERS.map((f) => (
            <span key={f.w} className="mani__filler mono" style={{ left: f.x, top: f.y }}>
              {f.w}
            </span>
          ))}
        </div>
        <p className="mani__count mono">
          Ah-Counter report: <b>{FILLERS.length}</b> filler words remaining
        </p>
      </div>
    </section>
  )
}
