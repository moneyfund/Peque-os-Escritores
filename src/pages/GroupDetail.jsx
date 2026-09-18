import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookPlus, Copy, Send, ShieldCheck, UsersRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import LessonCard from '../components/LessonCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getLesson, lessons, localized } from '../data/lessons.js'
import { tr } from '../i18n.js'
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
  const { profile, language, firebaseReady } = useAuth()
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [memberProgress, setMemberProgress] = useState({})
  const [inviteCode, setInviteCode] = useState('')
  const [selectedLesson, setSelectedLesson] = useState(lessons[0].id)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const t=(key)=>tr(language,key)

  const load = async () => {
    setLoading(true)
    const [g, m, a] = await Promise.all([getGroup(groupId), getGroupMembers(groupId), listAssignments(groupId)])
    setGroup(g); setMembers(m); setAssignments(a)
    const progressRows = await Promise.all(m.map(async (member) => [member.userId || member.id, await getGroupMemberProgress(groupId, member.userId || member.id)]))
    setMemberProgress(Object.fromEntries(progressRows))
    setLoading(false)
  }

  useEffect(()=>{ load() },[groupId])

  const currentMembership = members.find((member)=>(member.userId||member.id)===profile?.id)
  const isTeacher = group?.ownerId === profile?.id || currentMembership?.role === 'teacher'

  const sendInvite = async (event) => {
    event.preventDefault(); setStatus('')
    try {
      const target = await sendGroupInvite({ groupId, groupName:group.name, fromUid:profile.id, fromName:profile.username, userCode:inviteCode })
      setInviteCode(''); setStatus(`${t('inviteSent')}: ${target.username}`); await load()
    } catch(err) { setStatus(err.message) }
  }

  const assign = async (event) => {
    event.preventDefault()
    await createAssignment(groupId, selectedLesson, profile.id, profile.username)
    setStatus(language==='es'?'Lección asignada ✓':'Lesson assigned ✓')
    setAssignments(await listAssignments(groupId))
  }

  const copyGroup = async () => { await navigator.clipboard?.writeText(groupId); setStatus(language==='es'?'ID del grupo copiado':'Group ID copied') }

  if (loading) return <section className="page section-pad"><div className="container empty-state"><div className="loader-orbit">📚</div><h3>{t('loading')}</h3></div></section>
  if (!group) return <section className="page section-pad"><div className="container empty-state"><h2>Grupo no encontrado</h2><Link className="button" to="/grupos">Volver</Link></div></section>

  return <section className="page section-pad"><div className="container">
    <Link to="/grupos" className="back-link"><ArrowLeft/>{t('groups')}</Link>
    <div className="group-hero"><div className="school-badge">🏫</div><div><span className="eyebrow"><UsersRound size={16}/> {isTeacher?t('teacher'):t('student')}</span><h1>{group.name}</h1><p>{language==='es'?'Un espacio privado para aprender, compartir actividades y acompañar el progreso.':'A private space to learn, share activities and follow progress.'}</p></div><button className="button button-ghost" onClick={copyGroup}><Copy size={17}/>ID</button></div>

    {isTeacher && <div className="teacher-tools">
      <form className="tool-card" onSubmit={sendInvite}><div className="tool-icon">👋</div><div><h3>{t('inviteMember')}</h3><p>{language==='es'?'Escribe el ID que aparece en el perfil del estudiante.':'Enter the ID shown on the student profile.'}</p><div className="inline-form"><input value={inviteCode} onChange={(e)=>setInviteCode(e.target.value.toUpperCase())} placeholder="PEQ-XXXXXXXX"/><button className="button"><Send size={18}/>{t('sendInvite')}</button></div>{!firebaseReady&&<small className="demo-hint">Demo: prueba con <b>PEQ-DEMOFRIEND</b></small>}</div></form>
      <form className="tool-card" onSubmit={assign}><div className="tool-icon">📌</div><div><h3>{t('assignLesson')}</h3><p>{language==='es'?'Selecciona una actividad para que aparezca en el grupo.':'Choose an activity to publish in the group.'}</p><div className="inline-form"><select value={selectedLesson} onChange={(e)=>setSelectedLesson(e.target.value)}>{lessons.map((lesson)=><option key={lesson.id} value={lesson.id}>{localized(lesson.title,language)}</option>)}</select><button className="button"><BookPlus size={18}/>{language==='es'?'Asignar':'Assign'}</button></div></div></form>
    </div>}
    {status&&<div className="notice-bar">{status}</div>}

    <div className="group-section"><div className="section-heading"><div><span className="eyebrow">📚 {t('assignments')}</span><h2>{language==='es'?'Actividades del grupo':'Group activities'}</h2></div></div>{assignments.length?<div className="lesson-grid">{assignments.map((assignment)=>{const lesson=getLesson(assignment.lessonId); return lesson?<LessonCard key={assignment.id} lesson={lesson} language={language} compact href={`/lecciones/${lesson.id}?grupo=${groupId}&asignacion=${assignment.id}`}/>:null})}</div>:<div className="mini-empty">📭 {t('noAssignments')}</div>}</div>

    <div className="group-section"><div className="section-heading"><div><span className="eyebrow"><ShieldCheck size={16}/> {t('groupProgress')}</span><h2>{t('classmateProgress')}</h2><p>{t('privacyNote')}</p></div></div><div className="member-progress-grid">{members.map((member)=>{
      const uid=member.userId||member.id; const rows=memberProgress[uid]||[]; const done=rows.filter(r=>r.completed).length; const attempts=rows.reduce((s,r)=>s+(r.attempts||0),0); const avg=rows.length?Math.round(rows.reduce((s,r)=>s+(r.lastScore||0),0)/rows.length):0
      return <article className="member-progress-card" key={uid}><div className="member-header"><Avatar avatar={member.avatar} avatarType={member.avatarType} size="lg"/><div><h3>{member.username}</h3><span>{member.role==='teacher'?t('teacher'):t('student')}</span></div></div><div className="member-metrics"><span><strong>{done}</strong>{t('completed')}</span><span><strong>{attempts}</strong>{t('attempts')}</span><span><strong>{avg}%</strong>{t('score')}</span></div><div className="member-lessons">{rows.length?rows.sort((a,b)=>(b.updatedAt?.seconds||b.updatedAt||0)-(a.updatedAt?.seconds||a.updatedAt||0)).map((row)=>{const lesson=getLesson(row.lessonId);return <div key={row.lessonId}><span>{lesson?.icon||'📘'} {lesson?localized(lesson.title,language):row.lessonId}</span><small>{row.attempts||0} {t('attempts').toLowerCase()} · {row.lastScore||0}%</small></div>}):<p>{language==='es'?'Aún no ha realizado lecciones.':'No lessons completed yet.'}</p>}</div></article>
    })}</div></div>

    <div className="group-section"><div className="section-heading"><div><span className="eyebrow">👥 {t('members')}</span><h2>{members.length} {members.length===1?(language==='es'?'miembro':'member'):(language==='es'?'miembros':'members')}</h2></div></div><div className="member-list">{members.map((member)=><div key={member.userId||member.id}><Avatar avatar={member.avatar} avatarType={member.avatarType} size="md"/><div><strong>{member.username}</strong><small>{member.role==='teacher'?t('teacher'):t('student')}</small></div></div>)}</div></div>
  </div></section>
}
