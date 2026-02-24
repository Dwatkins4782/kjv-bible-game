import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { createPortalSession } from '../lib/stripe'
import { TIERS } from '../utils/tierConfig'
import { Link, useSearchParams } from 'react-router-dom'

export default function Account() {
  const { user, signOut } = useAuth()
  const { tier, subscriptionData } = useSubscription()
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')

  const tierInfo = TIERS[tier] || TIERS.free

  async function handleManageSubscription() {
    if (subscriptionData?.stripeCustomerId) {
      await createPortalSession({ customerId: subscriptionData.stripeCustomerId })
    }
  }

  async function handleSignOut() {
    await signOut()
  }

  return (
    <div className="fade-in">
      {success && (
        <div className="card" style={{ background: 'rgba(76,175,80,0.1)', borderColor: 'var(--green)', marginBottom: '16px' }}>
          <p style={{ color: 'var(--green)', textAlign: 'center' }}>
            {'\u2705'} Subscription activated! Welcome to {tierInfo.name}.
          </p>
        </div>
      )}

      <h2 className="text-gold mb-16">Account</h2>

      <div className="card">
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '8px' }}>{'\u{1F464}'}</div>
        <h3 className="text-center text-gold">{user?.displayName || 'Bible Student'}</h3>
        <p className="text-center text-muted" style={{ fontSize: '0.85rem' }}>{user?.email}</p>
      </div>

      <div className="card">
        <div className="flex-between mb-8">
          <h3 className="text-gold">Subscription</h3>
          <span className="streak-badge">{tierInfo.name}</span>
        </div>

        {tier === 'free' ? (
          <>
            <p className="text-muted mb-16" style={{ fontSize: '0.9rem' }}>
              You&apos;re on the Free plan with access to 20 scriptures and 3 lessons.
            </p>
            <Link to="/pricing" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Upgrade Your Plan
            </Link>
          </>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0' }}>
              {tierInfo.features.map((f, i) => (
                <li key={i} style={{ padding: '4px 0', fontSize: '0.9rem', color: 'var(--text)' }}>
                  {'\u2713'} {f}
                </li>
              ))}
            </ul>

            {subscriptionData?.isLifetime && (
              <p style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {'\u{2B50}'} Lifetime Access
              </p>
            )}

            {subscriptionData?.cancelAtPeriodEnd && (
              <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginTop: '8px' }}>
                Your subscription will end at the current billing period.
              </p>
            )}

            {subscriptionData?.stripeCustomerId && !subscriptionData?.isLifetime && (
              <button className="btn btn-secondary mt-16" style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleManageSubscription}>
                Manage Subscription
              </button>
            )}

            {tier !== 'premium' && (
              <Link to="/pricing" className="btn btn-primary mt-16" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                Upgrade to Premium
              </Link>
            )}
          </>
        )}
      </div>

      <button
        className="btn btn-danger mt-16"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  )
}
