import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

let lenis: Lenis | null = null
const listeners = new Set<(l: Lenis) => void>()

export function initScroll() {
  if (lenis) return lenis
  lenis = new Lenis({
    autoRaf: false,
    lerp: prefersReducedMotion() ? 1 : 0.095,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  })
  lenis.on('scroll', () => {
    ScrollTrigger.update()
    listeners.forEach((fn) => fn(lenis!))
  })
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis

export function onScroll(fn: (l: Lenis) => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function scrollToTarget(target: number | string | HTMLElement, opts: { immediate?: boolean; offset?: number; duration?: number } = {}) {
  if (lenis) lenis.scrollTo(target, { immediate: opts.immediate, offset: opts.offset ?? 0, duration: opts.duration ?? 1.4, force: true })
  else if (typeof target === 'number') window.scrollTo(0, target)
}

export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()
