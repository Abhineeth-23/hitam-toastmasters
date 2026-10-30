import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { GALLERY } from '../data/club'
import SplitReveal from '../components/SplitReveal'
import './moments.css'

const LAYOUT = [
  { x: '4%', y: '10%', r: -8, w: 'clamp(200px, 24vw, 360px)' },
  { x: '28%', y: '2%', r: 5, w: 'clamp(180px, 20vw, 300px)' },
  { x: '52%', y: '14%', r: -3, w: 'clamp(160px, 17vw, 260px)' },
  { x: '70%', y: '4%', r: 9, w: 'clamp(200px, 24vw, 360px)' },
  { x: '14%', y: '48%', r: 6, w: 'clamp(170px, 18vw, 280px)' },
  { x: '42%', y: '44%', r: -6, w: 'clamp(200px, 23vw, 340px)' },
  { x: '66%', y: '50%', r: 3, w: 'clamp(220px, 28vw, 420px)' },
]

export default function Moments() {
  const area = useRef<HTMLDivElement>(null)
  const [order, setOrder] = useState(GALLERY.map((_, i) => i))
  const bump = (i: number) => setOrder((o) => [...o.filter((k) => k !== i), i])

  return (
    <section className="mom section" data-theme="yellow" aria-label="Moments from club meetings">
      <div className="wrap mom__head">
        <p className="eyebrow">Moments</p>
        <SplitReveal as="h2" className="mom__title display">
          Saturdays, <span className="serif">collected.</span>
        </SplitReveal>
        <p className="mono mom__hint">Drag the photos around — they don’t mind.</p>
      </div>
      <div ref={area} className="mom__area wrap">
        {GALLERY.map((g, i) => {
          const l = LAYOUT[i % LAYOUT.length]
          return (
            <motion.figure
              key={g.src}
              className="mom__photo"
              style={{ left: l.x, top: l.y, width: l.w, zIndex: order.indexOf(i) + 1 }}
              initial={{ rotate: l.r, y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16, delay: i * 0.06 }}
              drag
              dragConstraints={area}
              dragElastic={0.18}
              dragTransition={{ power: 0.35, timeConstant: 260 }}
              whileDrag={{ scale: 1.06, rotate: 0, cursor: 'grabbing' }}
              whileHover={{ scale: 1.03 }}
              onPointerDown={() => bump(i)}
              data-cursor="Drag"
              data-cursor-tone="maroon"
            >
              <img src={g.src} alt={g.caption} draggable={false} loading="lazy" />
              <figcaption className="serif">{g.caption}</figcaption>
            </motion.figure>
          )
        })}
      </div>
    </section>
  )
}
