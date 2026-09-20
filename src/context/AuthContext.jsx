import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import {
  auth,
  authPersistenceReady,
  firebaseReady,
  googleProvider,
  productionAuthDomain,
} from '../firebase.js'
import {
  ensureUserProfile,
  getDemoProfile,
  migrateLegacyDemoProgress,
  subscribeProfile,
  syncPendingProgress,
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

const isMobileBrowser = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 820px)').matches ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}

const isProductionAuthOrigin = () =>
  typeof window !== 'undefined' &&
  window.location.hostname === productionAuthDomain

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

    let cancelled = false
    let stopAuth = null
    let stopProfile = null

    const hydrateUser = async (authUser) => {
      setUser(authUser)
      setAuthError('')
      const fallback = fallbackProfileFromAuth(authUser)
      setProfile((current) => current?.id === authUser.uid ? current : fallback)

      try {
        await ensureUserProfile(authUser)
        await migrateLegacyDemoProgress(authUser.uid).catch(() => {})
        await syncPendingProgress(authUser.uid).catch(() => {})

        if (cancelled) return

        stopProfile?.()
        stopProfile = subscribeProfile(
          authUser.uid,
          (nextProfile) => {
            setProfile(nextProfile)
            syncPendingProgress(authUser.uid, nextProfile?.groupIds || []).catch(() => {})
          },
          (error) => {
            console.error('Profile subscription failed', error)
            setAuthError('La sesión está abierta, pero Firebase no permitió cargar el perfil.')
          },
        )
      } catch (error) {
        console.error('Firebase profile initialization failed', error)
        setAuthError('La sesión está abierta, pero Firebase no permitió sincronizar el perfil.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    const start = async () => {
      await authPersistenceReady

      try {
        const redirectResult = await getRedirectResult(auth)
        if (redirectResult?.user && !cancelled) {
          await hydrateUser(redirectResult.user)
        }
      } catch (error) {
        console.error('Google redirect result failed', error)
        const code = error?.code || ''
        if (code === 'auth/unauthorized-domain') {
          setAuthError('El dominio de la web aún no está autorizado en Firebase Authentication.')
        } else {
          setAuthError('Google devolvió la sesión, pero Firebase no pudo recuperarla en este navegador.')
        }
      }

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

        await hydrateUser(authUser)
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

    // OAuth on mobile must enter through the stable production origin because
    // that origin proxies Firebase's /__/auth helpers and is the registered
    // redirect domain.
    if (isMobileBrowser() && !isProductionAuthOrigin()) {
      const destination = new URL(window.location.href)
      destination.hostname = productionAuthDomain
      destination.protocol = 'https:'
      destination.port = ''
      window.location.assign(destination.toString())
      return
    }

    try {
      if (isMobileBrowser()) {
        sessionStorage.setItem('pequenos-auth-redirect-started', '1')
        await signInWithRedirect(auth, googleProvider)
        return
      }

      const result = await signInWithPopup(auth, googleProvider)
      if (result?.user) {
        setUser(result.user)
        setProfile((current) => current || fallbackProfileFromAuth(result.user))
      }
    } catch (error) {
      console.error('Google login failed', error)
      const code = error?.code || ''

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return

      if (code === 'auth/unauthorized-domain') {
        setAuthError('Este dominio todavía no está autorizado en Firebase Authentication.')
      } else if (code === 'auth/web-storage-unsupported') {
        setAuthError('Este navegador está bloqueando el almacenamiento necesario para iniciar sesión.')
      } else {
        setAuthError('No pudimos completar el inicio de sesión con Google. Intenta nuevamente.')
      }

      throw error
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
