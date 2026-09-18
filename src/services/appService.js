import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, firebaseReady, storage } from '../firebase.js'

const DEMO_PROFILE_KEY = 'pequenos-demo-profile'
const DEMO_DATA_KEY = 'pequenos-demo-data'

const makeCode = (uid) => `PEQ-${uid.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`

const demoDefaults = () => ({
  progress: {},
  groups: {},
  invitations: {},
  assignments: {},
})

const readDemoData = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_DATA_KEY)) || demoDefaults()
  } catch {
    return demoDefaults()
  }
}

const writeDemoData = (data) => localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(data))

export const getDemoProfile = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(DEMO_PROFILE_KEY))
    if (saved) return saved
  } catch {}
  const profile = {
    id: 'demo-user-001',
    email: 'demo@pequenos.local',
    username: 'Peque Explorador',
    avatar: 'fox',
    avatarType: 'builtin',
    language: 'es',
    userCode: 'PEQ-DEMO0001',
    groupIds: [],
  }
  localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile))
  return profile
}

export async function ensureUserProfile(authUser) {
  if (!firebaseReady) return getDemoProfile()

  const userRef = doc(db, 'users', authUser.uid)
  const snapshot = await getDoc(userRef)
  if (snapshot.exists()) return { id: authUser.uid, ...snapshot.data() }

  const profile = {
    email: authUser.email || '',
    username: authUser.displayName?.split(' ')[0] || 'Peque Explorador',
    avatar: authUser.photoURL || 'fox',
    avatarType: authUser.photoURL ? 'url' : 'builtin',
    language: 'es',
    userCode: makeCode(authUser.uid),
    groupIds: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  await setDoc(userRef, profile)
  await setDoc(doc(db, 'publicProfiles', authUser.uid), {
    username: profile.username,
    avatar: profile.avatar,
    avatarType: profile.avatarType,
    userCode: profile.userCode,
    updatedAt: serverTimestamp(),
  })
  return { id: authUser.uid, ...profile }
}

export function subscribeProfile(uid, callback, onError) {
  if (!firebaseReady) {
    callback(getDemoProfile())
    return () => {}
  }
  return onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      if (snapshot.exists()) callback({ id: uid, ...snapshot.data() })
    },
    (error) => {
      console.error('Profile subscription failed', error)
      onError?.(error)
    },
  )
}

export async function updateUserProfile(uid, patch) {
  const safePatch = {
    username: patch.username?.trim() || 'Peque Explorador',
    avatar: patch.avatar,
    avatarType: patch.avatarType,
    language: patch.language === 'en' ? 'en' : 'es',
  }
  if (!firebaseReady) {
    const next = { ...getDemoProfile(), ...safePatch }
    localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(next))
    return next
  }
  await setDoc(doc(db, 'users', uid), { ...safePatch, updatedAt: serverTimestamp() }, { merge: true })
  await setDoc(doc(db, 'publicProfiles', uid), {
    username: safePatch.username,
    avatar: safePatch.avatar,
    avatarType: safePatch.avatarType,
    updatedAt: serverTimestamp(),
  }, { merge: true })
  return safePatch
}

export async function uploadProfileAvatar(uid, file) {
  if (!file) return null
  if (!firebaseReady) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileRef = ref(storage, `avatars/${uid}/profile.${extension}`)
  await uploadBytes(fileRef, file, { contentType: file.type })
  return getDownloadURL(fileRef)
}

export async function uploadGroupAvatar(groupId, file) {
  if (!file) return null
  if (!file.type?.startsWith('image/')) throw new Error('El archivo debe ser una imagen.')
  if (file.size > 5 * 1024 * 1024) throw new Error('La imagen debe pesar menos de 5 MB.')

  if (!firebaseReady) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileRef = ref(storage, `groups/${groupId}/profile.${extension}`)
  await uploadBytes(fileRef, file, { contentType: file.type })
  return getDownloadURL(fileRef)
}

export async function updateGroupProfile(groupId, patch) {
  const avatarPatch = {
    avatar: patch.avatar || '',
    avatarType: patch.avatarType === 'upload' ? 'upload' : 'builtin',
  }

  if (!firebaseReady) {
    const data = readDemoData()
    if (!data.groups[groupId]) throw new Error('Grupo no encontrado.')
    data.groups[groupId] = { ...data.groups[groupId], ...avatarPatch, updatedAt: Date.now() }
    writeDemoData(data)
    return data.groups[groupId]
  }

  await setDoc(doc(db, 'groups', groupId), {
    ...avatarPatch,
    updatedAt: serverTimestamp(),
  }, { merge: true })
  return avatarPatch
}

export async function migrateLegacyDemoProgress(uid) {
  if (!firebaseReady || !uid) return { migrated: 0 }

  const markerKey = `pequenos-progress-migrated-${uid}`
  if (localStorage.getItem(markerKey) === '1') return { migrated: 0 }

  const data = readDemoData()
  const legacyMaps = Object.entries(data.progress || {})
    .filter(([legacyUid]) => legacyUid !== uid)
    .map(([, value]) => value || {})

  const mergedLegacy = {}
  for (const map of legacyMaps) {
    for (const [lessonId, value] of Object.entries(map)) {
      const previous = mergedLegacy[lessonId] || {}
      mergedLegacy[lessonId] = {
        attempts: Math.max(previous.attempts || 0, value.attempts || 0),
        completed: Boolean(previous.completed || value.completed),
        lastScore: Math.max(previous.lastScore || 0, value.lastScore || 0),
        bestScore: Math.max(previous.bestScore || previous.lastScore || 0, value.bestScore || value.lastScore || 0),
      }
    }
  }

  const entries = Object.entries(mergedLegacy)
  if (!entries.length) return { migrated: 0 }

  let migrated = 0
  for (const [lessonId, legacy] of entries) {
    const progressRef = doc(db, 'users', uid, 'progress', lessonId)
    const snapshot = await getDoc(progressRef)
    const current = snapshot.exists() ? snapshot.data() : {}
    const next = {
      attempts: Math.max(current.attempts || 0, legacy.attempts || 0),
      completed: Boolean(current.completed || legacy.completed),
      lastScore: Math.max(current.lastScore || 0, legacy.lastScore || 0),
      bestScore: Math.max(current.bestScore || current.lastScore || 0, legacy.bestScore || legacy.lastScore || 0),
      updatedAt: serverTimestamp(),
    }
    await setDoc(progressRef, next, { merge: true })
    migrated += 1
  }

  localStorage.setItem(markerKey, '1')
  return { migrated }
}

export async function listUserProgress(uid) {
  if (!firebaseReady) {
    const data = readDemoData()
    const map = data.progress?.[uid] || {}
    return Object.entries(map).map(([lessonId, value]) => ({ lessonId, ...value }))
  }
  const snapshot = await getDocs(collection(db, 'users', uid, 'progress'))
  return snapshot.docs.map((item) => ({ lessonId: item.id, ...item.data() }))
}

export async function recordAttempt({ uid, lessonId, score, passed, groupIds = [] }) {
  if (!firebaseReady) {
    const data = readDemoData()
    data.progress[uid] ||= {}
    const previous = data.progress[uid][lessonId] || { attempts: 0, completed: false, bestScore: 0 }
    data.progress[uid][lessonId] = {
      attempts: previous.attempts + 1,
      completed: previous.completed || passed,
      lastScore: score,
      bestScore: Math.max(previous.bestScore || 0, score),
      updatedAt: Date.now(),
    }
    for (const groupId of groupIds) {
      data.groups[groupId] ||= { memberProgress: {} }
      data.groups[groupId].memberProgress ||= {}
      data.groups[groupId].memberProgress[uid] ||= {}
      const prior = data.groups[groupId].memberProgress[uid][lessonId] || { attempts: 0, completed: false, bestScore: 0 }
      data.groups[groupId].memberProgress[uid][lessonId] = {
        attempts: prior.attempts + 1,
        completed: prior.completed || passed,
        lastScore: score,
        bestScore: Math.max(prior.bestScore || 0, score),
        updatedAt: Date.now(),
      }
    }
    writeDemoData(data)
    return
  }

  const userProgressRef = doc(db, 'users', uid, 'progress', lessonId)
  const userSnapshot = await getDoc(userProgressRef)
  const previous = userSnapshot.exists() ? userSnapshot.data() : {}
  const next = {
    attempts: (previous.attempts || 0) + 1,
    lastScore: score,
    bestScore: Math.max(previous.bestScore || previous.lastScore || 0, score),
    completed: Boolean(previous.completed || passed),
    updatedAt: serverTimestamp(),
  }
  await setDoc(userProgressRef, next, { merge: true })

  // El progreso personal es la fuente principal. La sincronización a grupos
  // es secundaria y no debe hacer que el intento se pierda si un grupo cambió.
  await Promise.allSettled(groupIds.map(async (groupId) => {
    const groupProgressRef = doc(db, 'groups', groupId, 'memberProgress', uid, 'lessons', lessonId)
    const groupSnapshot = await getDoc(groupProgressRef)
    const groupPrevious = groupSnapshot.exists() ? groupSnapshot.data() : {}
    await setDoc(groupProgressRef, {
      attempts: (groupPrevious.attempts || 0) + 1,
      lastScore: score,
      bestScore: Math.max(groupPrevious.bestScore || groupPrevious.lastScore || 0, score),
      completed: Boolean(groupPrevious.completed || passed),
      updatedAt: serverTimestamp(),
    }, { merge: true })
  }))
}

export async function createGroup(uid, profile, name) {
  const cleanName = name.trim()
  if (!cleanName) throw new Error('Escribe un nombre para el grupo.')
  if (!firebaseReady) {
    const data = readDemoData()
    const groupId = `demo-group-${Date.now()}`
    data.groups[groupId] = {
      id: groupId,
      name: cleanName,
      ownerId: uid,
      avatar: '',
      avatarType: 'builtin',
      createdAt: Date.now(),
      members: {
        [uid]: { userId: uid, username: profile.username, avatar: profile.avatar, avatarType: profile.avatarType, role: 'teacher' },
      },
      memberProgress: {},
    }
    writeDemoData(data)
    const nextProfile = { ...getDemoProfile(), groupIds: [...new Set([...(profile.groupIds || []), groupId])] }
    localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(nextProfile))
    return groupId
  }
  const groupRef = await addDoc(collection(db, 'groups'), {
    name: cleanName,
    ownerId: uid,
    avatar: '',
    avatarType: 'builtin',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  await setDoc(doc(db, 'groups', groupRef.id, 'members', uid), {
    userId: uid,
    username: profile.username,
    avatar: profile.avatar,
    avatarType: profile.avatarType,
    role: 'teacher',
    joinedAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'users', uid), { groupIds: arrayUnion(groupRef.id) })
  return groupRef.id
}

export async function listGroups(groupIds = []) {
  if (!groupIds.length) return []
  if (!firebaseReady) {
    const data = readDemoData()
    return groupIds.map((id) => data.groups[id]).filter(Boolean)
  }
  const snapshots = await Promise.all(groupIds.map((id) => getDoc(doc(db, 'groups', id))))
  return snapshots.filter((s) => s.exists()).map((s) => ({ id: s.id, ...s.data() }))
}

export async function getGroup(groupId) {
  if (!firebaseReady) return readDemoData().groups[groupId] || null
  const snapshot = await getDoc(doc(db, 'groups', groupId))
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

export async function getGroupMembers(groupId) {
  if (!firebaseReady) {
    const group = readDemoData().groups[groupId]
    return Object.values(group?.members || {})
  }
  const snapshot = await getDocs(collection(db, 'groups', groupId, 'members'))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function findPublicProfileByCode(userCode) {
  const normalized = userCode.trim().toUpperCase()
  if (!normalized) return null
  if (!firebaseReady) {
    if (normalized === 'PEQ-DEMOFRIEND') {
      return { id: 'demo-friend-002', username: 'Luna', avatar: 'bunny', avatarType: 'builtin', userCode: normalized }
    }
    return null
  }
  const snapshot = await getDocs(query(collection(db, 'publicProfiles'), where('userCode', '==', normalized)))
  if (snapshot.empty) return null
  const found = snapshot.docs[0]
  return { id: found.id, ...found.data() }
}

export async function sendGroupInvite({ groupId, groupName, fromUid, fromName, userCode }) {
  const target = await findPublicProfileByCode(userCode)
  if (!target) throw new Error('No encontramos un usuario con ese ID.')
  if (target.id === fromUid) throw new Error('Ya formas parte del grupo como creador.')
  const inviteId = `${groupId}_${target.id}`
  if (!firebaseReady) {
    const data = readDemoData()
    data.invitations[inviteId] = {
      id: inviteId, groupId, groupName, fromUid, fromName, toUid: target.id, toName: target.username, status: 'pending', createdAt: Date.now(),
    }
    const group = data.groups[groupId]
    if (group && target.id === 'demo-friend-002') {
      group.members[target.id] = { userId: target.id, username: target.username, avatar: target.avatar, avatarType: target.avatarType, role: 'student' }
    }
    writeDemoData(data)
    return target
  }
  await setDoc(doc(db, 'invitations', inviteId), {
    groupId,
    groupName,
    fromUid,
    fromName,
    toUid: target.id,
    toName: target.username,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
  return target
}

export function subscribeInvitations(uid, callback) {
  if (!firebaseReady) {
    const all = Object.values(readDemoData().invitations || {}).filter((item) => item.toUid === uid && item.status === 'pending')
    callback(all)
    return () => {}
  }
  const q = query(collection(db, 'invitations'), where('toUid', '==', uid), where('status', '==', 'pending'))
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))))
}

export async function respondToInvitation(invitation, accept, profile) {
  if (!firebaseReady) {
    const data = readDemoData()
    if (data.invitations[invitation.id]) data.invitations[invitation.id].status = accept ? 'accepted' : 'rejected'
    if (accept && data.groups[invitation.groupId]) {
      data.groups[invitation.groupId].members[profile.id] = {
        userId: profile.id, username: profile.username, avatar: profile.avatar, avatarType: profile.avatarType, role: 'student',
      }
      const next = { ...profile, groupIds: [...new Set([...(profile.groupIds || []), invitation.groupId])] }
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(next))
    }
    writeDemoData(data)
    return
  }
  await updateDoc(doc(db, 'invitations', invitation.id), { status: accept ? 'accepted' : 'rejected', respondedAt: serverTimestamp() })
  if (!accept) return
  await setDoc(doc(db, 'groups', invitation.groupId, 'members', profile.id), {
    userId: profile.id,
    username: profile.username,
    avatar: profile.avatar,
    avatarType: profile.avatarType,
    role: 'student',
    joinedAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'users', profile.id), { groupIds: arrayUnion(invitation.groupId) })
}

export async function createAssignment(groupId, lessonId, teacherId, teacherName) {
  if (!firebaseReady) {
    const data = readDemoData()
    data.assignments[groupId] ||= []
    data.assignments[groupId].push({ id: `a-${Date.now()}`, lessonId, teacherId, teacherName, createdAt: Date.now() })
    writeDemoData(data)
    return
  }
  await addDoc(collection(db, 'groups', groupId, 'assignments'), {
    lessonId,
    teacherId,
    teacherName,
    createdAt: serverTimestamp(),
  })
}

export async function listAssignments(groupId) {
  if (!firebaseReady) return readDemoData().assignments[groupId] || []
  const snapshot = await getDocs(query(collection(db, 'groups', groupId, 'assignments'), orderBy('createdAt', 'desc')))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function getGroupMemberProgress(groupId, memberUid) {
  if (!firebaseReady) {
    const map = readDemoData().groups[groupId]?.memberProgress?.[memberUid] || {}
    return Object.entries(map).map(([lessonId, value]) => ({ lessonId, ...value }))
  }
  const snapshot = await getDocs(collection(db, 'groups', groupId, 'memberProgress', memberUid, 'lessons'))
  return snapshot.docs.map((item) => ({ lessonId: item.id, ...item.data() }))
}
