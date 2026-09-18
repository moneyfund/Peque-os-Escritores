import { ArrowUpRight, Check, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { localized } from '../data/lessons.js'
import LessonArtwork from './LessonArtwork.jsx'

export default function LessonCard({ lesson, language, progress, compact = false, href }) {
  const completed = Boolean(progress?.completed)
  const score = progress?.lastScore ?? 0

  return (
    <motion.article
      className={`lesson-card v3-lesson-card lesson-${lesson.category} ${compact ? 'compact' : ''} ${completed ? 'is-complete' : ''}`}
      whileHover={{ y: -7, rotate: lesson.difficulty === 2 ? .7 : -.7 }}
      whileTap={{ scale: .985 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
    >
      <Link to={href || `/lecciones/${lesson.id}`}>
        <div className="v3-lesson-visual">
          <LessonArtwork lessonId={lesson.id} size={78}/>
          <span className="v3-lesson-shape shape-a"/>
          <span className="v3-lesson-shape shape-b"/>
          {completed && <b><Check size={14}/></b>}
        </div>

        <div className="v3-lesson-copy">
          <div className="v3-lesson-meta">
            <span>{language === 'es' ? `Nivel ${lesson.difficulty}` : `Level ${lesson.difficulty}`}</span>
            {progress && <small>{progress.attempts || 0} {language === 'es' ? 'int.' : 'tries'}</small>}
          </div>
          <h3>{localized(lesson.title, language)}</h3>
          {!compact && <p>{localized(lesson.description, language)}</p>}
          {progress && <div className="v3-score-line"><span style={{ width: `${score}%` }}/></div>}
        </div>

        <span className="v3-lesson-go">{completed ? <ArrowUpRight size={18}/> : <Play size={17}/>}</span>
      </Link>
    </motion.article>
  )
}
