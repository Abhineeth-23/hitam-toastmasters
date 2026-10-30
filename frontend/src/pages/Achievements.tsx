import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import PageHero from '../components/PageHero'
import SplitReveal from '../components/SplitReveal'
import TiltCard from '../components/TiltCard'
import Odometer from '../components/Odometer'
import { useSectionThemes } from '../lib/useSectionThemes'
import { usePageMeta } from '../lib/usePageMeta'
import { ScrollTrigger } from '../lib/gsap'
import { ACHIEVEMENTS, type Achievement } from '../data/club'
import '../styles/pages.css'

const CATS = ['All', 'Club', 'Contest', 'Leadership', 'Education'] as const
const CAT_COLOR: Record<Achievement['category'], string> = {
  Club: '#f2df74',
  Contest: '#e5484d',
  Leadership: '#34c560',
  Education: '#4fa3d9',
}

export default function Achievements() {
  const root = useRef<HTMLDivElement>(null)
  const [cat, setCat] = useState<(typeof CATS)[number]>('All')
  useSectionThemes(root)
  usePageMeta('Achievements — HITAM Toastmasters', 'Awards, contest wins and leadership recognition earned by HITAM Toastmasters Club and its members.')

  const list = useMemo(() => (cat === 'All' ? ACHIEVEMENTS : ACHIEVEMENTS.filter((a) => a.category === cat)), [cat])
  const counts = useMemo(() => Object.fromEntries(CATS.map((c) => [c, c === 'All' ? ACHIEVEMENTS.length : ACHIEVEMENTS.filter((a) => a.category === c).length])), [])

  return (
    <div ref={root}>
      <PageHero
        index="02"
        kicker="Awards & contests"
        title="Achievements"
        lede={<p>From a club-wide Epic Club Award to Division-level contest wins and a District Hall of Fame — the receipts of eight years of Saturdays.</p>}
        aside={
          <p className="mono">
            <span style={{ fontSize: '3rem', display: 'block', lineHeight: 1 }} className="display">
              <Odometer value={String(ACHIEVEMENTS.length)} />
            </span>
            recognitions & counting
          </p>
        }
      />

      <section className="section" data-theme="dark" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <LayoutGroup>
            <div className="chips" role="tablist" aria-label="Filter achievements">
              {CATS.map((c) => (
                <button key={c} role="tab" aria-selected={cat === c} className={`chip ${cat === c ? 'is-on' : ''}`} onClick={() => setCat(c)}>
                  {cat === c && <motion.span layoutId="chip-bg" className="chip__bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  {c}
                  <span className="chip__count">{counts[c]}</span>
                </button>
              ))}
            </div>
            <motion.div layout className="awards" onLayoutAnimationComplete={() => ScrollTrigger.refresh()}>
              <AnimatePresence mode="popLayout">
                {list.map((a) => (
                  <motion.article
                    layout
                    key={a.title + a.who}
                    className={`award ${a.highlight ? 'is-big' : ''}`}
                    style={{ ['--cat' as string]: CAT_COLOR[a.category] }}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  >
                    {a.highlight && <span className="award__medal" aria-hidden="true" />}
                    <div className="award__top">
                      <span className="award__cat mono">{a.category}</span>
                      {a.year && <span className="mono muted">{a.year}</span>}
                    </div>
                    <h3 className="award__title">{a.title}</h3>
                    <p className="award__who">{a.who}</p>
                    <p className="award__detail">{a.detail}</p>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </section>

      <section className="section" data-theme="light">
        <div className="wrap two-col" style={{ alignItems: 'center' }}>
          <TiltCard className="tro__trophy" max={8}>
            <img src="/images/golden-feather.webp" alt="Golden Feather Award trophy, Area H2 Euphoria 2025" loading="lazy" style={{ width: '100%', borderRadius: 24 }} />
          </TiltCard>
          <div style={{ display: 'grid', gap: 24 }}>
            <p className="eyebrow">Spotlight</p>
            <SplitReveal as="h2" className="sec-title display">
              The <span className="serif">Golden Feather.</span>
            </SplitReveal>
            <p className="big-statement" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.2rem)' }}>
              Awarded twice to HITAM members — to Lasya Sree in the club’s early years, and to Deeksha Chettikam at Area H2’s Euphoria 2025.
            </p>
            <p className="muted">Recognition like this is earned the Toastmasters way: by showing up, taking roles, giving speeches, and lifting everyone else in the room.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
