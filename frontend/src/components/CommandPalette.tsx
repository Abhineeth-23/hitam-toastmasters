import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ROUTES, TERMS, ACHIEVEMENTS } from '../data/club'
import { setSound, soundEnabled } from '../lib/sound'
import './palette.css'

type Item = { id: string; label: string; hint: string; group: string; run: () => void }

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  const items = useMemo<Item[]>(() => {
    // Hash targets are scrolled to by TransitionRoutes once the page is on stage.
    const go = (p: string, hash?: string) => () => navigate(hash ? `${p}#${hash}` : p)
    const pages = ROUTES.map((r) => ({ id: r.path, label: r.label, hint: r.blurb, group: 'Pages', run: go(r.path) }))
    const actions: Item[] = [
      { id: 'tt', label: 'Spin a Table Topic', hint: 'Practise impromptu speaking', group: 'Actions', run: go('/', 'table-topics') },
      { id: 'next', label: 'When is the next meeting?', hint: '1st & 3rd Saturday', group: 'Actions', run: go('/contact') },
      { id: 'rsvp', label: 'RSVP as a guest', hint: 'Come watch a meeting', group: 'Actions', run: go('/join', 'rsvp') },
      { id: 'sound', label: soundEnabled() ? 'Turn sound off' : 'Turn sound on', hint: 'Interface sounds', group: 'Actions', run: () => setSound(!soundEnabled()) },
    ]
    const people = TERMS.flatMap((t) =>
      t.officers.map((o) => ({ id: `${t.term}-${o.role}`, label: o.name, hint: `${o.role} · ${t.term}`, group: 'People', run: go('/history', `term-${t.term.slice(0, 4)}`) })),
    )
    const awards = ACHIEVEMENTS.map((a, i) => ({ id: `a${i}`, label: a.title, hint: a.who, group: 'Achievements', run: go('/achievements') }))
    return [...pages, ...actions, ...awards, ...people]
  }, [navigate, open])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    const list = s ? items.filter((i) => (i.label + ' ' + i.hint + ' ' + i.group).toLowerCase().includes(s)) : items.filter((i) => i.group === 'Pages' || i.group === 'Actions')
    return list.slice(0, 40)
  }, [q, items])

  useEffect(() => {
    if (open) {
      setQ('')
      setSel(0)
      setTimeout(() => input.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => setSel(0), [q])

  const choose = (i: Item | undefined) => {
    if (!i) return
    onClose()
    i.run()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="palette" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            className="palette__box"
            role="dialog"
            aria-modal="true"
            aria-label="Quick navigation"
            initial={{ y: 30, scale: 0.96, opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <div className="palette__search">
              <span className="mono accent">›</span>
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pages, people, awards…"
                aria-label="Search"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setSel((s) => Math.min(filtered.length - 1, s + 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setSel((s) => Math.max(0, s - 1))
                  } else if (e.key === 'Enter') choose(filtered[sel])
                  else if (e.key === 'Escape') onClose()
                }}
              />
              <kbd className="mono">esc</kbd>
            </div>
            <ul className="palette__list" data-lenis-prevent>
              {filtered.length === 0 && <li className="palette__empty muted">No results. Try “president” or “award”.</li>}
              {filtered.map((it, i) => (
                <li key={it.id}>
                  {(i === 0 || filtered[i - 1].group !== it.group) && <p className="palette__group mono">{it.group}</p>}
                  <button className={`palette__item ${i === sel ? 'is-sel' : ''}`} onPointerEnter={() => setSel(i)} onClick={() => choose(it)}>
                    <span>{it.label}</span>
                    <span className="palette__hint">{it.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="palette__foot mono muted">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>ctrl/⌘ K toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
