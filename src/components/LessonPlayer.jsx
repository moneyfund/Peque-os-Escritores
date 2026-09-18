import { useEffect, useRef, useState } from 'react'
import { Check, Eraser, Lightbulb, RotateCcw, Sparkles, Star, Volume2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { localized } from '../data/lessons.js'
import { tr } from '../i18n.js'

const speak = (text, language) => {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = language === 'en' ? 'en-US' : 'es-ES'
  utterance.rate = 0.78
  utterance.pitch = 1.08
  window.speechSynthesis.speak(utterance)
}

function TraceCanvas({ target, language, onReadyChange }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)
  const distance = useRef(0)

  const drawGuide = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#f5f1ff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '900 250px ui-rounded, system-ui, sans-serif'
    ctx.strokeStyle = '#d7cfff'
    ctx.lineWidth = 18
    ctx.setLineDash([14, 16])
    ctx.strokeText(target, canvas.width / 2, canvas.height / 2 + 10)
    ctx.setLineDash([])
    ctx.fillStyle = '#ffffff'
    ctx.globalAlpha = .32
    ctx.fillText(target, canvas.width / 2, canvas.height / 2 + 10)
    ctx.globalAlpha = 1
  }

  useEffect(() => {
    distance.current = 0
    onReadyChange(false)
    drawGuide()
  }, [target])

  const point = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const start = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    drawing.current = true
    last.current = point(event)
  }

  const move = (event) => {
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const next = point(event)
    const prev = last.current
    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(next.x, next.y)
    ctx.strokeStyle = '#6f54ff'
    ctx.lineWidth = 20
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    distance.current += Math.hypot(next.x - prev.x, next.y - prev.y)
    if (distance.current > 240) onReadyChange(true)
    last.current = next
  }

  const stop = () => {
    drawing.current = false
    last.current = null
  }

  const clear = () => {
    distance.current = 0
    onReadyChange(false)
    drawGuide()
  }

  return (
    <div className="trace-wrap">
      <div className="trace-instruction">{language === 'es' ? 'Repasa la figura varias veces' : 'Trace over the shape a few times'}</div>
      <canvas
        ref={canvasRef}
        className="trace-canvas"
        width="640"
        height="380"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerCancel={stop}
        onPointerLeave={stop}
      />
      <button className="button button-ghost" onClick={clear}><Eraser size={18} />{tr(language, 'clear')}</button>
    </div>
  )
}

function ShapeVisual({ shape }) {
  return <div className={`shape-visual shape-${shape}`} aria-label={shape} />
}

function Celebration({ score, language, onAgain }) {
  const passed = score >= 70
  return (
    <motion.div className="result-card" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      <div className={`result-stars ${passed ? 'passed' : 'keep-going'}`}><Star/><Star/><Star/></div>
      <h2>{passed ? tr(language, 'great') : tr(language, 'keepTrying')}</h2>
      <div className="score-ring"><strong>{score}%</strong><span>{tr(language, 'score')}</span></div>
      <p>{passed
        ? (language === 'es' ? '¡Terminaste la lección! Tu progreso quedó guardado.' : 'You finished the lesson! Your progress was saved.')
        : (language === 'es' ? 'Practica una vez más y verás cómo cada intento se vuelve más fácil.' : 'Try once more and each attempt will feel easier.')}
      </p>
      <button className="button" onClick={onAgain}><RotateCcw size={18} />{tr(language, 'tryAgain')}</button>
    </motion.div>
  )
}

export default function LessonPlayer({ lesson, language, onComplete }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState(null)
  const [traceReady, setTraceReady] = useState(false)
  const [sequence, setSequence] = useState([])
  const [mistakes, setMistakes] = useState(0)

  const reset = () => {
    setIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setResult(null)
    setTraceReady(false)
    setSequence([])
    setMistakes(0)
  }

  const finish = (score) => {
    const normalized = Math.max(0, Math.min(100, Math.round(score)))
    setResult(normalized)
    onComplete?.({ score: normalized, passed: normalized >= 70 })
  }

  const choiceAnswer = (value) => {
    if (selected !== null) return
    setSelected(value)
  }

  const nextQuestion = () => {
    const total = lesson.items?.length || 1
    const currentCorrect = selected === answer ? 1 : 0
    const nextCorrectCount = correctCount + currentCorrect

    if (index >= total - 1) {
      finish((nextCorrectCount / total) * 100)
      return
    }

    setCorrectCount(nextCorrectCount)
    setIndex((value) => value + 1)
    setSelected(null)
  }

  if (result !== null) return <Celebration score={result} language={language} onAgain={reset} />

  if (lesson.type === 'trace') {
    const target = lesson.targets[index]
    const nextTrace = () => {
      if (!traceReady) return
      if (index === lesson.targets.length - 1) finish(100)
      else {
        setIndex((value) => value + 1)
        setTraceReady(false)
      }
    }
    return (
      <div className="activity-card">
        <div className="activity-progress"><span style={{ width: `${((index + 1) / lesson.targets.length) * 100}%` }} /></div>
        <div className="activity-kicker">{index + 1} / {lesson.targets.length}</div>
        <h2>{language === 'es' ? `Traza ${target}` : `Trace ${target}`}</h2>
        <TraceCanvas target={target} language={language} onReadyChange={setTraceReady} />
        <button className="button button-wide" disabled={!traceReady} onClick={nextTrace}><Check size={20} />{index === lesson.targets.length - 1 ? tr(language, 'done') : tr(language, 'next')}</button>
      </div>
    )
  }

  if (lesson.type === 'sequence') {
    const shuffled = [4, 1, 7, 2, 8, 5, 3, 6]
    const tapNumber = (number) => {
      const expected = lesson.target[sequence.length]
      if (number !== expected) {
        setMistakes((value) => value + 1)
        return
      }
      const next = [...sequence, number]
      setSequence(next)
      if (next.length === lesson.target.length) finish(Math.max(70, 100 - mistakes * 8))
    }
    return (
      <div className="activity-card">
        <div className="activity-progress"><span style={{ width: `${(sequence.length / lesson.target.length) * 100}%` }} /></div>
        <div className="activity-kicker">{language === 'es' ? 'Del menor al mayor' : 'Smallest to biggest'}</div>
        <h2>{language === 'es' ? 'Toca los números en orden' : 'Tap the numbers in order'}</h2>
        <div className="sequence-track">{lesson.target.map((n, i) => <span key={n} className={sequence.includes(n) ? 'filled' : ''}>{sequence[i] ?? '?'}</span>)}</div>
        <div className="number-grid">{shuffled.map((number) => <motion.button key={number} whileTap={{ scale: .9 }} disabled={sequence.includes(number)} onClick={() => tapNumber(number)}>{number}</motion.button>)}</div>
        {mistakes > 0 && <p className="friendly-tip"><Lightbulb size={18}/> {language === 'es' ? 'Busca primero el número más pequeño.' : 'Look for the smallest number first.'}</p>}
      </div>
    )
  }

  const item = lesson.items[index]
  let answer = item.answer
  let options = item.options
  let prompt = item.prompt ? localized(item.prompt, language) : ''

  if (lesson.type === 'count') answer = item.count
  if (lesson.type === 'word') {
    answer = localized(item.answer, language)
    options = item.options[language] || item.options.es
  }

  const isCorrect = selected !== null && selected === answer
  const progress = ((index + 1) / lesson.items.length) * 100

  const renderPrompt = () => {
    if (lesson.type === 'listen' || lesson.type === 'listen-color' || lesson.type === 'listen-emoji') {
      const word = localized(item.speak, language)
      return (
        <div className="listen-prompt">
          <motion.button className="sound-button" whileTap={{ scale: .9 }} onClick={() => speak(word, language)}><Volume2 size={36} /></motion.button>
          <strong>{language === 'es' ? 'Toca para escuchar' : 'Tap to listen'}</strong>
        </div>
      )
    }
    if (lesson.type === 'count') {
      return <div className="count-objects" aria-label={`${item.count} items`}>{Array.from({ length: item.count }, (_, i) => <span key={i}>{item.emoji}</span>)}</div>
    }
    if (lesson.type === 'shape') return <ShapeVisual shape={item.shape} />
    if (lesson.type === 'pattern') return <div className="pattern-row">{item.pattern.map((part, i) => <span key={`${part}-${i}`}>{part}</span>)}<span className="pattern-missing">?</span></div>
    if (lesson.type === 'word') {
      return <div className="word-prompt"><span>{item.emoji}</span><button className="sound-mini" onClick={() => speak(localized(item.speak, language), language)}><Volume2 /></button></div>
    }
    if (item.emoji) return <div className="big-emoji">{item.emoji}</div>
    return null
  }

  const renderOptions = () => {
    if (lesson.type === 'color' || lesson.type === 'listen-color') {
      return <div className="color-options">{options.map((color) => <button key={color} className={`color-choice ${selected === color ? (isCorrect ? 'correct' : 'wrong') : ''}`} style={{ '--choice-color': color }} onClick={() => choiceAnswer(color)} aria-label={color}><span /></button>)}</div>
    }
    if (lesson.type === 'shape') {
      return <div className="answer-grid">{options.map((value) => <button key={value} className={selected === value ? (isCorrect ? 'correct' : 'wrong') : ''} onClick={() => choiceAnswer(value)}>{item.labels[language]?.[value] || item.labels.es[value]}</button>)}</div>
    }
    const emojiOptions = lesson.type === 'listen-emoji' || lesson.type === 'pattern'
    return <div className={`answer-grid ${emojiOptions ? 'emoji-options' : ''}`}>{options.map((value) => <button key={value} className={selected === value ? (isCorrect ? 'correct' : 'wrong') : ''} onClick={() => choiceAnswer(value)}>{value}</button>)}</div>
  }

  return (
    <div className="activity-card">
      <div className="activity-progress"><span style={{ width: `${progress}%` }} /></div>
      <div className="activity-kicker">{index + 1} / {lesson.items.length}</div>
      {prompt && <h2>{prompt}</h2>}
      {!prompt && <h2>{language === 'es' ? 'Elige la respuesta correcta' : 'Choose the correct answer'}</h2>}
      {renderPrompt()}
      {renderOptions()}
      <AnimatePresence>
        {selected !== null && (
          <motion.div className={`answer-feedback ${isCorrect ? 'good' : 'try'}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {isCorrect ? <Check /> : <X />}
            <span>{isCorrect ? (language === 'es' ? '¡Correcto!' : 'Correct!') : (language === 'es' ? 'Casi. Mira otra vez.' : 'Almost. Look again.')}</span>
            <button className="button button-small" onClick={nextQuestion}>{index === lesson.items.length - 1 ? tr(language, 'done') : tr(language, 'next')}</button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="activity-sparkles" aria-hidden="true"><Sparkles /><Sparkles /></div>
    </div>
  )
}
