/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, StyleSheet } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { CoreOpsApiError, EmergingSignal, PlatformEvent } from '../../lib/core-operations-api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import { ENTRANCE_DURATION_MS, staggerDelay, useReducedMotionPreference } from '../../lib/motion'
import { getActivityService } from '../../lib/services/activityService'
import {
  QuantumButton,
  QuantumCard,
  QuantumEmptyState,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumSkeletonList,
  QuantumText,
  getSemanticColor,
} from '../../components/QuantumUI'

function severityTone(severity: EmergingSignal['severity']) {
  if (severity === 'material') return 'risk' as const
  if (severity === 'positive') return 'good' as const
  return 'watch' as const
}

function describeEvent(event: PlatformEvent): string {
  const parts = Object.entries(event.payload ?? {})
    .slice(0, 3)
    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
  return parts.join(' · ') || 'No additional detail recorded.'
}

export default function ActivityScreen() {
  const [events, setEvents] = useState<PlatformEvent[]>([])
  const [signals, setSignals] = useState<EmergingSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const reduceMotion = useReducedMotionPreference()

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const { events: nextEvents, signals: nextSignals } = await getActivityService().fetchActivity(60)
      setEvents(nextEvents)
      setSignals(nextSignals)
    } catch (err) {
      if (err instanceof CoreOpsApiError && err.status === 401) {
        setError('Live activity requires a signed-in session.')
      } else {
        setError('Could not load live activity. Pull down to try again.')
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
        <QuantumText variant="overline" color={FOUNDINGOS_ACCENT}>Live Activity</QuantumText>
        <QuantumSkeletonList count={4} />
      </QuantumScreen>
    )
  }

  if (error && events.length === 0 && signals.length === 0) {
    return (
      <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
        <QuantumEmptyState glyph="⚠" title="Activity is unavailable" subtitle={error} action={<QuantumButton onPress={() => load()}>Try again</QuantumButton>} />
      </QuantumScreen>
    )
  }

  const fade = (index: number) => (reduceMotion ? undefined : FadeInDown.delay(staggerDelay(index)).duration(ENTRANCE_DURATION_MS).springify().damping(18))

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
      {error ? <QuantumNotice tone="danger" onRetry={() => load()}>{error}</QuantumNotice> : null}

      <QuantumSectionHeader label="Emerging signals" />
      {signals.length === 0 && !error ? (
        <QuantumEmptyState glyph="◇" title="No emerging signals" subtitle="Signals surface here once the system detects a recurring pattern or risk." />
      ) : (
        signals.map((signal, i) => (
          <Animated.View key={signal.id} entering={fade(i)}>
            <QuantumCard accent={getSemanticColor(severityTone(signal.severity))}>
              <QuantumText variant="overline" color={getSemanticColor(severityTone(signal.severity))}>{signal.kind.replace(/-/g, ' ')}</QuantumText>
              <QuantumText style={styles.title}>{signal.title}</QuantumText>
              <QuantumText variant="caption">{signal.summary}</QuantumText>
            </QuantumCard>
          </Animated.View>
        ))
      )}

      <QuantumSectionHeader label="Live event feed" />
      {events.length === 0 && !error ? (
        <QuantumEmptyState glyph="⌕" title="No activity yet" subtitle="Actions, deliveries, and deal changes will appear here as they happen." />
      ) : (
        events.map((event, i) => (
          <Animated.View key={event.id} entering={fade(signals.length + i)}>
            <QuantumCard accent={FOUNDINGOS_ACCENT}>
              <QuantumText style={styles.title}>{event.type.replace(/[._]/g, ' ')}</QuantumText>
              <QuantumText variant="caption">{event.source} · {new Date(event.createdAt).toLocaleString('en-GB')}</QuantumText>
              <QuantumText variant="caption">{describeEvent(event)}</QuantumText>
            </QuantumCard>
          </Animated.View>
        ))
      )}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  title: { fontWeight: '600' },
})
