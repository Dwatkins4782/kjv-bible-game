// Subscription tier definitions
// Free: 20 scriptures, 3 lessons
// Basic ($2.99/mo): 50 scriptures, ~50% lessons
// Premium ($6.99/mo OR $49.99 one-time): Unlimited, all lessons, Audio Recite

export const TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceDisplay: 'Free',
    maxVerses: 20,
    maxLessons: 3,
    quizAccess: 'limited',
    audioRecite: false,
    features: [
      '20 memory scriptures',
      '3 Bible lessons',
      'Basic quiz access',
    ],
  },
  basic: {
    name: 'Basic',
    priceMonthly: 299,
    priceDisplay: '$2.99/mo',
    stripePriceId: import.meta.env?.VITE_STRIPE_BASIC_PRICE_ID || 'price_basic_monthly',
    maxVerses: 50,
    maxLessons: 10,
    quizAccess: 'available',
    audioRecite: false,
    features: [
      '50 memory scriptures',
      '50% of Bible lessons',
      'Full quiz on available verses',
      'Progress tracking & sync',
    ],
  },
  premium: {
    name: 'Premium',
    priceMonthly: 699,
    priceDisplay: '$6.99/mo',
    priceOneTime: 4999,
    priceOneTimeDisplay: '$49.99 one-time',
    stripePriceIdMonthly: import.meta.env?.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
    stripePriceIdOneTime: import.meta.env?.VITE_STRIPE_PREMIUM_ONETIME_ID || 'price_premium_onetime',
    maxVerses: Infinity,
    maxLessons: Infinity,
    quizAccess: 'full',
    audioRecite: true,
    features: [
      'Unlimited memory scriptures',
      'ALL Bible lessons',
      'All quiz types & difficulties',
      'Audio Recite \u2014 hear every scripture read aloud',
      'Priority content updates',
      'No ads',
    ],
  },
}

export const TIER_ORDER = { free: 0, basic: 1, premium: 2 }

export function hasTierAccess(userTier, requiredTier) {
  return (TIER_ORDER[userTier] || 0) >= (TIER_ORDER[requiredTier] || 0)
}
