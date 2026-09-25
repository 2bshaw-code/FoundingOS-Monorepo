/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native'
import { QuantumComparisonBars } from '../../../components/QuantumMiniCharts'
import {
  AgentActionIntelligence,
  fetchAgentActionIntelligence,
  getSession,
} from '../../../lib/core-operations-api'
import {
  QuantumButton,
  QuantumCard,
  QuantumMetric,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  quantumColors,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../../components/QuantumUI'

function formatPence(pence: number | null | undefined): string {
  if (!pence) return '£0'
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function IntelligenceScreen() {
  const theme = useActiveQuantumTheme()
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [summary, setSummary] = useState<AgentActionIntelligence | null>(null)

  const load = useCallback(async () => {
    const session = await getSession()
    setConnected(Boolean(session))
    if (!session) {
      setLoading(false)
      return
    }
    setSummary(await fetchAgentActionIntelligence().catch(() => null))
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <QuantumScreen scroll={false} contentStyle={styles.center}>
        <ActivityIndicator color={theme.accent} />
      </QuantumScreen>
    )
  }

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false) }} tintColor={theme.accent} />}>
      <QuantumCard accent={theme.accent}>
        <QuantumText variant="overline" color={theme.accent}>Core.Intelligence</QuantumText>
        <QuantumText variant="h1">Intelligence Console</QuantumText>
        <QuantumText color={theme.subtextColor}>
          Directly wired to the live Core.Operations intelligence endpoint: accuracy trend, learning momentum, economic value, emerging signals, and the execution audit trail.
        </QuantumText>
      </QuantumCard>

      {!connected ? (
        <View style={{ gap: quantumSpace.sm }}>
          <QuantumNotice tone="warning">Sign in with your Core.Operations account to view live intelligence evidence.</QuantumNotice>
          <QuantumButton onPress={() => router.replace({ pathname: '/', params: { returnTo: '/(app)/(tabs)/intelligence' } })}>Sign in</QuantumButton>
        </View>
      ) : null}

      {connected && summary ? (
        <>
          <View style={styles.metricRow}>
            <QuantumMetric label="Assessed outcomes" value={summary.snapshot.totalAssessedOutcomes} tone="info" />
            <QuantumMetric label="Refined patterns" value={summary.snapshot.refinedPatterns} tone="good" />
            <QuantumMetric label="Interactions" value={summary.snapshot.activeInteractions} tone={summary.snapshot.activeInteractions ? 'watch' : 'good'} />
          </View>

          <QuantumCard accent={theme.accent}>
            <QuantumText variant="h3">Accuracy trend</QuantumText>
            <QuantumText>{summary.snapshot.recentAccuracyTrend.narrative}</QuantumText>
            {summary.snapshot.recentAccuracyTrend.assessmentWindow > 0 ? (
              <QuantumComparisonBars
                current={summary.snapshot.recentAccuracyTrend.current}
                previous={summary.snapshot.recentAccuracyTrend.previous}
                accent={theme.accent}
              />
            ) : (
              <QuantumNotice tone="info">Trend data will appear after assessed outcomes are recorded.</QuantumNotice>
            )}
          </QuantumCard>

          <QuantumCard accent={theme.accent}>
            <QuantumText variant="h3">Learning momentum</QuantumText>
            <View style={styles.rowBetween}>
              <View style={styles.flex}>
                <QuantumText variant="h1">{summary.snapshot.learningMomentum.score}</QuantumText>
                <QuantumText variant="caption" color={theme.accent}>{summary.snapshot.learningMomentum.label.toUpperCase()}</QuantumText>
              </View>
              <View style={styles.flex}>
                <QuantumText>{summary.snapshot.learningMomentum.narrative}</QuantumText>
                <QuantumText variant="caption" color={theme.subtextColor}>{summary.health.narrative}</QuantumText>
              </View>
            </View>
          </QuantumCard>

          <QuantumCard accent={quantumColors.success}>
            <QuantumText variant="h3">Economic value</QuantumText>
            <View style={styles.metricRow}>
              <QuantumMetric label="Cash governed" value={formatPence(summary.snapshot.economicValue.cashGovernedPence)} tone="good" />
              <QuantumMetric label="Cash preserved" value={formatPence(summary.snapshot.economicValue.cashPreservedPence)} tone="good" />
            </View>
            <QuantumText>{summary.snapshot.economicValue.narrative}</QuantumText>
            <QuantumText variant="caption" color={theme.subtextColor}>
              Minutes saved: {summary.snapshot.economicValue.estimatedOperatorMinutesSaved} · Risk-reduced actions: {summary.snapshot.economicValue.riskReducedActions}
            </QuantumText>
          </QuantumCard>

          <QuantumSectionHeader label="Emerging signals" />
          {summary.emergingSignals.length === 0 ? (
            <QuantumNotice tone="info">No emerging signals are published yet. Live signals will appear here once governed outcomes accumulate.</QuantumNotice>
          ) : (
            summary.emergingSignals.map((signal) => (
              <QuantumCard key={signal.id} accent={signal.severity === 'positive' ? quantumColors.success : signal.severity === 'material' ? quantumColors.warning : theme.accent}>
                <View style={styles.rowBetween}>
                  <QuantumText variant="h3" style={styles.flex}>{signal.title}</QuantumText>
                  <QuantumText variant="caption" color={theme.accent}>{signal.reliability}% reliability</QuantumText>
                </View>
                <QuantumText>{signal.summary}</QuantumText>
                {signal.evidence.map((entry) => (
                  <QuantumText key={entry} variant="caption" color={theme.subtextColor}>• {entry}</QuantumText>
                ))}
                <QuantumNotice tone="info">{signal.advisory}</QuantumNotice>
              </QuantumCard>
            ))
          )}

          <QuantumSectionHeader label="Cross-action interactions" />
          {summary.interactions.length === 0 ? (
            <QuantumNotice tone="success">No live cross-action interaction risks are active right now.</QuantumNotice>
          ) : (
            summary.interactions.map((interaction) => (
              <QuantumCard key={interaction.id} accent={interaction.severity === 'material' ? quantumColors.warning : theme.accent}>
                <QuantumText variant="h3">{interaction.summary}</QuantumText>
                {interaction.evidence.map((entry) => (
                  <QuantumText key={entry} variant="caption" color={theme.subtextColor}>• {entry}</QuantumText>
                ))}
                <QuantumNotice tone="info">{interaction.advisory}</QuantumNotice>
              </QuantumCard>
            ))
          )}

          <QuantumSectionHeader label="Execution audit trail" />
          {summary.auditTrail.length === 0 ? (
            <QuantumNotice tone="info">No intelligence audit entries are available yet.</QuantumNotice>
          ) : (
            summary.auditTrail.map((entry) => (
              <QuantumCard key={entry.id} accent={theme.accent}>
                <View style={styles.rowBetween}>
                  <QuantumText variant="h3" style={styles.flex}>{entry.actionTitle}</QuantumText>
                  <QuantumText variant="caption" color={theme.accent}>{entry.stage.toUpperCase()}</QuantumText>
                </View>
                <QuantumText>{entry.summary}</QuantumText>
                <QuantumText variant="caption" color={theme.subtextColor}>{formatRelativeTime(entry.occurredAt)} · {entry.actor}</QuantumText>
                {entry.evidence.map((evidence) => (
                  <QuantumText key={evidence} variant="caption" color={theme.subtextColor}>• {evidence}</QuantumText>
                ))}
              </QuantumCard>
            ))
          )}
        </>
      ) : connected ? (
        <QuantumNotice tone="danger">The live intelligence summary could not be loaded. Pull to refresh.</QuantumNotice>
      ) : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  flex: { flex: 1 },
  metricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
})
