import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Route, Routes, useLocation, type Location } from 'react-router'
import { ScrollTrigger } from './lib/gsap'
import { initScroll, scrollToTarget, startScroll, stopScroll } from './lib/scroll'
import { gavel } from './lib/sound'
import { routeFor } from './data/club'
import Curtain, { curtain } from './components/Curtain'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Menu from './components/Menu'
import Cursor from './components/Cursor'
import ScrollTimer from './components/ScrollTimer'
import CommandPalette from './components/CommandPalette'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Achievements from './pages/Achievements'
import History from './pages/History'
import Team from './pages/Team'
import Join from './pages/Join'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function labelFor(path: string) {
  const m = routeFor(path)
  return { index: m?.index ?? '404', label: m?.label ?? 'Lost backstage', blurb: m?.blurb }
}

function scrollToHash(hash: string) {
  if (!hash) return
  const el = document.getElementById(decodeURIComponent(hash.slice(1)))
  if (el) scrollToTarget(el, { offset: -40 })
}

/**
 * Keeps the *displayed* location separate from the router location so the
 * old page stays on stage until the curtain has fully closed.
 */
function useStagedLocation(ready: boolean) {
  const location = useLocation()
  const [display, setDisplay] = useState<Location>(location)
  const displayRef = useRef(location)
  const latest = useRef(location)
  const busy = useRef(false)

  const run = useCallback(async () => {
    if (busy.current) return
    busy.current = true
    gavel()
    await curtain.close(labelFor(latest.current.pathname))
    const next = latest.current
    flushSync(() => setDisplay(next))
    displayRef.current = next
    scrollToTarget(0, { immediate: true })
    ScrollTrigger.refresh()
    await wait(140)
    curtain.open()
    busy.current = false
    if (next.hash) setTimeout(() => scrollToHash(next.hash), 900)
    if (latest.current.pathname !== next.pathname) run()
  }, [])

  useEffect(() => {
    latest.current = location
    if (!ready) {
      setDisplay(location)
      displayRef.current = location
      return
    }
    if (location.pathname === displayRef.current.pathname) {
      if (location.hash) scrollToHash(location.hash)
      return
    }
    run()
  }, [location, ready, run])

  return display
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const display = useStagedLocation(loaded)

  useEffect(() => {
    initScroll()
    // Re-measure triggers when content height changes (images, fonts, accordions).
    let h = 0
    let t = 0
    const ro = new ResizeObserver(() => {
      const nh = document.body.scrollHeight
      if (Math.abs(nh - h) < 2) return
      h = nh
      clearTimeout(t)
      t = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    })
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (menuOpen || paletteOpen) stopScroll()
    else startScroll()
  }, [menuOpen, paletteOpen])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setMenuOpen(false)
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])

  const onPreloaded = useCallback(() => {
    setLoaded(true)
    curtain.open()
    if (window.location.hash) setTimeout(() => scrollToHash(window.location.hash), 1200)
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header path={display.pathname} menuOpen={menuOpen} onMenu={() => setMenuOpen((o) => !o)} onPalette={() => setPaletteOpen(true)} />
      <Menu open={menuOpen} path={display.pathname} onClose={closeMenu} />
      <CommandPalette open={paletteOpen} onClose={closePalette} />

      <main id="main" key={display.pathname}>
        <Routes location={display}>
          <Route path="/" element={<Home ready={loaded} />} />
          <Route path="/about" element={<About />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/history" element={<History />} />
          <Route path="/team" element={<Team />} />
          <Route path="/join" element={<Join />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {display.pathname !== '/admin' && <Footer />}

      <ScrollTimer />
      <Cursor />
      <Curtain initiallyClosed />
      {!loaded && <Preloader onDone={onPreloaded} />}
      <div className="grain" aria-hidden="true" />
    </>
  )
}
