import './logo.css'

/** Original spinning-globe mark (a nod to the Toastmasters globe, not a copy of it). */
export function GlobeMark({ size = 34 }: { size?: number }) {
  return (
    <svg className="globe" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <clipPath id="globe-clip">
          <circle cx="20" cy="20" r="15" />
        </clipPath>
      </defs>
      <circle cx="20" cy="20" r="18.5" className="globe__ring" />
      <circle cx="20" cy="20" r="15" className="globe__body" />
      <g clipPath="url(#globe-clip)" className="globe__lines">
        <ellipse cx="20" cy="20" rx="15" ry="15" className="globe__m globe__m--1" />
        <ellipse cx="20" cy="20" rx="10" ry="15" className="globe__m globe__m--2" />
        <ellipse cx="20" cy="20" rx="4" ry="15" className="globe__m globe__m--3" />
        <path d="M5 20h30M7 13h26M7 27h26" />
      </g>
      <rect x="2" y="17" width="36" height="6" rx="1.2" className="globe__band" />
    </svg>
  )
}

export default function Logo() {
  return (
    <span className="logo">
      <GlobeMark />
      <span className="logo__text">
        <span className="logo__top">HITAM</span>
        <span className="logo__bottom">Toastmasters</span>
      </span>
    </span>
  )
}
