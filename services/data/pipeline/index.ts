/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export function getPipelineSignals(tenantId: string) {
  return {
    tenantId,
    stages: ['lead', 'qualified', 'proposal', 'close', 'won'],
    revenueRecognition: 'signed-or-paid-only',
  }
}
