import { useContext } from 'react'
import { SubscriptionContext } from '../contexts/SubscriptionContext'

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be inside SubscriptionProvider')
  return ctx
}
