/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Live Core.Operations implementation of ITeamService.
import {
  fetchPendingInvitations,
  fetchTeam,
  inviteTeamMember,
  resendTeamInvitation,
  revokeTeamInvitation,
  updateTeamMember,
} from '../core-operations-api'
import { ITeamService } from './teamService'

export function createRealTeamService(): ITeamService {
  return {
    fetchTeam: () => fetchTeam(),
    fetchPendingInvitations: () => fetchPendingInvitations(),
    inviteMember: (input) => inviteTeamMember(input),
    updateMember: (id, patch) => updateTeamMember(id, patch),
    revokeInvitation: (id) => revokeTeamInvitation(id),
    resendInvitation: (id) => resendTeamInvitation(id),
  }
}
