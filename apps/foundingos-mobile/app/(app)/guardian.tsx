/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import {
  AgentActionIntelligence,
  CoreOpsApiError,
  fetchAgentActionIntelligence,
} from '../../lib/core-operations-api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import {
  QuantumCard,
  QuantumLoadingScreen,
  QuantumMetric,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  getSemanticColor,
  quantumSpace,
} from '../../components/QuantumUI'

function severityTone(severity: 'watch' | 'material' | 'positive') {
  if (severity === 'material') return 'risk' as const
  if (severity === 'positive') return 'good' as const
  return 'watch' as const
}

export default function GuardianScreen() {
  const [data, setData] = useState<AgentActionIntelligence | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      setData(await fetchAgentActionIntelligence())
    } catch (err) {
      if (err instanceof CoreOpsApiError && err.status === 401) {
        setError('Guardian requires a signed-in session.')
      } else {
        setError('Could not load Guardian. Pull down to try again.')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <QuantumLoadingScreen />

  const materialSignals = data?.emergingSignals.filter((signal) => signal.severity === 'material') ?? []
  const hasIssues = materialSignals.length > 0 || data?.interactions.some((i) => i.severity === 'material')

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
      {data ? (
        <>
          <QuantumNotice tone={hasIssues ? 'danger' : 'success'}>
            {hasIssues
              ? `Guardian detected ${materialSignals.length || data.interactions.length} material issue(s). Review required.`
              : 'Guardian all clear. No material risks in the governed action ledger.'}
          </QuantumNotice>

          <QuantumSectionHeader label="System reliability" />
          <QuantumCard accent={FOUNDINGOS_ACCENT}>
            <View style={styles.metricRow}>
              <QuantumMetric label="Prediction accuracy" value={`${Math.round(data.health.averagePredictionAccuracy * 100)}%`} tone="info" />
              <QuantumMetric label="Assessed outcomes" value={data.health.totalAssessedOutcomes} tone="info" />
              <QuantumMetric label="Active patterns" value={data.health.activePatterns} tone="info" />
            </View>
            <QuantumText variant="caption" color="#7F7F7F">{data.health.narrative}</QuantumText>
            {data.health.recurringDeviation ? (
              <QuantumNotice tone="warning">
                Recurring deviation on {data.health.recurringDeviation.field} ({data.health.recurringDeviation.count}x): {data.health.recurringDeviation.insight}
              </QuantumNotice>
            ) : null}
          </QuantumCard>

          <QuantumSectionHeader label="Emerging signals" />
          {data.emergingSignals.length === 0 ? (
            <QuantumNotice>No emerging signals. Every governed workflow is within expected range.</QuantumNotice>
          ) : (
            data.emergingSignals.map((signal) => (
              <QuantumCard key={signal.id} accent={getSemanticColor(severityTone(signal.severity))}>
                <QuantumText variant="overline" color={getSemanticColor(severityTone(signal.severity))}>{signal.kind.replace(/-/g, ' ')}</QuantumText>
                <QuantumText style={styles.title}>{signal.title}</QuantumText>
                <QuantumText variant="caption">{signal.summary}</QuantumText>
                <QuantumText variant="caption" color="#7F7F7F">Reliability {Math.round(signal.reliability * 100)}% · {signal.outcomeCount} outcomes</QuantumText>
                <QuantumText variant="caption">{signal.advisory}</QuantumText>
              </QuantumCard>
            ))
          )}

          <QuantumSectionHeader label="Cross-action risk interactions" />
          {data.interactions.length === 0 ? (
            <QuantumNotice>No cross-action interactions detected.</QuantumNotice>
          ) : (
            data.interactions.map((interaction) => (
              <QuantumCard key={interaction.id} accent={getSemanticColor(interaction.severity === 'material' ? 'risk' : 'watch')}>
                <QuantumText style={styles.title}>{interaction.actionTitles[0]} ↔ {interaction.actionTitles[1]}</QuantumText>
                <QuantumText variant="caption">{interaction.summary}</QuantumText>
                <QuantumText variant="caption" color="#7F7F7F">{interaction.dimensions.join(' · ')}</QuantumText>
                <QuantumText variant="caption">{interaction.advisory}</QuantumText>
              </QuantumCard>
            ))
          )}

          <QuantumSectionHeader label="Core enforcement — audit trail" />
          {data.auditTrail.slice(0, 10).map((entry) => (
            <Pressable key={entry.id} onPress={() => router.push('/(app)/workflows')}>
              <QuantumCard accent={FOUNDINGOS_ACCENT}>
                <QuantumText style={styles.title}>{entry.actionTitle}</QuantumText>
                <QuantumText variant="caption">{entry.stage.toUpperCase()} · {entry.actor}</QuantumText>
                <QuantumText variant="caption" color="#7F7F7F">{new Date(entry.occurredAt).toLocaleString('en-GB')}</QuantumText>
                <QuantumText variant="caption">{entry.summary}</QuantumText>
              </QuantumCard>
            </Pressable>
          ))}
        </>
      ) : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  metricRow: { flexDirection: 'row', gap: quantumSpace.sm, flexWrap: 'wrap' },
  title: { fontWeight: '600' },
})
