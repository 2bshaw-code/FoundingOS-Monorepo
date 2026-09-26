/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { askFoundAi, type WorkspaceRecordDTO } from '../lib/core-operations-api'
import { coachQuestion, moduleHealth, playbookFor, workspaceExperts } from '../lib/pro-playbooks'
import { QuantumButton, QuantumCard, QuantumText, quantumColors, quantumSpace } from './QuantumUI'

// "What a professional would do here" plus live checks on this module's records, so someone
// new to the job gets the same results as someone who has done it for years.
export function ProCoach({ workspace, moduleId, moduleLabel, statuses, records, accent, onShowStatus }: {
  workspace: string
  moduleId: string
  moduleLabel: string
  statuses: string[]
  records: WorkspaceRecordDTO[]
  accent: string
  onShowStatus: (status: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState('')
  const [asking, setAsking] = useState(false)
  const [standard, ...steps] = playbookFor(moduleId, moduleLabel, statuses)
  const expert = workspaceExperts[workspace] ?? 'senior operator'
  const health = moduleHealth(records.map((record) => ({
    id: record.id,
    status: record.status,
    owner: record.ownerId ?? String(record.data?.owner ?? ''),
    value: record.valuePence == null ? String(record.data?.value ?? '') : String(record.valuePence),
    dueDate: typeof record.data?.dueDate === 'string' ? record.data.dueDate : undefined,
  })), statuses, 'item', records.some((record) => record.valuePence != null))
  const scoreColor = !records.length ? quantumColors.neutral500 : health.score >= 75 ? '#22C55E' : health.score >= 50 ? '#F59E0B' : '#EF4444'
  const fallback = `A ${expert} would focus on:\n1. ${steps[0]}\n2. ${steps[1]}\n3. ${steps[2]}`

  const ask = async () => {
    setAsking(true)
    try {
      const result = await askFoundAi(coachQuestion(workspace, moduleLabel, standard), workspace)
      setAnswer(result?.answer || fallback)
    } catch {
      setAnswer(fallback)
    } finally { setAsking(false) }
  }

  return (
    <QuantumCard accent={accent}>
      <Pressable accessibilityRole="button" onPress={() => setOpen(!open)} style={styles.bar}>
        <View style={[styles.score, { backgroundColor: scoreColor }]}>
          <QuantumText variant="label" style={{ color: '#04111F' }}>{records.length ? `${health.score}%` : '—'}</QuantumText>
        </View>
        <View style={styles.barText}>
          <QuantumText variant="label">Pro standard</QuantumText>
          <QuantumText variant="caption" color={quantumColors.neutral300}>FoundAI as your {expert}</QuantumText>
        </View>
        <QuantumText variant="caption" color={quantumColors.neutral300}>{open ? '▲' : '▼'}</QuantumText>
      </Pressable>
      {open ? (
        <View style={styles.body}>
          <QuantumText variant="overline" color={accent}>What “professional” looks like</QuantumText>
          <QuantumText variant="body">{standard}</QuantumText>
          <QuantumText variant="overline" color={accent}>Every week, a pro will</QuantumText>
          {steps.map((step, index) => <QuantumText key={step} variant="caption" color={quantumColors.neutral300}>{index + 1}.  {step}</QuantumText>)}
          <QuantumText variant="overline" color={accent}>Your {moduleLabel.toLowerCase()} right now</QuantumText>
          {health.checks.map((check) => (
            <View key={check.id} style={styles.check}>
              <QuantumText variant="label" style={{ color: check.ok ? '#22C55E' : '#F59E0B' }}>{check.ok ? '✓' : '!'}</QuantumText>
              <QuantumText variant="caption" style={styles.checkText}>{check.label}</QuantumText>
              {!check.ok && check.id === 'waiting' && statuses[0] ? (
                <Pressable hitSlop={8} onPress={() => onShowStatus(statuses[0])}>
                  <QuantumText variant="caption" color="#38BDF8">Show</QuantumText>
                </Pressable>
              ) : null}
            </View>
          ))}
          <QuantumButton disabled={asking} onPress={() => void ask()}>{asking ? 'FoundAI is looking…' : '✦ What should I do today?'}</QuantumButton>
          {answer ? <QuantumText variant="caption">{answer}</QuantumText> : null}
        </View>
      ) : null}
    </QuantumCard>
  )
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm },
  score: { borderRadius: 6, minWidth: 48, paddingHorizontal: 6, paddingVertical: 4, alignItems: 'center' },
  barText: { flex: 1 },
  body: { gap: quantumSpace.xs, marginTop: quantumSpace.sm },
  check: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm },
  checkText: { flex: 1 },
})
