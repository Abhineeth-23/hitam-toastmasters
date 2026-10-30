import { useRef, useState, type FormEvent } from 'react'
import PageHero from '../components/PageHero'
import SplitReveal from '../components/SplitReveal'
import Countdown from '../components/Countdown'
import { useSectionThemes } from '../lib/useSectionThemes'
import { usePageMeta } from '../lib/usePageMeta'
import { readStore, updateStore, uid } from '../lib/store'
import { CLUB } from '../data/club'
import '../styles/pages.css'

export default function Contact() {
  const root = useRef<HTMLDivElement>(null)
  const [sent, setSent] = useState(false)
  const meeting = readStore().meeting
  useSectionThemes(root)
  usePageMeta('Contact — HITAM Toastmasters', 'Where and when HITAM Toastmasters Club meets, and how to get in touch.')

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const msg = { id: uid(), name: get('name'), email: get('email'), subject: get('subject') || 'Hello from the website', message: get('message'), created: new Date().toISOString() }
    updateStore((s) => ({ ...s, messages: [msg, ...s.messages] }))
    setSent(true)
    // Static site: hand the message to the visitor's mail app as well.
    const body = encodeURIComponent(`${msg.message}\n\n— ${msg.name} (${msg.email})`)
    window.location.href = `mailto:${CLUB.email}?subject=${encodeURIComponent(msg.subject)}&body=${body}`
  }

  return (
    <div ref={root}>
      <PageHero
        index="06"
        kicker="Meeting venue & inquiries"
        title="Contact"
        lede={<p>We meet on campus on the 1st and 3rd Saturday of every month. The door is open — the hardest part is walking through it.</p>}
        aside={<p className="mono muted">{CLUB.city}</p>}
      />

      <section className="section" data-theme="dark" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="info-grid">
            <div className="info">
              <p className="eyebrow">When</p>
              <p className="info__big">{CLUB.meetingRule}</p>
              <Countdown />
              {meeting?.theme && (
                <p className="mono">
                  Theme · <span className="accent">{meeting.theme}</span>
                </p>
              )}
              {meeting?.wordOfTheDay && (
                <p className="mono">
                  Word of the day · <span className="accent">{meeting.wordOfTheDay}</span>
                </p>
              )}
            </div>
            <div className="info">
              <p className="eyebrow eyebrow--campus">Where</p>
              <p className="info__big">{meeting?.venue || CLUB.venue}</p>
              <p className="muted">{CLUB.address}</p>
              <a className="btn btn--ghost" style={{ justifySelf: 'start' }} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLUB.mapsQuery)}`} target="_blank" rel="noreferrer">
                Directions ↗
              </a>
            </div>
            <div className="info">
              <p className="eyebrow">Write</p>
              <a className="info__big info__big--email" href={`mailto:${CLUB.email}`}>
                {/* if it has to wrap, wrap at the @, not mid-word */}
                {CLUB.email.split('@')[0]}
                <wbr />@{CLUB.email.split('@')[1]}
              </a>
              <p className="muted">Questions about membership, guest visits, joint meetings or contests — the VP Public Relations will get back to you.</p>
            </div>
          </div>

          <div className="map" style={{ marginTop: 60 }}>
            <iframe title="Map to HITAM campus" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(CLUB.mapsQuery)}&output=embed`} />
          </div>
        </div>
      </section>

      <section className="section" data-theme="light">
        <div className="wrap two-col">
          <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
            <p className="eyebrow">Inquiries</p>
            <SplitReveal as="h2" className="sec-title display">
              Say it <span className="serif">out loud.</span>
            </SplitReveal>
            <p className="muted">Or, you know, type it. That works too.</p>
          </div>
          {sent ? (
            <div className="success" role="status">
              <p className="eyebrow">Message ready</p>
              <p className="serif">Thanks — your mail app should open now.</p>
              <p className="form__note">If it didn’t, email us directly at {CLUB.email}.</p>
              <button className="btn btn--ghost" onClick={() => setSent(false)} style={{ justifySelf: 'start' }}>
                Write another
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <div className="form__row">
                <div className="field">
                  <label htmlFor="c-name">Name</label>
                  <input id="c-name" name="name" required autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="c-email">Email</label>
                  <input id="c-email" name="email" type="email" required autoComplete="email" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-subject">Subject</label>
                <input id="c-subject" name="subject" placeholder="Joint meeting with our club" />
              </div>
              <div className="field">
                <label htmlFor="c-msg">Message</label>
                <textarea id="c-msg" name="message" required />
              </div>
              <button className="btn" type="submit" style={{ justifySelf: 'start' }}>
                Send <span className="arrow">→</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
