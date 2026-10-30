import { useEffect, useRef, useState } from 'react'
import { onScroll, scrollToTarget } from '../lib/scroll'
import { chime } from '../lib/sound'
import { pad } from '../lib/meeting'
import './scrolltimer.css'

/**
 * Scroll progress, re-imagined as a Toastmasters speech timer:
 * reading the page = giving a 7-minute speech. Green at 5:00, yellow at 6:00, red at 7:00.
 */
const SPEECH = 7 * 60

export default function ScrollTimer() {
  const [secs, setSecs] = useState(0)
  const [shown, setShown] = useState(false)
  const lastLight = useRef<string>('none')

  useEffect(
    () =>
      onScroll((l) => {
        const p = Number.isFinite(l.progress) ? Math.min(1, Math.max(0, l.progress)) : 0
        setSecs(Math.round(p * SPEECH))
        setShown(l.scroll > window.innerHeight * 0.6)
      }),
    [],
  )

  const light = secs >= SPEECH - 4 ? 'red' : secs >= 360 ? 'yellow' : secs >= 300 ? 'green' : 'none'

  useEffect(() => {
    if (light !== lastLight.current && light !== 'none') chime(light === 'green' ? 660 : light === 'yellow' ? 784 : 988)
    lastLight.current = light
  }, [light])

  return (
    <button className={`stimer stimer--${light} ${shown ? 'is-shown' : ''}`} onClick={() => scrollToTarget(0)} aria-label={`Reading timer ${Math.floor(secs / 60)} minutes ${secs % 60} seconds. Back to top.`} data-cursor="Top">
      <span className="stimer__lights" aria-hidden="true">
        <i className="g" />
        <i className="y" />
        <i className="r" />
      </span>
      <span className="stimer__time mono">
        {Math.floor(secs / 60)}:{pad(secs % 60)}
      </span>
      <span className="stimer__label mono">{light === 'red' ? 'Time!' : light === 'yellow' ? 'Wrap up' : light === 'green' ? 'Qualified' : 'Speech timer'}</span>
    </button>
  )
}
