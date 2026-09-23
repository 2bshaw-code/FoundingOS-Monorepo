/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Team service contract. Screens depend only on `ITeamService` via
// `getTeamService()` — never on the demo/real implementation directly.
import { PendingInvitation, TeamMember, TeamRole } from '../core-operations-api'
import { useQuantumStore } from '../store'
import { createDemoTeamService } from './teamService.demo'
import { createRealTeamService } from './teamService.real'

export type InviteMemberInput = { email: string; role: TeamRole }
export type InviteResult = { delivery: { message: string } }

export interface ITeamService {
  fetchTeam(): Promise<TeamMember[]>
  fetchPendingInvitations(): Promise<PendingInvitation[]>
  inviteMember(input: InviteMemberInput): Promise<InviteResult>
  updateMember(id: string, patch: Partial<Pick<TeamMember, 'role' | 'active'>>): Promise<TeamMember>
  revokeInvitation(id: string): Promise<unknown>
  resendInvitation(id: string): Promise<InviteResult>
}

let demoService: ITeamService | null = null
let realService: ITeamService | null = null

export function getTeamService(): ITeamService {
  if (useQuantumStore.getState().demoMode) {
    if (!demoService) demoService = createDemoTeamService()
    return demoService
  }
  if (!realService) realService = createRealTeamService()
  return realService
}
