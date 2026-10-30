import { useRef } from 'react'
import { useSectionThemes } from '../lib/useSectionThemes'
import { usePageMeta } from '../lib/usePageMeta'
import Hero from '../sections/Hero'
import Manifesto from '../sections/Manifesto'
import Stats from '../sections/Stats'
import Anatomy from '../sections/Anatomy'
import TableTopics from '../sections/TableTopics'
import Pathways from '../sections/Pathways'
import Trophies from '../sections/Trophies'
import Moments from '../sections/Moments'
import Spotlight from '../sections/Spotlight'

export default function Home({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  useSectionThemes(root)
  usePageMeta('HITAM Toastmasters — Find Your Voice', 'The Toastmasters club of Hyderabad Institute of Technology and Management. Public speaking and leadership, twice a month.')

  return (
    <div ref={root}>
      <Hero ready={ready} />
      <Manifesto />
      <Stats />
      <Anatomy />
      <TableTopics />
      <Pathways />
      <Trophies />
      <Moments />
      <Spotlight />
    </div>
  )
}
