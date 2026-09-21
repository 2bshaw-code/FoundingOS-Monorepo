/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native'
import { getAllOutboxItems } from '../../lib/outbox-sync'
import {
  AgentAction,
  MessagingChannelConnection,
  MessagingParticipant,
  MessagingReadiness,
  fetchMessagingConnections,
  fetchMessagingParticipants,
  fetchMessagingReadiness,
  getSession,
  listAgentActions,
  sendMessagingIntelligenceBrief,
} from '../../lib/core-operations-api'
import {
  QuantumButton,
  QuantumCard,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  quantumColors,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../components/QuantumUI'

function formatParticipant(participant: MessagingParticipant) {
  return participant.displayName ? `${participant.displayName} · ${participant.address}` : participant.address
}

function maskExternalId(value: string) {
  if (value.length <= 4) return value
  return `••••${value.slice(-4)}`
}

export default function AutomationScreen() {
  const theme = useActiveQuantumTheme()
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [readiness, setReadiness] = useState<MessagingReadiness | null>(null)
  const [connections, setConnections] = useState<MessagingChannelConnection[]>([])
  const [participants, setParticipants] = useState<MessagingParticipant[]>([])
  const [actions, setActions] = useState<AgentAction[]>([])
  const [queuedCommands, setQueuedCommands] = useState<Array<{ id: string; actionType: string; brandSlug: string; status: string }>>([])
  const [busyParticipantId, setBusyParticipantId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    const session = await getSession()
    setConnected(Boolean(session))
    if (!session) {
      setLoading(false)
      return
    }
    const [readinessResult, connectionsResult, participantsResult, actionsResult, outboxItems] = await Promise.all([
      fetchMessagingReadiness().catch(() => null),
      fetchMessagingConnections().catch(() => []),
      fetchMessagingParticipants().catch(() => []),
      listAgentActions().catch(() => []),
      getAllOutboxItems(),
    ])
    setReadiness(readinessResult)
    setConnections(connectionsResult)
    setParticipants(participantsResult)
    setActions(actionsResult)
    setQueuedCommands(
      outboxItems
        .filter((item) => item.actionType.startsWith('GOVERNED_ACTION_') || item.actionType.startsWith('WHATSAPP_'))
        .slice(0, 12)
        .map((item) => ({ id: item.id, actionType: item.actionType, brandSlug: item.brandSlug, status: item.status }))
    )
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const actionable = useMemo(
    () => actions.filter((action) => action.status === 'proposed' || action.status === 'approved'),
    [actions]
  )

  const deliverBrief = async (participantId: string) => {
    setBusyParticipantId(participantId)
    try {
      const latestAction = actionable[0]
      const result = await sendMessagingIntelligenceBrief(participantId, latestAction?.id)
      setNotice(result.sent ? 'Intelligence brief handed to WhatsApp delivery.' : 'Delivery was attempted but not confirmed by the provider.')
      await load()
    } catch (error: any) {
      setNotice(error?.message || 'Could not deliver the intelligence brief.')
    } finally {
      setBusyParticipantId(null)
    }
  }

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false) }} tintColor={theme.accent} />}>
      <QuantumCard accent={quantumColors.whatsapp}>
        <QuantumText variant="overline" color={quantumColors.whatsapp}>WhatsApp-native automation</QuantumText>
        <QuantumText variant="h1">Messaging & Automation</QuantumText>
        <QuantumText color={theme.subtextColor}>
          Real channel readiness, real authorized recipients, and governed intelligence brief delivery — without inventing message history the backend does not expose yet.
        </QuantumText>
      </QuantumCard>

      {notice ? <QuantumNotice tone="info">{notice}</QuantumNotice> : null}

      {!connected && !loading ? (
        <View style={{ gap: quantumSpace.sm }}>
          <QuantumNotice tone="warning">Sign in with your Core.Operations account to inspect real messaging readiness.</QuantumNotice>
          <QuantumButton onPress={() => router.push('/')}>Sign in</QuantumButton>
        </View>
      ) : null}

      {loading ? (
        <QuantumCard accent={theme.accent}>
          <ActivityIndicator color={theme.accent} />
        </QuantumCard>
      ) : null}

      {connected && !loading ? (
        <>
          <QuantumCard accent={quantumColors.whatsapp}>
            <View style={styles.metricGrid}>
              <View style={styles.metricBox}>
                <QuantumText variant="caption" color={theme.subtextColor}>Operational</QuantumText>
                <QuantumText variant="h2" color={readiness?.operational ? quantumColors.success : quantumColors.warning}>{readiness?.operational ? 'YES' : 'NO'}</QuantumText>
              </View>
              <View style={styles.metricBox}>
                <QuantumText variant="caption" color={theme.subtextColor}>Connections</QuantumText>
                <QuantumText variant="h2">{readiness?.activeConnections.length ?? 0}</QuantumText>
              </View>
              <View style={styles.metricBox}>
                <QuantumText variant="caption" color={theme.subtextColor}>Recipients</QuantumText>
                <QuantumText variant="h2">{readiness?.authorizedParticipants ?? 0}</QuantumText>
              </View>
            </View>
            <QuantumText variant="caption" color={theme.subtextColor}>
              Failed deliveries 24h: {readiness?.failedDeliveriesLast24Hours ?? 0} · Unrecognized inbound messages 24h: {readiness?.unrecognizedMessagesLast24Hours ?? 0}
            </QuantumText>
            {readiness ? <QuantumText variant="caption" color={theme.subtextColor}>{readiness.dependencyRisk}</QuantumText> : null}
          </QuantumCard>

          <QuantumSectionHeader label="Channel state" />
          {connections.length === 0 ? (
            <QuantumNotice tone="warning">No active messaging connection is configured for this business yet.</QuantumNotice>
          ) : (
            connections.map((connection) => (
              <QuantumCard key={`${connection.channel}-${connection.externalAccountId}`} accent={quantumColors.whatsapp}>
                <View style={styles.rowBetween}>
                  <QuantumText variant="h3">{connection.displayName || connection.channel}</QuantumText>
                  <QuantumText variant="caption" color={connection.active ? quantumColors.success : quantumColors.warning}>{connection.active ? 'ACTIVE' : 'INACTIVE'}</QuantumText>
                </View>
                <QuantumText variant="caption" color={theme.subtextColor}>Account {maskExternalId(connection.externalAccountId)}</QuantumText>
              </QuantumCard>
            ))
          )}

          <QuantumSectionHeader label="Authorized recipients" />
          {participants.length === 0 ? (
            <QuantumNotice tone="warning">No messaging participants have been linked to this tenant yet.</QuantumNotice>
          ) : (
            participants.map((participant) => (
              <QuantumCard key={participant.id} accent={quantumColors.whatsapp}>
                <View style={styles.rowBetween}>
                  <View style={styles.flex}>
                    <QuantumText variant="h3">{formatParticipant(participant)}</QuantumText>
                    <QuantumText variant="caption" color={theme.subtextColor}>{participant.role} · {participant.channel}</QuantumText>
                  </View>
                  <QuantumText variant="caption" color={participant.active ? quantumColors.success : quantumColors.warning}>{participant.active ? 'READY' : 'DISABLED'}</QuantumText>
                </View>
                <QuantumButton
                  onPress={() => deliverBrief(participant.id)}
                  disabled={busyParticipantId === participant.id || !readiness?.operational || !participant.active}
                >
                  {busyParticipantId === participant.id ? 'Sending…' : actionable[0] ? 'Send latest governed brief' : 'Send live intelligence snapshot'}
                </QuantumButton>
              </QuantumCard>
            ))
          )}

          <QuantumSectionHeader label="Governed command bridge" />
          {queuedCommands.length === 0 ? (
            <QuantumNotice>No offline messaging or governed command actions are queued locally right now.</QuantumNotice>
          ) : (
            queuedCommands.map((item) => (
              <QuantumCard key={item.id} accent={item.actionType.startsWith('GOVERNED_ACTION_') ? theme.accent : quantumColors.whatsapp}>
                <View style={styles.rowBetween}>
                  <QuantumText variant="h3" style={styles.flex}>{item.actionType}</QuantumText>
                  <QuantumText variant="caption" color={theme.subtextColor}>{item.status.toUpperCase()}</QuantumText>
                </View>
                <QuantumText variant="caption" color={theme.subtextColor}>{item.brandSlug}</QuantumText>
              </QuantumCard>
            ))
          )}

          {readiness?.webFallbackUrl ? <QuantumNotice tone="info">Web fallback: {readiness.webFallbackUrl}</QuantumNotice> : null}
        </>
      ) : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  flex: { flex: 1 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  metricBox: {
    flex: 1,
    minWidth: 88,
    padding: quantumSpace.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: quantumSpace.xs,
  },
})
