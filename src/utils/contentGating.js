import { getAllVerses } from '../data/verses'
import { TIERS, TIER_ORDER } from './tierConfig'

// Get verses accessible for a given tier
export function getAccessibleVerses(tier) {
  const allVerses = getAllVerses()
  const maxVerses = TIERS[tier]?.maxVerses ?? TIERS.free.maxVerses

  if (maxVerses === Infinity) return allVerses
  return allVerses.slice(0, maxVerses)
}

// Check if a verse at a given index is locked
export function isVerseLocked(verseIndex, tier) {
  const maxVerses = TIERS[tier]?.maxVerses ?? TIERS.free.maxVerses
  if (maxVerses === Infinity) return false
  return verseIndex >= maxVerses
}

// Check if a lesson is accessible for a given tier
export function canAccessLesson(lessonTier, userTier) {
  const userLevel = TIER_ORDER[userTier] ?? 0
  const requiredLevel = TIER_ORDER[lessonTier] ?? 0
  return userLevel >= requiredLevel
}

// Get all lessons with locked status for a given tier
export function getLessonsWithAccess(lessonRegistry, userTier) {
  return lessonRegistry.map(lesson => ({
    ...lesson,
    locked: !canAccessLesson(lesson.tier, userTier),
  }))
}

// Check if audio recite is available for a given tier
export function hasAudioRecite(tier) {
  return TIERS[tier]?.audioRecite ?? false
}

// Get the required tier label for upgrade prompts
export function getRequiredTierName(requiredTier) {
  return TIERS[requiredTier]?.name ?? 'Premium'
}
