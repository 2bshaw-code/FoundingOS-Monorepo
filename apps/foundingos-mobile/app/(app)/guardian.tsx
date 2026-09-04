/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { fetchGuardianStatus, type GuardianStatus } from '../../lib/api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import { explainGuardianWarning } from '../../lib/guardian-ai'
import { useAIAssistance } from '../../lib/ai-assistance'

// Real NATIVE Guardian screen — no browser, no WebView. Pulls the exact same real data the
// web Guardian page reads: a live survey-feed log scan and a real HTTP route-health probe
// across all 8 brand websites (see apps/foundingos-console/app/api/system/guardian/status),
// plus the real hardcoded enforcement flags list. Admin-only.
export default function GuardianScreen() {
  const [aiEnabled] = useAIAssistance()
  const [status, setStatus] = useState<GuardianStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const data = await fetchGuardianStatus()
      if (!data) setError('Guardian requires an admin session.')
      setStatus(data)
    } catch {
      setError('Could not load Guardian. Pull down to try again.')
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
      <View style={styles.center}>
        <ActivityIndicator color={FOUNDINGOS_ACCENT} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 14 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {status ? (
        <>
          <View style={[styles.statusBanner, { borderColor: status.hasIssues ? '#FF0033' : '#00FF66' }]}>
            <Text style={styles.statusText}>
              {status.hasIssues ? 'Guardian detected an issue — please review.' : 'Guardian: all clear'}
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Survey feed warnings</Text>
          {status.surveyWarnings.length === 0 ? (
            <Text style={styles.emptyText}>No warnings — every category has submissions and every route is responding.</Text>
          ) : (
            status.surveyWarnings.map((warning) => {
              const info = aiEnabled ? explainGuardianWarning(warning) : null
              return (
                <View key={warning} style={[styles.card, { borderColor: '#FF0033' }]}>
                  {info ? (
                    <View style={[styles.aiHint, { borderColor: FOUNDINGOS_ACCENT }]}>
                      <View style={[styles.aiBadge, { backgroundColor: FOUNDINGOS_ACCENT }]}><Text style={styles.aiBadgeText}>AI</Text></View>
                      <View style={{ flex: 1, gap: 6 }}>
                        <Text style={styles.aiText}><Text style={styles.aiLabel}>What I noticed: </Text>{info.whatINoticed}</Text>
                        <Text style={styles.aiText}><Text style={styles.aiLabel}>Why it matters: </Text>{info.whyItMatters}</Text>
                        <Text style={styles.aiText}><Text style={styles.aiLabel}>What you can do: </Text>{info.whatYouCanDo}</Text>
                        <Pressable style={[styles.aiCta, { backgroundColor: FOUNDINGOS_ACCENT }]} onPress={() => router.push('/(app)/superdash')}>
                          <Text style={styles.aiCtaText}>Investigate — {info.investigateLabel}</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.cardText}>{warning}</Text>
                  )}
                </View>
              )
            })
          )}

          <Text style={styles.sectionLabel}>Core enforcement</Text>
          {status.coreEnforcement.map((item) => (
            <View key={item} style={[styles.card, { borderColor: FOUNDINGOS_ACCENT }]}>
              <Text style={styles.cardText}>{item}</Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  error: { color: '#ff5470', fontSize: 13 },
  statusBanner: { borderWidth: 1, borderRadius: 14, padding: 16 },
  statusText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  sectionLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 6 },
  emptyText: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 12, padding: 12 },
  cardText: { color: '#ffffff', fontSize: 13 },
  aiHint: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 12, padding: 10, marginTop: 10 },
  aiBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  aiBadgeText: { color: '#071014', fontWeight: '900', fontSize: 10 },
  aiText: { color: '#ffffff', fontSize: 12 },
  aiLabel: { color: '#b9c2cf', fontWeight: '700' },
  aiCta: { alignSelf: 'flex-start', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  aiCtaText: { color: '#071014', fontSize: 11, fontWeight: '700' },
})
