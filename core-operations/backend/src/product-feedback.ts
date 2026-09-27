/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Pure helpers for private product ratings (stored as workspace audit events).
const SURFACES = new Set(['web', 'ios', 'android', 'mobile'])

export function normalizeProductRating(input: Record<string, unknown>) {
  const score = Number(input.score)
  if (!Number.isInteger(score) || score < 1 || score > 5) throw Object.assign(new Error('Choose a rating from 1 to 5 stars.'), { status: 400 })
  const surface = typeof input.surface === 'string' && SURFACES.has(input.surface) ? input.surface : 'web'
  const comment = typeof input.comment === 'string' ? input.comment.trim().slice(0, 1000) : ''
  const page = typeof input.page === 'string' ? input.page.trim().slice(0, 160) : ''
  return { score, surface, comment, page }
}

export function summarizeProductRatings(rows: Array<{ id: string; tenantId: string; metadata: unknown; createdAt: Date }>, tenantNames: Map<string, string>) {
  const ratings = rows.flatMap((row) => {
    const data = row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata) ? row.metadata as Record<string, unknown> : {}
    const score = Number(data.score)
    return Number.isInteger(score) && score >= 1 && score <= 5 ? [{ id: row.id, tenantId: row.tenantId, business: tenantNames.get(row.tenantId) || row.tenantId, score, surface: String(data.surface || 'web'), page: String(data.page || ''), comment: String(data.comment || ''), createdAt: row.createdAt.toISOString() }] : []
  })
  const average = ratings.length ? Math.round((ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length) * 10) / 10 : null
  return { count: ratings.length, average, distribution: [5, 4, 3, 2, 1].map((score) => ({ score, count: ratings.filter((rating) => rating.score === score).length })), recent: ratings.slice(0, 20) }
}
