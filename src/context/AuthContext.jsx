import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { auth, firebaseReady, googleProvider } from '../firebase.js'
import { ensureUserProfile, getDemoProfile, migrateLegacyDemoProgress, subscribeProfile } from '../services/appService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(firebaseReady)

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false)
      return undefined
    }

    getRedirectResult(auth).catch(() => {})
    let stopProfile = null
    const stopAuth = onAuthStateChanged(auth, async (authUser) => {
      stopProfile?.()
      stopProfile = null
      if (!authUser) {
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }
      setUser(authUser)
      await ensureUserProfile(authUser)
      await migrateLegacyDemoProgress(authUser.uid).catch(() => {})
      stopProfile = subscribeProfile(authUser.uid, setProfile)
      setLoading(false)
    })
    return () => {
      stopAuth()
      stopProfile?.()
    }
  }, [])

  const login = async () => {
    if (!firebaseReady) {
      const demo = getDemoProfile()
      setUser({ uid: demo.id, email: demo.email, displayName: demo.username })
      setProfile(demo)
      return
    }
    if (window.matchMedia('(max-width: 720px)').matches) {
      await signInWithRedirect(auth, googleProvider)
      return
    }
    await signInWithPopup(auth, googleProvider)
  }

  const logout = async () => {
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
    language: profile?.language || 'es',
  }), [user, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
