import { TIERS } from '../../utils/tierConfig'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'
import { createCheckoutSession } from '../../lib/stripe'

export default function PricingCards() {
  const { user } = useAuth()
  const { tier: currentTier } = useSubscription()

  async function handleSubscribe(tierKey, billing = 'monthly') {
    if (!user) {
      window.location.hash = '#/login'
      return
    }

    try {
      const t = TIERS[tierKey]
      const priceId = billing === 'yearly'
        ? t.stripePriceIdYearly
        : (tierKey === 'basic' ? t.stripePriceId : t.stripePriceIdMonthly)

      if (!priceId || priceId.startsWith('price_basic') || priceId.startsWith('price_premium')) {
        alert('Subscription is not configured yet. Please try again later.')
        console.error('Missing Stripe price ID for tier:', tierKey, 'billing:', billing, 'priceId:', priceId)
        return
      }

      await createCheckoutSession({
        priceId,
        uid: user.uid,
        email: user.email,
        mode: 'subscription',
      })
    } catch (err) {
      console.error('Subscription error:', err)
      alert('Something went wrong starting checkout. Please try again.')
    }
  }

  return (
    <div className="pricing-grid">
      {/* Free Tier */}
      <div className={`pricing-card ${currentTier === 'free' ? 'current' : ''}`}>
        <div className="pricing-tier-name">Free</div>
        <div className="pricing-price">$0</div>
        <div className="pricing-period">forever</div>
        <ul className="pricing-features">
          {TIERS.free.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        {currentTier === 'free' && <div className="pricing-current">Current Plan</div>}
      </div>

      {/* Basic Tier */}
      <div className={`pricing-card ${currentTier === 'basic' ? 'current' : ''}`}>
        <div className="pricing-tier-name">Basic</div>
        <div className="pricing-price">$2.99</div>
        <div className="pricing-period">per month</div>
        <ul className="pricing-features">
          {TIERS.basic.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        {currentTier === 'basic' ? (
          <div className="pricing-current">Current Plan</div>
        ) : (
          <button className="btn btn-secondary" style={{ width: '100%' }}
            onClick={() => handleSubscribe('basic')}>
            Subscribe
          </button>
        )}
      </div>

      {/* Premium Tier */}
      <div className={`pricing-card featured ${currentTier === 'premium' ? 'current' : ''}`}>
        <div className="pricing-badge">Best Value</div>
        <div className="pricing-tier-name">Premium</div>
        <div className="pricing-price">$6.99</div>
        <div className="pricing-period">per month</div>
        <div className="pricing-or">OR</div>
        <div className="pricing-price" style={{ fontSize: '1.6rem' }}>$49.99</div>
        <div className="pricing-period">per year (save 40%)</div>
        <ul className="pricing-features">
          {TIERS.premium.features.map((f, i) => (
            <li key={i} className={f.includes('Audio Recite') ? 'feature-highlight' : ''}>
              {f.includes('Audio Recite') ? '\u{1F50A} ' : ''}{f}
            </li>
          ))}
        </ul>
        {currentTier === 'premium' ? (
          <div className="pricing-current">Current Plan</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}
              onClick={() => handleSubscribe('premium', 'monthly')}>
              Subscribe Monthly
            </button>
            <button className="btn btn-secondary" style={{ width: '100%' }}
              onClick={() => handleSubscribe('premium', 'yearly')}>
              Subscribe Yearly &mdash; $49.99/yr
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
