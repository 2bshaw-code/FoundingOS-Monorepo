/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real bolt-on AI scanner config for FoundLogistics — wires the camera/photo-library capture
// screen to this brand's own real AI endpoint (see apps/foundingos-console/app/api).
export const AI_SCANNER = {
  title: 'Route Optimiser',
  description: 'Photograph today’s orders — AI builds the fastest, most fuel-efficient route.',
  endpoint: '/api/boltons/logistics-route',
  actionType: 'ROUTE_OPTIMISE_SCAN',
}
