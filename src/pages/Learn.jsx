import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Compass, Sparkles } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { categories, lessons, localized } from '../data/lessons.js'
import { useAuth } from '../context/AuthContext.jsx'
import { listUserProgress } from '../services/appService.js'
import LessonCard from '../components/LessonCard.jsx'

export default function Learn() {
  const { profile, language } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [progress, setProgress] = useState([])
  const category = searchParams.get('categoria') || 'all'

  useEffect(() => {
    if (profile?.id) listUserProgress(profile.id).then(setProgress)
  }, [profile?.id])

  const progressMap = useMemo(() => Object.fromEntries(progress.map((item) => [item.lessonId, item])), [progress])
  const visible = category === 'all' ? lessons : lessons.filter((lesson) => lesson.category === category)
  const activeCategory = categories.find((item) => item.id === category)

  return (
    <section className="v2-learn-page">
      <div className="container">
        <div className="v2-learn-head">
          <div>
            <span className="v2-kicker"><Compass size={16}/> {language === 'es' ? 'Explorar' : 'Explore'}</span>
            <h1>{activeCategory ? localized(activeCategory.title, language) : (language === 'es' ? 'Elige tu aventura' : 'Choose your adventure')}</h1>
          </div>
          <div className="v2-head-spark"><Sparkles/></div>
        </div>

        <div className="v2-category-rail">
          <button className={category === 'all' ? 'active' : ''} onClick={() => setSearchParams({})}>
            <span>✦</span><strong>{language === 'es' ? 'Todo' : 'All'}</strong>
          </button>
          {categories.map((item) => (
            <button key={item.id} className={category === item.id ? 'active' : ''} onClick={() => setSearchParams({ categoria: item.id })}>
              <span>{item.icon}</span><strong>{localized(item.title, language)}</strong>
            </button>
          ))}
        </div>

        <div className="v2-learn-summary">
          <div><strong>{visible.length}</strong><span>{language === 'es' ? 'retos' : 'challenges'}</span></div>
          <ChevronRight size={18}/>
          <p>{activeCategory ? localized(activeCategory.subtitle, language) : (language === 'es' ? 'Trazar · escuchar · ordenar · reconocer' : 'Trace · listen · order · recognize')}</p>
        </div>

        <div className="lesson-grid lesson-grid-wide v2-lesson-grid v2-learn-grid">
          {visible.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} language={language} progress={progressMap[lesson.id]} />)}
        </div>
      </div>
    </section>
  )
}
