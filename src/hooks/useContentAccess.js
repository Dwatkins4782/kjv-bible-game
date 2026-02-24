import { useMemo } from 'react'
import { useSubscription } from './useSubscription'
import { getAccessibleVerses, isVerseLocked, canAccessLesson, hasAudioRecite } from '../utils/contentGating'

export function useContentAccess() {
  const { tier } = useSubscription()

  return useMemo(() => ({
    tier,
    accessibleVerses: getAccessibleVerses(tier),
    isVerseLocked: (index) => isVerseLocked(index, tier),
    canAccessLesson: (lessonTier) => canAccessLesson(lessonTier, tier),
    hasAudioRecite: hasAudioRecite(tier),
  }), [tier])
}
