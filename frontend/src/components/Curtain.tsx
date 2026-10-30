import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { whoosh } from '../lib/sound'
import './curtain.css'

const FOLDS = 7

type Label = { index: string; label: string; blurb?: string }

type Controller = {
  close: (label: Label) => Promise<void>
  open: () => Promise<void>
}

let controller: Controller | null = null
let pendingInitialOpen = false

/** Imperative API used by the router transition + preloader. */
export const curtain = {
  close: (label: Label) => controller?.close(label) ?? Promise.resolve(),
  open: () => {
    if (!controller) {
      pendingInitialOpen = true
      return Promise.resolve()
    }
    return controller.open()
  },
}

export default function Curtain({ initiallyClosed = true }: { initiallyClosed?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<Label>({ index: '00', label: 'HITAM Toastmasters' })
  const tl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const el = root.current!
    const left = el.querySelectorAll<HTMLElement>('.curtain__side--l .curtain__fold')
    const right = el.querySelectorAll<HTMLElement>('.curtain__side--r .curtain__fold')
    const valance = el.querySelector<HTMLElement>('.curtain__valance')
    const card = el.querySelector<HTMLElement>('.curtain__card')
    const reduced = prefersReducedMotion()

    const setClosed = () => {
      gsap.set([...left, ...right], { xPercent: 0, scaleY: 1 })
      gsap.set(valance, { yPercent: 0, y: 0 })
      el.dataset.state = 'closed'
    }
    const setOpen = () => {
      gsap.set(left, { xPercent: (i) => -100 * (i + 1) })
      gsap.set(right, { xPercent: (i) => 100 * (FOLDS - i) })
      gsap.set(valance, { yPercent: -100, y: -24 })
      gsap.set(card, { autoAlpha: 0 })
      el.dataset.state = 'open'
    }
    if (initiallyClosed) setClosed()
    else setOpen()

    controller = {
      close: (next) =>
        new Promise<void>((resolve) => {
          setLabel(next)
          tl.current?.kill()
          el.dataset.state = 'closing'
          if (reduced) {
            setClosed()
            gsap.set(card, { autoAlpha: 1 })
            return resolve()
          }
          whoosh(0.8)
          const t = gsap.timeline({ onComplete: () => { el.dataset.state = 'closed'; resolve() } })
          t.to(valance, { yPercent: 0, y: 0, duration: 0.7, ease: 'expo' }, 0)
          // inner folds lead, outer folds trail — reads as fabric being pulled
          t.to(left, { xPercent: 0, duration: 0.95, ease: 'curtain', stagger: { each: 0.035, from: 'end' } }, 0)
          t.to(right, { xPercent: 0, duration: 0.95, ease: 'curtain', stagger: { each: 0.035, from: 'start' } }, 0)
          t.fromTo([...left, ...right], { skewY: 0 }, { skewY: (i) => (i < FOLDS ? 1.2 : -1.2), duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.1)
          t.fromTo(card, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.55)
          tl.current = t
        }),
      open: () =>
        new Promise<void>((resolve) => {
          tl.current?.kill()
          el.dataset.state = 'opening'
          if (reduced) {
            setOpen()
            return resolve()
          }
          whoosh(1.1)
          const t = gsap.timeline({ onComplete: () => { el.dataset.state = 'open'; resolve() } })
          t.to(card, { autoAlpha: 0, y: -20, duration: 0.35, ease: 'power2.in' }, 0)
          t.to(left, { xPercent: (i) => -100 * (i + 1), duration: 1.25, ease: 'expo', stagger: { each: 0.04, from: 'start' } }, 0.15)
          t.to(right, { xPercent: (i) => 100 * (FOLDS - i), duration: 1.25, ease: 'expo', stagger: { each: 0.04, from: 'end' } }, 0.15)
          t.to(valance, { yPercent: -100, y: -24, duration: 0.9, ease: 'power3.inOut' }, 0.45)
          tl.current = t
        }),
    }

    if (pendingInitialOpen) {
      pendingInitialOpen = false
      controller.open()
    }
    return () => {
      controller = null
      tl.current?.kill()
    }
  }, [initiallyClosed])

  const folds = (side: 'l' | 'r') =>
    Array.from({ length: FOLDS }, (_, i) => <div key={side + i} className="curtain__fold" style={{ ['--i' as string]: i }} />)

  return (
    <div ref={root} className="curtain" aria-hidden="true" data-state="closed">
      <div className="curtain__side curtain__side--l">{folds('l')}</div>
      <div className="curtain__side curtain__side--r">{folds('r')}</div>
      <div className="curtain__valance">
        <div className="curtain__fringe" />
      </div>
      <div className="curtain__card">
        <span className="mono">{label.index} —</span>
        <span className="curtain__title serif">{label.label}</span>
        {label.blurb && <span className="mono curtain__blurb">{label.blurb}</span>}
      </div>
    </div>
  )
}
