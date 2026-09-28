/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { prisma } from './auth.js'

// Live market research (market trends, national prices, competitor monitoring) is a paid
// add-on capability: every search costs money on top of the normal model call, so it is
// limited to the top plans and to the founder's own SuperDash.
const RESEARCH_PLANS = new Set(['growth', 'enterprise'])

export type WebSource = {
  title: string
  url: string
}

export type ResearchProfile = {
  countryCode: string
  currency: string
  timezone: string
  industry: string
  businessName: string
}

// Anthropic's server-side web search tool. Claude decides when to call it, runs the search
// itself and feeds the results back into its own turn, so there is no scraping surface here.
export function webSearchTool(profile: ResearchProfile | null, maxUses: number) {
  return {
    type: 'web_search_20250305',
    name: 'web_search',
    max_uses: maxUses,
    // Locating the search makes "national prices" actually national — a Kenyan retailer
    // asking about maize should not get Chicago futures.
    ...(profile?.countryCode
      ? { user_location: { type: 'approximate', country: profile.countryCode, ...(profile.timezone ? { timezone: profile.timezone } : {}) } }
      : {}),
  }
}

export function canResearch(plan: string | null | undefined, founderScope: boolean): boolean {
  if (founderScope) return true
  return RESEARCH_PLANS.has(String(plan || '').trim().toLowerCase())
}

// The tenant's highest plan across their workspaces, plus the trading context that makes
// market answers locally meaningful.
export async function loadResearchProfile(tenantId: string): Promise<{ plan: string; profile: ResearchProfile | null }> {
  const [workspaces, onboarding] = await Promise.all([
    prisma.tenantWorkspace.findMany({ where: { tenantId }, select: { plan: true } }).catch(() => []),
    prisma.tenantOnboarding.findFirst({ where: { tenantId }, select: { countryCode: true, currency: true, timezone: true, industry: true, businessName: true } }).catch(() => null),
  ])
  const plans = workspaces.map((row) => String(row.plan || '').toLowerCase())
  const plan = plans.includes('enterprise') ? 'enterprise' : plans.includes('growth') ? 'growth' : plans[0] || 'lite'
  return {
    plan,
    profile: onboarding
      ? {
          countryCode: onboarding.countryCode || 'GB',
          currency: onboarding.currency || 'GBP',
          timezone: onboarding.timezone || '',
          industry: onboarding.industry || '',
          businessName: onboarding.businessName || '',
        }
      : null,
  }
}

type ContentBlock = { type?: string; text?: string; content?: unknown }

// Pulls the citable pages out of the web_search_tool_result blocks Anthropic returns, so the
// UI can show where an external claim actually came from rather than asking people to trust it.
export function collectWebSources(content: ContentBlock[] | undefined): WebSource[] {
  const sources: WebSource[] = []
  const seen = new Set<string>()
  for (const block of content ?? []) {
    if (block?.type !== 'web_search_tool_result' || !Array.isArray(block.content)) continue
    for (const result of block.content as Array<Record<string, unknown>>) {
      const url = String(result?.url || '').trim()
      if (!url || seen.has(url)) continue
      seen.add(url)
      sources.push({ title: String(result?.title || url).trim().slice(0, 200), url })
      if (sources.length >= 12) return sources
    }
  }
  return sources
}

// With tools in play the model narrates between searches, so the answer JSON is in the final
// text block rather than the first one.
export function lastTextBlock(content: ContentBlock[] | undefined): string {
  let text = ''
  for (const block of content ?? []) {
    if (block?.type === 'text' && typeof block.text === 'string' && block.text.trim()) text = block.text
  }
  return text
}

export function researchSystemPrompt(profile: ResearchProfile | null): string {
  const where = profile
    ? `The business trades as ${profile.businessName || 'this company'}${profile.industry ? ` in ${profile.industry}` : ''}, based in country code ${profile.countryCode}, reporting in ${profile.currency}.`
    : ''
  return [
    'You have a web_search tool for live outside information: market trends, national and local prices, supplier and commodity costs, competitor activity, regulation and demand signals.',
    where,
    'Use it only when the question genuinely needs current outside facts that are not in the supplied records — never to answer something the records already cover, and never more than the question requires.',
    'When you do search, prefer recent sources, state the date or period a figure refers to, and give prices in the local currency of the business (converting only if you say so).',
    'Never present a searched figure as if it came from the business\'s own records. Never invent a price, trend or competitor claim you did not actually find — if a search returns nothing useful, say plainly that you could not find a reliable current figure.',
    'Keep outside findings and the business\'s own numbers clearly separated in your answer, and connect the two: say what the outside information means for this specific business.',
  ].filter(Boolean).join(' ')
}
