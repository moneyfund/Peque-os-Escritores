import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Play, Sparkles, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext.jsx'
import { categories, lessons, localized } from '../data/lessons.js'
import { listAssignments, listGroups, listUserProgress, subscribeInvitations } from '../services/appService.js'
import LessonCard from '../components/LessonCard.jsx'
import LearningIcon from '../components/LearningIcon.jsx'
import LessonArtwork from '../components/LessonArtwork.jsx'
import CategoryArtwork from '../components/CategoryArtwork.jsx'

const floatTransition = (delay = 0, duration = 4.2) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: 'easeInOut',
})

export default function Home() {
  const { user, profile, login, language } = useAuth()
  const [progress, setProgress] = useState([])
  const [groups, setGroups] = useState([])
  const [assignments, setAssignments] = useState([])
  const [inviteCount, setInviteCount] = useState(0)

  useEffect(() => {
    if (!profile?.id) return
    listUserProgress(profile.id).then(setProgress)
  }, [profile?.id])

  useEffect(() => {
    if (!profile?.groupIds?.length) {
      setGroups([])
      setAssignments([])
      return
    }
    listGroups(profile.groupIds).then(async (rows) => {
      setGroups(rows)
      const taskRows = await Promise.all(rows.map(async (group) => {
        const list = await listAssignments(group.id)
        return list.map((item) => ({ ...item, groupId: group.id, groupName: group.name }))
      }))
      setAssignments(taskRows.flat().slice(0, 4))
    })
  }, [profile?.groupIds?.join('|')])

  useEffect(() => {
    if (!profile?.id) return
    return subscribeInvitations(profile.id, (items) => setInviteCount(items.length))
  }, [profile?.id])

  const progressMap = useMemo(() => Object.fromEntries(progress.map((item) => [item.lessonId, item])), [progress])
  const completed = progress.filter((item) => item.completed).length
  const percent = Math.round((completed / lessons.length) * 100) || 0
  const suggested = lessons.filter((lesson) => !progressMap[lesson.id]?.completed).slice(0, 3)

  if (!user) {
    return (
      <div className="v3-home">
        <section className="v3-guest-hero">
          <div className="v3-sky-blob sky-one" />
          <div className="v3-sky-blob sky-two" />
          <div className="v3-hero-hill hill-one" />
          <div className="v3-hero-hill hill-two" />

          <div className="container v3-guest-grid">
            <motion.div className="v3-guest-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
              <span className="v3-kicker"><Sparkles size={16}/> {language === 'es' ? 'Aprender puede sentirse como jugar' : 'Learning can feel like play'}</span>
              <h1>{language === 'es' ? 'Un mundo para' : 'A world made to'} <span>{language === 'es' ? 'descubrir' : 'discover'}</span></h1>
              <p>{language === 'es' ? 'Vocales, números, colores y palabras en aventuras cortas que invitan a tocar, escuchar, trazar y explorar.' : 'Letters, numbers, colors and words in short adventures made to tap, listen, trace and explore.'}</p>
              <div className="v3-guest-actions">
                <button className="v3-primary-cta" onClick={login}><span className="google-g">G</span>{language === 'es' ? 'Continuar con Google' : 'Continue with Google'}<ArrowRight size={17}/></button>
                <Link className="v3-secondary-cta" to="/aprender"><Play size={17}/>{language === 'es' ? 'Explorar actividades' : 'Explore activities'}</Link>
              </div>
            </motion.div>

            <div className="v3-play-stage" aria-hidden="true">
              <motion.div className="v3-stage-ring ring-one" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}/>
              <motion.div className="v3-stage-ring ring-two" animate={{ rotate: -360 }} transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}/>

              <motion.div className="v3-brand-core" animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }} transition={floatTransition(0, 4.6)}>
                <img src="/favicon.svg" alt="" />
                <span className="v3-core-glow"/>
              </motion.div>

              <motion.div className="v3-float-token token-a" animate={{ y: [0, -18, 0], rotate: [-8, 7, -8] }} transition={floatTransition(.1, 4.4)}>A</motion.div>
              <motion.div className="v3-float-token token-5" animate={{ y: [0, 16, 0], rotate: [7, -6, 7] }} transition={floatTransition(.5, 5)}>5</motion.div>

              <motion.div className="v3-icon-orbit orbit-type" animate={{ y: [0, -10, 0], x: [0, 4, 0] }} transition={floatTransition(.2, 3.8)}><LearningIcon name="vowels" size={28}/></motion.div>
              <motion.div className="v3-icon-orbit orbit-color" animate={{ y: [0, 10, 0], rotate: [0, 8, 0] }} transition={floatTransition(.8, 4.7)}><LearningIcon name="colors" size={28}/></motion.div>
              <motion.div className="v3-icon-orbit orbit-shape" animate={{ x: [0, -8, 0], y: [0, -5, 0] }} transition={floatTransition(.4, 4.1)}><LearningIcon name="shapes" size={28}/></motion.div>
              <motion.div className="v3-icon-orbit orbit-sound" animate={{ scale: [1, 1.08, 1], y: [0, -8, 0] }} transition={floatTransition(.3, 3.9)}><LearningIcon name="words" size={28}/></motion.div>

              <motion.span className="v3-twinkle twinkle-one" animate={{ scale: [1, 1.5, 1], opacity: [.35, 1, .35] }} transition={floatTransition(0, 2.4)} />
              <motion.span className="v3-twinkle twinkle-two" animate={{ scale: [.8, 1.35, .8], opacity: [.25, .9, .25] }} transition={floatTransition(.8, 2.9)} />
              <motion.span className="v3-twinkle twinkle-three" animate={{ scale: [1, 1.45, 1], opacity: [.3, 1, .3] }} transition={floatTransition(.4, 2.6)} />
            </div>
          </div>
        </section>

        <section className="container v3-world-preview">
          {categories.map((category, index) => (
            <motion.div key={category.id} whileHover={{ y: -7, rotate: index % 2 ? 1 : -1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
              <Link to={`/aprender?categoria=${category.id}`} className={`v3-world-tile world-${category.color}`}>
                <span className="v3-world-number">0{index + 1}</span>
                <span className="v3-world-icon"><CategoryArtwork name={category.id} size={74}/></span>
                <strong>{localized(category.title, language)}</strong>
                <ArrowRight size={17}/>
              </Link>
            </motion.div>
          ))}
        </section>
      </div>
    )
  }

  const nextLesson = suggested[0] || lessons[0]

  return (
    <div className="v3-home v3-dashboard">
      <section className="container">
        <div className="v3-user-hero">
          <div className="v3-user-sky-glow one"/>
          <div className="v3-user-sky-glow two"/>
          <div className="v3-user-copy">
            <span className="v3-kicker">{language === 'es' ? 'Tu aventura de hoy' : 'Today’s adventure'}</span>
            <h1>{language === 'es' ? '¡Hola' : 'Hi'}, <span>{profile?.username}</span>!</h1>
            <p>{language === 'es' ? 'Tu mundo de aprendizaje está listo. Elige un reto y sigue avanzando.' : 'Your learning world is ready. Pick a challenge and keep moving.'}</p>
            <Link to={`/lecciones/${nextLesson.id}`} className="v3-primary-cta"><Play size={18}/>{language === 'es' ? 'Continuar aventura' : 'Continue adventure'}</Link>
          </div>

          <div className="v3-user-stage" aria-hidden="true">
            <motion.div className="v3-user-logo-float" animate={{ y: [0, -13, 0], rotate: [-3, 3, -3] }} transition={floatTransition(0, 4.2)}>
              <img src="/favicon.svg" alt="" />
            </motion.div>
            <motion.div className="v3-user-node node-one" animate={{ y: [0, -11, 0], rotate: [-5, 5, -5] }} transition={floatTransition(.3, 3.7)}><LearningIcon name="vowels" size={24}/></motion.div>
            <motion.div className="v3-user-node node-two" animate={{ y: [0, 10, 0], x: [0, 5, 0] }} transition={floatTransition(.7, 4.5)}><LearningIcon name="numbers" size={24}/></motion.div>
            <motion.div className="v3-user-node node-three" animate={{ y: [0, -9, 0], scale: [1, 1.08, 1] }} transition={floatTransition(.1, 4)}><LearningIcon name="colors" size={24}/></motion.div>
            <motion.div className="v3-user-node node-four" animate={{ x: [0, -7, 0], rotate: [0, 9, 0] }} transition={floatTransition(.5, 4.8)}><LearningIcon name="shapes" size={24}/></motion.div>
            <div className="v3-flight-path"><span/><span/><span/><span/><span/></div>
          </div>

          <motion.div className="v3-progress-bubble" animate={{ y: [0, -7, 0] }} transition={floatTransition(.4, 4.3)}>
            <div className="v3-progress-orb" style={{ '--progress': `${percent * 3.6}deg` }}>
              <div><strong>{percent}%</strong><span>{language === 'es' ? 'completado' : 'complete'}</span></div>
            </div>
          </motion.div>

          <div className="v3-user-ground ground-one"/>
          <div className="v3-user-ground ground-two"/>
        </div>

        <div className="v3-quick-grid">
          <Link to="/aprender" className="v3-quick-card quick-learn"><LearningIcon name="learn" size={29}/><span>{language === 'es' ? 'Aprender' : 'Learn'}</span><small>{lessons.length} {language === 'es' ? 'retos' : 'challenges'}</small></Link>
          <Link to="/grupos" className="v3-quick-card quick-groups"><LearningIcon name="groups" size={29}/><span>{language === 'es' ? 'Mis grupos' : 'My groups'}</span><small>{groups.length}</small></Link>
          <Link to="/invitaciones" className="v3-quick-card quick-invites"><LearningIcon name="invitations" size={29}/><span>{language === 'es' ? 'Invitaciones' : 'Invitations'}</span><small>{inviteCount}</small>{inviteCount > 0 && <b>{inviteCount}</b>}</Link>
          <Link to="/perfil" className="v3-quick-card quick-profile"><LearningIcon name="profile" size={29}/><span>{language === 'es' ? 'Mi perfil' : 'My profile'}</span><small>{profile?.userCode}</small></Link>
        </div>
      </section>

      {assignments.length > 0 && (
        <section className="container v3-section">
          <div className="v3-section-head">
            <div><span>{language === 'es' ? 'Para ti' : 'For you'}</span><h2>{language === 'es' ? 'Tareas de tus grupos' : 'Group assignments'}</h2></div>
            <Link to="/grupos">{language === 'es' ? 'Ver grupos' : 'View groups'} <ArrowRight size={16}/></Link>
          </div>
          <div className="v3-task-strip">
            {assignments.map((item) => {
              const lesson = lessons.find((row) => row.id === item.lessonId)
              if (!lesson) return null
              return (
                <Link key={item.id} to={`/lecciones/${lesson.id}`} className={`v3-task-card task-${lesson.category}`}>
                  <span className="v3-task-icon"><LessonArtwork lessonId={lesson.id} size={48}/></span>
                  <div><small>{item.groupName}</small><strong>{localized(lesson.title, language)}</strong></div>
                  <span className="v3-play-dot"><Play size={15}/></span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section className="container v3-section">
        <div className="v3-section-head">
          <div><span>{language === 'es' ? 'Explora' : 'Explore'}</span><h2>{language === 'es' ? '¿Qué aprenderemos hoy?' : 'What will we learn today?'}</h2></div>
          <Link to="/aprender">{language === 'es' ? 'Todos' : 'All'} <ArrowRight size={16}/></Link>
        </div>

        <div className="v3-world-grid">
          {categories.map((category, index) => {
            const total = lessons.filter((lesson) => lesson.category === category.id)
            const done = total.filter((lesson) => progressMap[lesson.id]?.completed).length
            return (
              <motion.div key={category.id} whileHover={{ y: -8, rotate: index % 2 ? 1.4 : -1.4 }} transition={{ type: 'spring', stiffness: 280, damping: 18 }}>
                <Link to={`/aprender?categoria=${category.id}`} className={`v3-world-card world-${category.color}`}>
                  <span className="v3-world-index">0{index + 1}</span>
                  <div className="v3-world-icon-large"><CategoryArtwork name={category.id} size={108}/></div>
                  <div className="v3-world-copy"><strong>{localized(category.title, language)}</strong><small>{done}/{total.length}</small></div>
                  <div className="v3-world-progress"><span style={{ width: `${(done / total.length) * 100}%` }}/></div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="container v3-section v3-section-last">
        <div className="v3-section-head">
          <div><span>{language === 'es' ? 'Siguiente paso' : 'Next step'}</span><h2>{language === 'es' ? 'Retos recomendados' : 'Recommended challenges'}</h2></div>
          <div className="v3-mini-metrics"><CheckCircle2 size={16}/>{completed} <Trophy size={16}/>{progress.reduce((sum, item) => sum + (item.attempts || 0), 0)}</div>
        </div>
        <div className="lesson-grid lesson-grid-wide v3-lesson-grid">
          {(suggested.length ? suggested : lessons.slice(0, 3)).map((lesson) => <LessonCard key={lesson.id} lesson={lesson} language={language} progress={progressMap[lesson.id]} />)}
        </div>
      </section>
    </div>
  )
}
