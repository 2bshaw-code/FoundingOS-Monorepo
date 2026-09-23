/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Single source of truth for every custom Reanimated interaction added across
// the app (QuantumCard press/entrance, the tab bar, the approvals queue, the
// workspace/module grids) — one shared "feel" instead of every screen tuning
// its own spring by hand. Tuned deliberately conservative ("quiet luxury"):
// high damping relative to stiffness so motion settles quickly without any
// visible overshoot/bounce, unlike a default React Native Animated.spring or
// an un-tuned Reanimated withSpring.
import { useQuantumStore } from './store'

// Used for instant, interactive feedback (press-in/press-out on cards, tab
// icons) — needs to feel immediate, so it's slightly stiffer/less damped
// than the entrance spring below.
export const PRESS_SPRING = { damping: 22, stiffness: 320, mass: 0.6 } as const

// Used for anything that settles into a resting layout position (card
// entrances, the "More" sheet sliding up, list reordering) — a touch softer
// so it reads as gliding into place rather than snapping.
export const SETTLE_SPRING = { damping: 20, stiffness: 200, mass: 0.8 } as const

// Staggered list/grid entrances: each subsequent item's fade+rise starts this
// many ms after the previous one, capped so a long list (e.g. 20+ approvals
// or module cards) never makes the user wait through a slow multi-second
// cascade before the last items appear.
export const ENTRANCE_STAGGER_MS = 45
export const ENTRANCE_STAGGER_CAP = 8
export const ENTRANCE_DURATION_MS = 300

/** Clamped stagger delay (ms) for the nth (0-based) item in a list/grid. */
export function staggerDelay(index?: number): number {
  if (typeof index !== 'number' || index < 0) return 0
  return Math.min(index, ENTRANCE_STAGGER_CAP) * ENTRANCE_STAGGER_MS
}

/**
 * Live "should custom motion run at all" flag — reads the OS Reduce Motion
 * setting via useQuantumStore.reducedMotion (kept in sync by
 * startReducedMotionListener() in the root layout). Check this before
 * driving any manual withSpring/withTiming value, and before passing
 * Reanimated's `entering`/`exiting`/`layout` props (pass undefined instead
 * when true, so the component mounts/unmounts/reorders with no animation at
 * all rather than a merely-faster one).
 */
export function useReducedMotionPreference(): boolean {
  return useQuantumStore((state) => state.reducedMotion)
}
