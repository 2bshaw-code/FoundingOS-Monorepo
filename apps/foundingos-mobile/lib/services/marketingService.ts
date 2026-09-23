/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Marketing service contract. Screens should depend only on `IMarketingService`
// and call `getMarketingService()` — never import the demo or real
// implementation directly. This is the seam a future owner uses to plug in a
// real AI content/ads engine without touching marketing.tsx.
import { MarketingCampaign, MarketingWorkspace, MediaGeneration, SocialPost } from '../core-operations-api'
import { useQuantumStore } from '../store'
import { createDemoMarketingService } from './marketingService.demo'
import { createRealMarketingService } from './marketingService.real'

export type CreateCampaignInput = {
  name: string
  objective?: string
  audience?: string
  platforms?: string[]
  status?: string
  scheduledAt?: string
}

export type UpdateCampaignInput = Partial<
  Pick<MarketingCampaign, 'status' | 'scheduledAt' | 'impressions' | 'engagements' | 'conversions' | 'revenuePence'>
>

export type CreateSocialPostInput = {
  campaignId?: string
  platforms?: string[]
  content: string
  scheduledAt?: string
  autoPost?: boolean
}

export type UpdateSocialPostInput = Partial<Pick<SocialPost, 'content' | 'status' | 'scheduledAt' | 'autoPost'>>

export type GenerateMediaInput = { format: string; brief: string }

export interface IMarketingService {
  fetchWorkspace(): Promise<MarketingWorkspace | null>
  createCampaign(input: CreateCampaignInput): Promise<MarketingCampaign>
  updateCampaign(id: string, patch: UpdateCampaignInput): Promise<MarketingCampaign>
  createSocialPost(input: CreateSocialPostInput): Promise<SocialPost>
  updateSocialPost(id: string, patch: UpdateSocialPostInput): Promise<SocialPost>
  generateMedia(input: GenerateMediaInput): Promise<MediaGeneration>
}

let demoService: IMarketingService | null = null
let realService: IMarketingService | null = null

// Re-evaluated on every call so a live Demo Mode toggle switches
// implementations immediately, without the screen needing to know.
export function getMarketingService(): IMarketingService {
  if (useQuantumStore.getState().demoMode) {
    if (!demoService) demoService = createDemoMarketingService()
    return demoService
  }
  if (!realService) realService = createRealMarketingService()
  return realService
}
