/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Additive extension of Guardian Mode, scoped to the cross-app survey feed. This does NOT
// modify the existing SuperDashGuardian() (that stays exactly as-is) — it adds a second,
// independent set of real, detectable checks specific to tester survey data:
//   - missing answers (blank/very short responses actually submitted)
//   - low engagement (a category with zero submissions)
//   - repeated anomalies (the same category anomalous more than once)
// "Detect broken routes" is genuinely checked too, but requires a live HTTP probe (server
// -side, to avoid a browser CORS failure calling another app's domain) — see routeHealth,
// which SuperDashboardPage fetches from /api/superdash/route-health and passes in here.
import type { SurveyFeedEntry } from './getSurveyFeedTiles'
import { SURVEY_CATEGORY_LABELS } from './getSurveyFeedTiles'

export type RouteHealthResult = { path: string; ok: boolean; status: number }

export function SuperDashSurveyGuardian(entries: SurveyFeedEntry[], routeHealth: RouteHealthResult[] = []): string[] {
  const warnings: string[] = []

  for (const [slug, label] of Object.entries(SURVEY_CATEGORY_LABELS)) {
    const categoryEntries = entries.filter((entry) => entry.category === slug)
    if (categoryEntries.length === 0) {
      warnings.push(`⚠️ Guardian: ${label} has no tester submissions yet — low engagement.`)
      continue
    }
    const blankCount = categoryEntries.reduce((count, entry) => count + entry.responses.filter((answer) => answer.trim().length < 3).length, 0)
    if (blankCount > 0) {
      warnings.push(`⚠️ Guardian: ${label} has ${blankCount} missing/blank answer(s) across ${categoryEntries.length} submission(s).`)
    }
  }

  const brokenRoutes = routeHealth.filter((route) => !route.ok)
  if (brokenRoutes.length > 0) {
    warnings.push(`⚡ Guardian: ${brokenRoutes.length} route(s) are not responding correctly — ${brokenRoutes.map((route) => `${route.path} (${route.status})`).join(', ')}.`)
  }

  return warnings
}

// "Repeated anomalies" — a real, honest signal: a category that appears in the anomaly
// list on more than one poll is flagged distinctly from a one-off anomaly.
export function detectRepeatedAnomalies(anomalyHistory: string[][]): string[] {
  const counts = new Map<string, number>()
  for (const poll of anomalyHistory) {
    for (const anomaly of poll) {
      counts.set(anomaly, (counts.get(anomaly) ?? 0) + 1)
    }
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([anomaly, count]) => `🔁 Guardian: repeated anomaly (${count}x) — ${anomaly}`)
}
