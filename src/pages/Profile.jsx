import { useRef, useState } from 'react'
import { Camera, Check, Copy, Languages, ShieldCheck, UserRound } from 'lucide-react'
import Avatar, { avatarOptions } from '../components/Avatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { updateUserProfile, uploadProfileAvatar } from '../services/appService.js'

export default function Profile() {
  const { profile, language, refreshDemoProfile } = useAuth()
  const [username, setUsername] = useState(profile?.username || '')
  const [selectedAvatar, setSelectedAvatar] = useState({ avatar: profile?.avatar, avatarType: profile?.avatarType })
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.language || 'es')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInput = useRef(null)

  if (!profile) return null

  const chooseFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setStatus(language === 'es' ? 'Selecciona una imagen.' : 'Choose an image file.')
    if (file.size > 5 * 1024 * 1024) return setStatus(language === 'es' ? 'La imagen debe pesar menos de 5 MB.' : 'Image must be under 5 MB.')
    setSaving(true)
    try {
      const url = await uploadProfileAvatar(profile.id, file)
      setSelectedAvatar({ avatar: url, avatarType: 'upload' })
      setStatus(language === 'es' ? 'Foto lista para guardar.' : 'Photo ready to save.')
    } finally {
      setSaving(false)
    }
  }

  const save = async () => {
    setSaving(true)
    await updateUserProfile(profile.id, { username, ...selectedAvatar, language: selectedLanguage })
    refreshDemoProfile()
    setStatus(language === 'es' ? 'Perfil actualizado' : 'Profile updated')
    setSaving(false)
  }

  const copyId = async () => {
    await navigator.clipboard?.writeText(profile.userCode)
    setStatus(language === 'es' ? 'ID copiado' : 'ID copied')
  }

  return (
    <section className="v2-profile-page">
      <div className="container v2-profile-wrap">
        <div className="v2-page-top">
          <div><span className="v2-kicker"><UserRound size={16}/> {language === 'es' ? 'Tu espacio' : 'Your space'}</span><h1>{language === 'es' ? 'Mi perfil' : 'My profile'}</h1></div>
        </div>

        <div className="v2-profile-grid">
          <aside className="v2-profile-preview">
            <div className="v2-profile-avatar-zone">
              <Avatar avatar={selectedAvatar.avatar} avatarType={selectedAvatar.avatarType} size="xl"/>
              <button onClick={() => fileInput.current?.click()} className="v2-camera"><Camera size={18}/></button>
              <input ref={fileInput} type="file" accept="image/*" hidden onChange={chooseFile}/>
            </div>
            <h2>{username || profile.username}</h2>
            <span>{profile.userCode}</span>
            <button className="v2-copy-code" onClick={copyId}><Copy size={16}/>{language === 'es' ? 'Copiar ID' : 'Copy ID'}</button>
            <div className="v2-safe-note"><ShieldCheck size={17}/><span>{language === 'es' ? 'Tu correo no se muestra en los grupos.' : 'Your email is not shown in groups.'}</span></div>
          </aside>

          <div className="v2-settings-panel">
            <div className="v2-setting-block">
              <small>{language === 'es' ? 'Nombre visible' : 'Display name'}</small>
              <input value={username} maxLength={28} onChange={(e) => setUsername(e.target.value)}/>
            </div>

            <div className="v2-setting-block">
              <small><Languages size={14}/> {language === 'es' ? 'Idioma' : 'Language'}</small>
              <div className="v2-language-switch">
                <button className={selectedLanguage === 'es' ? 'active' : ''} onClick={() => setSelectedLanguage('es')} type="button">Español</button>
                <button className={selectedLanguage === 'en' ? 'active' : ''} onClick={() => setSelectedLanguage('en')} type="button">English</button>
              </div>
            </div>

            <div className="v2-setting-block">
              <small>{language === 'es' ? 'Elige un personaje' : 'Choose a character'}</small>
              <div className="v2-avatar-grid">
                {avatarOptions.map((avatar) => (
                  <button key={avatar} className={selectedAvatar.avatarType === 'builtin' && selectedAvatar.avatar === avatar ? 'active' : ''} onClick={() => setSelectedAvatar({ avatar, avatarType: 'builtin' })}>
                    <Avatar avatar={avatar} avatarType="builtin" size="md"/>
                  </button>
                ))}
              </div>
            </div>

            <button className="v2-primary-cta v2-save-profile" onClick={save} disabled={saving || !username.trim()}><Check size={18}/>{saving ? (language === 'es' ? 'Guardando...' : 'Saving...') : (language === 'es' ? 'Guardar cambios' : 'Save changes')}</button>
            {status && <div className="v2-profile-status">{status}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
