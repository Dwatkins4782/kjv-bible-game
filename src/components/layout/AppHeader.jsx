import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'

export default function AppHeader() {
  const { user } = useAuth()
  const { tier } = useSubscription()

  return (
    <header className="app-header">
      <h1>Scripture Vault</h1>
      <div className="subtitle">Study to shew thyself approved unto God &mdash; 2 Timothy 2:15</div>
      {user && (
        <div style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--gold-dark)' }}>
          {user.displayName || user.email}
          {tier !== 'free' && <span className="tier-badge" style={{ marginLeft: '8px' }}>{tier.toUpperCase()}</span>}
        </div>
      )}
    </header>
  )
}
