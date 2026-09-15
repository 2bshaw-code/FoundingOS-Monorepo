/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import Svg, { Rect } from 'react-native-svg'
import { BRAND } from '../../lib/brand'
import { fetchPipeline, type Job, type Candidate } from '../../lib/talent-pipeline'

// AI-scored job match feed — Indeed/LinkedIn "Jobs for you"-style, ranking open roles by their
// average AI match score against current applicants. There is no real ML scoring model behind
// FoundTalent yet, so matchScorePct is a deterministic demo score generated server-side (see
// GET /api/talent/pipeline, clearly labelled `mode: 'demo'`), not a fabricated random number
// pretending to be real — it's stable, reproducible, and clearly commented as simulated
// everywhere it's used.
function MatchBar({ pct, color }: { pct: number; color: string }) {
  const width = 140
  const height = 8
  const filled = Math.max(4, Math.round((pct / 100) * width))
  return (
    <Svg width={width} height={height}>
      <Rect x={0} y={0} width={width} height={height} rx={4} fill="#242c38" />
      <Rect x={0} y={0} width={filled} height={height} rx={4} fill={color} />
    </Svg>
  )
}

function scoreColor(pct: number): string {
  if (pct >= 80) return '#00FF66'
  if (pct >= 60) return '#FFDD00'
  return '#FF5470'
}

export default function JobMatchScreen() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const pipeline = await fetchPipeline()
      if (!pipeline) {
        setError('Could not load job matches. Pull down to try again.')
        return
      }
      setJobs([...pipeline.jobs].sort((a, b) => b.avgMatchScorePct - a.avgMatchScorePct))
      setCandidates(pipeline.candidates)
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
        <Text style={styles.heroTitle}>Job Match</Text>
        <Text style={styles.heroSubtitle}>AI-scored match between open roles and applicants (demo scoring).</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.list}>
        {jobs.map((job) => {
          const expanded = expandedJobId === job.id
          const topCandidates = candidates
            .filter((c) => c.jobId === job.id)
            .sort((a, b) => b.matchScorePct - a.matchScorePct)
            .slice(0, 5)
          const color = scoreColor(job.avgMatchScorePct)
          return (
            <View key={job.id} style={styles.card}>
              <Pressable style={styles.cardTop} onPress={() => setExpandedJobId(expanded ? null : job.id)}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobMeta}>{job.department} · {job.location} · {job.applicantCount} applicants</Text>
                  <MatchBar pct={job.avgMatchScorePct} color={color} />
                </View>
                <View style={styles.scoreCol}>
                  <Text style={[styles.scoreValue, { color }]}>{job.avgMatchScorePct}%</Text>
                  <Text style={styles.scoreLabel}>avg match</Text>
                </View>
              </Pressable>

              {expanded ? (
                <View style={styles.candidateList}>
                  <Text style={styles.candidateListLabel}>Top matches</Text>
                  {topCandidates.length === 0 ? (
                    <Text style={styles.empty}>No applicants yet.</Text>
                  ) : (
                    topCandidates.map((candidate) => (
                      <Pressable
                        key={candidate.id}
                        style={styles.candidateRow}
                        onPress={() => router.push(`/candidate/${candidate.id}`)}
                      >
                        <Text style={styles.candidateName}>{candidate.name}</Text>
                        <Text style={[styles.candidateScore, { color: scoreColor(candidate.matchScorePct) }]}>{candidate.matchScorePct}%</Text>
                      </Pressable>
                    ))
                  )}
                </View>
              ) : null}
            </View>
          )
        })}
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
  list: { gap: 10 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 16, padding: 14, gap: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  jobTitle: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  jobMeta: { color: '#5b6472', fontSize: 12 },
  scoreCol: { alignItems: 'flex-end' },
  scoreValue: { fontSize: 20, fontWeight: '800' },
  scoreLabel: { color: '#5b6472', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  candidateList: { borderTopWidth: 1, borderTopColor: '#242c38', paddingTop: 10, gap: 8 },
  candidateListLabel: { color: '#5b6472', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  candidateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  candidateName: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  candidateScore: { fontSize: 13, fontWeight: '800' },
  empty: { color: '#5b6472', fontSize: 12 },
})
