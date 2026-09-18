import { ArrowUpRight, Check, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { localized } from '../data/lessons.js'

export default function LessonCard({ lesson, language, progress, compact = false, href }) {
  const completed = Boolean(progress?.completed)
  const score = progress?.lastScore ?? 0
  return (
    <motion.article className={`lesson-card v2-lesson-card ${compact ? 'compact' : ''} ${completed ? 'is-complete' : ''}`} whileHover={{ y: -4 }} whileTap={{ scale: .985 }}>
      <Link to={href || `/lecciones/${lesson.id}`}>
        <div className={`v2-lesson-visual category-${lesson.category}`}>
          <span>{lesson.icon}</span>
          {completed && <b><Check size={14}/></b>}
        </div>
        <div className="v2-lesson-copy">
          <div className="v2-lesson-meta">
            <span>{language === 'es' ? `Nivel ${lesson.difficulty}` : `Level ${lesson.difficulty}`}</span>
            {progress && <small>{progress.attempts || 0} {language === 'es' ? 'int.' : 'tries'}</small>}
          </div>
          <h3>{localized(lesson.title, language)}</h3>
          {!compact && <p>{localized(lesson.description, language)}</p>}
          {progress && <div className="v2-score-line"><span style={{ width: `${score}%` }}/></div>}
        </div>
        <span className="v2-lesson-go">{completed ? <ArrowUpRight size={18}/> : <Play size={17}/>}</span>
      </Link>
    </motion.article>
  )
}
