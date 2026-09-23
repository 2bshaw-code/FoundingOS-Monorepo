/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { AccessibilityInfo } from 'react-native'
import { useQuantumStore } from './store'

let subscription: { remove: () => void } | null = null

// Wires the OS "Reduce Motion" accessibility setting into
// useQuantumStore.reducedMotion — every custom press/entrance/list animation
// added across the app (QuantumCard, the tab bar, the approvals queue, the
// workspace/module grids) reads this one flag, so a single toggle disables
// all of them consistently instead of each animation needing its own check.
// Unlike Reanimated's own `useReducedMotion()` hook (a one-time snapshot at
// app start), this stays live if the user changes the setting mid-session.
// Call once from the root layout; safe to call more than once (re-subscribes
// cleanly), matching the startNetworkStatusListener() convention.
export function startReducedMotionListener() {
  if (subscription) subscription.remove()

  subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
    useQuantumStore.getState().setReducedMotion(enabled)
  })

  // Seed the initial value immediately rather than waiting for the user to
  // toggle the setting during this session.
  void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
    useQuantumStore.getState().setReducedMotion(enabled)
  })

  return () => subscription?.remove()
}
