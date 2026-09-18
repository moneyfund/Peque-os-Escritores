import { useEffect, useState } from 'react'
import { ArrowRight, Plus, UsersRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext.jsx'
import { createGroup, listGroups } from '../services/appService.js'
import { tr } from '../i18n.js'

export default function Groups() {
  const { profile, language, refreshDemoProfile } = useAuth()
  const [groups, setGroups] = useState([])
  const [name, setName] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const t = (key)=>tr(language,key)

  useEffect(()=>{ if(profile?.groupIds) listGroups(profile.groupIds).then(setGroups) },[profile?.groupIds?.join('|')])

  const create = async (event) => {
    event.preventDefault(); setError('')
    try {
      const id = await createGroup(profile.id, profile, name)
      refreshDemoProfile(); setName(''); setShowCreate(false); navigate(`/grupos/${id}`)
    } catch (err) { setError(err.message) }
  }

  return <section className="page section-pad"><div className="container">
    <div className="section-heading page-heading-row"><div><span className="eyebrow"><UsersRound size={16}/> {t('groups')}</span><h1>{language==='es'?'Aprendemos juntos':'We learn together'}</h1><p>{language==='es'?'Crea una clase, invita con el ID personal y comparte lecciones.':'Create a class, invite by personal ID and share lessons.'}</p></div><button className="button" onClick={()=>setShowCreate(v=>!v)}><Plus/>{t('createGroup')}</button></div>
    {showCreate && <motion.form className="create-group-card" onSubmit={create} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}><label><span>{t('groupName')}</span><input autoFocus value={name} onChange={(e)=>setName(e.target.value)} placeholder={language==='es'?'Ej. Preescolar A':'e.g. Preschool A'} /></label><button className="button" disabled={!name.trim()}>{t('create')}</button>{error&&<p className="error-text">{error}</p>}</motion.form>}
    {groups.length ? <div className="group-grid">{groups.map((group)=><Link className="group-card" key={group.id} to={`/grupos/${group.id}`}><span className="group-illustration">🏫</span><div><small>{group.ownerId===profile.id?t('teacher'):t('student')}</small><h3>{group.name}</h3><p>{language==='es'?'Ver miembros, tareas y progreso':'View members, assignments and progress'}</p></div><ArrowRight/></Link>)}</div> : <div className="empty-state"><span>🏫</span><h3>{t('noGroups')}</h3><p>{language==='es'?'Un docente puede invitarte usando tu ID, o puedes crear tu propio grupo.':'A teacher can invite you using your ID, or you can create your own group.'}</p></div>}
  </div></section>
}
