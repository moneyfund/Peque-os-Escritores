import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Bell, BookOpen, ChevronDown, Home, Languages, LogOut, Menu, Settings, Type, UserRound, UsersRound, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Avatar from './Avatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeInvitations, updateUserProfile } from '../services/appService.js'

export default function Layout({ children }) {
  const { user, profile, logout, login, language, refreshDemoProfile } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [inviteCount, setInviteCount] = useState(0)
  const location = useLocation()
  const profileMenuRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!profile?.id) return undefined
    return subscribeInvitations(profile.id, (items) => setInviteCount(items.length))
  }, [profile?.id])

  useEffect(() => {
    const close = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setProfileOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  const toggleLanguage = async () => {
    if (!profile) return
    const nextLanguage = language === 'es' ? 'en' : 'es'
    await updateUserProfile(profile.id, { ...profile, language: nextLanguage })
    refreshDemoProfile()
  }

  const primaryNav = [
    { to: '/', label: language === 'es' ? 'Inicio' : 'Home', icon: Home, end: true },
    { to: '/aprender', label: language === 'es' ? 'Aprender' : 'Learn', icon: BookOpen },
    { to: '/silabas', label: language === 'es' ? 'Sílabas' : 'Syllables', icon: Type },
    ...(user ? [{ to: '/grupos', label: language === 'es' ? 'Grupos' : 'Groups', icon: UsersRound }] : []),
  ]

  return (
    <div className="app-shell v3-shell">
      <header className="v3-topbar">
        <div className="container v3-topbar-inner">
          <Link to="/" className="v3-brand-link" aria-label="Pequeños Escritores">
            <img src={`${import.meta.env.BASE_URL}brand-logo.svg`} alt="Pequeños Escritores" className="v3-brand-image" />
          </Link>

          <nav className="v3-desktop-nav" aria-label="Principal">
            {primaryNav.map(({ to, label, icon: Icon, end }) => (
              <NavLink end={end} key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>
                <Icon size={17}/><span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="v3-top-actions">
            {user && (
              <Link to="/invitaciones" className="v3-round-action" aria-label="Invitaciones">
                <Bell size={19}/>
                {inviteCount > 0 && <b>{inviteCount}</b>}
              </Link>
            )}

            {user && profile ? (
              <div className="v3-profile-menu-wrap" ref={profileMenuRef}>
                <button className="v3-profile-trigger" onClick={() => setProfileOpen((value) => !value)}>
                  <Avatar avatar={profile.avatar} avatarType={profile.avatarType} size="sm"/>
                  <span>{profile.username}</span>
                  <ChevronDown size={15}/>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div className="v3-profile-menu" initial={{ opacity: 0, y: -8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: .98 }}>
                      <div className="v3-profile-menu-head">
                        <Avatar avatar={profile.avatar} avatarType={profile.avatarType} size="md"/>
                        <div><strong>{profile.username}</strong><small>{profile.userCode}</small></div>
                      </div>
                      <Link to="/perfil"><UserRound size={17}/>{language === 'es' ? 'Editar perfil' : 'Edit profile'}</Link>
                      <Link to="/avances"><Settings size={17}/>{language === 'es' ? 'Mis avances' : 'My progress'}</Link>
                      <button onClick={toggleLanguage}><Languages size={17}/>{language === 'es' ? 'Cambiar a English' : 'Switch to Español'}</button>
                      <button className="danger" onClick={logout}><LogOut size={17}/>{language === 'es' ? 'Cerrar sesión' : 'Sign out'}</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button className="v3-login-button" onClick={login}>
                <span className="google-g">G</span>
                {language === 'es' ? 'Entrar' : 'Sign in'}
              </button>
            )}

            <button className="v3-menu-button" onClick={() => setMenuOpen(true)} aria-label="Menú"><Menu size={22}/></button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {import.meta.env.VITE_HIDE_XARCON_CREDIT !== 'true' && (
        <footer className="xarcon-tech-footer">
          <div className="container xarcon-tech-footer-inner">
            <span>{language === 'es' ? 'Tecnología web por' : 'Web technology by'}</span>
            <strong>XARCON <b>Creative</b></strong>
          </div>
        </footer>
      )}

      {user && (
        <nav className="v3-mobile-dock" aria-label="Navegación móvil">
          <NavLink end to="/"><Home/><span>{language === 'es' ? 'Inicio' : 'Home'}</span></NavLink>
          <NavLink to="/aprender"><BookOpen/><span>{language === 'es' ? 'Aprender' : 'Learn'}</span></NavLink>
          <NavLink to="/silabas"><Type/><span>{language === 'es' ? 'Sílabas' : 'Syllables'}</span></NavLink>
          <NavLink to="/grupos"><UsersRound/><span>{language === 'es' ? 'Grupos' : 'Groups'}</span></NavLink>
          <NavLink to="/invitaciones" className="dock-invites"><Bell/><span>{language === 'es' ? 'Avisos' : 'Invites'}</span>{inviteCount > 0 && <b>{inviteCount}</b>}</NavLink>
        </nav>
      )}

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button className="drawer-backdrop v3-drawer-backdrop" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="drawer v3-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
              <div className="drawer-header">
                <img src={`${import.meta.env.BASE_URL}brand-logo.svg`} alt="Pequeños Escritores" className="v3-drawer-logo" />
                <button className="icon-only" onClick={() => setMenuOpen(false)}><X/></button>
              </div>

              {profile && (
                <div className="v3-drawer-profile">
                  <Avatar avatar={profile.avatar} avatarType={profile.avatarType} size="lg"/>
                  <div><strong>{profile.username}</strong><small>{profile.userCode}</small></div>
                </div>
              )}

              <div className="drawer-links">
                {primaryNav.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}><Icon/>{label}</NavLink>)}
                {user && <NavLink to="/invitaciones"><Bell/> {language === 'es' ? 'Invitaciones' : 'Invitations'} {inviteCount > 0 && <b className="badge">{inviteCount}</b>}</NavLink>}
                {user && <NavLink to="/avances"><Settings/> {language === 'es' ? 'Mis avances' : 'My progress'}</NavLink>}
                {user && <NavLink to="/perfil"><UserRound/> {language === 'es' ? 'Editar perfil' : 'Edit profile'}</NavLink>}
                {profile && <button onClick={toggleLanguage}><Languages/> {language === 'es' ? 'English' : 'Español'}</button>}
                {user ? <button onClick={logout}><LogOut/> {language === 'es' ? 'Cerrar sesión' : 'Sign out'}</button> : <button onClick={login}><UserRound/> {language === 'es' ? 'Entrar con Google' : 'Continue with Google'}</button>}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
