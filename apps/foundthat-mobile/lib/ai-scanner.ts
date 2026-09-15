/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real bolt-on AI scanner config for FoundThat — wires the camera/photo-library capture
// screen to this brand's own real AI endpoint (see apps/foundingos-console/app/api).
export const AI_SCANNER = {
  title: 'Product Discovery Scanner',
  description: 'Photograph any product — AI matches it against the live catalogue instantly.',
  endpoint: '/api/ai/order-assist',
  actionType: 'PRODUCT_DISCOVERY_SCAN',
}
