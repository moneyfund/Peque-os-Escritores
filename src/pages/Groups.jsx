import { useEffect, useState } from 'react'
import { ArrowUpRight, Camera, Plus, Sparkles, UsersRound, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import GroupAvatar from '../components/GroupAvatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createGroup, listGroups, updateGroupProfile, uploadGroupAvatar } from '../services/appService.js'

export default function Groups() {
  const { profile, language, refreshDemoProfile } = useAuth()
  const [groups, setGroups] = useState([])
  const [name, setName] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [error, setError] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (profile?.groupIds) listGroups(profile.groupIds).then(setGroups)
  }, [profile?.groupIds?.join('|')])

  const closeCreate = () => {
    setShowCreate(false)
    setName('')
    setAvatarFile(null)
    setAvatarPreview('')
    setError('')
  }

  const chooseAvatar = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError(language === 'es' ? 'Selecciona una imagen.' : 'Choose an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(language === 'es' ? 'La imagen debe pesar menos de 5 MB.' : 'Image must be under 5 MB.')
      return
    }
    setError('')
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const create = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const id = await createGroup(profile.id, profile, name)
      if (avatarFile) {
        const avatar = await uploadGroupAvatar(id, avatarFile)
        await updateGroupProfile(id, { avatar, avatarType: 'upload' })
      }
      refreshDemoProfile()
      closeCreate()
      navigate(`/grupos/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
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
                <Link className={`v2-group-tile group-tile-vivid group-tone-${(index % 4) + 1}`} key={group.id} to={`/grupos/${group.id}`}>
                  <span className="v2-group-index">0{index + 1}</span>
                  <GroupAvatar avatar={group.avatar} avatarType={group.avatarType} size="lg" className="group-card-avatar"/>
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
            <GroupAvatar size="xl"/>
            <span className="v2-kicker"><Sparkles size={15}/> {language === 'es' ? 'Empieza aquí' : 'Start here'}</span>
            <h2>{language === 'es' ? 'Crea tu primera clase' : 'Create your first class'}</h2>
            <p>{language === 'es' ? 'Puedes identificarla con una foto para que los niños la reconozcan rápidamente.' : 'You can add a photo so children recognize it quickly.'}</p>
            <button className="v2-primary-cta" onClick={() => setShowCreate(true)}><Plus/> {language === 'es' ? 'Crear grupo' : 'Create group'}</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div className="v2-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={closeCreate}>
            <motion.form className="v2-create-modal group-create-modal" onSubmit={create} initial={{ y: 30, opacity: 0, scale: .97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }} onMouseDown={(event) => event.stopPropagation()}>
              <button type="button" className="v2-modal-close" onClick={closeCreate}><X/></button>

              <div className="group-create-avatar">
                <GroupAvatar avatar={avatarPreview} avatarType={avatarPreview ? 'upload' : 'builtin'} size="xl"/>
                <label>
                  <input type="file" accept="image/*" onChange={chooseAvatar}/>
                  <Camera size={16}/>
                  {language === 'es' ? 'Foto del grupo' : 'Group photo'}
                </label>
              </div>

              <small>{language === 'es' ? 'Nueva clase' : 'New class'}</small>
              <h2>{language === 'es' ? 'Dale identidad al grupo' : 'Give your group an identity'}</h2>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={language === 'es' ? 'Ej. Preescolar A' : 'e.g. Preschool A'} />
              <p className="group-create-help">{language === 'es' ? 'La foto es opcional y solo el creador podrá cambiarla.' : 'The photo is optional and only the creator can change it.'}</p>
              {error && <p className="error-text">{error}</p>}
              <button className="v2-primary-cta" disabled={!name.trim() || saving}>
                {saving ? (language === 'es' ? 'Creando...' : 'Creating...') : (language === 'es' ? 'Crear grupo' : 'Create group')} <ArrowUpRight size={18}/>
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
