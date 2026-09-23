import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Compass, Sparkles, Type } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, getCategoryLessons, getLessonPrerequisite, isLessonUnlocked, localized } from '../data/lessons.js'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeUserProgress } from '../services/appService.js'
import LessonCard from '../components/LessonCard.jsx'
import LearningIcon from '../components/LearningIcon.jsx'
import CategoryArtwork from '../components/CategoryArtwork.jsx'
import CategoryHero from '../components/CategoryHero.jsx'

export default function Learn() {
  const { profile, language } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [progress, setProgress] = useState([])
  const category = searchParams.get('categoria') || 'all'

  useEffect(() => {
    if (!profile?.id) return undefined
    return subscribeUserProgress(profile.id, setProgress)
  }, [profile?.id])

  const progressMap = useMemo(() => Object.fromEntries(progress.map((item) => [item.lessonId, item])), [progress])
  const activeCategory = categories.find((item) => item.id === category)
  const visibleCategories = category === 'all' ? categories : categories.filter((item) => item.id === category)
  const groupedChallenges = useMemo(() => visibleCategories.map((item) => {
    const categoryLessons = getCategoryLessons(item.id)
    const completed = categoryLessons.filter((lesson) => progressMap[lesson.id]?.completed).length
    return { item, categoryLessons, completed }
  }), [category, progressMap])
  const visibleCount = groupedChallenges.reduce((sum, group) => sum + group.categoryLessons.length, 0)

  return (
    <section className="v3-learn-page">
      <div className="container">
        <div className="v3-learn-head v12-learn-head">
          <div>
            <span className="v3-kicker"><Compass size={16}/> {language === 'es' ? 'Explorar' : 'Explore'}</span>
            <h1>{activeCategory ? localized(activeCategory.title, language) : (language === 'es' ? 'Elige tu aventura' : 'Choose your adventure')}</h1>
          </div>
          <Link to="/silabas" className="v12-syllables-shortcut"><Type size={18}/><span><strong>{language === 'es' ? 'Laboratorio de sílabas' : 'Syllables lab'}</strong><small>{language === 'es' ? 'Todo desbloqueado' : 'Everything unlocked'}</small></span><ChevronRight size={18}/></Link>
        </div>

        {activeCategory ? (
          <CategoryHero category={activeCategory} language={language}/>
        ) : (
          <section className="v12-all-learning-hero">
            <div><span><Sparkles size={16}/> {language === 'es' ? '6 mundos de aprendizaje' : '6 learning worlds'}</span><strong>{language === 'es' ? 'Aprender se siente como explorar' : 'Learning feels like exploring'}</strong><small>{language === 'es' ? 'Elige una categoría, mueve sus elementos y avanza por niveles.' : 'Pick a category, move its elements and progress through levels.'}</small></div>
            <div className="v12-all-orbit" aria-hidden="true">{categories.map((item)=><span key={item.id}><CategoryArtwork name={item.id} size={54}/></span>)}</div>
          </section>
        )}

        <div className="v3-category-rail">
          <button className={category === 'all' ? 'active' : ''} onClick={() => setSearchParams({})}>
            <span className="v3-all-mark"><Sparkles size={19}/></span><strong>{language === 'es' ? 'Todo' : 'All'}</strong>
          </button>
          {categories.map((item) => (
            <button key={item.id} className={category === item.id ? 'active' : ''} onClick={() => setSearchParams({ categoria: item.id })}>
              <CategoryArtwork name={item.id} size={39} compact/><strong>{localized(item.title, language)}</strong>
            </button>
          ))}
        </div>

        <div className="v3-learn-summary">
          <div><strong>{visibleCount}</strong><span>{language === 'es' ? 'niveles' : 'levels'}</span></div>
          <ChevronRight size={18}/>
          <p>{language === 'es'
            ? 'Empiezas con los niveles 1 y 2 · cada logro abre el siguiente nivel de su camino'
            : 'Start with levels 1 and 2 · each success opens the next level in its path'}</p>
        </div>

        <div className="v4-category-stack">
          {groupedChallenges.map(({ item, categoryLessons, completed }) => (
            <section key={item.id} className={`v4-category-section category-${item.id}`}>
              <div className="v4-category-head">
                <div className="v4-category-title">
                  <span className="v4-category-art"><CategoryArtwork name={item.id} size={58}/></span>
                  <div>
                    <small>{language === 'es' ? 'Categoría' : 'Category'}</small>
                    <h2>{localized(item.title, language)}</h2>
                    <p>{localized(item.subtitle, language)}</p>
                  </div>
                </div>
                <div className="v4-category-progress">
                  <strong>{completed}/{categoryLessons.length}</strong>
                  <span>{language === 'es' ? 'completados' : 'completed'}</span>
                </div>
              </div>

              <div className="v4-level-grid">
                {categoryLessons.map((lesson) => {
                  const unlocked = isLessonUnlocked(lesson, progressMap)
                  const prerequisite = getLessonPrerequisite(lesson)
                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      language={language}
                      progress={progressMap[lesson.id]}
                      compact
                      locked={!unlocked}
                      unlockLevel={prerequisite?.level}
                    />
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
