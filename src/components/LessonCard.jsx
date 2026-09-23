import { ArrowUpRight, Check, LockKeyhole, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { localized } from '../data/lessons.js'
import LessonArtwork from './LessonArtwork.jsx'

export default function LessonCard({ lesson, language, progress, compact = false, href, locked = false, unlockLevel }) {
  const completed = Boolean(progress?.completed)
  const score = progress?.bestScore ?? progress?.lastScore ?? 0
  const level = lesson.level || lesson.difficulty || 1

  const content = (
    <>
      <div className="v3-lesson-visual">
        <LessonArtwork lessonId={lesson.id} size={78}/>
        <span className="v3-lesson-shape shape-a"/>
        <span className="v3-lesson-shape shape-b"/>
        {completed && <b><Check size={14}/></b>}
      </div>

      <div className="v3-lesson-copy">
        <div className="v3-lesson-meta">
          <span>{language === 'es' ? `Nivel ${level}` : `Level ${level}`}</span>
          {progress && <small>{progress.attempts || 0} {language === 'es' ? 'int.' : 'tries'}</small>}
        </div>
        <h3>{localized(lesson.title, language)}</h3>
        {!compact && <p>{localized(lesson.description, language)}</p>}
        {progress && <div className="v3-score-line"><span style={{ width: `${score}%` }}/></div>}
        {locked && (
          <div className="v4-lock-note">
            <LockKeyhole size={13}/>
            <span>{language === 'es'
              ? `Completa el nivel ${unlockLevel || Math.max(1, level - 2)}`
              : `Complete level ${unlockLevel || Math.max(1, level - 2)}`}</span>
          </div>
        )}
      </div>

      <span className="v3-lesson-go">{locked ? <LockKeyhole size={17}/> : completed ? <ArrowUpRight size={18}/> : <Play size={17}/>}</span>
    </>
  )

  return (
    <motion.article
      className={`lesson-card v3-lesson-card lesson-${lesson.category} ${compact ? 'compact' : ''} ${completed ? 'is-complete' : ''} ${locked ? 'is-locked' : ''}`}
      whileHover={{ y: locked ? -2 : -7, rotate: locked ? 0 : (level % 2 === 0 ? .7 : -.7) }}
      whileTap={locked ? undefined : { scale: .985 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
    >
      {locked
        ? <div className="v4-lesson-card-inner v4-locked-card" aria-disabled="true">{content}</div>
        : <Link className="v4-lesson-card-inner" to={href || `/lecciones/${lesson.id}`}>{content}</Link>}
    </motion.article>
  )
}
