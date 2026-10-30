import { Link } from 'react-router'
import { CLUB, ROUTES, TI } from '../data/club'
import { scrollToTarget } from '../lib/scroll'
import ProximityText from './ProximityText'
import Magnetic from './Magnetic'
import './footer.css'

export default function Footer() {
  return (
    <footer className="footer" data-theme="dark">
      <div className="wrap">
        <div className="footer__cta">
          <p className="eyebrow">{TI.tagline}</p>
          <h2 className="footer__headline">
            <span className="serif">Got something</span> <span className="display">to say?</span>
          </h2>
          <div className="footer__btns">
            <Magnetic>
              <Link to="/join" className="btn">
                Be our guest <span className="arrow">→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/contact" className="btn btn--ghost">
                Find the room
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="footer__grid">
          <div>
            <p className="mono muted">Navigate</p>
            <ul>
              {ROUTES.filter((r) => r.path !== '/admin').map((r) => (
                <li key={r.path}>
                  <Link to={r.path} className="footer__link">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono muted">Meet us</p>
            <p>{CLUB.meetingRule}</p>
            <p className="muted">{CLUB.venue}</p>
            <p className="muted">{CLUB.city}</p>
          </div>
          <div>
            <p className="mono muted">Part of</p>
            <p>
              <a className="footer__link" href={CLUB.tiUrl} target="_blank" rel="noreferrer">
                Toastmasters International ↗
              </a>
            </p>
            <p className="muted">{CLUB.district} · Est. {CLUB.chartered}</p>
            <p>
              <a className="footer__link" href={CLUB.hitamUrl} target="_blank" rel="noreferrer">
                hitam.org ↗
              </a>
            </p>
          </div>
          <div className="footer__top">
            <button className="footer__totop" onClick={() => scrollToTarget(0, { duration: 2 })} data-cursor="Up">
              <span>↑</span>
            </button>
          </div>
        </div>
      </div>

      <div className="footer__giant display" aria-hidden="true">
        <ProximityText text="TOASTMASTERS" min={250} max={900} radius={340} />
      </div>

      <div className="wrap footer__legal">
        <a className="footer__campus" href={CLUB.hitamUrl} target="_blank" rel="noreferrer">
          <img className="footer__campus-logo" src="/images/hitam-logo.webp" alt="HITAM logo" width="52" height="52" loading="lazy" />
          <span className="footer__campus-text">
            <span className="mono campus">A HITAM student club ↗</span>
            <span className="footer__campus-name">{CLUB.college}</span>
          </span>
          <span className="footer__campus-tag serif" aria-hidden="true">
            <span className="campus">find your path,</span> <span className="accent">find your voice.</span>
          </span>
        </a>
        <p className="footer__disclaimer">{CLUB.disclaimer}</p>
        <div className="footer__bottom mono">
          <span>© {new Date().getFullYear()} {CLUB.name}</span>
          <span>{CLUB.college}</span>
          <Link to="/admin" className="footer__link">
            Officers
          </Link>
        </div>
      </div>
    </footer>
  )
}
