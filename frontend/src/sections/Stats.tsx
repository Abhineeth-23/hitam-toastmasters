import Odometer from '../components/Odometer'
import SplitReveal from '../components/SplitReveal'
import { TERMS } from '../data/club'
import './stats.css'

const STATS = [
  { v: '2018', label: 'Chartered at HITAM', note: 'Founded under District 98' },
  { v: String(TERMS.length).padStart(2, '0'), label: 'Executive committees', note: 'And counting, one gavel at a time' },
  { v: '100+', label: 'Meetings held', note: 'Twice a month, every month' },
  { v: '02', label: 'Saturdays a month', note: 'The 1st and the 3rd. Always.' },
  { v: '1924', label: 'Toastmasters, since', note: 'A century of confident voices' },
]

export default function Stats() {
  return (
    <section className="stats section" data-theme="blue" aria-label="Club in numbers">
      <div className="wrap">
        <div className="stats__head">
          <p className="eyebrow">By the numbers</p>
          <SplitReveal as="h2" className="stats__title display">
            Small club. <span className="serif">Loud</span> legacy.
          </SplitReveal>
        </div>
        <ul className="stats__list">
          {STATS.map((s) => (
            <li key={s.label} className="stats__row">
              <Odometer value={s.v} className="stats__num display" />
              <div className="stats__meta">
                <p className="stats__label">{s.label}</p>
                <p className="mono muted">{s.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
