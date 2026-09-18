import { useState } from 'react'
import { ArrowLeft, Volume2 } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getLesson, localized } from '../data/lessons.js'
import { useAuth } from '../context/AuthContext.jsx'
import { recordAttempt } from '../services/appService.js'
import LessonPlayer from '../components/LessonPlayer.jsx'
import { tr } from '../i18n.js'

export default function Lesson() {
  const { lessonId } = useParams()
  const [params] = useSearchParams()
  const { user, profile, language, login } = useAuth()
  const [savedMessage, setSavedMessage] = useState('')
  const lesson = getLesson(lessonId)
  const groupId = params.get('grupo')

  if (!lesson) return <section className="page section-pad"><div className="container empty-state"><h2>Lección no encontrada</h2><Link to="/aprender" className="button">Volver</Link></div></section>

  const handleComplete = async ({ score, passed }) => {
    if (!profile?.id) {
      setSavedMessage(tr(language, 'signinToSave'))
      return
    }
    const groupIds = [...new Set([...(profile.groupIds || []), ...(groupId ? [groupId] : [])])]
    await recordAttempt({ uid: profile.id, lessonId: lesson.id, score, passed, groupIds })
    setSavedMessage(language === 'es' ? 'Progreso guardado ✓' : 'Progress saved ✓')
  }

  return (
    <section className="lesson-page section-pad">
      <div className="container lesson-container">
        <Link to={groupId ? `/grupos/${groupId}` : '/aprender'} className="back-link"><ArrowLeft />{tr(language, 'backLessons')}</Link>
        <div className="lesson-title-row"><div className={`lesson-icon big category-${lesson.category}`}>{lesson.icon}</div><div><span className="eyebrow">{'★'.repeat(lesson.difficulty)}{'☆'.repeat(3-lesson.difficulty)}</span><h1>{localized(lesson.title, language)}</h1><p>{localized(lesson.description, language)}</p></div></div>
        <LessonPlayer lesson={lesson} language={language} onComplete={handleComplete} />
        {savedMessage && <div className="save-toast">{savedMessage}{!user && <button onClick={login}>{tr(language, 'login')}</button>}</div>}
        <div className="parent-tip"><Volume2/><div><strong>{language === 'es' ? 'Consejo para acompañar' : 'Grown-up tip'}</strong><span>{language === 'es' ? 'Permite que el niño intente primero y celebra el proceso, no solo la respuesta correcta.' : 'Let the child try first and celebrate the process, not only the correct answer.'}</span></div></div>
      </div>
    </section>
  )
}
