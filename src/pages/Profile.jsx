import { useRef, useState } from 'react'
import { Camera, Check, Copy, Languages, UserRound } from 'lucide-react'
import Avatar, { avatarOptions } from '../components/Avatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { tr } from '../i18n.js'
import { updateUserProfile, uploadProfileAvatar } from '../services/appService.js'

export default function Profile() {
  const { profile, language, refreshDemoProfile } = useAuth()
  const [username, setUsername] = useState(profile?.username || '')
  const [selectedAvatar, setSelectedAvatar] = useState({ avatar: profile?.avatar, avatarType: profile?.avatarType })
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.language || 'es')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInput = useRef(null)
  const t = (key) => tr(language, key)

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
    } finally { setSaving(false) }
  }

  const save = async () => {
    setSaving(true)
    await updateUserProfile(profile.id, { username, ...selectedAvatar, language: selectedLanguage })
    refreshDemoProfile()
    setStatus(t('profileSaved'))
    setSaving(false)
  }

  const copyId = async () => {
    await navigator.clipboard?.writeText(profile.userCode)
    setStatus(t('copied'))
  }

  return <section className="page section-pad"><div className="container profile-layout">
    <div className="page-heading"><span className="eyebrow"><UserRound size={16}/> {t('profile')}</span><h1>{language === 'es' ? 'Hazlo tuyo' : 'Make it yours'}</h1><p>{language === 'es' ? 'Elige cómo quieres aparecer dentro de tus grupos.' : 'Choose how you want to appear inside your groups.'}</p></div>
    <div className="profile-card">
      <div className="profile-avatar-editor"><Avatar avatar={selectedAvatar.avatar} avatarType={selectedAvatar.avatarType} size="xl"/><button className="camera-button" onClick={()=>fileInput.current?.click()}><Camera/></button><input ref={fileInput} type="file" accept="image/*" hidden onChange={chooseFile}/></div>
      <div className="form-grid">
        <label><span>{t('username')}</span><input value={username} maxLength={28} onChange={(e)=>setUsername(e.target.value)} /></label>
        <label><span>{t('language')}</span><div className="segmented"><button className={selectedLanguage==='es'?'active':''} onClick={()=>setSelectedLanguage('es')} type="button">ES</button><button className={selectedLanguage==='en'?'active':''} onClick={()=>setSelectedLanguage('en')} type="button">EN</button></div></label>
      </div>
      <div className="user-code-box"><div><small>{t('userId')}</small><strong>{profile.userCode}</strong></div><button className="button button-ghost" onClick={copyId}><Copy size={17}/>{t('copy')}</button></div>
      <div className="avatar-picker"><strong>{t('builtin')}</strong><div>{avatarOptions.map((avatar)=><button key={avatar} className={selectedAvatar.avatarType==='builtin'&&selectedAvatar.avatar===avatar?'active':''} onClick={()=>setSelectedAvatar({avatar,avatarType:'builtin'})}><Avatar avatar={avatar} avatarType="builtin" size="md"/></button>)}</div></div>
      <button className="button button-wide" onClick={save} disabled={saving || !username.trim()}><Check/>{saving ? t('loading') : t('save')}</button>
      {status && <p className="form-status">{status}</p>}
    </div>
  </div></section>
}
