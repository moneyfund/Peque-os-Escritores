import { initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC1aqcls9eZu76vIcz_QxzXDSLobF71u8w',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'pequenos-escritores.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'pequenos-escritores',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'pequenos-escritores.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '605491809632',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:605491809632:web:f8f9efb021f4ed3777a205',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-PW3BF29JLX',
}

export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId)

let app = null
let auth = null
let db = null
let storage = null
let googleProvider = null
let analytics = null
let authPersistenceReady = Promise.resolve()

if (firebaseReady) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  authPersistenceReady = setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn('Firebase auth persistence could not be initialized.', error)
  })
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  })
  storage = getStorage(app)
  googleProvider = new GoogleAuthProvider()
  googleProvider.setCustomParameters({ prompt: 'select_account' })
  analyticsSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app)
  }).catch(() => {})
}

export { app, auth, db, storage, googleProvider, analytics, authPersistenceReady }
