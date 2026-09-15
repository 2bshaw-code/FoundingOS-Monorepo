/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchPipeline, STAGE_LABELS, type Candidate, type Stage } from '../../lib/talent-pipeline'
import { getOverrides, advanceCandidate, rejectCandidate, nextStage, type ScannedCandidate } from '../../lib/pipeline-actions'

const STAGE_COLOR: Record<Stage, string> = {
  applied: '#5b6472',
  screening: '#3AA0FF',
  interview: '#FFDD00',
  offer: '#FF8800',
  hired: '#00FF66',
}

// Real, working candidate detail + "move to next stage" / "reject" actions. There is no real
// ATS write-backend behind FoundTalent yet, so these actions persist honestly on-device
// (lib/pipeline-actions.ts) rather than faking a call to a backend that doesn't exist — same
// principle as apps/crypto-mobile's paper-trading portfolio and this app's own
// module-detail "✓ {action} noted" pattern.
export default function CandidateDetailScreen() {
  const { candidateId } = useLocalSearchParams<{ candidateId: string }>()
  const [candidate, setCandidate] = useState<(Candidate | ScannedCandidate) | null>(null)
  const [rejected, setRejected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!candidateId) return
    setLoading(true)
    const [pipeline, overrides] = await Promise.all([fetchPipeline(), getOverrides()])
    const fromFeed = pipeline?.candidates.find((c) => c.id === candidateId) ?? null
    const fromScan = overrides.scannedCandidates.find((c) => c.id === candidateId) ?? null
    const base = fromScan ?? fromFeed
    if (base) {
      const override = overrides.stageOverrides[candidateId]
      if (override === 'rejected') {
        setCandidate(base)
        setRejected(true)
      } else if (override) {
        setCandidate({ ...base, stage: override })
        setRejected(false)
      } else {
        setCandidate(base)
        setRejected(false)
      }
    }
    setLoading(false)
  }, [candidateId])

  useEffect(() => {
    load()
  }, [load])

  async function handleAdvance() {
    if (!candidate || busy) return
    setBusy(true)
    const result = await advanceCandidate(candidate.id, candidate.stage)
    setBusy(false)
    if (result.ok) {
      setCandidate({ ...candidate, stage: result.newStage })
      setFeedback(`✓ Moved to ${STAGE_LABELS[result.newStage]}`)
    } else {
      setFeedback(result.error)
    }
    setTimeout(() => setFeedback(''), 2500)
  }

  async function handleReject() {
    if (!candidate || busy) return
    setBusy(true)
    await rejectCandidate(candidate.id, candidate.stage)
    setBusy(false)
    setRejected(true)
    setFeedback('✓ Candidate rejected (noted)')
    setTimeout(() => setFeedback(''), 2500)
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  if (!candidate) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Candidate not found.</Text>
      </View>
    )
  }

  const upcoming = nextStage(candidate.stage)

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingTop: 60, gap: 14 }}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: BRAND.accent }]}>‹ Pipeline</Text>
      </Pressable>

      <View style={styles.hero}>
        <View style={[styles.avatar, { borderColor: STAGE_COLOR[candidate.stage] }]}>
          <Text style={[styles.avatarText, { color: STAGE_COLOR[candidate.stage] }]}>{candidate.name[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {candidate.name}{'scannedFromCv' in candidate && candidate.scannedFromCv ? ' 📄' : ''}
          </Text>
          <Text style={styles.headline}>{candidate.headline}</Text>
        </View>
      </View>

      {'scannedFromCv' in candidate && candidate.scannedFromCv ? (
        <Text style={styles.scanNote}>Added from a scanned CV on this device.</Text>
      ) : null}

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>AI match score (demo)</Text>
          <Text style={[styles.metricValue, { color: BRAND.accent }]}>{candidate.matchScorePct}%</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Experience</Text>
          <Text style={styles.metricValue}>{candidate.yearsExperience === 0 ? 'Entry' : `${candidate.yearsExperience} yrs`}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Applied</Text>
          <Text style={styles.metricValue}>{candidate.appliedDaysAgo === 0 ? 'Today' : `${candidate.appliedDaysAgo}d ago`}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Applying for</Text>
      <Text style={styles.jobTitle}>{candidate.jobTitle}</Text>

      <Text style={styles.sectionLabel}>Skills</Text>
      <View style={styles.skillWrap}>
        {candidate.skills.map((skill) => (
          <View key={skill} style={[styles.skillChip, { borderColor: BRAND.accent }]}>
            <Text style={[styles.skillChipText, { color: BRAND.accent }]}>{skill}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Stage</Text>
      <View style={[styles.stagePill, { borderColor: rejected ? '#FF0033' : STAGE_COLOR[candidate.stage], alignSelf: 'flex-start' }]}>
        <Text style={[styles.stagePillText, { color: rejected ? '#FF0033' : STAGE_COLOR[candidate.stage] }]}>
          {rejected ? 'Rejected' : STAGE_LABELS[candidate.stage]}
        </Text>
      </View>

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

      {!rejected ? (
        <View style={styles.actions}>
          {upcoming ? (
            <Pressable
              disabled={busy}
              style={[styles.actionButton, { backgroundColor: BRAND.accent, opacity: busy ? 0.6 : 1 }]}
              onPress={handleAdvance}
            >
              <Text style={styles.actionButtonText}>Move to {STAGE_LABELS[upcoming]}</Text>
            </Pressable>
          ) : (
            <View style={[styles.actionButton, { backgroundColor: '#00FF66' }]}>
              <Text style={styles.actionButtonText}>🎉 Hired — final stage</Text>
            </View>
          )}
          <Pressable disabled={busy} style={[styles.rejectButton, { borderColor: '#FF0033', opacity: busy ? 0.6 : 1 }]} onPress={handleReject}>
            <Text style={[styles.rejectButtonText, { color: '#FF0033' }]}>Reject candidate</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.rejectedNote}>This candidate was rejected on this device. This is a local note only — it doesn't write back to a real ATS.</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  back: { marginBottom: 4 },
  backText: { fontSize: 15, fontWeight: '700' },
  error: { color: '#ff5470', fontSize: 13 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '800' },
  name: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  headline: { color: '#b9c2cf', fontSize: 13, marginTop: 2 },
  scanNote: { color: '#5b6472', fontSize: 12, fontStyle: 'italic' },
  metricRow: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 14, padding: 12, gap: 4 },
  metricLabel: { color: '#5b6472', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValue: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  sectionLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '600', marginTop: 6 },
  jobTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  skillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  skillChipText: { fontSize: 12, fontWeight: '700' },
  stagePill: { borderWidth: 1.5, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 },
  stagePillText: { fontSize: 13, fontWeight: '800' },
  feedback: { color: '#00FF66', fontSize: 13, fontWeight: '700' },
  actions: { gap: 10, marginTop: 8 },
  actionButton: { borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  actionButtonText: { color: '#071014', fontWeight: '800', fontSize: 15 },
  rejectButton: { borderRadius: 999, borderWidth: 1.5, paddingVertical: 15, alignItems: 'center' },
  rejectButtonText: { fontWeight: '800', fontSize: 14 },
  rejectedNote: { color: '#5b6472', fontSize: 12, marginTop: 8, lineHeight: 18 },
})
