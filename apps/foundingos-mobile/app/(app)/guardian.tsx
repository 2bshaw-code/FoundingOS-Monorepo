/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'
import {
  AgentActionIntelligence,
  CoreOpsApiError,
} from '../../lib/core-operations-api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import { ENTRANCE_DURATION_MS, staggerDelay, useReducedMotionPreference } from '../../lib/motion'
import { getGuardianService } from '../../lib/services/guardianService'
import {
  QuantumButton,
  QuantumCard,
  QuantumConfidenceBar,
  QuantumEmptyState,
  QuantumMetric,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumSkeletonList,
  QuantumText,
  getSemanticColor,
  quantumColors,
  quantumSpace,
} from '../../components/QuantumUI'

function severityTone(severity: 'watch' | 'material' | 'positive') {
  if (severity === 'material') return 'risk' as const
  if (severity === 'positive') return 'good' as const
  return 'watch' as const
}

function momentumTone(label: 'establishing' | 'building' | 'compounding') {
  if (label === 'compounding') return 'good' as const
  if (label === 'building') return 'info' as const
  return 'watch' as const
}

function formatPence(pence: number): string {
  return `£${Math.round(pence / 100).toLocaleString('en-GB')}`
}

export default function GuardianScreen() {
  const [data, setData] = useState<AgentActionIntelligence | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const reduceMotion = useReducedMotionPreference()

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      setData(await getGuardianService().fetchIntelligence())
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

  if (loading) {
    return (
      <QuantumScreen>
        <QuantumText variant="overline" color={quantumColors.neutral300}>Decision intelligence</QuantumText>
        <QuantumText variant="h2">Guardian</QuantumText>
        <QuantumSkeletonList count={4} />
      </QuantumScreen>
    )
  }

  if (error && !data) {
    return (
      <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
        <QuantumEmptyState
          glyph="⚠"
          title="Guardian is unavailable"
          subtitle={error}
          action={<QuantumButton onPress={() => load()}>Try again</QuantumButton>}
        />
      </QuantumScreen>
    )
  }

  const materialSignals = data?.emergingSignals.filter((signal) => signal.severity === 'material') ?? []
  const hasIssues = materialSignals.length > 0 || data?.interactions.some((i) => i.severity === 'material')
  const momentum = data?.snapshot.learningMomentum
  const trend = data?.snapshot.recentAccuracyTrend
  const value = data?.snapshot.economicValue

  const fade = (index: number) => (reduceMotion ? undefined : FadeInDown.delay(staggerDelay(index)).duration(ENTRANCE_DURATION_MS).springify().damping(18))

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
      {error ? <QuantumNotice tone="danger" onRetry={() => load()}>{error}</QuantumNotice> : null}
      {data ? (
        <>
          {/* Executive hero — a single, high-hierarchy verdict + confidence bars,
              standing in for the plain text-only status that used to open this
              screen. This is the first thing a founder or buyer should see. */}
          <Animated.View entering={fade(0)}>
            <QuantumCard accent={hasIssues ? getSemanticColor('risk') : getSemanticColor('good')} elevated>
              <QuantumText variant="overline" color={getSemanticColor(hasIssues ? 'risk' : 'good')}>
                {hasIssues ? 'Review required' : 'All clear'}
              </QuantumText>
              <QuantumText variant="h2">
                {hasIssues
                  ? `${materialSignals.length || data.interactions.length} material issue(s) detected`
                  : 'No material risks in the governed action ledger'}
              </QuantumText>
              <View style={styles.heroBars}>
                <QuantumConfidenceBar
                  label="Prediction accuracy"
                  percent={data.health.averagePredictionAccuracy * 100}
                  tone={data.health.averagePredictionAccuracy >= 0.75 ? 'good' : data.health.averagePredictionAccuracy >= 0.5 ? 'watch' : 'risk'}
                />
                {momentum ? (
                  <QuantumConfidenceBar label={`Learning momentum · ${momentum.label}`} percent={momentum.score * 100} tone={momentumTone(momentum.label)} />
                ) : null}
              </View>
              <QuantumText variant="caption" color={quantumColors.neutral300}>{data.health.narrative}</QuantumText>
              {trend ? (
                <QuantumText variant="caption" color={quantumColors.neutral300}>
                  {trend.narrative}
                </QuantumText>
              ) : null}
              {data.health.recurringDeviation ? (
                <QuantumNotice tone="warning">
                  Recurring deviation on {data.health.recurringDeviation.field} ({data.health.recurringDeviation.count}x): {data.health.recurringDeviation.insight}
                </QuantumNotice>
              ) : null}
            </QuantumCard>
          </Animated.View>

          <QuantumSectionHeader label="System reliability" />
          <Animated.View entering={fade(1)}>
            <QuantumCard accent={FOUNDINGOS_ACCENT}>
              <View style={styles.metricRow}>
                <QuantumMetric label="Assessed outcomes" value={data.health.totalAssessedOutcomes} tone="info" />
                <QuantumMetric label="Refined patterns" value={data.health.refinedPatterns} tone="info" />
                <QuantumMetric label="Active patterns" value={data.health.activePatterns} tone="info" />
              </View>
            </QuantumCard>
          </Animated.View>

          {value ? (
            <>
              <QuantumSectionHeader label="Economic value governed" />
              <Animated.View entering={fade(2)}>
                <QuantumCard accent={getSemanticColor('good')}>
                  <View style={styles.metricRow}>
                    <QuantumMetric label="Cash preserved" value={formatPence(value.cashPreservedPence)} tone="good" />
                    <QuantumMetric label="Cash governed" value={formatPence(value.cashGovernedPence)} tone="info" />
                    <QuantumMetric label="Minutes saved" value={value.estimatedOperatorMinutesSaved} tone="info" />
                  </View>
                  <QuantumText variant="caption" color={quantumColors.neutral300}>{value.narrative}</QuantumText>
                </QuantumCard>
              </Animated.View>
            </>
          ) : null}

          <QuantumSectionHeader label="Emerging signals" />
          {data.emergingSignals.length === 0 ? (
            <QuantumEmptyState glyph="◇" title="No emerging signals" subtitle="Every governed workflow is within expected range." />
          ) : (
            data.emergingSignals.map((signal, i) => (
              <Animated.View key={signal.id} entering={fade(3 + i)}>
                <QuantumCard accent={getSemanticColor(severityTone(signal.severity))}>
                  <QuantumText variant="overline" color={getSemanticColor(severityTone(signal.severity))}>{signal.kind.replace(/-/g, ' ')}</QuantumText>
                  <QuantumText style={styles.title}>{signal.title}</QuantumText>
                  <QuantumText variant="caption" color={quantumColors.neutral300}>{signal.summary}</QuantumText>
                  <QuantumConfidenceBar label={`Reliability · ${signal.outcomeCount} outcomes`} percent={signal.reliability * 100} tone={severityTone(signal.severity)} />
                  <QuantumText variant="caption" color={quantumColors.neutral300}>{signal.advisory}</QuantumText>
                </QuantumCard>
              </Animated.View>
            ))
          )}

          <QuantumSectionHeader label="Cross-action risk interactions" />
          {data.interactions.length === 0 ? (
            <QuantumEmptyState glyph="◇" title="No cross-action interactions" subtitle="Nothing has been detected across the governed action ledger." />
          ) : (
            data.interactions.map((interaction, i) => (
              <Animated.View key={interaction.id} entering={fade(i)}>
                <QuantumCard accent={getSemanticColor(interaction.severity === 'material' ? 'risk' : 'watch')}>
                  <QuantumText style={styles.title}>{interaction.actionTitles[0]} ↔ {interaction.actionTitles[1]}</QuantumText>
                  <QuantumText variant="caption" color={quantumColors.neutral300}>{interaction.summary}</QuantumText>
                  <QuantumText variant="caption" color={quantumColors.neutral500}>{interaction.dimensions.join(' · ')}</QuantumText>
                  <QuantumText variant="caption" color={quantumColors.neutral300}>{interaction.advisory}</QuantumText>
                </QuantumCard>
              </Animated.View>
            ))
          )}

          <QuantumSectionHeader label="Core enforcement — audit trail" />
          {data.auditTrail.length === 0 ? (
            <QuantumEmptyState glyph="◇" title="No audit entries yet" subtitle="Approved and executed actions will appear here." />
          ) : (
            data.auditTrail.slice(0, 10).map((entry, i) => (
              <Animated.View key={entry.id} entering={fade(i)}>
                <Pressable onPress={() => router.push('/(app)/workflows')}>
                  <QuantumCard accent={FOUNDINGOS_ACCENT}>
                    <QuantumText style={styles.title}>{entry.actionTitle}</QuantumText>
                    <QuantumText variant="caption" color={quantumColors.neutral300}>{entry.stage.toUpperCase()} · {entry.actor}</QuantumText>
                    <QuantumText variant="caption" color={quantumColors.neutral500}>{new Date(entry.occurredAt).toLocaleString('en-GB')}</QuantumText>
                    <QuantumText variant="caption" color={quantumColors.neutral300}>{entry.summary}</QuantumText>
                  </QuantumCard>
                </Pressable>
              </Animated.View>
            ))
          )}
        </>
      ) : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  metricRow: { flexDirection: 'row', gap: quantumSpace.sm, flexWrap: 'wrap' },
  heroBars: { gap: quantumSpace.sm, marginTop: quantumSpace.sm, marginBottom: quantumSpace.xs },
  title: { fontWeight: '600' },
})
