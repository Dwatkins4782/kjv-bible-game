import { createContext, useState, useEffect, useContext } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { AuthContext } from './AuthContext'

export const SubscriptionContext = createContext(null)

export function SubscriptionProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [tier, setTier] = useState('free')
  const [subscriptionData, setSubscriptionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setTier('free')
      setSubscriptionData(null)
      setLoading(false)
      return
    }

    // Listen to user doc for real-time tier updates
    const userRef = doc(db, 'users', user.uid)
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setTier(data.tier || 'free')
        setSubscriptionData({
          stripeCustomerId: data.stripeCustomerId || null,
          subscriptionId: data.subscriptionId || null,
          subscriptionStatus: data.subscriptionStatus || null,
          currentPeriodEnd: data.currentPeriodEnd || null,
          cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
          isLifetime: data.isLifetime || false,
        })
      }
      setLoading(false)
    }, (err) => {
      console.warn('Subscription listener error (may be offline):', err.message)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  return (
    <SubscriptionContext.Provider value={{
      tier,
      subscriptionData,
      loading,
      isBasic: tier === 'basic' || tier === 'premium',
      isPremium: tier === 'premium',
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}
