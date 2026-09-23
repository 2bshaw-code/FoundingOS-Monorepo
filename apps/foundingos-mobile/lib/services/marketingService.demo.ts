/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// In-memory Demo Mode implementation of IMarketingService. Owns the mutable
// demo marketing workspace so create/update flows in marketing.tsx feel real
// without a live Core.Operations connection. Never talks to the network.
import { MarketingCampaign, MarketingWorkspace, MediaGeneration, SocialPost } from '../core-operations-api'
import {
  CreateCampaignInput,
  CreateSocialPostInput,
  GenerateMediaInput,
  IMarketingService,
  UpdateCampaignInput,
  UpdateSocialPostInput,
} from './marketingService'

const HOURS = 60 * 60 * 1000
const isoAgo = (ms: number) => new Date(Date.now() - ms).toISOString()

function recomputeMetrics(workspace: MarketingWorkspace): MarketingWorkspace {
  return {
    ...workspace,
    metrics: {
      campaigns: workspace.campaigns.length,
      scheduledPosts: workspace.socialPosts.filter((post) => post.status === 'scheduled').length,
      impressions: workspace.campaigns.reduce((sum, c) => sum + c.impressions, 0),
      conversions: workspace.campaigns.reduce((sum, c) => sum + c.conversions, 0),
      revenuePence: workspace.campaigns.reduce((sum, c) => sum + c.revenuePence, 0),
    },
  }
}

function seedWorkspace(): MarketingWorkspace {
  return recomputeMetrics({
    campaigns: [
      {
        id: 'demo-campaign-1', tenantId: 'demo', name: 'Spring Restock Push', objective: 'Drive repeat purchases', audience: 'Lapsed customers, last 90 days',
        platforms: ['whatsapp', 'instagram'], status: 'active', scheduledAt: isoAgo(-2 * 24 * HOURS),
        impressions: 18400, engagements: 2210, conversions: 214, revenuePence: 612_000,
        idea: 'Highlight the new size run with a limited-time WhatsApp discount code.', caption: 'Fresh sizes just landed — reply RESTOCK for 15% off this week only.', hashtags: '#NewArrivals #FounderAndCo',
        createdAt: isoAgo(9 * 24 * HOURS), updatedAt: isoAgo(3 * HOURS),
      },
      {
        id: 'demo-campaign-2', tenantId: 'demo', name: 'Win-back: Lapsed VIPs', objective: 'Re-engage top spenders', audience: 'VIP tier, no purchase in 60 days',
        platforms: ['whatsapp'], status: 'completed', scheduledAt: isoAgo(6 * 24 * HOURS),
        impressions: 4200, engagements: 980, conversions: 96, revenuePence: 288_000,
        idea: null, caption: 'We miss you! Here is 20% off your next order.', hashtags: null,
        createdAt: isoAgo(20 * 24 * HOURS), updatedAt: isoAgo(6 * 24 * HOURS),
      },
      {
        id: 'demo-campaign-3', tenantId: 'demo', name: 'Store 4 Grand Reopening', objective: 'Local footfall', audience: 'Store 4 catchment area',
        platforms: ['instagram', 'facebook'], status: 'draft', scheduledAt: null,
        impressions: 0, engagements: 0, conversions: 0, revenuePence: 0,
        idea: 'Tease the reopening with a countdown series.', caption: null, hashtags: null,
        createdAt: isoAgo(1 * 24 * HOURS), updatedAt: isoAgo(1 * 24 * HOURS),
      },
    ],
    socialPosts: [
      { id: 'demo-post-1', tenantId: 'demo', campaignId: 'demo-campaign-1', platforms: ['whatsapp'], content: 'Fresh sizes just landed — reply RESTOCK for 15% off this week only.', mediaUrl: null, mediaType: null, status: 'scheduled', scheduledAt: isoAgo(-1 * 24 * HOURS), publishedAt: null, autoPost: true, createdAt: isoAgo(3 * 24 * HOURS), updatedAt: isoAgo(3 * HOURS) },
      { id: 'demo-post-2', tenantId: 'demo', campaignId: 'demo-campaign-2', platforms: ['whatsapp'], content: 'We miss you! Here is 20% off your next order — just for our VIPs.', mediaUrl: null, mediaType: null, status: 'published', scheduledAt: isoAgo(7 * 24 * HOURS), publishedAt: isoAgo(7 * 24 * HOURS), autoPost: false, createdAt: isoAgo(9 * 24 * HOURS), updatedAt: isoAgo(7 * 24 * HOURS) },
    ],
    media: [
      { id: 'demo-media-1', tenantId: 'demo', format: 'Campaign copy', brief: 'Announce the spring restock to lapsed customers with urgency.', output: 'Fresh sizes just landed — reply RESTOCK for 15% off this week only. Limited stock, first come first served.', context: null, createdAt: isoAgo(3 * 24 * HOURS) },
    ],
    metrics: { campaigns: 0, scheduledPosts: 0, impressions: 0, conversions: 0, revenuePence: 0 },
  })
}

export function createDemoMarketingService(): IMarketingService {
  let workspace = seedWorkspace()

  return {
    async fetchWorkspace() {
      return workspace
    },

    async createCampaign(input: CreateCampaignInput) {
      const nowIso = new Date().toISOString()
      const campaign: MarketingCampaign = {
        id: `demo-campaign-${Date.now()}`, tenantId: 'demo', name: input.name, objective: input.objective ?? '', audience: input.audience ?? '',
        platforms: input.platforms ?? [], status: input.status ?? 'draft', scheduledAt: input.scheduledAt ?? null,
        impressions: 0, engagements: 0, conversions: 0, revenuePence: 0, idea: null, caption: null, hashtags: null,
        createdAt: nowIso, updatedAt: nowIso,
      }
      workspace = recomputeMetrics({ ...workspace, campaigns: [campaign, ...workspace.campaigns] })
      return campaign
    },

    async updateCampaign(id: string, patch: UpdateCampaignInput) {
      const existing = workspace.campaigns.find((campaign) => campaign.id === id)
      if (!existing) throw new Error('Campaign not found.')
      const updated: MarketingCampaign = { ...existing, ...patch, updatedAt: new Date().toISOString() }
      const campaigns = workspace.campaigns.map((campaign) => (campaign.id === id ? updated : campaign))
      workspace = recomputeMetrics({ ...workspace, campaigns })
      return updated
    },

    async createSocialPost(input: CreateSocialPostInput) {
      const nowIso = new Date().toISOString()
      const post: SocialPost = {
        id: `demo-post-${Date.now()}`, tenantId: 'demo', campaignId: input.campaignId ?? null, platforms: input.platforms ?? [],
        content: input.content, mediaUrl: null, mediaType: null, status: input.scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: input.scheduledAt ?? null, publishedAt: null, autoPost: Boolean(input.autoPost), createdAt: nowIso, updatedAt: nowIso,
      }
      workspace = recomputeMetrics({ ...workspace, socialPosts: [post, ...workspace.socialPosts] })
      return post
    },

    async updateSocialPost(id: string, patch: UpdateSocialPostInput) {
      const existing = workspace.socialPosts.find((post) => post.id === id)
      if (!existing) throw new Error('Social post not found.')
      const updated: SocialPost = { ...existing, ...patch, updatedAt: new Date().toISOString() }
      const socialPosts = workspace.socialPosts.map((post) => (post.id === id ? updated : post))
      workspace = recomputeMetrics({ ...workspace, socialPosts })
      return updated
    },

    async generateMedia(input: GenerateMediaInput) {
      const generation: MediaGeneration = {
        id: `demo-media-${Date.now()}`, tenantId: 'demo', format: input.format, brief: input.brief,
        output: `Here's a ${input.format.toLowerCase()} draft: "${input.brief.trim().replace(/\.$/, '')}" — crafted to match Founder & Co.'s warm, direct WhatsApp voice.`,
        context: null, createdAt: new Date().toISOString(),
      }
      workspace = { ...workspace, media: [generation, ...workspace.media] }
      return generation
    },
  }
}
