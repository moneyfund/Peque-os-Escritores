import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, BookPlus, CheckCircle2, Copy, Play, Send, Target, UsersRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getLesson, lessons, localized } from '../data/lessons.js'
import {
  createAssignment,
  getGroup,
  getGroupMemberProgress,
  getGroupMembers,
  listAssignments,
  sendGroupInvite,
} from '../services/appService.js'

export default function GroupDetail() {
  const { groupId } = useParams()
  const { profile, language } = useAuth()
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [memberProgress, setMemberProgress] = useState({})
  const [inviteCode, setInviteCode] = useState('')
  const [selectedLesson, setSelectedLesson] = useState(lessons[0].id)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const [g, m, a] = await Promise.all([
      getGroup(groupId),
      getGroupMembers(groupId),
      listAssignments(groupId),
    ])
    setGroup(g)
    setMembers(m)
    setAssignments(a)
    const progressRows = await Promise.all(
      m.map(async (member) => [
        member.userId || member.id,
        await getGroupMemberProgress(groupId, member.userId || member.id),
      ]),
    )
    setMemberProgress(Object.fromEntries(progressRows))
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [groupId])

  const currentMembership = members.find((member) => (member.userId || member.id) === profile?.id)
  const isTeacher = group?.ownerId === profile?.id || currentMembership?.role === 'teacher'

  const sendInvite = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const target = await sendGroupInvite({
        groupId,
        groupName: group.name,
        fromUid: profile.id,
        fromName: profile.username,
        userCode: inviteCode,
      })
      setInviteCode('')
      setStatus(language === 'es' ? `Invitación enviada a ${target.username}` : `Invitation sent to ${target.username}`)
    } catch (err) {
      setStatus(err.message)
    }
  }

  const assign = async (event) => {
    event.preventDefault()
    await createAssignment(groupId, selectedLesson, profile.id, profile.username)
    setStatus(language === 'es' ? 'Lección asignada' : 'Lesson assigned')
    setAssignments(await listAssignments(groupId))
  }

  const copyGroup = async () => {
    await navigator.clipboard?.writeText(groupId)
    setStatus(language === 'es' ? 'ID del grupo copiado' : 'Group ID copied')
  }

  const classStats = useMemo(() => {
    const allRows = Object.values(memberProgress).flat()
    const completed = allRows.filter((row) => row.completed).length
    const attempts = allRows.reduce((sum, row) => sum + (row.attempts || 0), 0)
    return { completed, attempts }
  }, [memberProgress])

  if (loading) {
    return <section className="v2-group-detail"><div className="container v2-loading-space"><div className="loader-orbit">📚</div></div></section>
  }

  if (!group) {
    return <section className="v2-group-detail"><div className="container v2-empty-panel"><h2>{language === 'es' ? 'Grupo no encontrado' : 'Group not found'}</h2><Link className="v2-primary-cta" to="/grupos">{language === 'es' ? 'Volver' : 'Back'}</Link></div></section>
  }

  return (
    <section className="v2-group-detail">
      <div className="container">
        <Link to="/grupos" className="v2-back-link"><ArrowLeft size={17}/>{language === 'es' ? 'Mis grupos' : 'My groups'}</Link>

        <div className="v2-class-hero">
          <div className="v2-class-symbol"><span/><span/><span/></div>
          <div className="v2-class-title">
            <small>{isTeacher ? (language === 'es' ? 'Espacio docente' : 'Teacher space') : (language === 'es' ? 'Mi clase' : 'My class')}</small>
            <h1>{group.name}</h1>
          </div>
          <div className="v2-class-stats">
            <div><UsersRound/><strong>{members.length}</strong><span>{language === 'es' ? 'miembros' : 'members'}</span></div>
            <div><BookOpen/><strong>{assignments.length}</strong><span>{language === 'es' ? 'tareas' : 'tasks'}</span></div>
            <div><CheckCircle2/><strong>{classStats.completed}</strong><span>{language === 'es' ? 'logros' : 'wins'}</span></div>
          </div>
          <button className="v2-copy-mini" onClick={copyGroup}><Copy size={15}/> ID</button>
        </div>

        {isTeacher && (
          <div className="v2-teacher-console">
            <form className="v2-console-card" onSubmit={sendInvite}>
              <div className="v2-console-icon"><Send/></div>
              <div className="v2-console-copy"><small>{language === 'es' ? 'Agregar estudiante' : 'Add student'}</small><strong>{language === 'es' ? 'Invitar por ID' : 'Invite by ID'}</strong></div>
              <div className="v2-console-form">
                <input value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="PEQ-XXXXXXXX"/>
                <button disabled={!inviteCode.trim()}><Send size={17}/></button>
              </div>
            </form>

            <form className="v2-console-card" onSubmit={assign}>
              <div className="v2-console-icon alt"><BookPlus/></div>
              <div className="v2-console-copy"><small>{language === 'es' ? 'Enviar actividad' : 'Send activity'}</small><strong>{language === 'es' ? 'Asignar lección' : 'Assign lesson'}</strong></div>
              <div className="v2-console-form">
                <select value={selectedLesson} onChange={(e) => setSelectedLesson(e.target.value)}>
                  {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{localized(lesson.title, language)}</option>)}
                </select>
                <button><BookPlus size={17}/></button>
              </div>
            </form>
          </div>
        )}

        {status && <div className="v2-status-toast">{status}</div>}

        <div className="v2-group-columns">
          <div className="v2-group-main">
            <div className="v2-section-head">
              <div><span>{language === 'es' ? 'Actividades' : 'Activities'}</span><h2>{language === 'es' ? 'Lecciones asignadas' : 'Assigned lessons'}</h2></div>
              <span className="v2-count-pill">{assignments.length}</span>
            </div>

            {assignments.length ? (
              <div className="v2-assignment-list">
                {assignments.map((assignment) => {
                  const lesson = getLesson(assignment.lessonId)
                  if (!lesson) return null
                  return (
                    <Link key={assignment.id} to={`/lecciones/${lesson.id}`} className="v2-assignment-row">
                      <span className="v2-assignment-icon">{lesson.icon}</span>
                      <div><small>{language === 'es' ? 'Asignada por' : 'Assigned by'} {assignment.teacherName}</small><strong>{localized(lesson.title, language)}</strong></div>
                      <span className="v2-play-dot"><Play size={15}/></span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="v2-mini-empty">{language === 'es' ? 'Todavía no hay lecciones asignadas.' : 'No lessons assigned yet.'}</div>
            )}

            <div className="v2-section-head v2-member-head">
              <div><span>{language === 'es' ? 'Resultados' : 'Results'}</span><h2>{language === 'es' ? 'Progreso del grupo' : 'Group progress'}</h2></div>
            </div>

            <div className="v2-member-progress-grid">
              {members.map((member) => {
                const uid = member.userId || member.id
                const rows = memberProgress[uid] || []
                const completed = rows.filter((row) => row.completed).length
                const attempts = rows.reduce((sum, row) => sum + (row.attempts || 0), 0)
                const score = rows.length ? Math.round(rows.reduce((sum, row) => sum + (row.lastScore || 0), 0) / rows.length) : 0
                return (
                  <article className="v2-member-progress" key={uid}>
                    <div className="v2-member-profile">
                      <Avatar avatar={member.avatar} avatarType={member.avatarType} size="md"/>
                      <div><strong>{member.username}</strong><small>{member.role === 'teacher' ? (language === 'es' ? 'Docente' : 'Teacher') : (language === 'es' ? 'Estudiante' : 'Student')}</small></div>
                    </div>
                    <div className="v2-member-numbers">
                      <span><strong>{completed}</strong>{language === 'es' ? 'hechas' : 'done'}</span>
                      <span><strong>{attempts}</strong>{language === 'es' ? 'intentos' : 'tries'}</span>
                      <span><strong>{score}%</strong>{language === 'es' ? 'prom.' : 'avg.'}</span>
                    </div>
                    <div className="v2-member-bar"><span style={{ width: `${Math.min(100, score)}%` }}/></div>
                  </article>
                )
              })}
            </div>
          </div>

          <aside className="v2-roster">
            <div className="v2-roster-head"><UsersRound/><div><small>{language === 'es' ? 'Clase' : 'Class'}</small><strong>{language === 'es' ? 'Integrantes' : 'Members'}</strong></div></div>
            <div className="v2-roster-list">
              {members.map((member) => (
                <div key={member.userId || member.id}>
                  <Avatar avatar={member.avatar} avatarType={member.avatarType} size="sm"/>
                  <span><strong>{member.username}</strong><small>{member.role === 'teacher' ? (language === 'es' ? 'Docente' : 'Teacher') : (language === 'es' ? 'Estudiante' : 'Student')}</small></span>
                </div>
              ))}
            </div>
            <div className="v2-privacy-note"><Target size={16}/><span>{language === 'es' ? 'El grupo comparte nombre, avatar y progreso; nunca el correo.' : 'The group shares name, avatar and progress; never email.'}</span></div>
          </aside>
        </div>
      </div>
    </section>
  )
}
