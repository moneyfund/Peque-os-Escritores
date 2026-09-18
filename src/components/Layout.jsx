import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Bell, BookOpen, ChartNoAxesColumnIncreasing, Home, Languages, LogOut, Menu, UserRound, UsersRound, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Avatar from './Avatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeInvitations, updateUserProfile } from '../services/appService.js'
import { tr } from '../i18n.js'

export default function Layout({ children }) {
  const { user, profile, logout, login, language, firebaseReady, refreshDemoProfile } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [inviteCount, setInviteCount] = useState(0)
  const location = useLocation()
  const t = (key) => tr(language, key)

  useEffect(() => setMenuOpen(false), [location.pathname])
  useEffect(() => {
    if (!profile?.id) return undefined
    return subscribeInvitations(profile.id, (items) => setInviteCount(items.length))
  }, [profile?.id])

  const toggleLanguage = async () => {
    if (!profile) return
    const nextLanguage = language === 'es' ? 'en' : 'es'
    await updateUserProfile(profile.id, { ...profile, language: nextLanguage })
    refreshDemoProfile()
  }

  const navItems = [
    { to: '/', label: t('home'), icon: Home },
    { to: '/aprender', label: t('learn'), icon: BookOpen },
    ...(user ? [
      { to: '/avances', label: t('progress'), icon: ChartNoAxesColumnIncreasing },
      { to: '/grupos', label: t('groups'), icon: UsersRound },
      { to: '/invitaciones', label: t('invitations'), icon: Bell, badge: inviteCount },
    ] : []),
  ]

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand" aria-label="Pequeños Escritores">
            <span className="brand-mark">📖</span>
            <span><strong>Pequeños</strong><small>Escritores</small></span>
          </Link>

          <nav className="desktop-nav" aria-label="Principal">
            {navItems.map(({ to, label, icon: Icon, badge }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Icon size={18} /> <span>{label}</span>{badge > 0 && <b className="badge">{badge}</b>}
              </NavLink>
            ))}
          </nav>

          <div className="top-actions">
            <button className="icon-button" onClick={toggleLanguage} disabled={!profile} title={t('language')}>
              <Languages size={20} /><span>{language.toUpperCase()}</span>
            </button>
            {user && profile ? (
              <Link to="/perfil" className="profile-pill">
                <Avatar avatar={profile.avatar} avatarType={profile.avatarType} size="sm" />
                <span>{profile.username}</span>
              </Link>
            ) : (
              <button className="button button-small" onClick={login}>{firebaseReady ? t('login') : t('demo')}</button>
            )}
            <button className="mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Menú"><Menu /></button>
          </div>
        </div>
      </header>

      {!firebaseReady && <div className="demo-banner">🧪 {t('demoMode')}</div>}

      <main>{children}</main>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button className="drawer-backdrop" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className="drawer-header">
                <span className="brand"><span className="brand-mark">📖</span><span><strong>Pequeños</strong><small>Escritores</small></span></span>
                <button className="icon-only" onClick={() => setMenuOpen(false)}><X /></button>
              </div>
              {user && profile && <div className="drawer-profile"><Avatar avatar={profile.avatar} avatarType={profile.avatarType} size="lg" /><div><strong>{profile.username}</strong><small>{profile.userCode}</small></div></div>}
              <div className="drawer-links">
                {navItems.map(({ to, label, icon: Icon, badge }) => <NavLink key={to} to={to}><Icon />{label}{badge > 0 && <b className="badge">{badge}</b>}</NavLink>)}
                {user && <NavLink to="/perfil"><UserRound />{t('profile')}</NavLink>}
                <button onClick={toggleLanguage}><Languages />{language === 'es' ? t('english') : t('spanish')}</button>
                {user ? <button onClick={logout}><LogOut />{t('logout')}</button> : <button onClick={login}><UserRound />{firebaseReady ? t('login') : t('demo')}</button>}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
