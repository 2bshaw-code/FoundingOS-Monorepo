/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export function getUsageSignals(tenantId: string) {
  return {
    tenantId,
    activeUsers: 0,
    aiActions: 0,
    lastUpdated: new Date().toISOString(),
  }
}
