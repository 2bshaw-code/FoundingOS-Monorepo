/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real bolt-on AI scanner config for FoundFinance — wires the camera/photo-library capture
// screen to this brand's own real AI endpoint (see apps/foundingos-console/app/api).
export const AI_SCANNER = {
  title: 'Receipt Scanner',
  description: 'Photograph a receipt or invoice — AI extracts amount, merchant, and category as an expense.',
  endpoint: '/api/boltons/finance-expense',
  actionType: 'RECEIPT_EXPENSE_SCAN',
}
