import PricingCards from '../components/subscription/PricingCards'

export default function Pricing() {
  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', margin: '20px 0 30px' }}>
        <h2 className="text-gold">Choose Your Plan</h2>
        <p className="text-muted" style={{ maxWidth: '500px', margin: '8px auto' }}>
          Deepen your walk with God through KJV scripture memorization, in-depth Bible lessons, and our exclusive <strong style={{ color: 'var(--gold)' }}>Audio Recite</strong> feature that reads every verse aloud.
        </p>
      </div>

      <PricingCards />

      <div className="card" style={{ marginTop: '24px', textAlign: 'center' }}>
        <h3 className="text-gold mb-8">{'\u{1F50A}'} Audio Recite &mdash; Premium Exclusive</h3>
        <p className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
          Hear every KJV scripture read aloud with natural voice synthesis. Perfect for memorization on the go, devotional listening, and absorbing God&apos;s Word through hearing. Available exclusively with Premium.
        </p>
        <p style={{ color: 'var(--gold)', marginTop: '12px', fontSize: '0.85rem', fontStyle: 'italic' }}>
          &ldquo;So then faith cometh by hearing, and hearing by the word of God.&rdquo; &mdash; Romans 10:17
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
          Cancel anytime &bull; Secure payments via Stripe &bull; 100% KJV
        </p>
      </div>
    </div>
  )
}
