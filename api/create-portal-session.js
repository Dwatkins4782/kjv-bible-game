// Vercel serverless function: Create Stripe Customer Portal Session
// POST /api/create-portal-session
// Body: { customerId, returnUrl }

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { customerId, returnUrl } = req.body

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customerId' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.FRONTEND_URL}/#/account`,
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Portal session error:', err)
    res.status(500).json({ error: err.message })
  }
}
