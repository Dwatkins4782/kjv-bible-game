// Vercel serverless function: Stripe Webhook Handler
// POST /api/webhook
// Handles subscription lifecycle events and updates Firestore

import Stripe from 'stripe'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

// Map Stripe price IDs to tier names
function getTierFromPriceId(priceId) {
  const basicPriceId = process.env.STRIPE_BASIC_PRICE_ID
  const premiumMonthlyId = process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID
  const premiumOnetimeId = process.env.STRIPE_PREMIUM_ONETIME_PRICE_ID

  if (priceId === basicPriceId) return 'basic'
  if (priceId === premiumMonthlyId || priceId === premiumOnetimeId) return 'premium'
  return 'basic' // default fallback
}

export const config = {
  api: { bodyParser: false },
}

async function getRawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  const rawBody = await getRawBody(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const uid = session.metadata?.firebaseUid
        if (!uid) break

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        const priceId = lineItems.data[0]?.price?.id
        const tier = getTierFromPriceId(priceId)
        const isOneTime = session.mode === 'payment'

        const updateData = {
          stripeCustomerId: session.customer,
          tier,
          subscriptionStatus: isOneTime ? 'lifetime' : 'active',
          isLifetime: isOneTime,
        }

        if (!isOneTime && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription)
          updateData.subscriptionId = sub.id
          updateData.currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString()
          updateData.cancelAtPeriodEnd = sub.cancel_at_period_end
        }

        await db.collection('users').doc(uid).set(updateData, { merge: true })
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object
        const customer = await stripe.customers.retrieve(sub.customer)
        const uid = customer.metadata?.firebaseUid
        if (!uid) break

        const priceId = sub.items.data[0]?.price?.id
        const tier = getTierFromPriceId(priceId)

        await db.collection('users').doc(uid).set({
          tier,
          subscriptionId: sub.id,
          subscriptionStatus: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        }, { merge: true })
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const customer = await stripe.customers.retrieve(sub.customer)
        const uid = customer.metadata?.firebaseUid
        if (!uid) break

        // Check if user has lifetime access
        const userDoc = await db.collection('users').doc(uid).get()
        if (userDoc.exists && userDoc.data().isLifetime) break // Don't downgrade lifetime users

        await db.collection('users').doc(uid).set({
          tier: 'free',
          subscriptionId: null,
          subscriptionStatus: 'canceled',
          cancelAtPeriodEnd: false,
        }, { merge: true })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customer = await stripe.customers.retrieve(invoice.customer)
        const uid = customer.metadata?.firebaseUid
        if (!uid) break

        await db.collection('users').doc(uid).set({
          subscriptionStatus: 'past_due',
        }, { merge: true })
        break
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err)
    return res.status(500).json({ error: 'Webhook processing failed' })
  }

  res.status(200).json({ received: true })
}
