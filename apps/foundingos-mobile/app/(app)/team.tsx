/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import {
  CoreOpsApiError,
  PendingInvitation,
  TeamMember,
  TeamRole,
  getSession,
} from '../../lib/core-operations-api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import { ENTRANCE_DURATION_MS, staggerDelay, useReducedMotionPreference } from '../../lib/motion'
import { getTeamService } from '../../lib/services/teamService'
import { useQuantumStore } from '../../lib/store'
import {
  QuantumButton,
  QuantumCard,
  QuantumEmptyState,
  QuantumFormField,
  QuantumNotice,
  QuantumPill,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumSkeletonList,
  QuantumText,
  QuantumTextInput,
  getSemanticColor,
  quantumSpace,
} from '../../components/QuantumUI'

const TEAM_ROLES: TeamRole[] = ['business_owner', 'business_manager', 'business_staff', 'business_viewer']

function roleLabel(role: TeamRole | string) {
  return role.replace('business_', '').replace(/^\w/, (c) => c.toUpperCase())
}

// Only Founder/Owner and Manager roles can view or manage team membership —
// mirrors the backend's requireTenantOwnerAccess guard on every /platform/team route.
// Deliberately NOT expressed via lib/permissions.ts's `manageWorkspace` action:
// that matrix entry requires 'admin' tier only (owner-equivalent), whereas this
// screen's existing, correct behavior also allows 'manager' tier — reusing the
// shared helper here would have silently narrowed who can manage the team.
const MANAGE_ROLES = new Set<string>(['business_owner', 'business_manager'])

export default function TeamScreen() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [canManage, setCanManage] = useState(true)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamRole>('business_staff')
  const [inviting, setInviting] = useState(false)
  const reduceMotion = useReducedMotionPreference()

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      // Demo mode always shows the founder-tier view (manage rights + a
      // realistic small team) so the screen is never blank/403 while demoing.
      if (useQuantumStore.getState().demoMode) {
        setCanManage(true)
        const service = getTeamService()
        const [team, pending] = await Promise.all([service.fetchTeam(), service.fetchPendingInvitations()])
        setMembers(team)
        setInvitations(pending)
        return
      }
      const session = await getSession()
      const isManager = MANAGE_ROLES.has(session?.role || '')
      setCanManage(isManager)
      if (isManager) {
        const service = getTeamService()
        const [team, pending] = await Promise.all([service.fetchTeam(), service.fetchPendingInvitations()])
        setMembers(team)
        setInvitations(pending)
      }
    } catch (err) {
      if (err instanceof CoreOpsApiError && err.status === 403) {
        setCanManage(false)
      } else if (err instanceof CoreOpsApiError && err.status === 401) {
        setError('Team requires a signed-in session.')
      } else {
        setError('Could not load Team. Pull down to try again.')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleInvite = async () => {
    const email = inviteEmail.trim().toLowerCase()
    if (!email || !email.includes('@')) {
      setError('Enter a valid email address to invite.')
      return
    }
    setInviting(true)
    setError('')
    setNotice('')
    try {
      const demoMode = useQuantumStore.getState().demoMode
      const result = await getTeamService().inviteMember({ email, role: inviteRole })
      setNotice(demoMode ? `Invitation sent to ${email}. (Demo mode — not persisted.)` : `Invitation sent to ${email}. ${result.delivery.message}`)
      setInviteEmail('')
      await load()
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not send invitation.')
    } finally {
      setInviting(false)
    }
  }

  const handleRoleChange = async (member: TeamMember, role: TeamRole) => {
    setBusyId(member.id)
    setError('')
    try {
      await getTeamService().updateMember(member.id, { role })
      await load()
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not update role.')
    } finally {
      setBusyId(null)
    }
  }

  const handleToggleActive = async (member: TeamMember) => {
    setBusyId(member.id)
    setError('')
    try {
      await getTeamService().updateMember(member.id, { active: !member.active })
      await load()
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not update access.')
    } finally {
      setBusyId(null)
    }
  }

  const handleRevoke = async (invitation: PendingInvitation) => {
    setBusyId(invitation.id)
    setError('')
    try {
      await getTeamService().revokeInvitation(invitation.id)
      await load()
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not revoke invitation.')
    } finally {
      setBusyId(null)
    }
  }

  const handleResend = async (invitation: PendingInvitation) => {
    setBusyId(invitation.id)
    setError('')
    setNotice('')
    try {
      const demoMode = useQuantumStore.getState().demoMode
      const result = await getTeamService().resendInvitation(invitation.id)
      setNotice(demoMode ? `Invitation re-sent to ${invitation.email}. (Demo mode — not persisted.)` : `Invitation re-sent to ${invitation.email}. ${result.delivery.message}`)
      await load()
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not resend invitation.')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <QuantumScreen>
        <QuantumText variant="overline" color={FOUNDINGOS_ACCENT}>Team & Roles</QuantumText>
        <QuantumText variant="h1">Team</QuantumText>
        <QuantumSkeletonList count={3} />
      </QuantumScreen>
    )
  }

  if (error && !members.length && !invitations.length) {
    return (
      <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
        <QuantumEmptyState glyph="⚠" title="Team is unavailable" subtitle={error} action={<QuantumButton onPress={() => load()}>Try again</QuantumButton>} />
      </QuantumScreen>
    )
  }

  if (!canManage) {
    return (
      <QuantumScreen>
        <QuantumNotice tone="warning">
          Team &amp; roles management is restricted to Founder/Owner and Manager roles. Ask your workspace owner for access.
        </QuantumNotice>
      </QuantumScreen>
    )
  }

  const fade = (index: number) => (reduceMotion ? undefined : FadeInDown.delay(staggerDelay(index)).duration(ENTRANCE_DURATION_MS).springify().damping(18))

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
      {error ? <QuantumNotice tone="danger" onRetry={() => load()}>{error}</QuantumNotice> : null}
      {notice ? <QuantumNotice tone="success">{notice}</QuantumNotice> : null}

      <QuantumSectionHeader label="Invite a team member" />
      <QuantumCard accent={FOUNDINGOS_ACCENT}>
        <QuantumFormField label="Email">
          <QuantumTextInput
            placeholder="teammate@company.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={inviteEmail}
            onChangeText={setInviteEmail}
          />
        </QuantumFormField>
        <QuantumText variant="caption" style={styles.roleLabel}>Role</QuantumText>
        <View style={styles.pillRow}>
          {TEAM_ROLES.map((role) => (
            <QuantumPill key={role} active={inviteRole === role} accent={FOUNDINGOS_ACCENT} onPress={() => setInviteRole(role)}>
              {roleLabel(role)}
            </QuantumPill>
          ))}
        </View>
        <QuantumButton onPress={handleInvite} disabled={inviting}>
          {inviting ? 'Sending…' : 'Send invitation'}
        </QuantumButton>
      </QuantumCard>

      <QuantumSectionHeader label="Pending invitations" />
      {invitations.length === 0 ? (
        <QuantumEmptyState glyph="◇" title="No pending invitations" subtitle="Invitations you send will show up here until they're accepted or revoked." />
      ) : (
        invitations.map((invitation, i) => (
          <Animated.View key={invitation.id} entering={fade(i)}>
            <QuantumCard accent={getSemanticColor('watch')}>
              <QuantumText style={styles.title}>{invitation.email}</QuantumText>
              <QuantumText variant="caption">
                {roleLabel(invitation.role)} · expires {new Date(invitation.expiresAt).toLocaleDateString('en-GB')}
              </QuantumText>
              <View style={styles.actionRow}>
                <QuantumButton tone="secondary" onPress={() => handleResend(invitation)} disabled={busyId === invitation.id}>
                  Resend
                </QuantumButton>
                <QuantumButton tone="danger" onPress={() => handleRevoke(invitation)} disabled={busyId === invitation.id}>
                  Revoke
                </QuantumButton>
              </View>
            </QuantumCard>
          </Animated.View>
        ))
      )}

      <QuantumSectionHeader label="Team members" />
      {members.length === 0 ? (
        <QuantumEmptyState glyph="◇" title="Just you for now" subtitle="No team members yet beyond the founder account. Invite one above." />
      ) : (
        members.map((member, i) => (
          <Animated.View key={member.id} entering={fade(invitations.length + i)}>
          <QuantumCard accent={member.active ? FOUNDINGOS_ACCENT : getSemanticColor('risk')}>
            <QuantumText style={styles.title}>{member.email}</QuantumText>
            <QuantumText variant="caption">
              {roleLabel(member.role)} · {member.active ? 'Active' : 'Suspended'}
            </QuantumText>
            <View style={styles.pillRow}>
              {TEAM_ROLES.map((role) => (
                <QuantumPill
                  key={role}
                  active={member.role === role}
                  accent={FOUNDINGOS_ACCENT}
                  onPress={() => handleRoleChange(member, role)}
                >
                  {roleLabel(role)}
                </QuantumPill>
              ))}
            </View>
            <QuantumButton tone={member.active ? 'danger' : 'secondary'} onPress={() => handleToggleActive(member)} disabled={busyId === member.id}>
              {member.active ? 'Suspend access' : 'Reinstate access'}
            </QuantumButton>
          </QuantumCard>
          </Animated.View>
        ))
      )}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  title: { fontWeight: '600' },
  roleLabel: { marginTop: quantumSpace.sm, marginBottom: quantumSpace.xs },
  pillRow: { flexDirection: 'row', gap: quantumSpace.xs, flexWrap: 'wrap', marginBottom: quantumSpace.sm },
  actionRow: { flexDirection: 'row', gap: quantumSpace.sm, marginTop: quantumSpace.sm },
})
