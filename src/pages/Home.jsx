import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Play, Sparkles, Trophy, Type, WandSparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext.jsx'
import { categories, isLessonUnlocked, lessons, localized } from '../data/lessons.js'
import { listAssignments, listGroups, subscribeInvitations, subscribeUserProgress } from '../services/appService.js'
import LessonCard from '../components/LessonCard.jsx'
import LearningIcon from '../components/LearningIcon.jsx'
import LessonArtwork from '../components/LessonArtwork.jsx'
import CategoryArtwork from '../components/CategoryArtwork.jsx'
import KidMusicPlayer from '../components/KidMusicPlayer.jsx'

const floatTransition = (delay = 0, duration = 4.2) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: 'easeInOut',
})

const dragProps = {
  drag: true,
  dragElastic: .18,
  dragConstraints: { left: -60, right: 60, top: -48, bottom: 48 },
}

export default function Home() {
  const { user, profile, login, language, authError } = useAuth()
  const [progress, setProgress] = useState([])
  const [groups, setGroups] = useState([])
  const [assignments, setAssignments] = useState([])
  const [inviteCount, setInviteCount] = useState(0)

  useEffect(() => {
    if (!profile?.id) return undefined
    return subscribeUserProgress(profile.id, setProgress)
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
    if (!profile?.id) return undefined
    return subscribeInvitations(profile.id, (items) => setInviteCount(items.length))
  }, [profile?.id])

  const progressMap = useMemo(() => Object.fromEntries(progress.map((item) => [item.lessonId, item])), [progress])
  const completed = progress.filter((item) => item.completed).length
  const percent = Math.round((completed / lessons.length) * 100) || 0
  const suggested = lessons.filter((lesson) => isLessonUnlocked(lesson, progressMap) && !progressMap[lesson.id]?.completed).slice(0, 3)

  if (!user) {
    return (
      <div className="v3-home v12-home">
        <section className="v12-guest-hero">
          <div className="v12-ambient ambient-one"/><div className="v12-ambient ambient-two"/><div className="v12-ambient ambient-three"/>
          <div className="container v12-guest-grid">
            <motion.div className="v12-guest-copy" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.55 }}>
              <span className="v12-kicker"><WandSparkles size={16}/> {language === 'es' ? 'Aprendizaje activo para preescolar' : 'Active preschool learning'}</span>
              <h1>{language === 'es' ? 'Toca. Escucha. Mueve. ' : 'Tap. Listen. Move. '}<strong>{language === 'es' ? 'Aprende.' : 'Learn.'}</strong></h1>
              <p>{language === 'es' ? 'Un espacio visual y juguetón para descubrir vocales, abecedario, sílabas, números, colores, formas y primeras palabras.' : 'A playful visual space for vowels, alphabet, Spanish syllables, numbers, colors, shapes and first words.'}</p>
              <div className="v12-hero-actions">
                <button className="v12-primary-cta" onClick={login}><span className="google-g">G</span>{language === 'es' ? 'Entrar y aprender' : 'Sign in and learn'}<ArrowRight size={17}/></button>
                <Link className="v12-secondary-cta" to="/silabas"><Type size={18}/>{language === 'es' ? 'Explorar sílabas' : 'Explore syllables'}</Link>
              </div>
              <KidMusicPlayer/>
              {authError && <div className="v3-auth-error" role="alert">{authError}</div>}
            </motion.div>

            <div className="v12-playground" aria-label={language === 'es' ? 'Escena interactiva: puedes mover los objetos' : 'Interactive scene: you can move the objects'}>
              <motion.div className="v12-play-ring ring-one" animate={{ rotate:360 }} transition={{ duration:28, repeat:Infinity, ease:'linear' }}/>
              <motion.div className="v12-play-ring ring-two" animate={{ rotate:-360 }} transition={{ duration:38, repeat:Infinity, ease:'linear' }}/>
              <motion.div className="v12-play-core" {...dragProps} animate={{ y:[0,-12,0], rotate:[-2,2,-2] }} transition={floatTransition(0,4.6)}>
                <img src="/favicon.svg" alt=""/>
                <span>{language === 'es' ? '¡Juega conmigo!' : 'Play with me!'}</span>
              </motion.div>
              {[
                ['A','token-a'],['7','token-b'],['MA','token-c'],['▲','token-d'],['●','token-e'],['B','token-f'],
              ].map(([value,className],index)=>(
                <motion.button type="button" key={value} className={`v12-drag-token ${className}`} {...dragProps}
                  animate={{ y:[0,index%2 ? 15 : -14,0], rotate:[-6,index%2 ? -10 : 10,-6] }}
                  transition={floatTransition(index*.12,3.7+index*.25)}>{value}</motion.button>
              ))}
              <span className="v12-play-hint">{language === 'es' ? 'Arrastra los objetos' : 'Drag the objects'}</span>
            </div>
          </div>
        </section>

        <section className="container v12-world-preview">
          {categories.map((category,index)=>(
            <motion.div key={category.id} whileHover={{ y:-8, rotate:index%2 ? 1 : -1 }} transition={{ type:'spring', stiffness:260, damping:18 }}>
              <Link to={`/aprender?categoria=${category.id}`} className={`v12-world-tile world-${category.color}`}>
                <span className="v12-world-index">0{index+1}</span>
                <CategoryArtwork name={category.id} size={82}/>
                <div><strong>{localized(category.title,language)}</strong><small>{localized(category.subtitle,language)}</small></div>
                <ArrowRight size={18}/>
              </Link>
            </motion.div>
          ))}
        </section>

        <section className="container v12-phonics-banner">
          <div><span><Sparkles size={16}/> {language === 'es' ? 'Nueva área exclusiva' : 'New dedicated area'}</span><h2>{language === 'es' ? 'Laboratorio de sílabas y escritura fonética' : 'Spanish syllables & phonics lab'}</h2><p>{language === 'es' ? 'MA · ME · MI · MO · MU, PA · PE · PI… familias completas, armado de palabras y dictado inicial.' : 'Complete syllable families, word building and early dictation.'}</p></div>
          <div className="v12-syllable-cloud" aria-hidden="true"><b>MA</b><b>PE</b><b>LI</b><b>SO</b><b>TU</b></div>
          <Link to="/silabas">{language === 'es' ? 'Entrar al laboratorio' : 'Open the lab'}<ArrowRight size={18}/></Link>
        </section>
      </div>
    )
  }

  const nextLesson = suggested[0] || lessons.find((lesson) => isLessonUnlocked(lesson, progressMap)) || lessons[0]

  return (
    <div className="v3-home v3-dashboard v12-home">
      <section className="container">
        <div className="v12-user-hero">
          <div className="v12-user-aurora aurora-one"/><div className="v12-user-aurora aurora-two"/>
          <div className="v12-user-copy">
            <span className="v12-kicker">{language === 'es' ? 'Tu aventura de hoy' : 'Today’s adventure'}</span>
            <h1>{language === 'es' ? '¡Hola' : 'Hi'}, <strong>{profile?.username}</strong>!</h1>
            <p>{language === 'es' ? 'Tu mundo está listo. Puedes mover los objetos, escuchar música, practicar sílabas o continuar tu próximo reto.' : 'Your world is ready. Move objects, play music, practice syllables or continue your next challenge.'}</p>
            <div className="v12-hero-actions">
              <Link to={`/lecciones/${nextLesson.id}`} className="v12-primary-cta"><Play size={18}/>{language === 'es' ? 'Continuar aventura' : 'Continue adventure'}</Link>
              <Link to="/silabas" className="v12-secondary-cta"><Type size={18}/>{language === 'es' ? 'Practicar sílabas' : 'Practice syllables'}</Link>
            </div>
            <KidMusicPlayer compact/>
          </div>

          <div className="v12-user-playground" aria-label={language === 'es' ? 'Zona interactiva' : 'Interactive area'}>
            <motion.div className="v12-user-core" {...dragProps} animate={{ y:[0,-12,0], rotate:[-3,3,-3] }} transition={floatTransition(0,4.2)}>
              <img src="/favicon.svg" alt=""/>
            </motion.div>
            {[
              ['A','node-one'],['#','node-two'],['MA','node-three'],['3','node-four'],['▲','node-five'],
            ].map(([value,className],index)=>(
              <motion.button type="button" key={value} className={`v12-user-node ${className}`} {...dragProps}
                animate={{ y:[0,index%2 ? 11 : -10,0], x:[0,index%2 ? 5 : -4,0], rotate:[-4,index%2 ? -7 : 7,-4] }}
                transition={floatTransition(index*.18,3.8+index*.25)}>{value}</motion.button>
            ))}
            <div className="v12-flight-path"><span/><span/><span/><span/><span/></div>
          </div>

          <motion.div className="v12-progress-bubble" animate={{ y:[0,-7,0] }} transition={floatTransition(.4,4.3)}>
            <div className="v3-progress-orb" style={{ '--progress':`${percent*3.6}deg` }}><div><strong>{percent}%</strong><span>{language === 'es' ? 'completado' : 'complete'}</span></div></div>
          </motion.div>
        </div>

        <div className="v12-quick-grid">
          <Link to="/aprender" className="v12-quick-card quick-learn"><LearningIcon name="learn" size={31}/><span>{language === 'es' ? 'Aprender' : 'Learn'}</span><small>{lessons.length} {language === 'es' ? 'retos' : 'challenges'}</small></Link>
          <Link to="/silabas" className="v12-quick-card quick-syllables"><Type size={31}/><span>{language === 'es' ? 'Sílabas' : 'Syllables'}</span><small>{language === 'es' ? 'Todo abierto' : 'Unlocked'}</small></Link>
          <Link to="/grupos" className="v12-quick-card quick-groups"><LearningIcon name="groups" size={31}/><span>{language === 'es' ? 'Mis grupos' : 'My groups'}</span><small>{groups.length}</small></Link>
          <Link to="/invitaciones" className="v12-quick-card quick-invites"><LearningIcon name="invitations" size={31}/><span>{language === 'es' ? 'Invitaciones' : 'Invitations'}</span><small>{inviteCount}</small>{inviteCount>0 && <b>{inviteCount}</b>}</Link>
          <Link to="/perfil" className="v12-quick-card quick-profile"><LearningIcon name="profile" size={31}/><span>{language === 'es' ? 'Mi perfil' : 'My profile'}</span><small>{profile?.userCode}</small></Link>
        </div>
      </section>

      {assignments.length>0 && (
        <section className="container v3-section">
          <div className="v3-section-head"><div><span>{language === 'es' ? 'Para ti' : 'For you'}</span><h2>{language === 'es' ? 'Tareas de tus grupos' : 'Group assignments'}</h2></div><Link to="/grupos">{language === 'es' ? 'Ver grupos' : 'View groups'} <ArrowRight size={16}/></Link></div>
          <div className="v3-task-strip">
            {assignments.map((item)=>{
              const lesson=lessons.find((row)=>row.id===item.lessonId)
              if(!lesson) return null
              return <Link key={item.id} to={`/lecciones/${lesson.id}`} className={`v3-task-card task-${lesson.category}`}><span className="v3-task-icon"><LessonArtwork lessonId={lesson.id} size={48}/></span><div><small>{item.groupName}</small><strong>{localized(lesson.title,language)}</strong></div><span className="v3-play-dot"><Play size={15}/></span></Link>
            })}
          </div>
        </section>
      )}

      <section className="container v3-section">
        <div className="v3-section-head"><div><span>{language === 'es' ? 'Explora' : 'Explore'}</span><h2>{language === 'es' ? '¿Qué aprenderemos hoy?' : 'What will we learn today?'}</h2></div><Link to="/aprender">{language === 'es' ? 'Todos' : 'All'} <ArrowRight size={16}/></Link></div>
        <div className="v12-world-grid">
          {categories.map((category,index)=>{
            const total=lessons.filter((lesson)=>lesson.category===category.id)
            const done=total.filter((lesson)=>progressMap[lesson.id]?.completed).length
            return (
              <motion.div key={category.id} whileHover={{ y:-9, rotate:index%2 ? 1.4 : -1.4 }} transition={{ type:'spring', stiffness:280, damping:18 }}>
                <Link to={`/aprender?categoria=${category.id}`} className={`v12-world-card world-${category.color}`}>
                  <span className="v12-world-index">0{index+1}</span>
                  <div className="v12-world-art"><CategoryArtwork name={category.id} size={105}/></div>
                  <div><strong>{localized(category.title,language)}</strong><small>{done}/{total.length} {language === 'es' ? 'completados' : 'completed'}</small></div>
                  <div className="v12-world-progress"><span style={{ width:`${total.length ? (done/total.length)*100 : 0}%` }}/></div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="container v12-signed-phonics">
        <div className="v12-signed-phonics-copy"><span><Type size={16}/> {language === 'es' ? 'Escritura fonética' : 'Spanish phonics'}</span><h2>{language === 'es' ? 'De sonidos a palabras' : 'From sounds to words'}</h2><p>{language === 'es' ? 'Explora familias silábicas sin bloqueos, combina consonantes y vocales y practica dictado inicial.' : 'Explore unlocked syllable families, combine sounds and practice early dictation.'}</p><Link to="/silabas">{language === 'es' ? 'Abrir laboratorio' : 'Open lab'}<ArrowRight size={18}/></Link></div>
        <div className="v12-signed-phonics-visual" aria-hidden="true"><span>MA</span><span>ME</span><span>MI</span><span>MO</span><span>MU</span></div>
      </section>

      <section className="container v3-section v3-section-last">
        <div className="v3-section-head"><div><span>{language === 'es' ? 'Siguiente paso' : 'Next step'}</span><h2>{language === 'es' ? 'Retos recomendados' : 'Recommended challenges'}</h2></div><div className="v3-mini-metrics"><CheckCircle2 size={16}/>{completed} <Trophy size={16}/>{progress.reduce((sum,item)=>sum+(item.attempts||0),0)}</div></div>
        <div className="lesson-grid lesson-grid-wide v3-lesson-grid">{(suggested.length ? suggested : lessons.filter((lesson)=>isLessonUnlocked(lesson,progressMap)).slice(0,3)).map((lesson)=><LessonCard key={lesson.id} lesson={lesson} language={language} progress={progressMap[lesson.id]}/>)}</div>
      </section>
    </div>
  )
}
