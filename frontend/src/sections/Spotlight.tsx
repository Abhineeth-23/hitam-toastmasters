import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap, isTouch } from '../lib/gsap'
import Magnetic from '../components/Magnetic'
import './spotlight.css'

/** The page goes dark; your cursor is the only light on stage. */
export default function Spotlight() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current!
    const pos = { x: 0.5, y: 0.5 }
    const set = () => {
      el.style.setProperty('--sx', `${pos.x * 100}%`)
      el.style.setProperty('--sy', `${pos.y * 100}%`)
    }
    if (isTouch()) {
      // wander on its own
      const tl = gsap.timeline({ repeat: -1, yoyo: true, onUpdate: set })
      tl.to(pos, { x: 0.2, y: 0.4, duration: 3, ease: 'sine.inOut' }).to(pos, { x: 0.8, y: 0.6, duration: 3, ease: 'sine.inOut' })
      return () => {
        tl.kill()
      }
    }
    const xTo = gsap.quickTo(pos, 'x', { duration: 0.9, ease: 'power3', onUpdate: set })
    const yTo = gsap.quickTo(pos, 'y', { duration: 0.9, ease: 'power3', onUpdate: set })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - r.left) / r.width)
      yTo((e.clientY - r.top) / r.height)
    }
    el.addEventListener('pointermove', move)
    set()
    return () => el.removeEventListener('pointermove', move)
  }, [])

  return (
    <section ref={root} className="spot" data-theme="dark" aria-label="Join the club">
      <div className="spot__layer spot__layer--dim" aria-hidden="true">
        <p className="display">The stage</p>
        <p className="serif">is waiting.</p>
      </div>
      <div className="spot__layer spot__layer--lit">
        <p className="display">The stage</p>
        <p className="serif">is waiting.</p>
      </div>
      <div className="spot__beam" aria-hidden="true" />

      <Magnetic className="spot__cta" strength={0.5}>
        <Link to="/join" className="spot__circle" aria-label="Join HITAM Toastmasters">
          <svg viewBox="0 0 200 200" className="spot__ring" aria-hidden="true">
            <defs>
              <path id="spot-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
            </defs>
            <text>
              {/* textLength = the circle's circumference (2π·76), so the loop closes without overlapping */}
              <textPath href="#spot-circle" textLength="477" lengthAdjust="spacing">
                Be our guest · Be our guest · Be our guest ·
              </textPath>
            </text>
          </svg>
          <span className="spot__arrow">→</span>
        </Link>
      </Magnetic>
    </section>
  )
}
