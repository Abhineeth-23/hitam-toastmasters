import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from '../lib/gsap'
import { onScroll } from '../lib/scroll'
import { routeFor } from '../data/club'
import { setSound, onSound, soundEnabled, tick } from '../lib/sound'
import Logo from './Logo'
import Scramble from './Scramble'
import Magnetic from './Magnetic'
import './header.css'

function useISTClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    const up = () => setT(f.format(new Date()))
    up()
    const id = setInterval(up, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

type Props = {
  path: string
  menuOpen: boolean
  onMenu: () => void
  onPalette: () => void
}

export default function Header({ path, menuOpen, onMenu, onPalette }: Props) {
  const ref = useRef<HTMLElement>(null)
  const clock = useISTClock()
  const [sound, setSoundState] = useState(soundEnabled())
  const meta = routeFor(path)

  useEffect(() => onSound(setSoundState), [])

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let hidden = false
    let last = 0
    return onScroll((l) => {
      const y = l.scroll
      const down = y > last && y > 160
      last = y
      if (down !== hidden && !menuOpen) {
        hidden = down
        gsap.to(ref.current, { yPercent: down ? -110 : 0, duration: 0.6, ease: 'expo' })
      }
      ref.current?.classList.toggle('is-scrolled', y > 40)
    })
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen) gsap.to(ref.current, { yPercent: 0, duration: 0.4 })
  }, [menuOpen])

  return (
    <header ref={ref} className={`header ${menuOpen ? 'is-menu' : ''}`}>
      <div className="header__left">
        <Link to="/" className="header__logo" aria-label="HITAM Toastmasters — home">
          <Logo />
        </Link>
        <nav className="crumbs mono" aria-label="Breadcrumb">
          <Link to="/" className="crumbs__root">
            Index
          </Link>
          <span className="crumbs__sep">/</span>
          <span className="crumbs__current" aria-current="page">
            <span className="crumbs__idx">{meta?.index ?? '404'}</span>
            <Scramble text={meta?.label ?? 'Lost'} />
          </span>
        </nav>
      </div>

      <div className="header__right">
        <span className="header__clock mono" title="Hyderabad time">
          <span className="header__pulse" />
          HYD {clock}
        </span>
        <button className="header__k mono" onClick={onPalette} aria-label="Open quick navigation (Ctrl K)">
          <kbd>⌘K</kbd>
        </button>
        <button
          className={`header__sound ${sound ? 'is-on' : ''}`}
          onClick={() => {
            setSound(!sound)
            tick()
          }}
          aria-pressed={sound}
          aria-label={sound ? 'Mute interface sounds' : 'Enable interface sounds'}
          data-cursor={sound ? 'Mute' : 'Sound'}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ ['--i' as string]: i }} />
          ))}
        </button>
        <Link to="/join" className="btn header__join">
          Join <span className="arrow">→</span>
        </Link>
        <Magnetic strength={0.4}>
          <button className="menu-btn" onClick={onMenu} aria-expanded={menuOpen} aria-controls="menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            <span className="menu-btn__label mono">
              <span>{menuOpen ? 'Close' : 'Menu'}</span>
            </span>
            <span className="menu-btn__icon">
              <i />
              <i />
            </span>
          </button>
        </Magnetic>
      </div>
    </header>
  )
}
