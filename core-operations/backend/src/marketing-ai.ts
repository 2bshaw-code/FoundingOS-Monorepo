/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { anthropicHeaders } from './ai.js'
// FoundAI for marketing: writes posts/emails/ads and plans whole campaigns with Claude, in the
// tenant's own brand voice and grounded in its real products, customers and past campaigns.
// Output is always a draft — nothing is published from here.
import { prisma } from './auth.js'
import { enforceBrandTerms, getBrandProfile, readBrandVoiceRules } from './operations.js'

export type PostDraft = { headline: string; body: string; hashtags: string[]; cta: string; type: string; imageIdea: string }
export type CampaignPost = { day: number; channel: string; type: string; headline: string; body: string; hashtags: string[]; cta: string }
export type CampaignPlan = { name: string; summary: string; audience: string; channels: string[]; durationDays: number; budgetSplit: Array<{ channel: string; percent: number }>; kpis: string[]; posts: CampaignPost[] }

const text = (value: unknown, max = 600) => String(value ?? '').trim().slice(0, max)
const list = (value: unknown, max = 8) => (Array.isArray(value) ? value : []).map((item) => text(item, 60)).filter(Boolean).slice(0, max)
const tags = (value: unknown) => list(value, 6).map((tag) => tag.startsWith('#') ? tag : `#${tag.replace(/\s+/g, '')}`)

function configuration() {
  if (process.env.AI_ENABLED === 'false') throw Object.assign(new Error('FoundAI has been turned off for this environment.'), { status: 503 })
  const apiKey = text(process.env.ANTHROPIC_API_KEY, 400)
  if (!apiKey) throw Object.assign(new Error('FoundAI is not configured. Add ANTHROPIC_API_KEY to the server environment.'), { status: 503 })
  return { apiKey, model: text(process.env.AI_REASONING_MODEL) || 'claude-sonnet-4-5' }
}

async function businessContext(tenantId: string) {
  const [profile, onboarding, records] = await Promise.all([
    getBrandProfile(tenantId),
    prisma.tenantOnboarding.findUnique({ where: { tenantId }, select: { businessName: true, industry: true, countryCode: true } }).catch(() => null),
    prisma.workspaceRecord.findMany({
      where: { tenantId, deletedAt: null, module: { in: ['products', 'inventory', 'promotions', 'campaigns', 'content', 'crm', 'leads'] } },
      orderBy: { updatedAt: 'desc' },
      take: 40,
      select: { module: true, name: true, status: true, valuePence: true, data: true },
    }),
  ])
  const voice = readBrandVoiceRules(profile?.brandVoice)
  return {
    voice,
    business: {
      name: profile?.tradingName || profile?.companyName || onboarding?.businessName || 'the business',
      tagline: profile?.tagline || null,
      website: profile?.website || null,
      industry: onboarding?.industry || null,
      country: onboarding?.countryCode || 'GB',
    },
    records: records.map((record) => ({ module: record.module, name: record.name, status: record.status, value: record.valuePence, detail: text((record.data as Record<string, unknown> | null)?.secondary, 160) || undefined })),
  }
}

async function callClaude(system: string, payload: unknown, maxTokens: number) {
  const { apiKey, model } = configuration()
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: anthropicHeaders(apiKey),
    body: JSON.stringify({ model, max_tokens: maxTokens, temperature: 0.7, system, messages: [{ role: 'user', content: JSON.stringify(payload) }] }),
    signal: AbortSignal.timeout(45_000),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { message?: string } } | null
    throw Object.assign(new Error(body?.error?.message || `FoundAI provider returned HTTP ${response.status}`), { status: 502 })
  }
  const body = await response.json() as { content?: Array<{ type?: string; text?: string }> }
  const raw = body.content?.find((item) => item.type === 'text')?.text ?? ''
  try { return JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)) as Record<string, unknown> } catch {
    throw Object.assign(new Error('FoundAI returned an unreadable draft. Please try again.'), { status: 502 })
  }
}

const rulesFor = (voice: ReturnType<typeof readBrandVoiceRules>, businessName: string) => [
  `You are FoundAI, the in-house marketer for ${businessName}.`,
  `Brand tone: ${voice.tone || 'clear, warm and confident'}.`,
  voice.approvedTerms.length ? `Prefer these terms: ${voice.approvedTerms.join(', ')}.` : '',
  voice.avoidedTerms.length ? `Never use these words: ${voice.avoidedTerms.join(', ')}.` : '',
  'Use British English. Only use facts in the supplied business context and brief — never invent prices, discounts, dates, statistics, awards or testimonials. If an offer is not supplied, do not promise one.',
  'Write for real customers of a small business: specific, human, no buzzwords, no emoji spam (at most one or two where natural).',
].filter(Boolean).join(' ')

export async function draftMarketingPost(tenantId: string, input: Record<string, unknown>): Promise<PostDraft> {
  const { voice, business, records } = await businessContext(tenantId)
  const type = text(input.type, 40) || 'Social post'
  const brief = { topic: text(input.topic) || 'our latest news', format: type, tone: text(input.tone, 40) || voice.tone || 'Professional', platform: text(input.platform, 40) || null, previousVersion: text(input.previous, 800) || null }
  const parsed = await callClaude(
    `${rulesFor(voice, business.name)} Write one ${type}. ${type === 'Email' ? 'The headline is the email subject line (under 60 characters); the body is a short plain-text email.' : type === 'Ad copy' ? 'Headline under 40 characters, body under 125 characters.' : type === 'Blog intro' ? 'Body is a 2–3 paragraph blog introduction.' : 'Body under 220 words, suited to Instagram, Facebook and LinkedIn.'} If previousVersion is supplied, write a clearly different angle. Return strict JSON: {"headline": string, "body": string, "hashtags": string[] (3-5, empty for Email), "cta": string (2-5 words), "imageIdea": string (one sentence describing a photo to pair with it)}.`,
    { brief, business, records },
    900,
  )
  const draft: PostDraft = { headline: text(parsed.headline, 160), body: text(parsed.body, 3000), hashtags: type === 'Email' ? [] : tags(parsed.hashtags), cta: text(parsed.cta, 60) || 'Find out more', type, imageIdea: text(parsed.imageIdea, 240) }
  if (!draft.headline || !draft.body) throw Object.assign(new Error('FoundAI returned an empty draft. Please try again.'), { status: 502 })
  enforceBrandTerms([draft.headline, draft.body, draft.cta], voice)
  return draft
}

export async function planMarketingCampaign(tenantId: string, input: Record<string, unknown>): Promise<CampaignPlan> {
  const { voice, business, records } = await businessContext(tenantId)
  const brief = {
    goal: text(input.goal) || 'Bring in more customers this month',
    audience: text(input.audience, 300) || null,
    offer: text(input.offer, 300) || null,
    budget: text(input.budget, 60) || null,
    durationDays: Math.min(60, Math.max(3, Number(input.durationDays) || 14)),
    channels: list(input.channels).length ? list(input.channels) : ['Instagram', 'Facebook', 'Email'],
  }
  const parsed = await callClaude(
    `${rulesFor(voice, business.name)} Plan a complete marketing campaign from the brief and write every post in it, ready to schedule. Spread 4–8 posts across the duration and only the requested channels; use "Email" type for email channel posts (headline = subject line) and "Social post" or "Ad copy" otherwise. budgetSplit percentages must add to 100 and only be included if a budget is supplied (else empty). Return strict JSON: {"name": string, "summary": string (2 sentences), "audience": string, "channels": string[], "durationDays": number, "budgetSplit": [{"channel": string, "percent": number}], "kpis": string[] (3 measurable targets, no invented baselines), "posts": [{"day": number (1-based), "channel": string, "type": string, "headline": string, "body": string, "hashtags": string[], "cta": string}]}.`,
    { brief, business, records },
    3500,
  )
  const posts = (Array.isArray(parsed.posts) ? parsed.posts : []).slice(0, 10).map((raw) => {
    const post = raw as Record<string, unknown>
    return { day: Math.max(1, Math.round(Number(post.day) || 1)), channel: text(post.channel, 40) || 'Social', type: text(post.type, 40) || 'Social post', headline: text(post.headline, 160), body: text(post.body, 2000), hashtags: tags(post.hashtags), cta: text(post.cta, 60) || 'Find out more' }
  }).filter((post) => post.headline && post.body)
  if (!posts.length) throw Object.assign(new Error('FoundAI could not build a campaign from that brief. Try adding more detail.'), { status: 502 })
  const plan: CampaignPlan = {
    name: text(parsed.name, 120) || 'New campaign',
    summary: text(parsed.summary, 600),
    audience: text(parsed.audience, 300) || brief.audience || '',
    channels: list(parsed.channels).length ? list(parsed.channels) : brief.channels,
    durationDays: Math.round(Number(parsed.durationDays) || brief.durationDays),
    budgetSplit: brief.budget ? (Array.isArray(parsed.budgetSplit) ? parsed.budgetSplit : []).map((raw) => ({ channel: text((raw as Record<string, unknown>).channel, 40), percent: Math.round(Number((raw as Record<string, unknown>).percent) || 0) })).filter((item) => item.channel && item.percent > 0) : [],
    kpis: (Array.isArray(parsed.kpis) ? parsed.kpis : []).map((kpi) => text(kpi, 160)).filter(Boolean).slice(0, 4),
    posts,
  }
  enforceBrandTerms([plan.name, plan.summary, ...posts.flatMap((post) => [post.headline, post.body, post.cta])], voice)
  return plan
}
