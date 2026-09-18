import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { localized } from '../data/lessons.js'

export default function LessonCard({ lesson, language, progress, compact = false, href }) {
  const completed = Boolean(progress?.completed)
  return (
    <motion.article className={`lesson-card ${compact ? 'compact' : ''}`} whileHover={{ y: -5 }} whileTap={{ scale: .98 }}>
      <Link to={href || `/lecciones/${lesson.id}`}>
        <div className={`lesson-icon category-${lesson.category}`}>{lesson.icon}</div>
        <div className="lesson-card-copy">
          <div className="lesson-card-topline">
            <span className="difficulty">{'★'.repeat(lesson.difficulty)}{'☆'.repeat(3 - lesson.difficulty)}</span>
            {completed && <span className="complete-chip"><CheckCircle2 size={14} /> {language === 'es' ? 'Hecha' : 'Done'}</span>}
          </div>
          <h3>{localized(lesson.title, language)}</h3>
          {!compact && <p>{localized(lesson.description, language)}</p>}
          {progress && <small>{language === 'es' ? 'Intentos' : 'Attempts'}: {progress.attempts || 0} · {progress.lastScore ?? 0}%</small>}
        </div>
        <span className="round-arrow"><ArrowRight size={19} /></span>
      </Link>
    </motion.article>
  )
}
