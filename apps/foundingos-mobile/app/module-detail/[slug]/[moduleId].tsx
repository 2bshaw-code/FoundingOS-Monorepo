/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { BRANDS } from '../../../lib/brands'
import { authedFetch } from '../../../lib/api'
import { AIHintBanner } from '../../../components/AIHintBanner'
import { QuantumBackButton } from '../../../components/QuantumBackButton'
import { QuantumButton, QuantumCard, QuantumLoadingScreen, QuantumNotice, QuantumScreen, QuantumSectionHeader, QuantumText, getSemanticColor, quantumSpace } from '../../../components/QuantumUI'

type ModuleMetric = { label: string; value: string; trend?: string; icon?: string; tone?: 'good' | 'watch' | 'risk' }
type ModuleData = { id: string; label: string; description: string; metrics: ModuleMetric[]; actions: string[]; workflow?: string[] }

export default function ModuleDetailScreen() {
  const { slug, moduleId } = useLocalSearchParams<{ slug: string; moduleId: string }>()
  const brand = BRANDS.find((entry) => entry.slug === slug)
  const [data, setData] = useState<ModuleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [confirmedAction, setConfirmedAction] = useState<string | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (!slug || !moduleId) return
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const response = await authedFetch(`https://${slug}-console.foundingos.com/api/console/modules/${moduleId}`)
      if (!response.ok) {
        setError(response.status === 401 ? 'Your session has expired. Please sign in again.' : 'Could not load this module.')
        setData(null)
        return
      }
      const json = await response.json()
      setData(json.module)
    } catch {
      setError('Could not load this module. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [slug, moduleId])

  useEffect(() => {
    load()
  }, [load])

  function handleActionTap(action: string) {
    setConfirmedAction(action)
    setTimeout(() => setConfirmedAction((current) => (current === action ? null : current)), 2500)
  }

  if (!brand) return null
  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={brand.accent} />}>
      <QuantumBackButton label={`‹ ${brand.name}`} fallbackHref={`/brand-detail/${brand.slug}`} />
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : data ? (
        <>
          <QuantumCard accent={brand.accent}>
            <QuantumText variant="overline" color={brand.accent}>{brand.name}</QuantumText>
            <QuantumText variant="h1">{data.label}</QuantumText>
            <QuantumText color="#D8D8D8">{data.description}</QuantumText>
          </QuantumCard>

          <AIHintBanner
            accent={brand.accent}
            description={`${data.label}: ${data.description}`}
            recommendedAction={data.actions[0]?.toLowerCase() ?? 'review this module'}
            onDoThisForMe={() => data.actions[0] && handleActionTap(data.actions[0])}
          />

          <QuantumSectionHeader label="Metrics" />
          <View style={styles.metricGrid}>
            {data.metrics.map((metric) => (
              <QuantumCard key={metric.label} accent={getSemanticColor(metric.tone ?? 'good')} style={styles.metricCard}>
                <QuantumText variant="caption" color="#D8D8D8">{metric.icon ? `${metric.icon} ` : ''}{metric.label}</QuantumText>
                <QuantumText variant="h2">{metric.value}</QuantumText>
                {metric.trend ? <QuantumText variant="caption" color="#7F7F7F">{metric.trend}</QuantumText> : null}
              </QuantumCard>
            ))}
          </View>

          <QuantumSectionHeader label="Quick actions" />
          <View style={styles.grid}>
            {data.actions.map((action) => (
              <QuantumButton key={action} tone={confirmedAction === action ? 'primary' : 'secondary'} onPress={() => handleActionTap(action)}>
                {confirmedAction === action ? `✓ ${action} noted` : action}
              </QuantumButton>
            ))}
          </View>

          {data.workflow?.length ? (
            <>
              <QuantumSectionHeader label="Workflow" />
              {data.workflow.map((step, index) => (
                <QuantumCard key={step} accent={brand.accent}>
                  <View style={styles.workflowRow}>
                    <QuantumText variant="h3" color={brand.accent}>{index + 1}</QuantumText>
                    <QuantumText>{step}</QuantumText>
                  </View>
                </QuantumCard>
              ))}
            </>
          ) : null}
        </>
      ) : (
        <ActivityIndicator color={brand.accent} />
      )}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.md },
  metricCard: { flexGrow: 1, flexBasis: '47%', minWidth: 148 },
  workflowRow: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.md },
})
