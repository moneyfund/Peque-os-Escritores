import { useEffect, useState } from 'react'
import { Check, Mail, Sparkles, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { respondToInvitation, subscribeInvitations } from '../services/appService.js'

export default function Invitations() {
  const { profile, language, refreshDemoProfile } = useAuth()
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState(null)

  useEffect(() => profile?.id ? subscribeInvitations(profile.id, setItems) : undefined, [profile?.id])

  const respond = async (item, accept) => {
    setBusy(item.id)
    await respondToInvitation(item, accept, profile)
    refreshDemoProfile()
    setItems((current) => current.filter((x) => x.id !== item.id))
    setBusy(null)
  }

  return (
    <section className="v2-invites-page">
      <div className="container v2-narrow">
        <div className="v2-page-top">
          <div><span className="v2-kicker"><Mail size={16}/> {language === 'es' ? 'Bandeja' : 'Inbox'}</span><h1>{language === 'es' ? 'Invitaciones' : 'Invitations'}</h1></div>
          <span className="v2-count-pill">{items.length}</span>
        </div>

        {items.length ? (
          <div className="v2-invite-stack">
            {items.map((item) => (
              <article className="v2-invite-card" key={item.id}>
                <div className="v2-invite-mark"><Mail/></div>
                <div className="v2-invite-copy">
                  <span>{item.fromName}</span>
                  <h3>{item.groupName}</h3>
                  <small>{language === 'es' ? 'Quiere que formes parte del grupo.' : 'Wants you to join the group.'}</small>
                </div>
                <div className="v2-invite-actions">
                  <button className="accept" disabled={busy === item.id} onClick={() => respond(item, true)}><Check/>{language === 'es' ? 'Aceptar' : 'Accept'}</button>
                  <button className="reject" disabled={busy === item.id} onClick={() => respond(item, false)}><X/></button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="v2-empty-panel">
            <div className="v2-empty-orbit"><Mail/></div>
            <span className="v2-kicker"><Sparkles size={15}/>{language === 'es' ? 'Todo al día' : 'All caught up'}</span>
            <h2>{language === 'es' ? 'No hay invitaciones pendientes' : 'No pending invitations'}</h2>
          </div>
        )}
      </div>
    </section>
  )
}
