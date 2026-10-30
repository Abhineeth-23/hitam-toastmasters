import { useRef, useState } from 'react'
import { Link } from 'react-router'
import PageHero from '../components/PageHero'
import SplitReveal from '../components/SplitReveal'
import Marquee from '../components/Marquee'
import Magnetic from '../components/Magnetic'
import { useSectionThemes } from '../lib/useSectionThemes'
import { usePageMeta } from '../lib/usePageMeta'
import { CLUB, CORE_VALUES, WHAT_WE_DO, TI } from '../data/club'
import '../styles/pages.css'

const CONTESTS = [
  { icon: '☺', name: 'Humorous Speech Contest', body: 'Make the room laugh — with structure.' },
  { icon: '✎', name: 'Evaluation Contest', body: 'Everyone evaluates the same speech. Best feedback wins.' },
  { icon: '◎', name: 'International Speech Contest', body: 'The world’s largest speech contest starts at club level.' },
  { icon: '?', name: 'Table Topics Contest', body: 'Same surprise question, one speaker at a time.' },
]

export default function About() {
  const root = useRef<HTMLDivElement>(null)
  const [openValue, setOpenValue] = useState(0)
  const [openRow, setOpenRow] = useState<number | null>(0)
  useSectionThemes(root)
  usePageMeta('About — HITAM Toastmasters', 'What Toastmasters is, what HITAM Toastmasters Club stands for, and what we do.')

  return (
    <div ref={root}>
      <PageHero
        index="01"
        kicker="About us"
        title="About"
        lede={<p>“{CLUB.objective}”</p>}
        aside={
          <p className="mono muted">
            Chartered {CLUB.chartered}
            <br />
            {CLUB.district}
          </p>
        }
      />

      <section className="section" data-theme="light">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow" style={{ marginBottom: 24 }}>
              Toastmasters, in a sentence
            </p>
            <SplitReveal as="p" className="big-statement">
              A global nonprofit that, since <span className="serif">{TI.founded}</span>, has turned nervous people into confident speakers and leaders — one meeting at a time.
            </SplitReveal>
          </div>
          <div className="prose" style={{ alignSelf: 'end' }}>
            <p>
              Toastmasters International helps individuals improve their public speaking, communication, and leadership skills. Through regular meetings, members practise giving speeches, take part in impromptu speaking sessions and receive constructive feedback in a
              supportive environment.
            </p>
            <p>{CLUB.environment}</p>
            <p className="serif" style={{ fontSize: '1.6rem', color: 'var(--accent)' }}>
              {TI.tagline}.
            </p>
          </div>
        </div>
      </section>

      <section className="section" data-theme="dark">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Core values</p>
            <SplitReveal as="h2" className="sec-title display">
              Four words we <span className="serif">live by.</span>
            </SplitReveal>
          </div>
          <div className="values" onPointerLeave={() => setOpenValue(0)}>
            {CORE_VALUES.map((v, i) => (
              <button key={v.name} className={`value ${openValue === i ? 'is-open' : ''}`} onPointerEnter={() => setOpenValue(i)} onFocus={() => setOpenValue(i)} onClick={() => setOpenValue(i)}>
                <span className="value__n">0{i + 1}</span>
                <span className="value__name">{v.name}</span>
                <span className="value__body">
                  <span className="value__line">{v.line}</span>
                  <span>{v.body}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Marquee speed={50}>
        {['Speak', 'Evaluate', 'Lead', 'Listen', 'Mentor', 'Repeat'].map((w) => (
          <span key={w} className="display" style={{ fontSize: 'clamp(3rem, 9vw, 9rem)', padding: '0.15em 0.3em', display: 'inline-flex', gap: '0.3em', alignItems: 'center' }}>
            {w} <span className="serif" style={{ color: 'var(--accent)', fontSize: '0.6em' }}>&</span>
          </span>
        ))}
      </Marquee>

      <section className="section" data-theme="maroon">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">What we do</p>
            <SplitReveal as="h2" className="sec-title display">
              More than <span className="serif">meetings.</span>
            </SplitReveal>
          </div>
          <div className="rows">
            {WHAT_WE_DO.map((w, i) => (
              <div key={w.title} className={`row ${openRow === i ? 'is-open' : ''}`}>
                <button className="row__head" onClick={() => setOpenRow(openRow === i ? null : i)} aria-expanded={openRow === i}>
                  <span className="mono muted">0{i + 1}</span>
                  <span className="row__title">{w.title}</span>
                  <span className="row__plus" aria-hidden="true" />
                </button>
                <div className="row__body">
                  <div>
                    <p>{w.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-theme="dark">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Speech contests</p>
            <SplitReveal as="h2" className="sec-title display">
              Four ways to <span className="serif">compete.</span>
            </SplitReveal>
          </div>
          <div className="contests">
            {CONTESTS.map((c) => (
              <div key={c.name} className="contest">
                <span className="contest__icon" aria-hidden="true">
                  {c.icon}
                </span>
                <div>
                  <h3>{c.name}</h3>
                  <p className="muted" style={{ marginTop: 8 }}>
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 60, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Magnetic>
              <Link to="/achievements" className="btn">
                See what we’ve won <span className="arrow">→</span>
              </Link>
            </Magnetic>
            <Link to="/history" className="btn btn--ghost">
              Our story
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
