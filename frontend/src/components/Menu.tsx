import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, isTouch, prefersReducedMotion } from '../lib/gsap'
import { ROUTES, CLUB } from '../data/club'
import { tick } from '../lib/sound'
import Countdown from './Countdown'
import './menu.css'

type Props = { open: boolean; path: string; onClose: () => void }

function RollText({ text }: { text: string }) {
  return (
    <span className="roll" aria-hidden="true">
      {[...text].map((c, i) => (
        <span key={i} className="roll__c" style={{ ['--d' as string]: `${i * 0.025}s` }}>
          <span>{c === ' ' ? ' ' : c}</span>
          <span>{c === ' ' ? ' ' : c}</span>
        </span>
      ))}
    </span>
  )
}

export default function Menu({ open, path, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const first = useRef(true)
  const items = ROUTES.filter((r) => r.path !== '/admin')

  // Open / close choreography
  useEffect(() => {
    const el = root.current!
    if (first.current) {
      first.current = false
      gsap.set(el, { autoAlpha: 0 })
      return
    }
    const links = el.querySelectorAll('.menu__item')
    const side = el.querySelectorAll('.menu__reveal')
    const reduced = prefersReducedMotion()
    const btn = document.querySelector('.menu-btn')?.getBoundingClientRect()
    const cx = btn ? btn.left + btn.width / 2 : window.innerWidth - 40
    const cy = btn ? btn.top + btn.height / 2 : 40

    if (open) {
      const tl = gsap.timeline()
      tl.set(el, { autoAlpha: 1 })
      if (!reduced) {
        tl.fromTo(el, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(150vmax at ${cx}px ${cy}px)`, duration: 1.1, ease: 'expo.inOut' }, 0)
        tl.fromTo(links, { yPercent: 120, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.05, ease: 'expo' }, 0.35)
        tl.fromTo(side, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06 }, 0.55)
      }
      return () => {
        tl.kill()
      }
    } else {
      setHover(null)
      if (reduced) {
        gsap.set(el, { autoAlpha: 0 })
        return
      }
      const tl = gsap.timeline()
      tl.to(links, { yPercent: -120, duration: 0.5, stagger: 0.02, ease: 'power3.in' }, 0)
      tl.to(el, { clipPath: `circle(0px at ${cx}px ${cy}px)`, duration: 0.8, ease: 'expo.inOut' }, 0.15)
      tl.set(el, { autoAlpha: 0 })
      return () => {
        tl.kill()
      }
    }
  }, [open])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [open, onClose])

  // Cursor-following spotlight + preview card
  useEffect(() => {
    const el = root.current!
    if (isTouch()) return
    const px = gsap.quickTo(preview.current, 'x', { duration: 0.7, ease: 'power3' })
    const py = gsap.quickTo(preview.current, 'y', { duration: 0.7, ease: 'power3' })
    const rot = gsap.quickTo(preview.current, 'rotate', { duration: 0.9, ease: 'power3' })
    let lastX = 0
    const move = (e: PointerEvent) => {
      el.style.setProperty('--mx', `${e.clientX}px`)
      el.style.setProperty('--my', `${e.clientY}px`)
      px(e.clientX)
      py(e.clientY)
      rot(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6)))
      lastX = e.clientX
    }
    el.addEventListener('pointermove', move)
    return () => el.removeEventListener('pointermove', move)
  }, [])

  const active = hover !== null ? items[hover] : null

  return (
    <div ref={root} id="menu" className="menu" role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open}>
      <div className="menu__spot" />
      <div className="menu__inner wrap">
        <nav className="menu__nav" aria-label="Primary">
          <ul onPointerLeave={() => setHover(null)} className={hover !== null ? 'has-hover' : ''}>
            {items.map((r, i) => (
              <li key={r.path} className="menu__row">
                <Link
                  to={r.path}
                  className={`menu__item ${hover === i ? 'is-hover' : ''} ${path === r.path ? 'is-current' : ''}`}
                  onClick={onClose}
                  onPointerEnter={() => {
                    setHover(i)
                    tick(1 + i * 0.06)
                  }}
                  onFocus={() => setHover(i)}
                >
                  <span className="menu__idx mono">{r.index}</span>
                  <span className="menu__label display">
                    <span className="sr-only">{r.label}</span>
                    <RollText text={r.label} />
                  </span>
                  <span className="menu__blurb serif">{r.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <aside className="menu__aside">
          <div className="menu__reveal">
            <p className="eyebrow">Next meeting</p>
            <Countdown />
          </div>
          <div className="menu__reveal menu__meta">
            <p className="eyebrow eyebrow--campus">Where</p>
            <p>{CLUB.venue}</p>
            <p className="muted">{CLUB.city}</p>
          </div>
          <div className="menu__reveal menu__meta">
            <p className="eyebrow">Rhythm</p>
            <p>{CLUB.meetingRule}</p>
          </div>
          <div className="menu__reveal menu__foot mono">
            <Link to="/admin" onClick={onClose} className="menu__admin">
              Officer login ↗
            </Link>
            <a href={CLUB.tiUrl} target="_blank" rel="noreferrer">
              toastmasters.org ↗
            </a>
          </div>
        </aside>
      </div>

      <div ref={preview} className={`menu__preview ${active?.image ? 'is-on' : ''}`} aria-hidden="true">
        {items.map(
          (r, i) =>
            r.image && (
              <div key={r.path} className={`menu__preview-img ${hover === i ? 'is-active' : ''}`} style={{ backgroundImage: `url(${r.image})`, ['--tint' as string]: r.accent }} />
            ),
        )}
      </div>
    </div>
  )
}
