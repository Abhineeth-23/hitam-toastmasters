import { readStore } from './store'

/** Club meetings: 1st & 3rd Saturday, default start 10:00 IST. */
const IST_OFFSET_MIN = 330

function nthSaturday(year: number, month: number, n: number) {
  const first = new Date(Date.UTC(year, month, 1))
  const offset = (6 - first.getUTCDay() + 7) % 7
  return 1 + offset + (n - 1) * 7
}

/** Returns a Date (absolute instant) for the next meeting start. */
export function nextMeeting(now = new Date(), hour = 10, minute = 0): Date {
  const override = readStore().meeting
  if (override?.date) {
    const d = new Date(override.date)
    if (!Number.isNaN(d.getTime()) && d.getTime() > now.getTime() - 2 * 3600e3) return d
  }
  // Work in IST wall-clock.
  const ist = new Date(now.getTime() + IST_OFFSET_MIN * 60e3)
  let y = ist.getUTCFullYear()
  let m = ist.getUTCMonth()
  for (let i = 0; i < 3; i++) {
    for (const n of [1, 3]) {
      const day = nthSaturday(y, m, n)
      const utc = Date.UTC(y, m, day, hour, minute) - IST_OFFSET_MIN * 60e3
      // Keep "today's" meeting live for 2 hours after it starts.
      if (utc + 2 * 3600e3 > now.getTime()) return new Date(utc)
    }
    m++
    if (m > 11) {
      m = 0
      y++
    }
  }
  return new Date(now.getTime() + 14 * 864e5)
}

export function formatIST(d: Date, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', ...opts }).format(d)
}

export function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

export const pad = (n: number, l = 2) => String(n).padStart(l, '0')
