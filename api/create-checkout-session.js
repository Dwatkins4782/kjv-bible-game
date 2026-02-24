// Vercel serverless function: Create Stripe Checkout Session
// POST /api/create-checkout-session
// Body: { priceId, uid, email, mode, successUrl, cancelUrl }

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { priceId, uid, email, mode = 'subscription', successUrl, cancelUrl } = req.body

    if (!priceId || !uid || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if customer already exists
    const customers = await stripe.customers.list({ email, limit: 1 })
    let customer = customers.data[0]

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        metadata: { firebaseUid: uid },
      })
    }

    const sessionConfig = {
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode === 'payment' ? 'payment' : 'subscription',
      success_url: successUrl || `${process.env.FRONTEND_URL}/#/account?success=true`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/#/pricing?canceled=true`,
      metadata: { firebaseUid: uid },
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Checkout session error:', err)
    res.status(500).json({ error: err.message })
  }
}
