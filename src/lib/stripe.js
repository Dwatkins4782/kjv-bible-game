// Stripe frontend helpers — calls serverless functions for checkout

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function createCheckoutSession({ priceId, uid, email, mode = 'subscription' }) {
  const res = await fetch(`${API_BASE}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId,
      uid,
      email,
      mode,
      successUrl: window.location.origin + '/#/account?success=true',
      cancelUrl: window.location.origin + '/#/pricing?canceled=true',
    }),
  })

  if (!res.ok) throw new Error('Failed to create checkout session')
  const data = await res.json()
  window.location.href = data.url
}

export async function createPortalSession({ customerId }) {
  const res = await fetch(`${API_BASE}/create-portal-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerId,
      returnUrl: window.location.origin + '/#/account',
    }),
  })

  if (!res.ok) throw new Error('Failed to create portal session')
  const data = await res.json()
  window.location.href = data.url
}
