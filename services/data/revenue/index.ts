/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export function getRevenueSignals(tenantId: string) {
  return {
    tenantId,
    currency: 'GBP',
    revenueTrend: 'unknown',
    creditSafe: true,
  }
}
