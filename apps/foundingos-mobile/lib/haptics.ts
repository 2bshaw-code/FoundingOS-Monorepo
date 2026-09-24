/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Thin wrapper around expo-haptics so every tactile cue in the app goes through
// one place — makes it trivial to mute all haptics on web/unsupported platforms
// or behind a future settings toggle, and keeps the actual Haptics.* calls (and
// their exact style choices) consistent everywhere instead of ad-hoc per screen.
import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'

const supported = Platform.OS === 'ios' || Platform.OS === 'android'

// A light tap for routine interactions — button presses, tab switches, toggles.
export function hapticTap() {
  if (!supported) return
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined)
}

// A firmer tap for a deliberate, weighty action — approving/executing an AI
// decision, submitting a form, confirming a destructive action.
export function hapticImpact() {
  if (!supported) return
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined)
}

// Success — a record was created, an approval went through, a sync completed.
export function hapticSuccess() {
  if (!supported) return
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined)
}

// Failure — a request errored, validation failed, a reject action fired.
export function hapticError() {
  if (!supported) return
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined)
}

// Warning — something needs attention but isn't a hard failure (offline notice,
// a risky AI action pending confirmation).
export function hapticWarning() {
  if (!supported) return
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined)
}

// Selection changed — scrubbing through a picker, switching a segmented filter.
export function hapticSelection() {
  if (!supported) return
  Haptics.selectionAsync().catch(() => undefined)
}
