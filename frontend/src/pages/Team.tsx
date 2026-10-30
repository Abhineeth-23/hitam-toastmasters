import { useRef, useState } from 'react'
import { Link } from 'react-router'
import PageHero from '../components/PageHero'
import SplitReveal from '../components/SplitReveal'
import Magnetic from '../components/Magnetic'
import { useSectionThemes } from '../lib/useSectionThemes'
import { usePageMeta } from '../lib/usePageMeta'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { CURRENT_TERM, ROLE_DUTIES, TERMS } from '../data/club'
import '../styles/pages.css'

// Brand colours lifted enough to glow on the dark card (raw Loyal Blue/Maroon read as black there).
const PALETTE = ['#0a6fa6', '#a83246', '#f2df74', '#a9b2b1', '#2fa055', '#c0485a', '#3d8fc4']

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

function Monogram({ name }: { name: string }) {
  const h = hash(name)
  const initials = name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && w.length > 1)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  // `>>>` keeps the shifted hash unsigned; `>>` went negative and indexed past the palette.
  const i1 = h % PALETTE.length
  const i2 = (i1 + 1 + ((h >>> 4) % (PALETTE.length - 1))) % PALETTE.length // never the same as c1
  const style = {
    '--c1': PALETTE[i1],
    '--c2': PALETTE[i2],
    '--mx1': `${20 + (h % 40)}%`,
    '--my1': `${20 + ((h >>> 3) % 50)}%`,
    '--mx2': `${50 + ((h >>> 6) % 40)}%`,
    '--my2': `${40 + ((h >>> 9) % 50)}%`,
  } as React.CSSProperties
  return (
    <div className="monogram" style={style} aria-hidden="true">
      <span>{initials}</span>
    </div>
  )
}

/** How many terms has this person served on the committee? */
const tenure = (name: string) => TERMS.filter((t) => t.officers.some((o) => o.name === name)).length

export default function Team() {
  const root = useRef<HTMLDivElement>(null)
  const [flipped, setFlipped] = useState<string | null>(null)
  useSectionThemes(root)
  usePageMeta('Team — HITAM Toastmasters', `The ${CURRENT_TERM.term} Executive Committee of HITAM Toastmasters Club.`)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo('.flip', { y: 80, opacity: 0, rotate: () => gsap.utils.random(-4, 4) }, { y: 0, opacity: 1, rotate: 0, duration: 1.2, stagger: 0.08, scrollTrigger: { trigger: '.team', start: 'top 80%' } })
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <PageHero
        index="04"
        kicker={`Executive committee · ${CURRENT_TERM.term}`}
        title="Team"
        lede={<p>Eight officers, one job: make sure every member gets better at speaking and leading. Hover a card to see what each role actually does.</p>}
        aside={<p className="mono muted">Term {CURRENT_TERM.term}</p>}
      />

      <section className="section" data-theme="dark" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="team">
            {CURRENT_TERM.officers.map((o) => {
              const n = tenure(o.name)
              return (
                <div
                  key={o.role}
                  className={`flip ${flipped === o.role ? 'is-flipped' : ''}`}
                  tabIndex={0}
                  onClick={() => setFlipped(flipped === o.role ? null : o.role)}
                  onKeyDown={(e) => e.key === 'Enter' && setFlipped(flipped === o.role ? null : o.role)}
                  data-cursor="Flip"
                >
                  <div className="flip__inner">
                    <div className="flip__face flip__front">
                      <Monogram name={o.name} />
                      <div>
                        <p className="flip__role">{o.role}</p>
                        <p className="flip__name">{o.name}</p>
                      </div>
                    </div>
                    <div className="flip__face flip__back">
                      <p className="mono">{o.role}</p>
                      <p className="flip__duty">{ROLE_DUTIES[o.role]}</p>
                      <p className="mono">{n > 1 ? `${n} terms on the committee` : 'First term on the committee'}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section" data-theme="blue">
        <div className="wrap two-col">
          <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
            <p className="eyebrow">Leadership track</p>
            <SplitReveal as="h2" className="sec-title display">
              Today’s member. <span className="serif">Tomorrow’s officer.</span>
            </SplitReveal>
          </div>
          <div className="prose" style={{ alignSelf: 'end' }}>
            <p>
              Officer elections happen every year. Look at the archive and you will see it: VPs become presidents, sergeants-at-arms become presidents, past presidents become Area Directors. Kaushik went from Sergeant at Arms to President; Akshitha from VP Membership to President to
              Area Director.
            </p>
            <p>Serving on the committee is the fastest way to learn to lead — and it starts by showing up to a meeting.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
              <Magnetic>
                <Link to="/join" className="btn">
                  Start as a guest <span className="arrow">→</span>
                </Link>
              </Magnetic>
              <Link to="/history" className="btn btn--ghost">
                Past committees
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
