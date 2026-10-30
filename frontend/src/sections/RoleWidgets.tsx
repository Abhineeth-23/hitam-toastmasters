import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { gavel, tick, chime } from '../lib/sound'
import { TABLE_TOPICS, WORDS_OF_THE_DAY } from '../data/club'
import { pad } from '../lib/meeting'

function Gavel() {
  const head = useRef<SVGGElement>(null)
  const [n, setN] = useState(0)
  const strike = () => {
    gavel()
    setN((v) => v + 1)
    gsap.timeline()
      .to(head.current, { rotate: -38, duration: 0.18, ease: 'power2.out', svgOrigin: '70 70' })
      .to(head.current, { rotate: 6, duration: 0.12, ease: 'power4.in', svgOrigin: '70 70' })
      .to(head.current, { rotate: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)', svgOrigin: '70 70' })
  }
  return (
    <button className="rw rw--gavel" onClick={strike} data-cursor="Strike">
      <svg viewBox="0 0 140 90" width="150" aria-hidden="true">
        <rect x="20" y="74" width="100" height="10" rx="3" fill="var(--maroon)" />
        <g ref={head}>
          <rect x="66" y="22" width="80" height="7" rx="3" fill="var(--yellow)" transform="rotate(-30 70 70)" />
          <rect x="40" y="10" width="34" height="22" rx="6" fill="var(--fg)" transform="rotate(-30 70 70)" />
        </g>
      </svg>
      <span className="mono">{n === 0 ? 'Tap to call to order' : `Order! ×${n}`}</span>
    </button>
  )
}

function Mic() {
  return (
    <div className="rw rw--vu" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} style={{ ['--i' as string]: i }} />
      ))}
    </div>
  )
}

function Speech() {
  return (
    <div className="rw rw--speech" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="110">
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--line)" strokeWidth="6" />
        <circle className="rw__ring" cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" pathLength="100" />
      </svg>
      <span className="mono">5–7 min</span>
    </div>
  )
}

function Topics() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % TABLE_TOPICS.length), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <button className="rw rw--topics" onClick={() => setI((v) => (v + 1) % TABLE_TOPICS.length)} data-cursor="Next">
      <span key={i} className="rw__topic serif">
        “{TABLE_TOPICS[i]}”
      </span>
    </button>
  )
}

function Evalu() {
  return (
    <div className="rw rw--eval" aria-label="Commend, recommend, commend">
      {['Commend', 'Recommend', 'Commend'].map((w, i) => (
        <span key={i} className="mono" style={{ ['--i' as string]: i }}>
          {w}
        </span>
      ))}
    </div>
  )
}

function Timer() {
  const [s, setS] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setS((v) => (v >= 450 ? 0 : v + 6)), 100)
    return () => clearInterval(id)
  }, [])
  const light = s >= 420 ? 'r' : s >= 360 ? 'y' : s >= 300 ? 'g' : ''
  return (
    <div className={`rw rw--timer is-${light}`} aria-hidden="true">
      <div className="rw__lights">
        <i className="g" />
        <i className="y" />
        <i className="r" />
      </div>
      <span className="mono rw__clock">
        {Math.floor(s / 60)}:{pad(s % 60)}
      </span>
    </div>
  )
}

function AhCounter() {
  const [c, setC] = useState({ um: 0, ah: 0, like: 0 })
  const total = c.um + c.ah + c.like
  return (
    <div className="rw rw--ah">
      <div className="rw__ah-btns">
        {(Object.keys(c) as (keyof typeof c)[]).map((k, i) => (
          <button
            key={k}
            onClick={() => {
              tick(1 + i * 0.2)
              setC((p) => ({ ...p, [k]: p[k] + 1 }))
            }}
          >
            <span className="serif">{k}</span>
            <b className="mono">{c[k]}</b>
          </button>
        ))}
      </div>
      <span className="mono muted">{total === 0 ? 'Click when you hear one' : total > 9 ? 'Okay, that was a lot.' : `${total} filler${total > 1 ? 's' : ''} logged`}</span>
    </div>
  )
}

function Word() {
  const [i, setI] = useState(0)
  const w = WORDS_OF_THE_DAY[i]
  return (
    <button
      className="rw rw--word"
      onClick={() => {
        chime(1046)
        setI((v) => (v + 1) % WORDS_OF_THE_DAY.length)
      }}
      data-cursor="Next word"
    >
      <span key={w.word} className="rw__word">
        <span className="serif">{w.word}</span> <span className="mono muted">{w.type}</span>
      </span>
      <span className="rw__def muted">{w.def}</span>
    </button>
  )
}

function Stars() {
  const [r, setR] = useState(0)
  const [h, setH] = useState(0)
  return (
    <div className="rw rw--stars" onPointerLeave={() => setH(0)}>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} aria-label={`${n} stars`} className={(h || r) >= n ? 'on' : ''} onPointerEnter={() => setH(n)} onClick={() => setR(n)}>
            ★
          </button>
        ))}
      </div>
      <span className="mono muted">{r ? `Meeting rated ${r}/5` : 'Rate the meeting'}</span>
    </div>
  )
}

export function RoleWidget({ kind }: { kind: string }) {
  switch (kind) {
    case 'gavel':
      return <Gavel />
    case 'mic':
      return <Mic />
    case 'speech':
      return <Speech />
    case 'topics':
      return <Topics />
    case 'eval':
      return <Evalu />
    case 'timer':
      return <Timer />
    case 'ah':
      return <AhCounter />
    case 'word':
      return <Word />
    default:
      return <Stars />
  }
}
