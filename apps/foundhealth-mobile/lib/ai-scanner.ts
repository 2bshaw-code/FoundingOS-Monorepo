/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real bolt-on AI scanner config for FoundHealth — wires the camera/photo-library capture
// screen to this brand's own real AI endpoint (see apps/foundingos-console/app/api).
export const AI_SCANNER = {
  title: 'Record Extractor',
  description: 'Photograph a patient document — AI extracts it into structured, compliant records.',
  endpoint: '/api/ai/health-records',
  actionType: 'HEALTH_RECORD_SCAN',
}
