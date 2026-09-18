import { useEffect, useState } from 'react'
import { Check, Mail, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { respondToInvitation, subscribeInvitations } from '../services/appService.js'
import { tr } from '../i18n.js'

export default function Invitations() {
  const { profile, language, refreshDemoProfile } = useAuth()
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState(null)
  const t=(key)=>tr(language,key)
  useEffect(()=> profile?.id ? subscribeInvitations(profile.id,setItems) : undefined,[profile?.id])
  const respond = async (item, accept) => { setBusy(item.id); await respondToInvitation(item,accept,profile); refreshDemoProfile(); setItems((current)=>current.filter((x)=>x.id!==item.id)); setBusy(null) }
  return <section className="page section-pad"><div className="container narrow-container"><div className="page-heading"><span className="eyebrow"><Mail size={16}/> {t('invitations')}</span><h1>{language==='es'?'Invitaciones a grupos':'Group invitations'}</h1></div>{items.length ? <div className="invite-list">{items.map(item=><article className="invite-card" key={item.id}><div className="invite-icon">✉️</div><div><small>{item.fromName} {language==='es'?'te invitó a':'invited you to'}</small><h3>{item.groupName}</h3><span>{t('pending')}</span></div><div className="invite-actions"><button className="button button-success" disabled={busy===item.id} onClick={()=>respond(item,true)}><Check/>{t('accept')}</button><button className="button button-ghost" disabled={busy===item.id} onClick={()=>respond(item,false)}><X/>{t('reject')}</button></div></article>)}</div> : <div className="empty-state"><span>📭</span><h3>{t('noInvites')}</h3></div>}</div></section>
}
