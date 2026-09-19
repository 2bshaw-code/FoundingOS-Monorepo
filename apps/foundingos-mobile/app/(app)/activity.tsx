/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, StyleSheet } from 'react-native'
import {
  CoreOpsApiError,
  EmergingSignal,
  PlatformEvent,
  fetchAgentActionIntelligence,
  fetchEventFeed,
} from '../../lib/core-operations-api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import {
  QuantumCard,
  QuantumLoadingScreen,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
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

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const [feed, intelligence] = await Promise.all([fetchEventFeed(60), fetchAgentActionIntelligence()])
      setEvents(feed)
      setSignals(intelligence.emergingSignals)
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

  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}

      <QuantumSectionHeader label="Emerging signals" />
      {signals.length === 0 && !error ? (
        <QuantumNotice>No emerging signals right now.</QuantumNotice>
      ) : (
        signals.map((signal) => (
          <QuantumCard key={signal.id} accent={getSemanticColor(severityTone(signal.severity))}>
            <QuantumText variant="overline" color={getSemanticColor(severityTone(signal.severity))}>{signal.kind.replace(/-/g, ' ')}</QuantumText>
            <QuantumText style={styles.title}>{signal.title}</QuantumText>
            <QuantumText variant="caption">{signal.summary}</QuantumText>
          </QuantumCard>
        ))
      )}

      <QuantumSectionHeader label="Live event feed" />
      {events.length === 0 && !error ? (
        <QuantumNotice>No activity yet.</QuantumNotice>
      ) : (
        events.map((event) => (
          <QuantumCard key={event.id} accent={FOUNDINGOS_ACCENT}>
            <QuantumText style={styles.title}>{event.type.replace(/[._]/g, ' ')}</QuantumText>
            <QuantumText variant="caption" color="#7F7F7F">{event.source} · {new Date(event.createdAt).toLocaleString('en-GB')}</QuantumText>
            <QuantumText variant="caption">{describeEvent(event)}</QuantumText>
          </QuantumCard>
        ))
      )}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  title: { fontWeight: '600' },
})
