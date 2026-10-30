import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { usePageMeta } from '../lib/usePageMeta'
import { readStore, updateStore, writeStore, uid, type Store } from '../lib/store'
import { nextMeeting, formatIST } from '../lib/meeting'
import { gavel } from '../lib/sound'
import { MEETING_ROLES } from '../data/club'
import './admin.css'

/**
 * Officers' dashboard.
 * IMPORTANT: this is a client-side gate only (the site has no backend). It keeps
 * casual visitors out of the UI, it is NOT real security. Data lives in this
 * browser's localStorage; use Export/Import to move it between devices.
 * Change the passcode by replacing PASS_HASH with the SHA-256 of a new one.
 */
const PASS_HASH = '0a1844b75bead1d1cd367a4315db0bba8f20c22223f6c618a79943b7faf40f9b' // "gavel@2018"
const SESSION = 'hitam-tm-admin'

async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function useStore() {
  const [s, setS] = useState<Store>(readStore)
  useEffect(() => {
    const on = () => setS(readStore())
    window.addEventListener('hitam-store', on)
    return () => window.removeEventListener('hitam-store', on)
  }, [])
  return s
}

function Gate({ onIn }: { onIn: () => void }) {
  const [err, setErr] = useState(false)
  const [busy, setBusy] = useState(false)
  const box = useRef<HTMLFormElement>(null)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    const v = String(new FormData(e.currentTarget).get('pass') ?? '')
    const ok = (await sha256(v)) === PASS_HASH
    setBusy(false)
    if (ok) {
      gavel()
      try {
        sessionStorage.setItem(SESSION, '1')
      } catch {
        /* ignore */
      }
      onIn()
    } else {
      setErr(true)
      box.current?.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-12px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(0)' }], { duration: 420 })
    }
  }

  return (
    <section className="adm-gate" data-theme="dark">
      <form ref={box} className="adm-gate__box" onSubmit={submit}>
        <div className="adm-gate__lights" aria-hidden="true">
          <i className={err ? 'r on' : 'r'} />
          <i className={busy ? 'y on' : 'y'} />
          <i className="g" />
        </div>
        <p className="eyebrow">Officers only · 07</p>
        <h1 className="display adm-gate__title">
          Back<span className="serif">stage</span>
        </h1>
        <div className="field">
          <label htmlFor="pass">Passcode</label>
          <input id="pass" name="pass" type="password" autoComplete="current-password" required autoFocus onChange={() => setErr(false)} />
        </div>
        {err && <p className="adm-err mono">Red light. Wrong passcode.</p>}
        <button className="btn" type="submit" disabled={busy}>
          Enter <span className="arrow">→</span>
        </button>
        <p className="adm-note">Client-side gate for club officers. Data saved here stays in this browser.</p>
      </form>
    </section>
  )
}

const TABS = ['Meeting', 'Announcements', 'Guests', 'Messages', 'Data'] as const

function toLocalInput(d: Date) {
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60e3).toISOString().slice(0, 16)
}

function MeetingTab({ s }: { s: Store }) {
  const m = s.meeting ?? {}
  const [saved, setSaved] = useState(false)
  const auto = nextMeeting(new Date())
  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const date = String(f.get('date') || '')
    const roles: Record<string, string> = {}
    MEETING_ROLES.forEach((r) => {
      const v = String(f.get(`role-${r.n}`) || '').trim()
      if (v) roles[r.role] = v
    })
    updateStore((st) => ({
      ...st,
      meeting: {
        date: date ? new Date(date).toISOString() : undefined,
        theme: String(f.get('theme') || '') || undefined,
        venue: String(f.get('venue') || '') || undefined,
        wordOfTheDay: String(f.get('word') || '') || undefined,
        roles,
      },
    }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }
  return (
    <form className="adm-card form" onSubmit={save}>
      <div className="adm-card__head">
        <h2>Next meeting</h2>
        <p className="muted">Leave the date empty to use the automatic 1st/3rd Saturday schedule (next: {formatIST(auto, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })} IST).</p>
      </div>
      <div className="form__row">
        <div className="field">
          <label htmlFor="m-date">Date & time (your local time)</label>
          <input id="m-date" name="date" type="datetime-local" defaultValue={m.date ? toLocalInput(new Date(m.date)) : ''} />
        </div>
        <div className="field">
          <label htmlFor="m-venue">Venue / room</label>
          <input id="m-venue" name="venue" defaultValue={m.venue} placeholder="Seminar Hall, Block B" />
        </div>
      </div>
      <div className="form__row">
        <div className="field">
          <label htmlFor="m-theme">Theme</label>
          <input id="m-theme" name="theme" defaultValue={m.theme} placeholder="Courage" />
        </div>
        <div className="field">
          <label htmlFor="m-word">Word of the day</label>
          <input id="m-word" name="word" defaultValue={m.wordOfTheDay} placeholder="Resilient" />
        </div>
      </div>
      <p className="mono muted">Role assignments</p>
      <div className="adm-roles">
        {MEETING_ROLES.map((r) => (
          <div key={r.n} className="field">
            <label htmlFor={`role-${r.n}`}>{r.role}</label>
            <input id={`role-${r.n}`} name={`role-${r.n}`} defaultValue={m.roles?.[r.role]} placeholder="TM …" />
          </div>
        ))}
      </div>
      <div className="adm-actions">
        <button className="btn" type="submit">
          {saved ? 'Saved ✓' : 'Save meeting'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => updateStore((st) => ({ ...st, meeting: undefined }))}>
          Reset to automatic
        </button>
      </div>
    </form>
  )
}

function AnnouncementsTab({ s }: { s: Store }) {
  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const title = String(f.get('title') || '').trim()
    if (!title) return
    updateStore((st) => ({ ...st, announcements: [{ id: uid(), title, body: String(f.get('body') || ''), date: new Date().toISOString(), pinned: f.get('pinned') === 'on' }, ...st.announcements] }))
    e.currentTarget.reset()
  }
  return (
    <div className="adm-grid">
      <form className="adm-card form" onSubmit={add}>
        <div className="adm-card__head">
          <h2>New announcement</h2>
          <p className="muted">Pinned announcements appear at the top of the home page.</p>
        </div>
        <div className="field">
          <label htmlFor="a-title">Title</label>
          <input id="a-title" name="title" required placeholder="Humorous Speech Contest — sign-ups open" />
        </div>
        <div className="field">
          <label htmlFor="a-body">Details</label>
          <textarea id="a-body" name="body" />
        </div>
        <label className="adm-check">
          <input type="checkbox" name="pinned" defaultChecked /> Pin to home page
        </label>
        <button className="btn" type="submit">
          Publish
        </button>
      </form>
      <div className="adm-card">
        <div className="adm-card__head">
          <h2>Published</h2>
        </div>
        {s.announcements.length === 0 && <p className="muted">Nothing yet.</p>}
        <ul className="adm-list">
          <AnimatePresence initial={false}>
            {s.announcements.map((a) => (
              <motion.li key={a.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}>
                <div>
                  <p>
                    {a.pinned && <span className="adm-pin mono">Pinned</span>} {a.title}
                  </p>
                  <p className="mono muted">{new Date(a.date).toLocaleString()}</p>
                </div>
                <div className="adm-row-actions">
                  <button className="mono" onClick={() => updateStore((st) => ({ ...st, announcements: st.announcements.map((x) => (x.id === a.id ? { ...x, pinned: !x.pinned } : x)) }))}>
                    {a.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button className="mono adm-del" onClick={() => updateStore((st) => ({ ...st, announcements: st.announcements.filter((x) => x.id !== a.id) }))}>
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  )
}

function toCSV(rows: Record<string, unknown>[]) {
  if (!rows.length) return ''
  const keys = Object.keys(rows[0])
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n')
}

function download(name: string, text: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function TableTab({ rows, kind }: { rows: Record<string, string | undefined>[]; kind: 'rsvps' | 'messages' }) {
  const cols = kind === 'rsvps' ? ['name', 'email', 'branch', 'year', 'note', 'created'] : ['name', 'email', 'subject', 'message', 'created']
  return (
    <div className="adm-card">
      <div className="adm-card__head adm-card__head--row">
        <h2>
          {kind === 'rsvps' ? 'Guest RSVPs' : 'Messages'} <span className="muted">({rows.length})</span>
        </h2>
        <div className="adm-actions">
          <button className="btn btn--ghost" disabled={!rows.length} onClick={() => download(`hitam-tm-${kind}.csv`, toCSV(rows), 'text/csv')}>
            Export CSV
          </button>
          <button className="btn btn--ghost" disabled={!rows.length} onClick={() => confirm(`Clear all ${kind}?`) && updateStore((st) => ({ ...st, [kind]: [] }))}>
            Clear
          </button>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="muted">Nothing yet. Submissions from this browser appear here.</p>
      ) : (
        <div className="adm-table" data-lenis-prevent>
          <table>
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c} className="mono">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {cols.map((c) => (
                    <td key={c}>{c === 'created' && r[c] ? new Date(r[c]!).toLocaleString() : r[c]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function DataTab({ s }: { s: Store }) {
  const [msg, setMsg] = useState('')
  const importFile = async (file: File) => {
    try {
      const data = JSON.parse(await file.text())
      writeStore({ announcements: [], rsvps: [], messages: [], ...data })
      setMsg('Imported ✓')
    } catch {
      setMsg('That file is not valid JSON.')
    }
  }
  return (
    <div className="adm-card">
      <div className="adm-card__head">
        <h2>Data</h2>
        <p className="muted">This site has no server. Everything above is stored in this browser. Export a backup, or import one on another device.</p>
      </div>
      <div className="adm-actions">
        <button className="btn" onClick={() => download('hitam-tm-backup.json', JSON.stringify(s, null, 2), 'application/json')}>
          Export JSON
        </button>
        <label className="btn btn--ghost">
          Import JSON
          <input type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
        </label>
      </div>
      {msg && <p className="mono" style={{ marginTop: 16 }}>{msg}</p>}
      <p className="adm-note" style={{ marginTop: 28 }}>
        To publish changes for everyone (team, achievements, history), edit <code>src/data/club.ts</code> and redeploy.
      </p>
    </div>
  )
}

export default function Admin() {
  const [inside, setInside] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION) === '1'
    } catch {
      return false
    }
  })
  const [tab, setTab] = useState<(typeof TABS)[number]>('Meeting')
  const s = useStore()
  usePageMeta('Admin — HITAM Toastmasters')

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark'
  }, [])

  if (!inside) return <Gate onIn={() => setInside(true)} />

  const counts: Partial<Record<(typeof TABS)[number], number>> = { Announcements: s.announcements.length, Guests: s.rsvps.length, Messages: s.messages.length }

  return (
    <section className="adm" data-theme="dark">
      <div className="wrap">
        <header className="adm__head">
          <div>
            <p className="eyebrow">Officers’ dashboard</p>
            <h1 className="display adm__title">
              Back<span className="serif">stage</span>
            </h1>
          </div>
          <div className="adm__stats">
            <div>
              <span className="display">{s.rsvps.length}</span>
              <span className="mono muted">Guest RSVPs</span>
            </div>
            <div>
              <span className="display">{s.messages.length}</span>
              <span className="mono muted">Messages</span>
            </div>
            <div>
              <span className="display">{s.announcements.filter((a) => a.pinned).length}</span>
              <span className="mono muted">Pinned</span>
            </div>
            <button
              className="btn btn--ghost"
              onClick={() => {
                try {
                  sessionStorage.removeItem(SESSION)
                } catch {
                  /* ignore */
                }
                setInside(false)
              }}
            >
              Lock
            </button>
          </div>
        </header>

        <nav className="adm__tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={`chip ${tab === t ? 'is-on' : ''}`} onClick={() => setTab(t)}>
              {tab === t && <motion.span layoutId="adm-tab" className="chip__bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              {t}
              {counts[t] ? <span className="chip__count">{counts[t]}</span> : null}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {tab === 'Meeting' && <MeetingTab s={s} />}
            {tab === 'Announcements' && <AnnouncementsTab s={s} />}
            {tab === 'Guests' && <TableTab kind="rsvps" rows={s.rsvps} />}
            {tab === 'Messages' && <TableTab kind="messages" rows={s.messages} />}
            {tab === 'Data' && <DataTab s={s} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
