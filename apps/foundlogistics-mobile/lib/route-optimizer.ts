/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { RouteStop } from './logistics-poll'

// Simple deterministic nearest-neighbour heuristic over the route's own demo stop coordinates
// (abstract 0-100 grid positions from the live feed, not real GPS) — a genuine, reproducible
// route-optimiser *suggestion*, clearly labelled as such in the UI rather than presented as an
// authoritative real-world routing engine (no traffic data, no real map, no external routing
// API involved).
export type OptimisedStop = RouteStop & { order: number; legDistanceKm: number }

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy) * 0.6
}

export function suggestVisitOrder(stops: RouteStop[]): { order: OptimisedStop[]; totalDistanceKm: number } {
  if (stops.length === 0) return { order: [], totalDistanceKm: 0 }

  const remaining = [...stops]
  const first = remaining.shift()!
  const ordered: OptimisedStop[] = [{ ...first, order: 1, legDistanceKm: 0 }]
  let current = first
  let totalDistanceKm = 0

  while (remaining.length > 0) {
    let nearestIndex = 0
    let nearestDistance = Infinity
    for (let i = 0; i < remaining.length; i++) {
      const d = distance(current, remaining[i])
      if (d < nearestDistance) {
        nearestDistance = d
        nearestIndex = i
      }
    }
    const next = remaining.splice(nearestIndex, 1)[0]
    totalDistanceKm += nearestDistance
    ordered.push({ ...next, order: ordered.length + 1, legDistanceKm: Number(nearestDistance.toFixed(1)) })
    current = next
  }

  return { order: ordered, totalDistanceKm: Number(totalDistanceKm.toFixed(1)) }
}

// Total distance of the stops in their original (un-optimised) order, for comparison.
export function originalOrderDistanceKm(stops: RouteStop[]): number {
  let total = 0
  for (let i = 1; i < stops.length; i++) {
    total += distance(stops[i - 1], stops[i])
  }
  return Number(total.toFixed(1))
}
