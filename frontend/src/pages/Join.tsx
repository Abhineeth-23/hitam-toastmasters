import { useRef, useState, type FormEvent } from 'react'
import PageHero from '../components/PageHero'
import SplitReveal from '../components/SplitReveal'
import Countdown, { useNextMeeting } from '../components/Countdown'
import { useSectionThemes } from '../lib/useSectionThemes'
import { usePageMeta } from '../lib/usePageMeta'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { formatIST } from '../lib/meeting'
import { updateStore, uid } from '../lib/store'
import { chime } from '../lib/sound'
import { CLUB, FAQ, FIRST_MEETING, GUEST_STEPS } from '../data/club'
import '../styles/pages.css'

function RSVP() {
  const [done, setDone] = useState<string | null>(null)
  const { date } = useNextMeeting()

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const name = get('name')
    updateStore((s) => ({
      ...s,
      rsvps: [{ id: uid(), name, email: get('email'), branch: get('branch'), year: get('year'), note: get('note'), created: new Date().toISOString() }, ...s.rsvps],
    }))
    chime(1046)
    setDone(name.split(' ')[0] || 'friend')
  }

  if (done)
    return (
      <div className="success" role="status">
        <p className="eyebrow">You’re on the list</p>
        <p className="serif">See you there, {done}.</p>
        <p>
          Next meeting: <b>{formatIST(date, { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' })} IST</b> · {CLUB.venue}
        </p>
        <p className="form__note">Saved on this device for the club officers. If you’d like a reply, also drop us a line at {CLUB.email}.</p>
        <button className="btn btn--ghost" onClick={() => setDone(null)} style={{ justifySelf: 'start' }}>
          RSVP someone else
        </button>
      </div>
    )

  return (
    <form className="form" onSubmit={submit}>
      <div className="form__row">
        <div className="field">
          <label htmlFor="r-name">Your name</label>
          <input id="r-name" name="name" required autoComplete="name" placeholder="Priya Sharma" />
        </div>
        <div className="field">
          <label htmlFor="r-email">Email</label>
          <input id="r-email" name="email" type="email" required autoComplete="email" placeholder="you@hitam.org" />
        </div>
      </div>
      <div className="form__row">
        <div className="field">
          <label htmlFor="r-branch">Branch</label>
          <select id="r-branch" name="branch" defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            {['CSE', 'CSE (AI & ML)', 'CSE (Data Science)', 'CSE (Cyber Security)', 'ECE', 'EEE', 'Mechanical', 'Civil', 'MBA', 'Other'].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="r-year">Year</label>
          <select id="r-year" name="year" defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            {['1st year', '2nd year', '3rd year', '4th year', 'Faculty / staff'].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="r-note">Anything we should know? (optional)</label>
        <textarea id="r-note" name="note" placeholder="I’m terrified of public speaking and that’s exactly why I’m coming." />
      </div>
      <button className="btn" type="submit" style={{ justifySelf: 'start' }}>
        Save my seat <span className="arrow">→</span>
      </button>
    </form>
  )
}

export default function Join() {
  const root = useRef<HTMLDivElement>(null)
  const [faq, setFaq] = useState<number | null>(0)
  useSectionThemes(root)
  usePageMeta('Join — HITAM Toastmasters', 'How to visit your first HITAM Toastmasters meeting as a guest, what happens, and how to become a member.')

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const cards = gsap.utils.toArray<HTMLElement>('.stack__card')
      cards.forEach((c, i) => {
        if (i === cards.length - 1) return
        const st = { trigger: cards[i + 1], start: 'top bottom', end: 'top 15%', scrub: true }
        gsap.to(c, { scale: 0.92, ease: 'none', scrollTrigger: st })
        gsap.to(c.querySelector('.stack__shade'), { opacity: 0.55, ease: 'none', scrollTrigger: st })
      })
      gsap.fromTo('.agenda li', { x: -40, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.07, duration: 0.9, scrollTrigger: { trigger: '.agenda', start: 'top 75%' } })
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <PageHero
        index="05"
        kicker="Join us & guest guide"
        title="Join"
        lede={<p>No audition, no fee to visit, no pressure to speak. Just walk in on a Saturday. Here is everything you need to know about your first meeting.</p>}
        aside={
          <div>
            <p className="mono muted" style={{ marginBottom: 8 }}>
              Next meeting
            </p>
            <Countdown compact />
          </div>
        }
      />

      <section className="section" data-theme="dark" style={{ paddingTop: 60 }}>
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Four steps</p>
            <SplitReveal as="h2" className="sec-title display">
              Guest to <span className="serif">speaker.</span>
            </SplitReveal>
          </div>
          <div className="stack">
            {GUEST_STEPS.map((s) => (
              <article key={s.n} className="stack__card">
                <span className="stack__shade" aria-hidden="true" />
                <span className="stack__n">{s.n}</span>
                <div>
                  <h3 className="stack__title">{s.title}</h3>
                  <p className="stack__body">{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-theme="light">
        <div className="wrap two-col">
          <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
            <p className="eyebrow">Your first meeting</p>
            <SplitReveal as="h2" className="sec-title display">
              What actually <span className="serif">happens.</span>
            </SplitReveal>
            <p className="muted">A typical running order — timings vary meeting to meeting. You’ll be welcomed, introduced, and (only if you want) invited to try a Table Topic.</p>
          </div>
          <ol className="agenda">
            {FIRST_MEETING.map((m) => (
              <li key={m.t}>
                <span className="agenda__t">{m.t}</span>
                <span className="agenda__what">{m.what}</span>
                <span className="mono muted">{m.who}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" data-theme="maroon">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Questions</p>
            <SplitReveal as="h2" className="sec-title display">
              Asked <span className="serif">nervously.</span>
            </SplitReveal>
          </div>
          <div className="rows">
            {FAQ.map((f, i) => (
              <div key={f.q} className={`row ${faq === i ? 'is-open' : ''}`}>
                <button className="row__head" onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>
                  <span className="mono muted">Q{i + 1}</span>
                  <span className="row__title" style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2.4rem)' }}>
                    {f.q}
                  </span>
                  <span className="row__plus" aria-hidden="true" />
                </button>
                <div className="row__body">
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="rsvp" className="section" data-theme="dark">
        <div className="wrap two-col">
          <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
            <p className="eyebrow">RSVP</p>
            <SplitReveal as="h2" className="sec-title display">
              Save a <span className="serif">seat.</span>
            </SplitReveal>
            <p className="muted">Totally optional — you can just turn up. But if you tell us you’re coming, the Sergeant at Arms will keep a seat (and a name tag) ready.</p>
            <Countdown />
          </div>
          <RSVP />
        </div>
      </section>
    </div>
  )
}
