import { useEffect, useState } from 'react'
import { formatIST, nextMeeting, pad, splitDuration } from '../lib/meeting'
import './countdown.css'

export function useNextMeeting() {
  const [now, setNow] = useState(() => Date.now())
  const [, force] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    const onStore = () => force((n) => n + 1)
    window.addEventListener('hitam-store', onStore)
    return () => {
      clearInterval(id)
      window.removeEventListener('hitam-store', onStore)
    }
  }, [])
  const date = nextMeeting(new Date(now))
  const left = date.getTime() - now
  return { date, left, live: left <= 0, parts: splitDuration(left) }
}

export default function Countdown({ compact = false }: { compact?: boolean }) {
  const { date, live, parts } = useNextMeeting()
  const day = formatIST(date, { weekday: 'long', day: 'numeric', month: 'long' })
  const time = formatIST(date, { hour: 'numeric', minute: '2-digit' })

  if (compact)
    return (
      <span className="countdown-compact mono">
        {live ? 'Meeting in progress' : `${pad(parts.d)}d ${pad(parts.h)}h ${pad(parts.m)}m ${pad(parts.s)}s`}
      </span>
    )

  return (
    <div className="countdown">
      <div className="countdown__digits" aria-live="off">
        {live ? (
          <span className="countdown__live">On stage now</span>
        ) : (
          (
            [
              ['d', parts.d, 'days'],
              ['h', parts.h, 'hrs'],
              ['m', parts.m, 'min'],
              ['s', parts.s, 'sec'],
            ] as const
          ).map(([k, v, l]) => (
            <span key={k} className="countdown__unit">
              <span className="countdown__num">{pad(v)}</span>
              <span className="countdown__lbl mono">{l}</span>
            </span>
          ))
        )}
      </div>
      <p className="countdown__when mono">
        {day} · {time} IST
      </p>
    </div>
  )
}
