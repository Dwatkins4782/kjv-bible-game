import { createContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

export const AuthContext = createContext(null)

const googleProvider = new GoogleAuthProvider()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Ensure user doc exists in Firestore
        await ensureUserDoc(firebaseUser)
        // Migrate localStorage data on first login
        await migrateLocalStorage(firebaseUser.uid)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function ensureUserDoc(firebaseUser) {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          createdAt: new Date().toISOString(),
          tier: 'free',
          stats: { quizzesTaken: 0, totalCorrect: 0, totalQuestions: 0, memorized: [] },
          lessonProgress: {},
        })
      }
    } catch (e) {
      console.warn('Could not create user doc (offline or no Firebase config):', e.message)
    }
  }

  async function migrateLocalStorage(uid) {
    try {
      const localStats = localStorage.getItem('kjv-stats')
      if (!localStats) return

      const parsed = JSON.parse(localStats)
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const data = userSnap.data()
        if (!data.stats?.quizzesTaken && parsed.quizzesTaken > 0) {
          await setDoc(userRef, { stats: parsed }, { merge: true })
        }
      }
    } catch (e) {
      console.warn('localStorage migration skipped:', e.message)
    }
  }

  async function signUp(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    return cred.user
  }

  async function signIn(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  async function signInWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider)
    return cred.user
  }

  async function signOutUser() {
    await firebaseSignOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut: signOutUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
