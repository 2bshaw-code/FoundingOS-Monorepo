/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Deterministic daily rotation helper — same day, same device, always picks the same index,
// but a new day always picks a different one. No backend/network call needed: this keeps the
// pre-login preview screen feeling "alive" (new hook/insight/leaderboard order each day) for
// repeat visitors, without needing a real content-scheduling service.
export function dayIndex(poolLength: number): number {
  if (poolLength <= 0) return 0
  const now = new Date()
  const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 0)
  const dayOfYear = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - startOfYear) / 86400000)
  return dayOfYear % poolLength
}

export function pickDaily<T>(pool: T[], offset = 0): T {
  return pool[(dayIndex(pool.length) + offset) % pool.length]
}
