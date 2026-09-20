import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, authPersistenceReady, firebaseReady, googleProvider } from '../firebase.js'
import {
  ensureUserProfile,
  getDemoProfile,
  subscribeProfile,
} from '../services/appService.js'

const AuthContext = createContext(null)

const fallbackProfileFromAuth = (authUser) => ({
  id: authUser.uid,
  email: authUser.email || '',
  username: authUser.displayName?.split(' ')[0] || 'Peque Explorador',
  avatar: authUser.photoURL || 'fox',
  avatarType: authUser.photoURL ? 'url' : 'builtin',
  language: 'es',
  userCode: `PEQ-${authUser.uid.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`,
  groupIds: [],
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(firebaseReady)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false)
      return undefined
    }

    let stopProfile = null
    let cancelled = false
    let stopAuth = null

    const start = async () => {
      await authPersistenceReady

      if (cancelled) return

      stopAuth = onAuthStateChanged(auth, async (authUser) => {
        stopProfile?.()
        stopProfile = null

        if (!authUser) {
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        // Authentication succeeded. The UI becomes signed in immediately,
        // even if the profile request takes a moment.
        setUser(authUser)
        setProfile((current) =>
          current?.id === authUser.uid ? current : fallbackProfileFromAuth(authUser)
        )
        setAuthError('')

        try {
          await ensureUserProfile(authUser)

          if (cancelled) return

          stopProfile = subscribeProfile(
            authUser.uid,
            (nextProfile) => setProfile(nextProfile),
            (error) => {
              console.error('Profile subscription failed', error)
              setAuthError('Iniciaste sesión, pero Firestore rechazó la lectura del perfil.')
            },
          )
        } catch (error) {
          console.error('Profile initialization failed', error)
          setAuthError('Iniciaste sesión, pero Firestore rechazó la sincronización del perfil.')
        } finally {
          if (!cancelled) setLoading(false)
        }
      })
    }

    start()

    return () => {
      cancelled = true
      stopAuth?.()
      stopProfile?.()
    }
  }, [])

  const login = async () => {
    setAuthError('')

    if (!firebaseReady) {
      const demo = getDemoProfile()
      setUser({ uid: demo.id, email: demo.email, displayName: demo.username })
      setProfile(demo)
      return
    }

    await authPersistenceReady

    try {
      // Same Firebase login flow on desktop and mobile.
      const result = await signInWithPopup(auth, googleProvider)

      if (result?.user) {
        setUser(result.user)
        setProfile(fallbackProfileFromAuth(result.user))
      }
    } catch (error) {
      const code = error?.code || ''
      console.error('Google login failed', error)

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return

      if (code === 'auth/popup-blocked') {
        setAuthError('El navegador bloqueó la ventana de Google. Permite ventanas emergentes para esta página e inténtalo otra vez.')
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError('El dominio actual no está autorizado en Firebase Authentication.')
      } else {
        setAuthError('No pudimos completar el inicio de sesión con Google. Intenta nuevamente.')
      }
    }
  }

  const logout = async () => {
    setAuthError('')

    if (!firebaseReady) {
      setUser(null)
      setProfile(null)
      return
    }

    await signOut(auth)
  }

  const refreshDemoProfile = () => {
    if (!firebaseReady && user) setProfile(getDemoProfile())
  }

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    login,
    logout,
    firebaseReady,
    refreshDemoProfile,
    authError,
    language: profile?.language || 'es',
  }), [user, profile, loading, authError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
