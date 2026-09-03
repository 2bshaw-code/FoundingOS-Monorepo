/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Builds SuperDashTileData-shaped tiles from the cross-app survey feed, so the existing,
// unmodified SuperDashAnomaly/SuperDashAutonomous functions can run on real tester survey
// data exactly the same way they already run on core-module tiles.
import { FoundAIInlineHints } from './foundai-inline-hints'
import { FoundAIVoicePrompt } from './foundai-voice'
import type { SuperDashTileData } from './getSuperDashTiles'

export type SurveyFeedEntry = {
  brand: string
  category: string
  tester: string | null
  responses: string[]
  timestamp: number
  receivedAt: string
}

export const SURVEY_CATEGORY_LABELS: Record<string, string> = {
  sales: 'Sales',
  marketing: 'Marketing',
  product: 'Product',
  support: 'Support',
  operations: 'Operations',
  finance: 'Finance',
  retailexp: 'Retail Experience',
  uxui: 'UX/UI',
  branding: 'Branding',
  competitor: 'Competitor Analysis',
}

const CATEGORY_SLUGS = Object.keys(SURVEY_CATEGORY_LABELS)

function blankAnswerCount(entries: SurveyFeedEntry[]): number {
  return entries.reduce((count, entry) => count + entry.responses.filter((answer) => answer.trim().length < 3).length, 0)
}

// A category with zero submissions scores low on purpose — that's a real, honest signal
// ("nobody has given feedback on this yet"), not a decorative placeholder.
function categoryScore(entries: SurveyFeedEntry[]): number {
  if (entries.length === 0) return 0.6
  const engagementBonus = Math.min(entries.length, 4) * 0.08
  const blankPenalty = blankAnswerCount(entries) * 0.05
  const score = 1.0 + engagementBonus - blankPenalty
  return Number(Math.max(0.4, Math.min(1.6, score)).toFixed(2))
}

function buildTile(id: string, title: string, description: string, href: string, score: number): SuperDashTileData {
  const scoreStr = score.toFixed(2)
  return {
    id,
    title,
    description,
    href,
    score: scoreStr,
    aiHint: FoundAIInlineHints('FoundRetail', id, scoreStr),
    aiVoice: FoundAIVoicePrompt('FoundRetail', id, scoreStr),
  }
}

export function getSurveyFeedTiles(entries: SurveyFeedEntry[]): SuperDashTileData[] {
  const categoryTiles = CATEGORY_SLUGS.map((slug) => {
    const categoryEntries = entries.filter((entry) => entry.category === slug)
    return buildTile(
      `survey-${slug}`,
      `${SURVEY_CATEGORY_LABELS[slug]} Insights`,
      `${categoryEntries.length} tester submission(s) for ${SURVEY_CATEGORY_LABELS[slug]}.`,
      `/survey/${slug}`,
      categoryScore(categoryEntries),
    )
  })

  const distinctTesters = new Set(entries.map((entry) => entry.tester).filter((tester): tester is string => Boolean(tester)))
  const completedCategories = CATEGORY_SLUGS.filter((slug) => entries.some((entry) => entry.category === slug)).length
  const completionRatio = completedCategories / CATEGORY_SLUGS.length
  const categoryHealth = categoryTiles.reduce((total, tile) => total + parseFloat(tile.score), 0) / categoryTiles.length

  const globalTiles = [
    buildTile('survey-tester-activity', 'Tester Activity', `${distinctTesters.size} distinct tester(s), ${entries.length} total submission(s).`, '/superdashboard', 1.0 + Math.min(distinctTesters.size, 5) * 0.05),
    buildTile('survey-completion-rate', 'Survey Completion Rate', `${completedCategories} of ${CATEGORY_SLUGS.length} categories have at least one submission.`, '/superdashboard', 0.6 + completionRatio),
    buildTile('survey-category-health', 'Category Health', `Average health score across all ${CATEGORY_SLUGS.length} survey categories.`, '/superdashboard', categoryHealth),
  ]

  return [...categoryTiles, ...globalTiles]
}
