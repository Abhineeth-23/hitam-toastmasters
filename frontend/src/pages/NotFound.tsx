import { useRef } from 'react'
import { Link } from 'react-router'
import { usePageMeta } from '../lib/usePageMeta'
import { useSectionThemes } from '../lib/useSectionThemes'
import Spotlight from '../sections/Spotlight'

export default function NotFound() {
  const root = useRef<HTMLDivElement>(null)
  useSectionThemes(root)
  usePageMeta('Lost backstage — HITAM Toastmasters')
  return (
    <div ref={root}>
      <section className="section" data-theme="dark" style={{ minHeight: '70svh', display: 'grid', alignItems: 'end' }}>
        <div className="wrap" style={{ display: 'grid', gap: 24 }}>
          <p className="eyebrow">Error 404 · Ah-counter: 1</p>
          <h1 className="display" style={{ fontSize: 'clamp(4rem, 14vw, 14rem)' }}>
            Um<span className="serif accent">…</span>
          </h1>
          <p style={{ fontSize: 'var(--fs-m)', maxWidth: '40ch' }}>This page forgot its lines. Happens to the best of us — take a breath and head back to the stage.</p>
          <Link to="/" className="btn" style={{ justifySelf: 'start' }}>
            Back to the stage <span className="arrow">→</span>
          </Link>
        </div>
      </section>
      <Spotlight />
    </div>
  )
}
