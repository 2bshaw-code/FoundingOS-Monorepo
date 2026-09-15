/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchPipeline, STAGES, STAGE_LABELS, type Candidate, type Stage } from '../../lib/talent-pipeline'
import { getOverrides, type ScannedCandidate } from '../../lib/pipeline-actions'

const STAGE_COLOR: Record<Stage, string> = {
  applied: '#5b6472',
  screening: '#3AA0FF',
  interview: '#FFDD00',
  offer: '#FF8800',
  hired: '#00FF66',
}

type BoardCandidate = Candidate & { rejected?: boolean; scannedFromCv?: boolean }

// LinkedIn/Indeed-style hiring pipeline — real, live, deterministic demo candidate data (see
// lib/talent-pipeline.ts, backed by GET /api/talent/pipeline) grouped into a stage-filtered
// kanban-ish board. Local stage moves/rejections (lib/pipeline-actions.ts) and any candidates
// created by the CV scanner are merged in on-device, since there's no real ATS write-backend
// yet — same honesty pattern used across this app's module-detail screens.
export default function PipelineScreen() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [scanned, setScanned] = useState<ScannedCandidate[]>([])
  const [overrides, setOverrides] = useState<Record<string, Stage | 'rejected'>>({})
  const [activeStage, setActiveStage] = useState<Stage | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const [pipeline, localState] = await Promise.all([fetchPipeline(), getOverrides()])
      if (!pipeline) {
        setError('Could not load the candidate pipeline. Pull down to try again.')
        return
      }
      setCandidates(pipeline.candidates)
      setOverrides(localState.stageOverrides)
      setScanned(localState.scannedCandidates)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const board: BoardCandidate[] = useMemo(() => {
    const fromFeed: BoardCandidate[] = candidates.map((c) => {
      const override = overrides[c.id]
      if (override === 'rejected') return { ...c, rejected: true }
      if (override) return { ...c, stage: override }
      return c
    })
    const fromScans: BoardCandidate[] = scanned.map((c) => {
      const override = overrides[c.id]
      if (override === 'rejected') return { ...c, rejected: true }
      if (override) return { ...c, stage: override }
      return c
    })
    return [...fromScans, ...fromFeed]
  }, [candidates, scanned, overrides])

  const visible = board.filter((c) => !c.rejected && (activeStage === 'all' || c.stage === activeStage))

  const stageCounts = useMemo(() => {
    const counts: Record<Stage, number> = { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0 }
    for (const c of board) {
      if (!c.rejected) counts[c.stage] += 1
    }
    return counts
  }, [board])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Pipeline</Text>
        <Text style={styles.heroSubtitle}>{board.filter((c) => !c.rejected).length} active candidates across {STAGES.length} stages.</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
        <Pressable
          style={[styles.chip, { borderColor: BRAND.accent }, activeStage === 'all' && { backgroundColor: BRAND.accent }]}
          onPress={() => setActiveStage('all')}
        >
          <Text style={[styles.chipText, activeStage === 'all' && { color: '#071014' }]}>All ({board.filter((c) => !c.rejected).length})</Text>
        </Pressable>
        {STAGES.map((stage) => (
          <Pressable
            key={stage}
            style={[styles.chip, { borderColor: STAGE_COLOR[stage] }, activeStage === stage && { backgroundColor: STAGE_COLOR[stage] }]}
            onPress={() => setActiveStage(stage)}
          >
            <Text style={[styles.chipText, activeStage === stage && { color: '#071014' }]}>
              {STAGE_LABELS[stage]} ({stageCounts[stage]})
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.list}>
        {visible.length === 0 ? (
          <Text style={styles.empty}>No candidates in this stage yet.</Text>
        ) : (
          visible.map((candidate) => (
            <Pressable
              key={candidate.id}
              style={styles.card}
              onPress={() => router.push(`/candidate/${candidate.id}`)}
            >
              <View style={styles.cardTop}>
                <View style={[styles.avatar, { borderColor: STAGE_COLOR[candidate.stage] }]}>
                  <Text style={[styles.avatarText, { color: STAGE_COLOR[candidate.stage] }]}>{candidate.name[0]}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>
                    {candidate.name}{candidate.scannedFromCv ? ' 📄' : ''}
                  </Text>
                  <Text style={styles.cardHeadline}>{candidate.headline}</Text>
                </View>
                <View style={styles.matchCol}>
                  <Text style={[styles.matchPct, { color: BRAND.accent }]}>{candidate.matchScorePct}%</Text>
                  <Text style={styles.matchLabel}>match</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <View style={[styles.stagePill, { borderColor: STAGE_COLOR[candidate.stage] }]}>
                  <Text style={[styles.stagePillText, { color: STAGE_COLOR[candidate.stage] }]}>{STAGE_LABELS[candidate.stage]}</Text>
                </View>
                <Text style={styles.cardJob}>{candidate.jobTitle}</Text>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  hero: { marginBottom: 4 },
  heroTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  heroSubtitle: { color: '#b9c2cf', fontSize: 13, marginTop: 4 },
  error: { color: '#ff5470', fontSize: 13 },
  chip: { borderWidth: 1.5, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  chipText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  list: { gap: 10 },
  empty: { color: '#5b6472', fontSize: 13, textAlign: 'center', paddingVertical: 24 },
  card: {
    backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 16, padding: 14, gap: 10,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '800' },
  cardBody: { flex: 1, gap: 2 },
  cardName: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  cardHeadline: { color: '#b9c2cf', fontSize: 12 },
  matchCol: { alignItems: 'flex-end' },
  matchPct: { fontSize: 16, fontWeight: '800' },
  matchLabel: { color: '#5b6472', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stagePill: { borderWidth: 1, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 },
  stagePillText: { fontSize: 11, fontWeight: '700' },
  cardJob: { color: '#5b6472', fontSize: 12, flex: 1 },
})
