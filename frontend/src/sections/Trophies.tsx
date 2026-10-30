import { Link } from 'react-router'
import Marquee from '../components/Marquee'
import TiltCard from '../components/TiltCard'
import SplitReveal from '../components/SplitReveal'
import Magnetic from '../components/Magnetic'
import { ACHIEVEMENTS } from '../data/club'
import './trophies.css'

const NAMES = ['Epic Club Award', 'The Focus Award', 'Pathways Change Maker', 'PR Stalwart · Hall of Fame', 'Golden Feather', 'Division Champions', 'Area H2 · Josh Contest']

export default function Trophies() {
  const featured = ACHIEVEMENTS.filter((a) => a.highlight).slice(0, 4)
  return (
    <section className="tro section" data-theme="dark" aria-label="Achievements">
      <Marquee className="tro__marquee" speed={70}>
        {NAMES.map((n, i) => (
          <span key={n} className={`tro__name display ${i % 2 ? 'is-outline' : ''}`}>
            {n} <span className="tro__star">✦</span>
          </span>
        ))}
      </Marquee>

      <div className="wrap tro__grid">
        <TiltCard className="tro__trophy">
          <img src="/images/golden-feather.webp" alt="The Golden Feather Award presented to Deeksha Chettikam, HITAM Toastmasters Club, Area H2, Euphoria 2025" loading="lazy" />
          <span className="tro__caption mono">Golden Feather · Euphoria 2025</span>
        </TiltCard>

        <div className="tro__copy">
          <p className="eyebrow">The trophy cabinet</p>
          <SplitReveal as="h2" className="tro__title display">
            We don’t practise <span className="serif">quietly.</span>
          </SplitReveal>
          <ul className="tro__list">
            {featured.map((a) => (
              <li key={a.title}>
                <span className="mono muted">{a.year ?? a.category}</span>
                <span className="tro__award">{a.title}</span>
                <span className="muted tro__who">{a.who}</span>
              </li>
            ))}
          </ul>
          <Magnetic>
            <Link to="/achievements" className="btn">
              Open the cabinet <span className="arrow">→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
