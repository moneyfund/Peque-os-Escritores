import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, lessons, localized } from '../data/lessons.js'
import { useAuth } from '../context/AuthContext.jsx'
import { listUserProgress } from '../services/appService.js'
import LessonCard from '../components/LessonCard.jsx'
import { tr } from '../i18n.js'

export default function Learn() {
  const { profile, language } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [progress, setProgress] = useState([])
  const category = searchParams.get('categoria') || 'all'
  const t = (key) => tr(language, key)

  useEffect(() => { if (profile?.id) listUserProgress(profile.id).then(setProgress) }, [profile?.id])
  const progressMap = useMemo(() => Object.fromEntries(progress.map((item) => [item.lessonId, item])), [progress])
  const visible = category === 'all' ? lessons : lessons.filter((lesson) => lesson.category === category)

  return (
    <section className="page section-pad">
      <div className="container">
        <div className="page-heading learning-heading"><span className="eyebrow">🎒 {t('today')}</span><h1>{t('lessons')}</h1><p>{language === 'es' ? 'Elige una aventura. Puedes repetir cada actividad todas las veces que quieras.' : 'Choose an adventure. You can repeat every activity as many times as you like.'}</p></div>
        <div className="filter-scroll">
          <button className={category === 'all' ? 'active' : ''} onClick={() => setSearchParams({})}>🌟 {language === 'es' ? 'Todas' : 'All'}</button>
          {categories.map((item) => <button key={item.id} className={category === item.id ? 'active' : ''} onClick={() => setSearchParams({ categoria: item.id })}>{item.icon} {localized(item.title, language)}</button>)}
        </div>
        <div className="lesson-grid lesson-grid-wide">{visible.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} language={language} progress={progressMap[lesson.id]} />)}</div>
      </div>
    </section>
  )
}
