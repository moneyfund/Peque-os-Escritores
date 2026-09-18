import { useEffect, useState } from 'react'
import { ArrowUpRight, Plus, Sparkles, UsersRound, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../context/AuthContext.jsx'
import { createGroup, listGroups } from '../services/appService.js'

export default function Groups() {
  const { profile, language, refreshDemoProfile } = useAuth()
  const [groups, setGroups] = useState([])
  const [name, setName] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (profile?.groupIds) listGroups(profile.groupIds).then(setGroups)
  }, [profile?.groupIds?.join('|')])

  const create = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const id = await createGroup(profile.id, profile, name)
      refreshDemoProfile()
      setName('')
      setShowCreate(false)
      navigate(`/grupos/${id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="v2-groups-page">
      <div className="container">
        <div className="v2-page-top">
          <div>
            <span className="v2-kicker"><UsersRound size={16}/> {language === 'es' ? 'Comunidad' : 'Community'}</span>
            <h1>{language === 'es' ? 'Mis grupos' : 'My groups'}</h1>
          </div>
          <button className="v2-primary-cta compact" onClick={() => setShowCreate(true)}><Plus size={18}/>{language === 'es' ? 'Crear grupo' : 'Create group'}</button>
        </div>

        {groups.length ? (
          <div className="v2-group-board">
            {groups.map((group, index) => {
              const teacher = group.ownerId === profile.id
              return (
                <Link className="v2-group-tile" key={group.id} to={`/grupos/${group.id}`}>
                  <span className="v2-group-index">0{index + 1}</span>
                  <div className="v2-group-symbol"><span/><span/><span/></div>
                  <div className="v2-group-copy">
                    <small>{teacher ? (language === 'es' ? 'Docente' : 'Teacher') : (language === 'es' ? 'Estudiante' : 'Student')}</small>
                    <h3>{group.name}</h3>
                  </div>
                  <ArrowUpRight/>
                </Link>
              )
            })}

            <button className="v2-group-add" onClick={() => setShowCreate(true)}>
              <span><Plus/></span>
              <strong>{language === 'es' ? 'Nuevo grupo' : 'New group'}</strong>
            </button>
          </div>
        ) : (
          <div className="v2-empty-panel">
            <div className="v2-empty-orbit"><UsersRound/></div>
            <span className="v2-kicker"><Sparkles size={15}/> {language === 'es' ? 'Empieza aquí' : 'Start here'}</span>
            <h2>{language === 'es' ? 'Crea tu primera clase' : 'Create your first class'}</h2>
            <p>{language === 'es' ? 'O espera una invitación de tu docente.' : 'Or wait for an invitation from your teacher.'}</p>
            <button className="v2-primary-cta" onClick={() => setShowCreate(true)}><Plus/> {language === 'es' ? 'Crear grupo' : 'Create group'}</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div className="v2-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setShowCreate(false)}>
            <motion.form className="v2-create-modal" onSubmit={create} initial={{ y: 30, opacity: 0, scale: .97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }} onMouseDown={(event) => event.stopPropagation()}>
              <button type="button" className="v2-modal-close" onClick={() => setShowCreate(false)}><X/></button>
              <span className="v2-modal-icon"><UsersRound/></span>
              <small>{language === 'es' ? 'Nueva clase' : 'New class'}</small>
              <h2>{language === 'es' ? 'Ponle un nombre' : 'Give it a name'}</h2>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={language === 'es' ? 'Ej. Preescolar A' : 'e.g. Preschool A'} />
              {error && <p className="error-text">{error}</p>}
              <button className="v2-primary-cta" disabled={!name.trim()}>{language === 'es' ? 'Crear grupo' : 'Create group'} <ArrowUpRight size={18}/></button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
