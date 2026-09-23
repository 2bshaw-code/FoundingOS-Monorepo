/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Live Core.Operations implementation of IMarketingService. Thin adapter over
// the tenant-scoped REST client — this is where a future owner would swap in
// a different backend or AI content engine without touching marketing.tsx.
import {
  createMarketingCampaign,
  createMarketingSocialPost,
  fetchMarketingWorkspace,
  generateMarketingMedia,
  updateMarketingCampaign,
  updateMarketingSocialPost,
} from '../core-operations-api'
import { IMarketingService } from './marketingService'

export function createRealMarketingService(): IMarketingService {
  return {
    fetchWorkspace: () => fetchMarketingWorkspace(),
    createCampaign: (input) => createMarketingCampaign(input),
    updateCampaign: (id, patch) => updateMarketingCampaign(id, patch),
    createSocialPost: (input) => createMarketingSocialPost(input),
    updateSocialPost: (id, patch) => updateMarketingSocialPost(id, patch),
    generateMedia: (input) => generateMarketingMedia(input),
  }
}
