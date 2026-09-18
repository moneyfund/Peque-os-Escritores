import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Cloud, Sparkles, Star, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext.jsx'
import { categories, lessons, localized } from '../data/lessons.js'
import { listUserProgress } from '../services/appService.js'
import { tr } from '../i18n.js'
import LessonCard from '../components/LessonCard.jsx'

export default function Home() {
  const { user, profile, login, language, firebaseReady } = useAuth()
  const [progress, setProgress] = useState([])
  const t = (key) => tr(language, key)

  useEffect(() => {
    if (!profile?.id) return
    listUserProgress(profile.id).then(setProgress)
  }, [profile?.id])

  const progressMap = useMemo(() => Object.fromEntries(progress.map((item) => [item.lessonId, item])), [progress])
  const completed = progress.filter((item) => item.completed).length
  const attempts = progress.reduce((sum, item) => sum + (item.attempts || 0), 0)
  const suggested = lessons.filter((lesson) => !progressMap[lesson.id]?.completed).slice(0, 3)

  return (
    <>
      <section className="hero section-pad">
        <div className="floating-shape shape-one">A</div><div className="floating-shape shape-two">3</div><div className="floating-shape shape-three">★</div>
        <div className="container hero-grid">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow"><Sparkles size={17} /> {user ? `${t('hello')}, ${profile?.username || ''}!` : 'Aprender jugando es más divertido'}</span>
            <h1>{t('welcome')}</h1>
            <p>{t('welcomeText')}</p>
            <div className="hero-actions">
              <Link className="button button-large" to="/aprender"><BookOpen />{t('start')}</Link>
              {!user && <button className="button button-secondary button-large" onClick={login}>{firebaseReady ? t('login') : t('demo')}</button>}
            </div>
            <div className="hero-trust"><span>✓ Actividades cortas</span><span>✓ Progreso visible</span><span>✓ Español / English</span></div>
          </motion.div>
          <motion.div className="hero-scene" initial={{ scale: .92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .15 }}>
            <div className="sun">☀️</div><Cloud className="cloud cloud-a"/><Cloud className="cloud cloud-b"/>
            <div className="mascot-card">
              <div className="mascot">🦉</div>
              <div className="speech-bubble">{language === 'es' ? '¡Vamos a aprender!' : "Let's learn!"}</div>
              <div className="mini-cards"><span>🔤</span><span>🔢</span><span>🎨</span><span>🧩</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      {user && (
        <section className="container stats-strip">
          <div><span className="stat-icon violet"><Trophy /></span><strong>{completed}</strong><small>{t('completed')}</small></div>
          <div><span className="stat-icon orange"><Star /></span><strong>{attempts}</strong><small>{t('attempts')}</small></div>
          <div><span className="stat-icon green">🌱</span><strong>{Math.round((completed / lessons.length) * 100) || 0}%</strong><small>{t('progress')}</small></div>
        </section>
      )}

      <section className="section-pad container">
        <div className="section-heading"><div><span className="eyebrow">🌈 Explora por tema</span><h2>{t('today')}</h2></div><Link to="/aprender" className="text-link">{t('lessons')} <ArrowRight size={17}/></Link></div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <motion.div key={category.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }}>
              <Link to={`/aprender?categoria=${category.id}`} className={`category-card color-${category.color}`}>
                <span className="category-bubble">{category.icon}</span><div><h3>{localized(category.title, language)}</h3><p>{localized(category.subtitle, language)}</p></div><ArrowRight />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="soft-section section-pad">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">✨ {user ? t('continue') : 'Empieza por aquí'}</span><h2>{user ? t('continue') : t('lessons')}</h2></div></div>
          <div className="lesson-grid">{(suggested.length ? suggested : lessons.slice(0,3)).map((lesson) => <LessonCard key={lesson.id} lesson={lesson} language={language} progress={progressMap[lesson.id]} />)}</div>
        </div>
      </section>
    </>
  )
}
