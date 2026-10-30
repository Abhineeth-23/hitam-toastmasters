/**
 * Tiny client-side store used by the admin dashboard.
 * Everything lives in this browser's localStorage — there is no server.
 * Use "Export JSON" in /admin to move data between machines.
 */

export type MeetingOverride = {
  date?: string // ISO datetime
  theme?: string
  venue?: string
  wordOfTheDay?: string
  roles?: Record<string, string>
}

export type Announcement = { id: string; title: string; body: string; date: string; pinned?: boolean }
export type GuestRSVP = { id: string; name: string; email: string; branch: string; year: string; note?: string; created: string }
export type ContactMsg = { id: string; name: string; email: string; subject: string; message: string; created: string }

export type Store = {
  meeting?: MeetingOverride
  announcements: Announcement[]
  rsvps: GuestRSVP[]
  messages: ContactMsg[]
}

const KEY = 'hitam-tm-store-v1'
const EMPTY: Store = { announcements: [], rsvps: [], messages: [] }

export function readStore(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    return { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    return { ...EMPTY }
  }
}

export function writeStore(next: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('hitam-store'))
  } catch {
    /* storage unavailable — fail quietly */
  }
}

export function updateStore(fn: (s: Store) => Store) {
  writeStore(fn(readStore()))
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
