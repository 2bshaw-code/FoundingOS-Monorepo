/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real bolt-on AI scanner config for FoundTalent — wires the camera/photo-library capture
// screen to this brand's own real AI endpoint (see apps/foundingos-console/app/api).
export const AI_SCANNER = {
  title: 'CV Scanner',
  description: 'Photograph or upload a CV — AI extracts a structured candidate profile.',
  endpoint: '/api/ai/talent-intake',
  actionType: 'CV_INTAKE_SCAN',
}
