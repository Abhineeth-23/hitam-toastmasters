import { useGSAP, ScrollTrigger } from './gsap'
import type { RefObject } from 'react'

/**
 * Sections declare `data-theme="dark|light|maroon|blue|yellow"`.
 * As each one crosses the viewport centre the whole page re-themes,
 * so the background "breathes" from one colour to the next.
 */
export function useSectionThemes(scope: RefObject<HTMLElement | null>, fallback = 'dark') {
  useGSAP(
    () => {
      const root = document.documentElement
      root.dataset.theme = fallback
      const sections = [...(scope.current?.querySelectorAll<HTMLElement>('[data-theme]') ?? []), ...document.querySelectorAll<HTMLElement>('.footer[data-theme]')]
      sections.forEach((s) => {
        ScrollTrigger.create({
          trigger: s,
          start: 'top 55%',
          end: 'bottom 55%',
          // measure after any pinned sections, which are often created later (e.g. the
          // History timeline) and push everything below them down
          refreshPriority: -1,
          onToggle: (self) => {
            if (self.isActive) root.dataset.theme = s.dataset.theme
          },
        })
      })
      return () => {
        root.dataset.theme = 'dark'
      }
    },
    { scope },
  )
}
