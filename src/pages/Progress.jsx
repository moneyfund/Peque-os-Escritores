import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, RotateCcw, Target, Trophy } from 'lucide-react'
import { lessons } from '../data/lessons.js'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeUserProgress } from '../services/appService.js'
import LessonCard from '../components/LessonCard.jsx'

export default function Progress() {
  const { profile, language } = useAuth()
  const [progress, setProgress] = useState([])

  useEffect(() => {
    if (!profile?.id) return undefined
    return subscribeUserProgress(profile.id, setProgress)
  }, [profile?.id])

  const map = useMemo(() => Object.fromEntries(progress.map((item) => [item.lessonId, item])), [progress])
  const completed = progress.filter((p) => p.completed).length
  const attempts = progress.reduce((sum, item) => sum + (item.attempts || 0), 0)
  const average = progress.length ? Math.round(progress.reduce((sum, item) => sum + (item.lastScore || 0), 0) / progress.length) : 0
  const percent = Math.round((completed / lessons.length) * 100) || 0

  return (
    <section className="v2-progress-page">
      <div className="container">
        <div className="v2-page-top">
          <div><span className="v2-kicker"><Trophy size={16}/> {language === 'es' ? 'Tus logros' : 'Your achievements'}</span><h1>{language === 'es' ? 'Mis avances' : 'My progress'}</h1></div>
        </div>

        <div className="v2-progress-hero">
          <div className="v2-progress-ring" style={{ '--progress': `${percent * 3.6}deg` }}><div><strong>{percent}%</strong><span>{language === 'es' ? 'completo' : 'complete'}</span></div></div>
          <div className="v2-progress-identity"><span>{profile?.username}</span><h2>{language === 'es' ? 'Cada intento cuenta.' : 'Every try counts.'}</h2></div>
          <div className="v2-progress-stats">
            <div><CheckCircle2/><strong>{completed}</strong><span>{language === 'es' ? 'completadas' : 'completed'}</span></div>
            <div><RotateCcw/><strong>{attempts}</strong><span>{language === 'es' ? 'intentos' : 'attempts'}</span></div>
            <div><Target/><strong>{average}%</strong><span>{language === 'es' ? 'promedio' : 'average'}</span></div>
          </div>
        </div>

        <div className="v2-section-head v2-progress-list-head">
          <div><span>{language === 'es' ? 'Detalle' : 'Details'}</span><h2>{language === 'es' ? 'Progreso por reto' : 'Progress by challenge'}</h2></div>
        </div>

        {progress.length ? (
          <div className="lesson-grid lesson-grid-wide v2-lesson-grid">
            {lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} language={language} progress={map[lesson.id]} compact/> )}
          </div>
        ) : (
          <div className="v2-empty-panel"><div className="v2-empty-orbit"><Trophy/></div><h2>{language === 'es' ? 'Tu aventura empieza con el primer reto' : 'Your adventure starts with the first challenge'}</h2></div>
        )}
      </div>
    </section>
  )
}
