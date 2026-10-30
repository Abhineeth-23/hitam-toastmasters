import { useRef, useState } from 'react'
import PageHero from '../components/PageHero'
import SplitReveal from '../components/SplitReveal'
import { useSectionThemes } from '../lib/useSectionThemes'
import { usePageMeta } from '../lib/usePageMeta'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { MILESTONES, TERMS } from '../data/club'
import '../styles/pages.css'

const presidentOf = (year: string) => TERMS.find((t) => t.term.startsWith(year))?.officers[0]?.name

export default function History() {
  const root = useRef<HTMLDivElement>(null)
  const tl = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<string | null>(TERMS[TERMS.length - 1].term)
  useSectionThemes(root)
  usePageMeta('History — HITAM Toastmasters', 'The journey of HITAM Toastmasters Club since its charter in 2018 — milestones and every executive committee.')

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 861px)', () => {
        const track = tl.current!.querySelector<HTMLElement>('.tl__track')!
        const panels = gsap.utils.toArray<HTMLElement>('.tl__panel', track)
        const dist = () => track.scrollWidth - window.innerWidth
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: tl.current,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.7,
            snap: { snapTo: 1 / (panels.length - 1), duration: { min: 0.3, max: 0.8 }, ease: 'power2.inOut' },
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.round(self.progress * (panels.length - 1))),
          },
        })
        panels.forEach((p) => {
          const st = { trigger: p, containerAnimation: tween, start: 'left 80%', end: 'left 10%', scrub: true }
          gsap.fromTo(p.querySelector('.tl__year'), { '--fill': '0%' }, { '--fill': '100%', ease: 'none', scrollTrigger: st } as gsap.TweenVars)
          gsap.fromTo(p.querySelector('.tl__year'), { xPercent: 12 }, { xPercent: -6, ease: 'none', scrollTrigger: { ...st, start: 'left right', end: 'right left' } })
          gsap.fromTo(p.querySelectorAll('.tl__copy > *'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, ease: 'power2.out', scrollTrigger: { ...st, start: 'left 70%', end: 'left 30%' } })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <PageHero
        index="03"
        kicker="Club journey & milestones"
        title="History"
        lede={<p>Eight executive committees. Two Districts. Hundreds of first speeches. This is how a college club found its voice.</p>}
        aside={<p className="mono muted">2018 → today</p>}
      />

      <section ref={tl} className="tl" data-theme="dark" aria-label="Timeline">
        <div className="tl__track">
          {MILESTONES.map((m) => (
            <article key={m.year} className="tl__panel">
              <div className="tl__year" aria-hidden="true">
                {m.year}
              </div>
              <div className="tl__copy">
                <span className="tl__tag mono">{m.tag}</span>
                <h2 className="tl__title">{m.title}</h2>
                <p className="tl__body">{m.body}</p>
                {presidentOf(m.year) && (
                  <p className="tl__pres mono muted">
                    President {m.year}–{String(Number(m.year) + 1).slice(2)} · <span style={{ color: 'var(--fg)' }}>{presidentOf(m.year)}</span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="tl__years mono" aria-hidden="true">
          {MILESTONES.map((m, i) => (
            <span key={m.year} className={i <= active ? 'is-on' : ''}>
              {m.year}
            </span>
          ))}
        </div>
      </section>

      <section className="section" data-theme="light">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">The gavel passes</p>
            <SplitReveal as="h2" className="sec-title display">
              Every president, <span className="serif">in order.</span>
            </SplitReveal>
          </div>
          <ol className="gavel-chain">
            {[...TERMS].reverse().map((t, i) => (
              <li key={t.term}>
                <span className="mono muted">
                  Term {String(i + 1).padStart(2, '0')} · {t.term}
                </span>
                <span className="gavel-chain__name">{t.officers[0].name}</span>
                <span className="mono muted">{t.note ?? 'President'}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" data-theme="dark">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Archive</p>
            <SplitReveal as="h2" className="sec-title display">
              Every committee, <span className="serif">every name.</span>
            </SplitReveal>
          </div>
          <div className="rows">
            {[...TERMS].reverse().map((t) => (
              <div key={t.term} id={`term-${t.term.slice(0, 4)}`} className={`row ${open === t.term ? 'is-open' : ''}`}>
                <button className="row__head" onClick={() => setOpen(open === t.term ? null : t.term)} aria-expanded={open === t.term}>
                  <span className="mono muted">{t.term.slice(0, 4)}</span>
                  <span className="row__title">
                    {t.term} <span className="serif muted" style={{ fontWeight: 400, fontSize: '0.6em' }}>{t.note ?? `led by ${t.officers[0].name.split(' ')[0]}`}</span>
                  </span>
                  <span className="row__plus" aria-hidden="true" />
                </button>
                <div className="row__body">
                  <div>
                    <div className="term-table">
                      {t.officers.map((o) => (
                        <div key={o.role}>
                          <p className="mono">{o.role}</p>
                          <p>{o.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
