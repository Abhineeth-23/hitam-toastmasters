import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { MEETING_ROLES } from '../data/club'
import { RoleWidget } from './RoleWidgets'
import SplitReveal from '../components/SplitReveal'
import './anatomy.css'

export default function Anatomy() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const el = track.current!
        const distance = () => el.scrollWidth - window.innerWidth
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set('.anat__progress i', { scaleX: self.progress }),
          },
        })
        gsap.utils.toArray<HTMLElement>('.anat__card').forEach((card) => {
          gsap.fromTo(
            card,
            { rotate: 4, y: 60, opacity: 0.4 },
            {
              rotate: 0,
              y: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'left 55%', scrub: true },
            },
          )
          gsap.fromTo(
            card.querySelector('.anat__n'),
            { xPercent: 40 },
            { xPercent: -30, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="anat" data-theme="dark" aria-label="Anatomy of a meeting">
      <div ref={track} className="anat__track">
        <div className="anat__intro">
          <p className="eyebrow">Every 1st & 3rd Saturday</p>
          <SplitReveal as="h2" className="anat__title display">
            Anatomy of a <span className="serif">meeting</span>
          </SplitReveal>
          <p className="anat__lede muted">
            A Toastmasters meeting is a small, perfectly-timed theatre. Everyone has a role — and every role teaches something. Go on, play with them.
          </p>
          <p className="mono anat__hint">Scroll →</p>
        </div>
        {MEETING_ROLES.map((r) => (
          <article key={r.n} className="anat__card">
            <span className="anat__n display" aria-hidden="true">
              {r.n}
            </span>
            <header>
              <p className="mono muted">Role {r.n}</p>
              <h3 className="anat__role">{r.role}</h3>
              <p className="anat__verb serif">{r.verb}</p>
            </header>
            <p className="anat__body">{r.body}</p>
            <div className="anat__widget">
              <RoleWidget kind={r.widget} />
            </div>
          </article>
        ))}
        <div className="anat__end">
          <p className="serif">…and then the gavel falls.</p>
          <p className="mono muted">Meeting adjourned. Same time in two weeks.</p>
        </div>
      </div>
      <div className="anat__progress" aria-hidden="true">
        <i />
      </div>
    </section>
  )
}
