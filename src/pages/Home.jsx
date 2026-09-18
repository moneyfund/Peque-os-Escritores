import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Bell, BookOpen, CheckCircle2, Layers3, Play, Sparkles, Trophy, UserRound, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext.jsx'
import { categories, lessons, localized } from '../data/lessons.js'
import { listAssignments, listGroups, listUserProgress, subscribeInvitations } from '../services/appService.js'
import LessonCard from '../components/LessonCard.jsx'

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
      <div className="v2-home">
        <section className="v2-guest-hero">
          <div className="v2-guest-glow" />
          <div className="container v2-guest-grid">
            <motion.div className="v2-guest-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <span className="v2-kicker"><Sparkles size={16}/> Aprender jugando</span>
              <h1>Pequeños<br/><span>Escritores</span></h1>
              <p>Vocales, números, colores y palabras en pequeñas aventuras interactivas.</p>
              <div className="v2-guest-actions">
                <button className="v2-primary-cta" onClick={login}>Entrar con Google <ArrowRight size={18}/></button>
                <Link className="v2-secondary-cta" to="/aprender"><Play size={17}/> Explorar</Link>
              </div>
            </motion.div>

            <motion.div className="v2-playground" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .12 }}>
              <div className="v2-orbit orbit-a">A</div>
              <div className="v2-orbit orbit-b">5</div>
              <div className="v2-orbit orbit-c">●</div>
              <div className="v2-orbit orbit-d">★</div>
              <div className="v2-mascot-shell">
                <div className="v2-book-face">
                  <span className="eye left" />
                  <span className="eye right" />
                  <span className="smile" />
                </div>
                <div className="v2-mini-note">A · E · I · O · U</div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container v2-world-preview">
          {categories.map((category, index) => (
            <Link key={category.id} to={`/aprender?categoria=${category.id}`} className={`v2-world-tile world-${category.color}`}>
              <span className="v2-world-number">0{index + 1}</span>
              <span className="v2-world-icon">{category.icon}</span>
              <strong>{localized(category.title, language)}</strong>
              <ArrowRight size={18}/>
            </Link>
          ))}
        </section>
      </div>
    )
  }

  const nextLesson = suggested[0] || lessons[0]

  return (
    <div className="v2-home v2-dashboard">
      <section className="container v2-dashboard-top">
        <motion.div className="v2-greeting-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="v2-greeting-copy">
            <span className="v2-kicker">{language === 'es' ? 'Tu aventura de hoy' : 'Today’s adventure'}</span>
            <h1>{language === 'es' ? '¡Hola' : 'Hi'}, {profile?.username}!</h1>
            <p>{language === 'es' ? 'Elige un reto y sigue sumando logros.' : 'Pick a challenge and keep growing.'}</p>
            <Link to={`/lecciones/${nextLesson.id}`} className="v2-primary-cta">
              <Play size={18}/> {language === 'es' ? 'Continuar' : 'Continue'}
            </Link>
          </div>

          <div className="v2-progress-orb" style={{ '--progress': `${percent * 3.6}deg` }}>
            <div><strong>{percent}%</strong><span>{language === 'es' ? 'completado' : 'complete'}</span></div>
          </div>

          <div className="v2-letter-stack" aria-hidden="true">
            <span>A</span><span>3</span><span>★</span>
          </div>
        </motion.div>

        <div className="v2-quick-grid">
          <Link to="/aprender" className="v2-quick-card quick-learn"><BookOpen/><span>{language === 'es' ? 'Aprender' : 'Learn'}</span><small>{lessons.length} retos</small></Link>
          <Link to="/grupos" className="v2-quick-card quick-groups"><UsersRound/><span>{language === 'es' ? 'Mis grupos' : 'My groups'}</span><small>{groups.length}</small></Link>
          <Link to="/invitaciones" className="v2-quick-card quick-invites"><Bell/><span>{language === 'es' ? 'Invitaciones' : 'Invitations'}</span><small>{inviteCount}</small>{inviteCount > 0 && <b>{inviteCount}</b>}</Link>
          <Link to="/perfil" className="v2-quick-card quick-profile"><UserRound/><span>{language === 'es' ? 'Mi perfil' : 'My profile'}</span><small>{profile?.userCode}</small></Link>
        </div>
      </section>

      {assignments.length > 0 && (
        <section className="container v2-section">
          <div className="v2-section-head">
            <div><span>{language === 'es' ? 'Para ti' : 'For you'}</span><h2>{language === 'es' ? 'Tareas de tus grupos' : 'Group assignments'}</h2></div>
            <Link to="/grupos">{language === 'es' ? 'Ver grupos' : 'View groups'} <ArrowRight size={16}/></Link>
          </div>
          <div className="v2-task-strip">
            {assignments.map((item) => {
              const lesson = lessons.find((row) => row.id === item.lessonId)
              if (!lesson) return null
              return (
                <Link key={item.id} to={`/lecciones/${lesson.id}`} className="v2-task-card">
                  <span className="v2-task-icon">{lesson.icon}</span>
                  <div><small>{item.groupName}</small><strong>{localized(lesson.title, language)}</strong></div>
                  <span className="v2-play-dot"><Play size={15}/></span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section className="container v2-section">
        <div className="v2-section-head">
          <div><span>{language === 'es' ? 'Explora' : 'Explore'}</span><h2>{language === 'es' ? '¿Qué aprenderemos hoy?' : 'What will we learn today?'}</h2></div>
          <Link to="/aprender">{language === 'es' ? 'Todos' : 'All'} <ArrowRight size={16}/></Link>
        </div>
        <div className="v2-world-grid">
          {categories.map((category, index) => {
            const total = lessons.filter((lesson) => lesson.category === category.id)
            const done = total.filter((lesson) => progressMap[lesson.id]?.completed).length
            return (
              <Link key={category.id} to={`/aprender?categoria=${category.id}`} className={`v2-world-card world-${category.color}`}>
                <span className="v2-world-index">0{index + 1}</span>
                <div className="v2-world-icon-large">{category.icon}</div>
                <div className="v2-world-copy"><strong>{localized(category.title, language)}</strong><small>{done}/{total.length}</small></div>
                <div className="v2-world-progress"><span style={{ width: `${(done / total.length) * 100}%` }}/></div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="container v2-section v2-section-last">
        <div className="v2-section-head">
          <div><span>{language === 'es' ? 'Siguiente paso' : 'Next step'}</span><h2>{language === 'es' ? 'Retos recomendados' : 'Recommended challenges'}</h2></div>
          <div className="v2-mini-metrics"><CheckCircle2 size={16}/>{completed} <Trophy size={16}/>{progress.reduce((sum, item) => sum + (item.attempts || 0), 0)}</div>
        </div>
        <div className="lesson-grid lesson-grid-wide v2-lesson-grid">
          {(suggested.length ? suggested : lessons.slice(0, 3)).map((lesson) => <LessonCard key={lesson.id} lesson={lesson} language={language} progress={progressMap[lesson.id]} />)}
        </div>
      </section>
    </div>
  )
}
