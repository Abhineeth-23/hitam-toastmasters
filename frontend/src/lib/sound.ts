/**
 * Synthesised UI sounds (no audio files). Off by default; toggled in the header.
 */
let ctx: AudioContext | null = null
let enabled = false
const subs = new Set<(on: boolean) => void>()

export const soundEnabled = () => enabled

export function setSound(on: boolean) {
  enabled = on
  if (on && !ctx) ctx = new AudioContext()
  if (on) ctx?.resume()
  subs.forEach((f) => f(on))
}

export function onSound(fn: (on: boolean) => void) {
  subs.add(fn)
  return () => {
    subs.delete(fn)
  }
}

function env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
}

/** Soft tick for hovers. */
export function tick(pitch = 1) {
  if (!enabled || !ctx) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(1800 * pitch, t)
  o.frequency.exponentialRampToValueAtTime(900 * pitch, t + 0.04)
  env(g, t, 0.04, 0.002, 0.05)
  o.connect(g).connect(ctx.destination)
  o.start(t)
  o.stop(t + 0.08)
}

/** Wooden gavel knock: filtered noise burst + low body thump. */
export function gavel() {
  if (!enabled || !ctx) return
  const t = ctx.currentTime
  for (const [delay, amp] of [[0, 0.5], [0.16, 0.35]] as const) {
    const at = t + delay
    const len = 0.12
    const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6)
    const n = ctx.createBufferSource()
    n.buffer = buf
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 900
    bp.Q.value = 2.5
    const ng = ctx.createGain()
    env(ng, at, amp, 0.001, 0.1)
    n.connect(bp).connect(ng).connect(ctx.destination)
    n.start(at)

    const o = ctx.createOscillator()
    const og = ctx.createGain()
    o.frequency.setValueAtTime(180, at)
    o.frequency.exponentialRampToValueAtTime(70, at + 0.12)
    env(og, at, amp * 0.6, 0.002, 0.14)
    o.connect(og).connect(ctx.destination)
    o.start(at)
    o.stop(at + 0.2)
  }
}

/** Short bell chime for the timer lights. */
export function chime(freq = 880) {
  if (!enabled || !ctx) return
  const t = ctx.currentTime
  for (const mult of [1, 2.01, 3.02]) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = freq * mult
    env(g, t, 0.08 / mult, 0.003, 1.2 / mult)
    o.connect(g).connect(ctx.destination)
    o.start(t)
    o.stop(t + 1.4)
  }
}

/** Whoosh for curtain moves. */
export function whoosh(dur = 0.9) {
  if (!enabled || !ctx) return
  const t = ctx.currentTime
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const n = ctx.createBufferSource()
  n.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.setValueAtTime(200, t)
  f.frequency.exponentialRampToValueAtTime(1600, t + dur * 0.5)
  f.frequency.exponentialRampToValueAtTime(300, t + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.12, t + dur * 0.45)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  n.connect(f).connect(g).connect(ctx.destination)
  n.start(t)
}
