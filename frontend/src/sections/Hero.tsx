import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import type { VoiceField } from '../webgl/voiceField'
import ProximityText from '../components/ProximityText'
import Countdown from '../components/Countdown'
import Magnetic from '../components/Magnetic'
import { CLUB } from '../data/club'
import { scrollToTarget } from '../lib/scroll'
import { readStore } from '../lib/store'
import './hero.css'

type MicState = 'off' | 'asking' | 'on' | 'denied'

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const field = useRef<VoiceField | null>(null)
  const meter = useRef<HTMLSpanElement>(null)
  const [mic, setMic] = useState<MicState>('off')
  const [webgl, setWebgl] = useState(true)
  const [notice] = useState(() => readStore().announcements.find((a) => a.pinned))

  // Boot the WebGL field (lazy-loaded so three.js stays out of the main chunk).
  useEffect(() => {
    let alive = true
    import('../webgl/voiceField')
      .then(({ createVoiceField }) => {
        if (!alive || !canvas.current) return
        try {
          field.current = createVoiceField(canvas.current, { reduced: prefersReducedMotion() })
          field.current.onLevel((l) => {
            const k = Math.min(1, l * 3.2)
            meter.current?.style.setProperty('--level', k.toFixed(3))
            root.current?.style.setProperty('--voice', k.toFixed(3))
          })
        } catch {
          setWebgl(false)
        }
      })
      .catch(() => setWebgl(false))
    return () => {
      alive = false
      field.current?.destroy()
      field.current = null
    }
  }, [])

  // Intro choreography once the curtain rises.
  useGSAP(
    () => {
      if (!ready) return
      const reduced = prefersReducedMotion()
      const tl = gsap.timeline({ delay: 0.35 })
      tl.fromTo('.hero__canvas', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
      if (!reduced) {
        tl.fromTo('.hero__find .hero__word', { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.08 }, 0.2)
        tl.fromTo('.hero__voice .px', { yPercent: 40, opacity: 0, filter: 'blur(14px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.6, clearProps: 'filter' }, 0.35)
        tl.fromTo('.hero__fade', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.08 }, 0.9)
      }
      // Parallax out on scroll
      gsap.to('.hero__title', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.hero__bar', { opacity: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '30% top', scrub: true } })
    },
    { scope: root, dependencies: [ready] },
  )

  const toggleMic = async () => {
    if (!field.current) return
    if (mic === 'on') {
      await field.current.setMic(false)
      setMic('off')
      root.current?.style.setProperty('--voice', '0')
      return
    }
    setMic('asking')
    const ok = await field.current.setMic(true)
    setMic(ok ? 'on' : 'denied')
  }

  const micLabel = mic === 'on' ? 'Listening — say something' : mic === 'asking' ? 'Allow the microphone…' : mic === 'denied' ? 'Mic blocked — just move your cursor' : 'Speak to the stage'

  return (
    <section ref={root} className={`hero ${mic === 'on' ? 'is-listening' : ''}`} data-theme="dark" aria-label="Find your voice">
      <div className="hero__stage" aria-hidden="true">
        {webgl ? <canvas ref={canvas} className="hero__canvas" /> : <div className="hero__fallback" />}
        <div className="hero__vignette" />
      </div>

      <div className="hero__top wrap">
        <p className="eyebrow hero__fade">
          {CLUB.district} · Chartered {CLUB.chartered}
        </p>
        {notice ? (
          <p className="hero__notice hero__fade" title={notice.body}>
            <span className="mono">News</span> {notice.title}
          </p>
        ) : (
          <p className="eyebrow eyebrow--campus hero__fade hero__college">{CLUB.college}</p>
        )}
      </div>

      <h1 className="hero__title wrap">
        <span className="hero__find serif">
          <span className="hero__mask">
            <span className="hero__word">Find</span>
          </span>{' '}
          <span className="hero__mask">
            <span className="hero__word">your</span>
          </span>
        </span>
        <span className="hero__voice display">
          <ProximityText text="VOICE" min={500} max={900} radius={420} lift={18} />
        </span>
      </h1>

      <div className="hero__bar wrap">
        <div className="hero__fade hero__intro">
          <p>
            HITAM’s home for public speaking & leadership. Twice a month, students take the stage — and leave a little braver.
          </p>
          <div className="hero__ctas">
            <Magnetic>
              <Link to="/join" className="btn">
                Take the stage <span className="arrow">→</span>
              </Link>
            </Magnetic>
            <button className="btn btn--ghost" onClick={() => scrollToTarget('#manifesto', { duration: 1.8 })}>
              Begin ↓
            </button>
          </div>
        </div>

        <button className={`hero__mic hero__fade mic--${mic}`} onClick={toggleMic} aria-pressed={mic === 'on'} disabled={!webgl || mic === 'asking'}>
          <span ref={meter} className="hero__mic-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
              <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          <span className="hero__mic-text">
            <span className="mono">{mic === 'on' ? 'Mic on' : 'Optional'}</span>
            <span>{micLabel}</span>
          </span>
        </button>

        <div className="hero__next hero__fade">
          <p className="mono muted">Next meeting in</p>
          <Countdown compact />
        </div>
      </div>
    </section>
  )
}
