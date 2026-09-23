/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// In-memory Demo Mode implementation of ITeamService. Seeds a realistic
// founder + manager + staff team so the Team screen always shows a
// manage-capable view without a live Core.Operations session.
import { PendingInvitation, TeamMember } from '../core-operations-api'
import { InviteMemberInput, ITeamService } from './teamService'

const HOURS = 60 * 60 * 1000
const isoAgo = (ms: number) => new Date(Date.now() - ms).toISOString()

function seedMembers(): TeamMember[] {
  return [
    { id: 'demo-team-owner', email: 'alex@founderandco.com', role: 'business_owner', permissions: null, active: true, createdAt: isoAgo(120 * 24 * HOURS), updatedAt: isoAgo(120 * 24 * HOURS) },
    { id: 'demo-team-manager', email: 'priya@founderandco.com', role: 'business_manager', permissions: null, active: true, createdAt: isoAgo(90 * 24 * HOURS), updatedAt: isoAgo(14 * HOURS) },
    { id: 'demo-team-staff', email: 'jordan@founderandco.com', role: 'business_staff', permissions: null, active: true, createdAt: isoAgo(45 * 24 * HOURS), updatedAt: isoAgo(2 * HOURS) },
  ]
}

function seedInvitations(): PendingInvitation[] {
  return [
    { id: 'demo-invite-1', email: 'sam@founderandco.com', role: 'business_viewer', permissions: null, expiresAt: isoAgo(-6 * 24 * HOURS), createdAt: isoAgo(1 * HOURS) },
  ]
}

export function createDemoTeamService(): ITeamService {
  let members = seedMembers()
  let invitations = seedInvitations()

  return {
    async fetchTeam() {
      return members
    },

    async fetchPendingInvitations() {
      return invitations
    },

    async inviteMember(input: InviteMemberInput) {
      const nowIso = new Date().toISOString()
      invitations = [
        ...invitations,
        { id: `demo-invite-${Date.now()}`, email: input.email, role: input.role, permissions: null, expiresAt: new Date(Date.now() + 6 * 24 * HOURS).toISOString(), createdAt: nowIso },
      ]
      return { delivery: { message: '(Demo mode — not persisted.)' } }
    },

    async updateMember(id: string, patch) {
      const existing = members.find((member) => member.id === id)
      if (!existing) throw new Error('Team member not found.')
      const updated: TeamMember = { ...existing, ...patch, updatedAt: new Date().toISOString() }
      members = members.map((member) => (member.id === id ? updated : member))
      return updated
    },

    async revokeInvitation(id: string) {
      invitations = invitations.filter((invitation) => invitation.id !== id)
      return { id, status: 'revoked' as const }
    },

    async resendInvitation(id: string) {
      const existing = invitations.find((invitation) => invitation.id === id)
      if (!existing) throw new Error('Invitation not found.')
      return { delivery: { message: '(Demo mode — not persisted.)' } }
    },
  }
}
