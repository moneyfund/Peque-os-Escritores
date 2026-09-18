import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, RotateCcw, Target, Trophy } from 'lucide-react'
import { lessons, localized } from '../data/lessons.js'
import { useAuth } from '../context/AuthContext.jsx'
import { listUserProgress } from '../services/appService.js'
import { tr } from '../i18n.js'
import LessonCard from '../components/LessonCard.jsx'

export default function Progress() {
  const { profile, language } = useAuth()
  const [progress, setProgress] = useState([])
  useEffect(() => { if (profile?.id) listUserProgress(profile.id).then(setProgress) }, [profile?.id])
  const map = useMemo(() => Object.fromEntries(progress.map((item) => [item.lessonId, item])), [progress])
  const completed = progress.filter((p) => p.completed).length
  const attempts = progress.reduce((s,p)=>s+(p.attempts||0),0)
  const average = progress.length ? Math.round(progress.reduce((s,p)=>s+(p.lastScore||0),0)/progress.length) : 0

  return <section className="page section-pad"><div className="container">
    <div className="page-heading"><span className="eyebrow">🏆 {tr(language,'progress')}</span><h1>{language === 'es' ? 'Mira cuánto has aprendido' : 'See how much you have learned'}</h1></div>
    <div className="dashboard-stats"><div><CheckCircle2/><strong>{completed}</strong><span>{tr(language,'completed')}</span></div><div><RotateCcw/><strong>{attempts}</strong><span>{tr(language,'attempts')}</span></div><div><Target/><strong>{average}%</strong><span>{tr(language,'score')}</span></div><div><Trophy/><strong>{Math.round((completed/lessons.length)*100)||0}%</strong><span>{tr(language,'progress')}</span></div></div>
    <div className="progress-banner"><div><strong>{profile?.username}</strong><span>{language === 'es' ? 'Tu jardín de aprendizaje está creciendo 🌱' : 'Your learning garden is growing 🌱'}</span></div><div className="big-progress"><span style={{width:`${(completed/lessons.length)*100}%`}}/></div></div>
    <div className="section-heading"><div><h2>{tr(language,'lessonProgress')}</h2></div></div>
    {progress.length ? <div className="lesson-grid lesson-grid-wide">{lessons.map((lesson)=><LessonCard key={lesson.id} lesson={lesson} language={language} progress={map[lesson.id]} compact />)}</div> : <div className="empty-state"><span>🌱</span><h3>{tr(language,'noProgress')}</h3></div>}
  </div></section>
}
