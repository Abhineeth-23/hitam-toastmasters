import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { PATHWAYS_LEVELS } from '../data/club'
import SplitReveal from '../components/SplitReveal'
import './pathways.css'

const H = 1800
const NODES = [
  { x: 250, y: 180 },
  { x: 750, y: 540 },
  { x: 250, y: 900 },
  { x: 750, y: 1260 },
  { x: 500, y: 1620 },
]
const D = 'M500,0 C500,90 250,90 250,180 C250,360 750,360 750,540 C750,720 250,720 250,900 C250,1080 750,1080 750,1260 C750,1440 500,1440 500,1620'

export default function Pathways() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const path = root.current!.querySelector<SVGPathElement>('.pw__draw')!
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      if (prefersReducedMotion()) {
        gsap.set(path, { strokeDashoffset: 0 })
        return
      }
      const st = { trigger: '.pw__map', start: 'top 60%', end: 'bottom 70%', scrub: 0.8 }
      gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: st })
      // HTML marker follows the path (kept outside the stretched SVG so it stays round).
      const map = root.current!.querySelector<HTMLElement>('.pw__map')!
      const you = root.current!.querySelector<HTMLElement>('.pw__you')!
      const prog = { p: 0 }
      const place = () => {
        const pt = path.getPointAtLength(prog.p * len)
        gsap.set(you, { x: (pt.x / 1000) * map.clientWidth, y: (pt.y / H) * map.clientHeight })
      }
      place()
      gsap.to(prog, { p: 1, ease: 'none', onUpdate: place, scrollTrigger: { ...st, onRefresh: place } })
      gsap.utils.toArray<HTMLElement>('.pw__node').forEach((n) => {
        gsap.fromTo(n, { scale: 0.4, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: n, start: 'top 62%', toggleActions: 'play none none reverse' } })
      })
      gsap.utils.toArray<HTMLElement>('.pw__card').forEach((c) => {
        gsap.fromTo(c, { y: 60, opacity: 0, rotate: c.classList.contains('is-left') ? -3 : 3 }, { y: 0, opacity: 1, rotate: 0, duration: 1.2, scrollTrigger: { trigger: c, start: 'top 80%' } })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="pw section" data-theme="light" aria-label="The Pathways learning journey">
      <div className="wrap">
        <div className="pw__head">
          <p className="eyebrow">Pathways · The learning programme</p>
          <SplitReveal as="h2" className="pw__title display">
            Five levels from <span className="serif">nervous</span> to <span className="serif">natural.</span>
          </SplitReveal>
          <p className="pw__lede muted">
            Every member follows Toastmasters International’s Pathways programme — speech projects across five levels, each with a real evaluator in the room.
          </p>
        </div>

        <div className="pw__map">
          <svg className="pw__svg" viewBox={`0 0 1000 ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={D} className="pw__ghost" vectorEffect="non-scaling-stroke" />
            <path d={D} className="pw__draw" />
          </svg>
          {PATHWAYS_LEVELS.map((l, i) => {
            const n = NODES[i]
            const left = n.x > 500
            return (
              <div key={l.level} className="pw__stop" style={{ left: `${n.x / 10}%`, top: `${(n.y / H) * 100}%` }}>
                <span className="pw__node display">{l.level}</span>
                <div className={`pw__card ${left ? 'is-left' : 'is-right'} ${n.x === 500 ? 'is-center' : ''}`}>
                  <p className="mono muted">Level {l.level}</p>
                  <h3>{l.name}</h3>
                  <p className="muted">{l.body}</p>
                </div>
              </div>
            )
          })}
          <span className="pw__you" aria-hidden="true">
            <span className="pw__you-halo" />
            <span className="pw__you-dot" />
            <span className="pw__you-label mono">you</span>
          </span>
        </div>
      </div>
    </section>
  )
}
