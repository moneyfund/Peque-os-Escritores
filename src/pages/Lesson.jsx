import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, LockKeyhole, Volume2 } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getLesson, getLessonPrerequisite, isLessonUnlocked, localized } from '../data/lessons.js'
import { useAuth } from '../context/AuthContext.jsx'
import { recordAttempt, subscribeUserProgress } from '../services/appService.js'
import LessonPlayer from '../components/LessonPlayer.jsx'
import LearningIcon from '../components/LearningIcon.jsx'
import { tr } from '../i18n.js'

export default function Lesson() {
  const { lessonId } = useParams()
  const [params] = useSearchParams()
  const { user, profile, language, login } = useAuth()
  const [savedMessage, setSavedMessage] = useState('')
  const [saveState, setSaveState] = useState('idle')
  const [progress, setProgress] = useState([])
  const [progressReady, setProgressReady] = useState(false)
  const lesson = getLesson(lessonId)
  const groupId = params.get('grupo')

  useEffect(() => {
    if (!profile?.id) {
      setProgress([])
      setProgressReady(true)
      return undefined
    }
    setProgressReady(false)
    return subscribeUserProgress(
      profile.id,
      (items) => {
        setProgress(items)
        setProgressReady(true)
      },
      () => setProgressReady(true),
    )
  }, [profile?.id])

  const progressMap = useMemo(() => Object.fromEntries(progress.map((item) => [item.lessonId, item])), [progress])
  const unlocked = lesson ? isLessonUnlocked(lesson, progressMap) : false
  const prerequisite = lesson ? getLessonPrerequisite(lesson) : null

  if (!lesson) return <section className="page section-pad"><div className="container empty-state"><h2>Lección no encontrada</h2><Link to="/aprender" className="button">Volver</Link></div></section>

  if (!progressReady && profile?.id && (lesson.level || 1) > 2) {
    return <section className="lesson-page section-pad v3-lesson-page"><div className="container lesson-container"><div className="v4-level-gate"><span><LockKeyhole/></span><h2>{language === 'es' ? 'Cargando tu progreso…' : 'Loading your progress…'}</h2></div></div></section>
  }

  if (!unlocked) {
    return (
      <section className="lesson-page section-pad v3-lesson-page">
        <div className="container lesson-container">
          <Link to="/aprender" className="back-link"><ArrowLeft />{tr(language, 'backLessons')}</Link>
          <div className="v4-level-gate">
            <span><LockKeyhole/></span>
            <h2>{language === 'es' ? `El nivel ${lesson.level} todavía está bloqueado` : `Level ${lesson.level} is still locked`}</h2>
            <p>{language === 'es'
              ? `Completa primero el nivel ${prerequisite?.level || Math.max(1, (lesson.level || 3) - 2)} de esta categoría para abrirlo.`
              : `Complete level ${prerequisite?.level || Math.max(1, (lesson.level || 3) - 2)} in this category first to unlock it.`}</p>
            <Link className="button" to="/aprender">{language === 'es' ? 'Volver a los retos' : 'Back to challenges'}</Link>
          </div>
        </div>
      </section>
    )
  }

  const handleComplete = async ({ score, passed }) => {
    if (!profile?.id) {
      setSavedMessage(tr(language, 'signinToSave'))
      return
    }
    const groupIds = [...new Set([...(profile.groupIds || []), ...(groupId ? [groupId] : [])])]
    setSaveState('saving')
    try {
      const result = await recordAttempt({ uid: profile.id, lessonId: lesson.id, score, passed, groupIds })
      if (!result?.saved) throw new Error('Firestore no confirmó el guardado.')
      setSaveState('synced')
      setSavedMessage(language === 'es' ? 'Progreso guardado en Firebase' : 'Progress saved to Firebase')
    } catch (error) {
      console.error('Progress save failed', error)
      setSaveState('error')
      setSavedMessage(language === 'es'
        ? 'No se pudo guardar el progreso en Firebase. Revisa la conexión o las reglas e inténtalo nuevamente.'
        : 'Progress could not be saved to Firebase. Check the connection or rules and try again.')
    }
  }

  return (
    <section className="lesson-page section-pad v3-lesson-page">
      <div className="container lesson-container">
        <Link to={groupId ? `/grupos/${groupId}` : '/aprender'} className="back-link"><ArrowLeft />{tr(language, 'backLessons')}</Link>
        <div className={`lesson-title-row v3-lesson-title category-${lesson.category}`}>
          <div className="v3-lesson-title-icon"><LearningIcon name={lesson.id} size={38}/></div>
          <div>
            <span className="v3-level-pill">{language === 'es' ? `Nivel ${lesson.level || lesson.difficulty}` : `Level ${lesson.level || lesson.difficulty}`}</span>
            <h1>{localized(lesson.title, language)}</h1>
            <p>{localized(lesson.description, language)}</p>
          </div>
        </div>
        <LessonPlayer lesson={lesson} language={language} onComplete={handleComplete} />
        {savedMessage && <div className={`save-toast save-${saveState}`}>{saveState === 'saving' ? (language === 'es' ? 'Guardando…' : 'Saving…') : savedMessage}{!user && <button onClick={login}>{tr(language, 'login')}</button>}</div>}
        <div className="parent-tip"><Volume2/><div><strong>{language === 'es' ? 'Consejo para acompañar' : 'Grown-up tip'}</strong><span>{language === 'es' ? 'Permite que el niño intente primero y celebra el proceso, no solo la respuesta correcta.' : 'Let the child try first and celebrate the process, not only the correct answer.'}</span></div></div>
      </div>
    </section>
  )
}
