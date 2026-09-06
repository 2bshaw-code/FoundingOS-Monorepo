/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export function draftProposal(dealId: string) {
  return `Proposal draft for ${dealId}: value, implementation plan, proof, and next step.`
}

export function draftFollowUp(dealId: string) {
  return `Quick follow-up on ${dealId}: should we lock the next step for this week?`
}

export function draftObjectionResponse(objectionType: string) {
  return `Response for ${objectionType}: acknowledge, prove value, reduce risk, and ask for the next step.`
}

export function draftClosingMessage(dealId: string) {
  return `Closing message for ${dealId}: confirm scope, timeline, and approval path.`
}
