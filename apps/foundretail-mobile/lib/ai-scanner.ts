/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real bolt-on AI scanner config for FoundRetail — wires the camera/photo-library capture
// screen to this brand's own real AI endpoint (see apps/foundingos-console/app/api).
export const AI_SCANNER = {
  title: 'Shelf Scanner',
  description: 'Snap a photo of your shelf — AI reads stock levels and flags what needs restocking.',
  endpoint: '/api/boltons/shelf-scanner',
  actionType: 'SHELF_STOCK_SCAN',
}
