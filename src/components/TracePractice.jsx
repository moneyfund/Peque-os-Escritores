import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Eraser, Pointer, RotateCcw, Sparkles, Target } from 'lucide-react'
import { motion } from 'motion/react'
import { localized } from '../data/lessons.js'

const VIEWBOX_WIDTH = 320
const VIEWBOX_HEIGHT = 220
const ACCEPT_SCORE = 70

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const pointDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

const gridKey = (x, y) => `${x}:${y}`

function buildPointGrid(points, cellSize) {
  const grid = new Map()
  for (const point of points) {
    const gx = Math.floor(point.x / cellSize)
    const gy = Math.floor(point.y / cellSize)
    const key = gridKey(gx, gy)
    const bucket = grid.get(key) || []
    bucket.push(point)
    grid.set(key, bucket)
  }
  return grid
}

function isNearGrid(point, grid, cellSize, tolerance) {
  const gx = Math.floor(point.x / cellSize)
  const gy = Math.floor(point.y / cellSize)
  const radius = Math.ceil(tolerance / cellSize)

  for (let x = gx - radius; x <= gx + radius; x += 1) {
    for (let y = gy - radius; y <= gy + radius; y += 1) {
      const bucket = grid.get(gridKey(x, y))
      if (!bucket) continue
      for (const candidate of bucket) {
        if (pointDistance(point, candidate) <= tolerance) return true
      }
    }
  }
  return false
}

function scoreTrace({ referencePoints, userPoints, referenceLength, drawnLength, tolerance = 17 }) {
  if (!referencePoints.length || !userPoints.length || referenceLength <= 0) {
    return { score: 0, coverage: 0, precision: 0, lengthScore: 0 }
  }

  const cellSize = Math.max(7, tolerance)
  const userGrid = buildPointGrid(userPoints, cellSize)
  const referenceGrid = buildPointGrid(referencePoints, cellSize)
  const tightTolerance = tolerance * 0.55

  let coverageHits = 0
  let tightCoverageHits = 0
  for (const point of referencePoints) {
    if (isNearGrid(point, userGrid, cellSize, tolerance)) coverageHits += 1
    if (isNearGrid(point, userGrid, cellSize, tightTolerance)) tightCoverageHits += 1
  }

  let precisionHits = 0
  let tightPrecisionHits = 0
  for (const point of userPoints) {
    if (isNearGrid(point, referenceGrid, cellSize, tolerance)) precisionHits += 1
    if (isNearGrid(point, referenceGrid, cellSize, tightTolerance)) tightPrecisionHits += 1
  }

  const coverage = coverageHits / referencePoints.length
  const tightCoverage = tightCoverageHits / referencePoints.length
  const precision = precisionHits / userPoints.length
  const tightPrecision = tightPrecisionHits / userPoints.length
  const lengthRatio = drawnLength / referenceLength
  const lengthScore = clamp(1 - Math.abs(lengthRatio - 1) / 1.25, 0, 1)

  let score = Math.round(100 * (
    coverage * 0.38 +
    tightCoverage * 0.18 +
    precision * 0.27 +
    tightPrecision * 0.07 +
    lengthScore * 0.10
  ))

  // Hard caps prevent a short stroke or a large scribble from being accepted.
  if (drawnLength < referenceLength * 0.35 || coverage < 0.36) score = Math.min(score, 39)
  if (precision < 0.40) score = Math.min(score, 49)

  return {
    score: clamp(score, 0, 100),
    coverage: Math.round(coverage * 100),
    precision: Math.round(precision * 100),
    lengthScore: Math.round(lengthScore * 100),
  }
}

function getTraceLabel(target, language) {
  if (target?.name) return localized(target.name, language)
  return target?.label || ''
}

function speakTraceTarget(target, language) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const rawLabel = String(target?.label || '').trim()
  const isSimpleLetterOrNumber = /^[A-ZÁÉÍÓÚÑ]$/i.test(rawLabel) || /^\d+$/.test(rawLabel)
  const text = isSimpleLetterOrNumber ? rawLabel : getTraceLabel(target, language)
  if (!text) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = language === 'en' ? 'en-US' : 'es-NI'
  utterance.rate = 0.72
  utterance.pitch = 1.05
  window.speechSynthesis.speak(utterance)
}

function TraceCanvas({ target, language, onEvaluated }) {
  const canvasRef = useRef(null)
  const guideRefs = useRef([])
  const strokesRef = useRef([])
  const drawingRef = useRef(false)
  const lastPointRef = useRef(null)
  const drawnLengthRef = useRef(0)
  const animationFrameRef = useRef(null)
  const animationStartedRef = useRef(null)

  const [hasDrawing, setHasDrawing] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [hand, setHand] = useState({ x: 0, y: 0, visible: false })
  const [startPoint, setStartPoint] = useState(null)
  const [replayKey, setReplayKey] = useState(0)

  const paths = target?.paths || []

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    strokesRef.current = []
    drawnLengthRef.current = 0
    drawingRef.current = false
    lastPointRef.current = null
    setHasDrawing(false)
    setEvaluation(null)
    onEvaluated?.(null)
  }

  useEffect(() => {
    clearCanvas()
    setReplayKey((value) => value + 1)
  }, [target])

  useEffect(() => {
    const pathElements = guideRefs.current.filter(Boolean)
    if (!pathElements.length) return undefined

    const segments = pathElements.map((path) => ({
      path,
      length: path.getTotalLength(),
    }))
    const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0)

    if (!totalLength) return undefined

    const first = segments[0].path.getPointAtLength(0)
    setStartPoint({ x: first.x, y: first.y })

    animationStartedRef.current = null
    const duration = Math.max(3300, Math.min(6200, totalLength * 8.2))

    const animate = (timestamp) => {
      if (animationStartedRef.current === null) animationStartedRef.current = timestamp

      const elapsed = (timestamp - animationStartedRef.current) % duration
      const progress = elapsed / duration
      let remaining = progress * totalLength
      let active = segments[segments.length - 1]

      for (const segment of segments) {
        if (remaining <= segment.length) {
          active = segment
          break
        }
        remaining -= segment.length
      }

      const point = active.path.getPointAtLength(clamp(remaining, 0, active.length))
      setHand({ x: point.x, y: point.y, visible: true })
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [target, replayKey])

  const eventPoint = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT,
    }
  }

  const drawSegment = (from, to) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    const scaleX = canvas.width / VIEWBOX_WIDTH
    const scaleY = canvas.height / VIEWBOX_HEIGHT

    context.save()
    context.scale(scaleX, scaleY)
    context.beginPath()
    context.moveTo(from.x, from.y)
    context.lineTo(to.x, to.y)
    context.strokeStyle = '#6558e8'
    context.lineWidth = 9
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.stroke()
    context.restore()
  }

  const appendInterpolatedPoints = (stroke, from, to) => {
    const distance = pointDistance(from, to)
    const steps = Math.max(1, Math.ceil(distance / 3.5))

    for (let step = 1; step <= steps; step += 1) {
      const ratio = step / steps
      stroke.push({
        x: from.x + (to.x - from.x) * ratio,
        y: from.y + (to.y - from.y) * ratio,
      })
    }
  }

  const startDrawing = (event) => {
    if (evaluation?.accepted) return

    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    const point = eventPoint(event)
    const stroke = [point]
    strokesRef.current.push(stroke)
    drawingRef.current = true
    lastPointRef.current = point
    setEvaluation(null)
    onEvaluated?.(null)
  }

  const moveDrawing = (event) => {
    if (!drawingRef.current || evaluation?.accepted) return

    event.preventDefault()
    const next = eventPoint(event)
    const previous = lastPointRef.current
    if (!previous) return

    const segmentDistance = pointDistance(previous, next)
    if (segmentDistance < 0.5) return

    const stroke = strokesRef.current[strokesRef.current.length - 1]
    appendInterpolatedPoints(stroke, previous, next)
    drawSegment(previous, next)

    drawnLengthRef.current += segmentDistance
    lastPointRef.current = next
    setHasDrawing(true)
  }

  const stopDrawing = () => {
    drawingRef.current = false
    lastPointRef.current = null
  }

  const evaluate = () => {
    const pathElements = guideRefs.current.filter(Boolean)
    if (!pathElements.length) return

    const referencePoints = []
    let referenceLength = 0

    for (const path of pathElements) {
      const length = path.getTotalLength()
      referenceLength += length
      const samples = Math.max(16, Math.ceil(length / 3.6))

      for (let sample = 0; sample <= samples; sample += 1) {
        const point = path.getPointAtLength((sample / samples) * length)
        referencePoints.push({ x: point.x, y: point.y })
      }
    }

    const allUserPoints = strokesRef.current.flat()
    const userStride = Math.max(1, Math.ceil(allUserPoints.length / 1300))
    const sampledUserPoints = allUserPoints.filter((_, index) => index % userStride === 0)

    const result = scoreTrace({
      referencePoints,
      userPoints: sampledUserPoints,
      referenceLength,
      drawnLength: drawnLengthRef.current,
      tolerance: target?.tolerance || 17,
    })

    const nextEvaluation = {
      ...result,
      accepted: result.score >= ACCEPT_SCORE,
    }

    setEvaluation(nextEvaluation)
    onEvaluated?.(nextEvaluation)
    if (nextEvaluation.accepted) speakTraceTarget(target, language)
  }

  const feedback = useMemo(() => {
    if (!evaluation) return null

    if (evaluation.score >= 90) {
      return language === 'es' ? '¡Excelente! Seguiste la guía con mucha precisión.' : 'Excellent! You followed the guide very precisely.'
    }

    if (evaluation.accepted) {
      return language === 'es' ? '¡Muy bien! Tu trazo se parece a la guía.' : 'Great job! Your trace closely follows the guide.'
    }

    if (evaluation.coverage < 55) {
      return language === 'es' ? 'Recorre más partes de la guía con tu dedo.' : 'Try covering more of the guide.'
    }

    return language === 'es' ? 'Vas bien. Intenta mantenerte un poco más cerca de la línea.' : 'Almost there. Try staying a little closer to the line.'
  }, [evaluation, language])

  return (
    <div className="trace-practice">
      <div className="trace-help-banner">
        <span><Pointer size={19}/></span>
        <div>
          <strong>{language === 'es' ? 'Mira la manito' : 'Watch the hand'}</strong>
          <small>{language === 'es' ? 'Te enseña el recorrido antes de intentarlo.' : 'It shows you the path before you try.'}</small>
        </div>
        <button type="button" onClick={() => setReplayKey((value) => value + 1)}>
          <RotateCcw size={15}/>
          {language === 'es' ? 'Ver guía' : 'Replay'}
        </button>
      </div>

      <div className="trace-stage">
        <svg className="trace-guide-svg" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} aria-hidden="true">
          {paths.map((path, index) => (
            <path
              key={`${target?.label || 'trace'}-${index}`}
              ref={(element) => { guideRefs.current[index] = element }}
              d={path}
              className="trace-guide-path"
              pathLength="1"
            />
          ))}
          {startPoint && <circle className="trace-start-dot" cx={startPoint.x} cy={startPoint.y} r="6"/>}
        </svg>

        <canvas
          ref={canvasRef}
          className="trace-drawing-canvas"
          width="640"
          height="440"
          onPointerDown={startDrawing}
          onPointerMove={moveDrawing}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
          aria-label={language === 'es' ? 'Área para trazar' : 'Tracing area'}
        />

        {startPoint && (
          <span
            className="trace-start-label"
            style={{
              left: `${(startPoint.x / VIEWBOX_WIDTH) * 100}%`,
              top: `${(startPoint.y / VIEWBOX_HEIGHT) * 100}%`,
            }}
          >
            {language === 'es' ? 'Inicio' : 'Start'}
          </span>
        )}

        {hand.visible && !evaluation?.accepted && (
          <motion.span
            className="trace-guide-hand"
            style={{
              left: `${(hand.x / VIEWBOX_WIDTH) * 100}%`,
              top: `${(hand.y / VIEWBOX_HEIGHT) * 100}%`,
            }}
            animate={{ scale: [1, 1.12, 1], rotate: [-7, 4, -7] }}
            transition={{ duration: .7, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <Pointer size={28} strokeWidth={2.4}/>
          </motion.span>
        )}
      </div>

      {evaluation && (
        <motion.div
          className={`trace-score-card ${evaluation.accepted ? 'accepted' : 'retry'}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="trace-score-main">
            <span>{evaluation.accepted ? <Check size={22}/> : <Target size={22}/>}</span>
            <div>
              <strong>{evaluation.score}%</strong>
              <small>{feedback}</small>
            </div>
          </div>
          <div className="trace-score-breakdown">
            <span>{language === 'es' ? 'Cobertura' : 'Coverage'} <b>{evaluation.coverage}%</b></span>
            <span>{language === 'es' ? 'Precisión' : 'Accuracy'} <b>{evaluation.precision}%</b></span>
          </div>
        </motion.div>
      )}

      <div className="trace-actions">
        <button type="button" className="button button-ghost" onClick={clearCanvas}>
          <Eraser size={17}/>
          {language === 'es' ? 'Limpiar' : 'Clear'}
        </button>

        {!evaluation?.accepted && (
          <button type="button" className="button trace-evaluate-button" onClick={evaluate} disabled={!hasDrawing}>
            <Sparkles size={17}/>
            {language === 'es' ? 'Evaluar mi trazo' : 'Check my trace'}
          </button>
        )}
      </div>

      {evaluation && !evaluation.accepted && (
        <button type="button" className="trace-retry-button" onClick={clearCanvas}>
          <RotateCcw size={16}/>
          {language === 'es' ? 'Intentar otra vez' : 'Try again'}
        </button>
      )}
    </div>
  )
}

export default function TracePractice({ targets = [], language, onComplete }) {
  const [index, setIndex] = useState(0)
  const [scores, setScores] = useState([])
  const [evaluation, setEvaluation] = useState(null)
  const target = targets[index]

  if (!target) return null

  const label = getTraceLabel(target, language)

  const next = () => {
    if (!evaluation?.accepted) return

    const nextScores = [...scores]
    nextScores[index] = evaluation.score
    setScores(nextScores)

    if (index >= targets.length - 1) {
      const average = Math.round(nextScores.reduce((sum, value) => sum + (value || 0), 0) / targets.length)
      onComplete?.(average)
      return
    }

    setIndex((value) => value + 1)
    setEvaluation(null)
  }

  return (
    <div className="activity-card trace-activity-card">
      <div className="activity-progress">
        <span style={{ width: `${((index + (evaluation?.accepted ? 1 : 0)) / targets.length) * 100}%` }}/>
      </div>

      <div className="trace-topline">
        <div className="activity-kicker">{index + 1} / {targets.length}</div>
        <span className="trace-pass-note">{language === 'es' ? '70% para aprobar el trazo' : '70% to pass this trace'}</span>
      </div>

      <h2>{language === 'es' ? `Traza ${label}` : `Trace ${label}`}</h2>

      <TraceCanvas
        key={`${index}-${target.label || label}`}
        target={target}
        language={language}
        onEvaluated={setEvaluation}
      />

      {evaluation?.accepted && (
        <button type="button" className="button button-wide trace-next-button" onClick={next}>
          <Check size={19}/>
          {index === targets.length - 1
            ? (language === 'es' ? 'Terminar reto' : 'Finish challenge')
            : (language === 'es' ? 'Siguiente trazo' : 'Next trace')}
        </button>
      )}
    </div>
  )
}
