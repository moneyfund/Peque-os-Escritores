import { motion } from 'motion/react'

function VowelsArt() {
  return <svg viewBox="0 0 120 100" aria-hidden="true">
    <defs>
      <linearGradient id="va" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff7a9e"/><stop offset="1" stopColor="#e63d78"/></linearGradient>
      <linearGradient id="vb" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#42b9ff"/><stop offset="1" stopColor="#1269e8"/></linearGradient>
      <linearGradient id="vc" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffd44f"/><stop offset="1" stopColor="#ff9c19"/></linearGradient>
      <filter id="vs"><feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#24406f" floodOpacity=".22"/></filter>
    </defs>
    <g filter="url(#vs)" fontFamily="Arial Rounded MT Bold, system-ui, sans-serif" fontWeight="900">
      <text x="13" y="74" fontSize="54" fill="url(#va)" transform="rotate(-8 13 74)">A</text>
      <text x="44" y="47" fontSize="52" fill="url(#vb)" transform="rotate(5 44 47)">B</text>
      <text x="75" y="78" fontSize="50" fill="url(#vc)" transform="rotate(7 75 78)">C</text>
    </g>
    <circle cx="17" cy="18" r="3" fill="#fff" opacity=".8"/>
    <path d="M105 13l2.5 6.5L114 22l-6.5 2.5L105 31l-2.5-6.5L96 22l6.5-2.5z" fill="#fff" opacity=".82"/>
  </svg>
}

function NumbersArt() {
  return <svg viewBox="0 0 120 100" aria-hidden="true">
    <defs>
      <linearGradient id="n1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#40a9ff"/><stop offset="1" stopColor="#176fd8"/></linearGradient>
      <linearGradient id="n2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffb321"/><stop offset="1" stopColor="#f47820"/></linearGradient>
      <linearGradient id="n3" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#68dc77"/><stop offset="1" stopColor="#26a94d"/></linearGradient>
      <filter id="ns"><feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#24406f" floodOpacity=".22"/></filter>
    </defs>
    <g filter="url(#ns)" fontFamily="Arial Rounded MT Bold, system-ui, sans-serif" fontWeight="900">
      <text x="37" y="49" fontSize="56" fill="url(#n1)" transform="rotate(3 37 49)">1</text>
      <text x="15" y="86" fontSize="49" fill="url(#n2)" transform="rotate(-8 15 86)">2</text>
      <text x="67" y="84" fontSize="50" fill="url(#n3)" transform="rotate(8 67 84)">3</text>
    </g>
    <path d="M104 12l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" opacity=".9"/>
  </svg>
}

function ColorsArt() {
  return <svg viewBox="0 0 120 100" aria-hidden="true">
    <defs>
      <linearGradient id="pal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffd85b"/><stop offset="1" stopColor="#f1a52c"/></linearGradient>
      <linearGradient id="brush" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#46aaff"/><stop offset="1" stopColor="#1b67d8"/></linearGradient>
      <filter id="cs"><feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#24406f" floodOpacity=".2"/></filter>
    </defs>
    <g filter="url(#cs)">
      <path d="M20 61c0-27 21-46 48-46 23 0 40 12 40 30 0 12-8 18-18 18H79c-6 0-9 6-6 11 4 7-1 16-12 17-23 2-41-10-41-30z" fill="url(#pal)"/>
      <circle cx="48" cy="37" r="7" fill="#ff5c82"/><circle cx="72" cy="31" r="7" fill="#5d7df3"/><circle cx="88" cy="46" r="7" fill="#55d59a"/><circle cx="42" cy="61" r="7" fill="#55b7ff"/>
      <g transform="translate(78 6) rotate(25)">
        <rect width="13" height="61" rx="6" fill="url(#brush)"/>
        <path d="M0 58h13L6.5 75z" fill="#7b4c2c"/>
        <rect y="4" width="13" height="7" rx="3" fill="#bceaff"/>
      </g>
    </g>
  </svg>
}

function ShapesArt() {
  return <svg viewBox="0 0 120 100" aria-hidden="true">
    <defs>
      <linearGradient id="ss1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffd74d"/><stop offset="1" stopColor="#ffad18"/></linearGradient>
      <linearGradient id="ss2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff6388"/><stop offset="1" stopColor="#e63d6b"/></linearGradient>
      <linearGradient id="ss3" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#5c9dff"/><stop offset="1" stopColor="#3455df"/></linearGradient>
      <filter id="ssh"><feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#24406f" floodOpacity=".2"/></filter>
    </defs>
    <g filter="url(#ssh)">
      <path d="M31 12l6 13 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2z" fill="url(#ss1)"/>
      <circle cx="40" cy="72" r="17" fill="url(#ss2)"/>
      <path d="M70 43h28l10 31H60z" fill="url(#ss3)"/>
    </g>
  </svg>
}

function WordsArt() {
  return <svg viewBox="0 0 120 100" aria-hidden="true">
    <defs>
      <linearGradient id="fur" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffbd58"/><stop offset="1" stopColor="#f17a39"/></linearGradient>
      <filter id="ws"><feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#24406f" floodOpacity=".2"/></filter>
    </defs>
    <g filter="url(#ws)">
      <path d="M27 35L20 12l25 13M93 35l7-23-25 13" fill="url(#fur)" stroke="#dc6e39" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M24 51c0-25 16-38 36-38s36 13 36 38c0 23-16 38-36 38S24 74 24 51z" fill="url(#fur)"/>
      <ellipse cx="46" cy="51" rx="6" ry="8" fill="#1e375d"/><ellipse cx="74" cy="51" rx="6" ry="8" fill="#1e375d"/>
      <circle cx="44" cy="48" r="2" fill="#fff"/><circle cx="72" cy="48" r="2" fill="#fff"/>
      <path d="M55 63c3 3 7 3 10 0" fill="none" stroke="#81492f" strokeWidth="3" strokeLinecap="round"/>
      <path d="M58 58l2 2 2-2" fill="none" stroke="#81492f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="35" cy="63" r="7" fill="#ff8b8d" opacity=".55"/><circle cx="85" cy="63" r="7" fill="#ff8b8d" opacity=".55"/>
      <path d="M101 38c7 5 7 13 0 18M108 31c12 9 12 24 0 33" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".9"/>
    </g>
  </svg>
}

const artMap = {
  vowels: VowelsArt,
  numbers: NumbersArt,
  colors: ColorsArt,
  shapes: ShapesArt,
  words: WordsArt,
}

export default function CategoryArtwork({ name, size = 96, compact = false, animated = true, className = '' }) {
  const Art = artMap[name] || VowelsArt
  return (
    <motion.span
      className={`category-artwork ${compact ? 'category-artwork-compact' : ''} ${className}`}
      style={{ width: size }}
      animate={animated ? { y: [0, -5, 0], rotate: [-1.5, 1.5, -1.5] } : undefined}
      transition={animated ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
      aria-hidden="true"
    >
      <Art />
    </motion.span>
  )
}
