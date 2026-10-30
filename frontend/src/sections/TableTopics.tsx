import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { TABLE_TOPICS } from '../data/club'
import { chime, tick } from '../lib/sound'
import { pad } from '../lib/meeting'
import SplitReveal from '../components/SplitReveal'
import Magnetic from '../components/Magnetic'
import './tabletopics.css'

const REPEAT = 5
const GREEN = 60
const YELLOW = 90
const RED = 120

type Phase = 'idle' | 'spinning' | 'ready' | 'running' | 'paused'

export default function TableTopics() {
  const reel = useRef<HTMLDivElement>(null)
  const pos = useRef(0)
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [secs, setSecs] = useState(0)
  const startAt = useRef(0)
  const carried = useRef(0)
  const skipCarry = useRef(false)

  const N = TABLE_TOPICS.length
  const light = secs >= RED ? 'red' : secs >= YELLOW ? 'yellow' : secs >= GREEN ? 'green' : 'none'

  // Timer loop
  useEffect(() => {
    if (phase !== 'running') return
    startAt.current = performance.now()
    const id = setInterval(() => {
      setSecs(Math.floor(carried.current + (performance.now() - startAt.current) / 1000))
    }, 200)
    return () => {
      if (skipCarry.current) {
        skipCarry.current = false
        carried.current = 0
      } else carried.current += (performance.now() - startAt.current) / 1000
      clearInterval(id)
    }
  }, [phase])

  const zero = () => {
    if (phase === 'running') skipCarry.current = true
    carried.current = 0
    setSecs(0)
  }

  const prevLight = useRef('none')
  useEffect(() => {
    if (light !== prevLight.current && light !== 'none') chime(light === 'green' ? 660 : light === 'yellow' ? 784 : 988)
    prevLight.current = light
  }, [light])

  const spin = () => {
    if (phase === 'spinning') return
    zero()
    setPhase('spinning')
    const next = (idx + 1 + Math.floor(Math.random() * (N - 1))) % N
    const itemH = reel.current!.firstElementChild!.getBoundingClientRect().height
    const target = (2 * N + next) * itemH
    const reduced = prefersReducedMotion()
    let lastTick = -1
    gsap.fromTo(
      pos,
      { current: (idx % N) * itemH },
      {
        current: target,
        duration: reduced ? 0.01 : 3.2,
        ease: 'expo.out',
        onUpdate: () => {
          gsap.set(reel.current, { y: -pos.current })
          const k = Math.floor(pos.current / itemH)
          if (k !== lastTick) {
            lastTick = k
            tick(1.4)
          }
        },
        onComplete: () => {
          // snap back to the first copy so the reel never runs out
          pos.current = next * itemH
          gsap.set(reel.current, { y: -pos.current })
          setIdx(next)
          setPhase('ready')
          chime(1318)
        },
      },
    )
  }

  const toggle = () => {
    if (phase === 'running') setPhase('paused')
    else if (phase === 'ready' || phase === 'paused') setPhase('running')
  }

  const reset = () => {
    zero()
    setPhase(phase === 'idle' ? 'idle' : 'ready')
  }

  const verdict =
    phase === 'idle'
      ? 'Spin to get your topic'
      : phase === 'spinning'
        ? 'Choosing your fate…'
        : secs === 0
          ? 'Stand up. Breathe. Start when ready.'
          : light === 'red'
            ? secs > RED + 30
              ? 'Way over — but that’s why we practise.'
              : 'Red light. Land the plane!'
            : light === 'yellow'
              ? 'Yellow — start wrapping up.'
              : light === 'green'
                ? 'Green — you’ve qualified. Keep going.'
                : 'You’re speaking. Don’t say “um”.'

  return (
    <section id="table-topics" className={`tt section tt--${light}`} data-theme="maroon" aria-label="Table Topics practice">
      <div className="tt__glow" aria-hidden="true" />
      <div className="wrap tt__grid">
        <div className="tt__copy">
          <p className="eyebrow">Table Topics · Try it now</p>
          <SplitReveal as="h2" className="tt__title display">
            Your turn. <span className="serif">Right now.</span>
          </SplitReveal>
          <p className="tt__lede">
            In every meeting, someone gets a surprise question and one to two minutes to answer it — no notes, no warning. Spin the reel, stand up in your room, and talk.
          </p>
          <ul className="tt__rules mono">
            <li>
              <i className="g" /> 1:00 Green — qualified
            </li>
            <li>
              <i className="y" /> 1:30 Yellow — wrap up
            </li>
            <li>
              <i className="r" /> 2:00 Red — time’s up
            </li>
          </ul>
        </div>

        <div className="tt__machine">
          <div className="tt__window" aria-live="polite">
            <div ref={reel} className="tt__reel">
              {Array.from({ length: REPEAT }).flatMap((_, r) =>
                TABLE_TOPICS.map((t, i) => (
                  <p key={`${r}-${i}`} className="tt__topic serif" aria-hidden={!(r === 0 && i === idx)}>
                    {t}
                  </p>
                )),
              )}
            </div>
            <span className="tt__shade tt__shade--t" />
            <span className="tt__shade tt__shade--b" />
          </div>

          <div className="tt__panel">
            <div className="tt__clock">
              <span className="tt__lights" aria-hidden="true">
                <i className="g" />
                <i className="y" />
                <i className="r" />
              </span>
              <span className="tt__time mono" aria-label={`${secs} seconds`}>
                {Math.floor(secs / 60)}:{pad(secs % 60)}
              </span>
            </div>
            <p className="tt__verdict">{verdict}</p>
            <div className="tt__btns">
              <Magnetic>
                <button className="btn" onClick={spin} disabled={phase === 'spinning'} data-cursor="Spin">
                  {phase === 'idle' ? 'Spin a topic' : 'Spin again'} <span className="arrow">↻</span>
                </button>
              </Magnetic>
              <button className="btn btn--ghost" onClick={toggle} disabled={phase === 'idle' || phase === 'spinning'}>
                {phase === 'running' ? 'Pause' : phase === 'paused' ? 'Resume' : 'Start timer'}
              </button>
              <button className="btn btn--ghost" onClick={reset} disabled={secs === 0}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
