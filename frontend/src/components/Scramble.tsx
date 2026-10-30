import { useCallback, useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { prefersReducedMotion } from '../lib/gsap'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=?/<>'

/** Text that decodes itself whenever `text` changes or on hover (when `hover`). */
export default function Scramble({
  text,
  hover = false,
  duration = 600,
  ...rest
}: { text: string; hover?: boolean; duration?: number } & HTMLAttributes<HTMLSpanElement>) {
  const [out, setOut] = useState(text)
  const raf = useRef(0)

  const run = useCallback(() => {
    if (prefersReducedMotion()) {
      setOut(text)
      return
    }
    cancelAnimationFrame(raf.current)
    const start = performance.now()
    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const reveal = Math.floor(p * text.length)
      let s = ''
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (i < reveal || c === ' ') s += c
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (p < 1) raf.current = requestAnimationFrame(frame)
    }
    raf.current = requestAnimationFrame(frame)
  }, [text, duration])

  useEffect(() => {
    run()
    return () => cancelAnimationFrame(raf.current)
  }, [run])

  return (
    <span {...rest} aria-label={text} onPointerEnter={hover ? run : undefined}>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}
