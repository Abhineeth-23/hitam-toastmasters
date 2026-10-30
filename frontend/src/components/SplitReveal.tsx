import { useRef, type ElementType, type ReactNode, type CSSProperties } from 'react'
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap'

type Props = {
  as?: ElementType
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** lines: masked line slide-up · words: word stagger · chars: char flip */
  mode?: 'lines' | 'words' | 'chars'
  delay?: number
  /** animate immediately instead of on scroll */
  immediate?: boolean
  stagger?: number
}

/** Masked text reveal powered by GSAP SplitText (auto re-splits on resize/font load). */
export default function SplitReveal({ as: Tag = 'div', children, className, style, mode = 'lines', delay = 0, immediate = false, stagger }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const type = mode === 'lines' ? 'lines' : mode === 'words' ? 'lines,words' : 'lines,words,chars'
      let anim: gsap.core.Tween | undefined
      const split = SplitText.create(el, {
        type,
        mask: mode === 'chars' ? 'lines' : mode,
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          anim?.kill()
          const targets = mode === 'lines' ? self.lines : mode === 'words' ? self.words : self.chars
          anim = gsap.from(targets, {
            yPercent: mode === 'chars' ? 110 : 105,
            rotate: mode === 'chars' ? 8 : 0,
            opacity: mode === 'words' ? 0 : 1,
            duration: mode === 'chars' ? 1 : 1.2,
            ease: 'expo',
            delay,
            stagger: stagger ?? (mode === 'lines' ? 0.09 : mode === 'words' ? 0.03 : 0.018),
            scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%', once: true },
          })
          return anim
        },
      })
      return () => split.revert()
    },
    { scope: ref, dependencies: [mode, delay, immediate] },
  )

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}
