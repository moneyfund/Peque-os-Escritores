import { motion } from 'motion/react'

const defs = `
  <filter id="laShadow"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#24406f" flood-opacity=".18"/></filter>
`

function TraceVowels() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><path d="M17 79L43 18h15l27 61H70l-7-17H37l-7 17z" fill="#ff6f9a"/><path d="M42 51h16L50 31z" fill="#fff4f7"/><g transform="translate(72 10) rotate(24)"><rect width="16" height="63" rx="7" fill="#ffc438"/><rect width="16" height="12" rx="6" fill="#ff6b84"/><path d="M0 63h16L8 79z" fill="#f5c18b"/><path d="M5 73h6l-3 6z" fill="#17345f"/></g></g><path d="M15 88c26-8 52-8 80 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".8"/></svg>
}
function ListenVowels() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><path d="M38 22c-17 1-27 14-27 32 0 19 11 29 24 30 8 1 13-5 12-12-1-6-7-9-7-16 0-8 7-12 13-9 6 3 6 11 3 16" fill="none" stroke="#ff7f9f" strokeWidth="10" strokeLinecap="round"/><circle cx="78" cy="47" r="18" fill="#4da8ff"/><text x="78" y="55" textAnchor="middle" fontSize="25" fontWeight="900" fill="#fff">A</text><path d="M98 32c9 7 9 23 0 30M106 24c15 13 15 32 0 46" fill="none" stroke="#6d5ce6" strokeWidth="5" strokeLinecap="round"/></g></svg>
}
function VowelPictures() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><rect x="13" y="14" width="42" height="72" rx="15" fill="#5b9df7"/><text x="34" y="64" textAnchor="middle" fontSize="46" fontWeight="900" fill="#fff">A</text><path d="M76 35c18-8 31 5 27 22-4 17-24 29-33 8-7-17-1-27 6-30z" fill="#ff5f72"/><path d="M82 32c2-8 7-12 13-14" fill="none" stroke="#4da65d" strokeWidth="5" strokeLinecap="round"/><ellipse cx="96" cy="24" rx="8" ry="4" fill="#5bbf69" transform="rotate(-20 96 24)"/></g></svg>
}
function CountObjects() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><circle cx="31" cy="34" r="14" fill="#ff7197"/><rect x="51" y="18" width="27" height="27" rx="8" fill="#ffd04d"/><path d="M98 48L82 20 66 48z" fill="#5f93f4"/><circle cx="35" cy="72" r="13" fill="#55d394"/><rect x="61" y="60" width="30" height="26" rx="8" fill="#b372ed"/></g><text x="99" y="82" textAnchor="middle" fontSize="26" fontWeight="900" fill="#17345f">?</text></svg>
}
function NumberOrder() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)" fontWeight="900" fontFamily="system-ui"><rect x="11" y="54" width="30" height="32" rx="10" fill="#ff8f75"/><rect x="45" y="37" width="30" height="49" rx="10" fill="#ffd14d"/><rect x="79" y="20" width="30" height="66" rx="10" fill="#64c894"/><text x="26" y="77" textAnchor="middle" fontSize="20" fill="#fff">1</text><text x="60" y="68" textAnchor="middle" fontSize="20" fill="#fff">2</text><text x="94" y="58" textAnchor="middle" fontSize="20" fill="#fff">3</text></g><path d="M19 15h79" stroke="#6d5ce6" strokeWidth="5" strokeLinecap="round"/><path d="M92 9l8 6-8 6" fill="none" stroke="#6d5ce6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function TraceNumbers() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><text x="18" y="80" fontSize="78" fontWeight="900" fill="#4d9ff7">2</text><g transform="translate(73 13) rotate(20)"><rect width="16" height="62" rx="7" fill="#ffd042"/><rect width="16" height="11" rx="6" fill="#ff6d87"/><path d="M0 62h16L8 78z" fill="#efc08b"/><path d="M5 72h6l-3 6z" fill="#17345f"/></g></g></svg>
}
function ColorFind() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><circle cx="33" cy="33" r="19" fill="#ff647f"/><circle cx="78" cy="28" r="17" fill="#55b0ff"/><circle cx="35" cy="73" r="16" fill="#ffd24d"/><circle cx="81" cy="70" r="20" fill="#58d28e"/><circle cx="81" cy="70" r="27" fill="none" stroke="#fff" strokeWidth="5"/></g></svg>
}
function ListenColors() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><path d="M18 43h18l18-15v44L36 57H18z" fill="#6d5ce6"/><path d="M62 36c9 7 9 20 0 27M70 28c15 13 15 31 0 43" fill="none" stroke="#6d5ce6" strokeWidth="5" strokeLinecap="round"/><circle cx="95" cy="31" r="12" fill="#ff6382"/><circle cx="96" cy="63" r="12" fill="#4fa7ff"/><circle cx="79" cy="79" r="11" fill="#ffd24d"/></g></svg>
}

function TraceLines() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)" fill="none" strokeLinecap="round"><path d="M13 24h94" stroke="#ff6f95" strokeWidth="8"/><path d="M17 53c18-22 36-22 54 0s27 20 38 4" stroke="#5f9ef7" strokeWidth="8"/><path d="M16 82l25-18 24 18 25-18 17 12" stroke="#55ca8f" strokeWidth="8"/></g><circle cx="13" cy="24" r="5" fill="#ffd04c"/></svg>
}
function TraceGeometry() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)" fill="none" strokeWidth="8" strokeLinejoin="round"><circle cx="29" cy="31" r="18" stroke="#ff6688"/><path d="M60 49L79 15l19 34z" stroke="#ffd04d"/><rect x="18" y="63" width="34" height="27" rx="4" stroke="#5d9ff7"/><path d="M82 60l22 15-22 15-22-15z" stroke="#67cf94"/></g></svg>
}

function IdentifyShapes() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><circle cx="30" cy="31" r="17" fill="#ff6688"/><rect x="54" y="16" width="33" height="33" rx="8" fill="#5a9cf7"/><path d="M31 81L50 52l19 29z" fill="#ffd14c"/><path d="M82 83l15-28 15 28z" fill="#65cf93"/></g><path d="M93 20l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff" opacity=".9"/></svg>
}
function Patterns() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><circle cx="19" cy="50" r="12" fill="#ff6c8d"/><rect x="38" y="38" width="24" height="24" rx="7" fill="#ffd049"/><circle cx="78" cy="50" r="12" fill="#ff6c8d"/><rect x="96" y="38" width="18" height="24" rx="6" fill="#ffd049"/></g><path d="M13 78h96" stroke="#6d5ce6" strokeWidth="5" strokeLinecap="round" strokeDasharray="8 8"/><text x="60" y="94" textAnchor="middle" fontSize="18" fontWeight="900" fill="#17345f">?</text></svg>
}
function AnimalSounds() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><path d="M29 34L24 13l21 12M91 34l5-21-21 12" fill="#ffad4b" stroke="#e77a34" strokeWidth="2"/><ellipse cx="60" cy="54" rx="37" ry="34" fill="#ffad4b"/><ellipse cx="46" cy="50" rx="5" ry="7" fill="#17345f"/><ellipse cx="74" cy="50" rx="5" ry="7" fill="#17345f"/><path d="M55 64c4 5 7 5 11 0" fill="none" stroke="#85482e" strokeWidth="3" strokeLinecap="round"/><circle cx="38" cy="63" r="7" fill="#ff8c91" opacity=".5"/><circle cx="82" cy="63" r="7" fill="#ff8c91" opacity=".5"/><path d="M99 38c7 6 7 16 0 22M106 31c12 10 12 26 0 36" fill="none" stroke="#6d5ce6" strokeWidth="4" strokeLinecap="round"/></g></svg>
}
function FirstWords() {
  return <svg viewBox="0 0 120 100"><defs dangerouslySetInnerHTML={{__html:defs}}/><g filter="url(#laShadow)"><path d="M16 19h69a13 13 0 0113 13v27a13 13 0 01-13 13H49L33 86V72H29a13 13 0 01-13-13z" fill="#63b2ff"/><circle cx="38" cy="46" r="5" fill="#fff"/><circle cx="57" cy="46" r="5" fill="#fff"/><circle cx="76" cy="46" r="5" fill="#fff"/><rect x="76" y="62" width="33" height="27" rx="8" fill="#ffd34d"/><path d="M84 69h17M84 76h12M84 83h16" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></g></svg>
}

const artMap = {
  'trace-vowels': TraceVowels,
  'listen-vowels': ListenVowels,
  'vowel-pictures': VowelPictures,
  'count-objects': CountObjects,
  'number-order': NumberOrder,
  'trace-numbers': TraceNumbers,
  'trace-lines-basic': TraceLines,
  'trace-geometric-shapes': TraceGeometry,
  'find-color': ColorFind,
  'listen-colors': ListenColors,
  'identify-shapes': IdentifyShapes,
  patterns: Patterns,
  'animal-sounds': AnimalSounds,
  'first-words': FirstWords,
}

export default function LessonArtwork({ lessonId, size = 92, animated = true, className = '' }) {
  const Art = artMap[lessonId] || FirstWords
  return <motion.span
    className={`lesson-artwork ${className}`}
    style={{ width: size }}
    animate={animated ? { y: [0,-4,0], rotate: [-1.2,1.2,-1.2] } : undefined}
    transition={animated ? { duration: 3.1, repeat: Infinity, ease: 'easeInOut' } : undefined}
    aria-hidden="true"
  ><Art/></motion.span>
}
