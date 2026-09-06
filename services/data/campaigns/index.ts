/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export function getCampaignSignals(tenantId: string) {
  return {
    tenantId,
    consentRequired: true,
    preferredChannels: ['WhatsApp', 'Email', 'Retargeting'],
  }
}
