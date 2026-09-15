/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export const OPEN_FOUND_AI_PANEL_EVENT = 'founder-os:open-found-ai-panel'
export const OPEN_BOB_PANEL_EVENT = OPEN_FOUND_AI_PANEL_EVENT

export function openBobPanel() {
  window.dispatchEvent(new Event(OPEN_BOB_PANEL_EVENT))
}
