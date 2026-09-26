/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// FoundAI on mobile: the Autopilot card (what FoundAI did, what's waiting for you, approve
// in one tap), "Ask FoundAI" over the business's real records, and the AI post writer.
// All three use the same Core.Operations endpoints as the web workspaces.
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, Share, StyleSheet, TextInput, View } from 'react-native'
import {
  AutopilotState,
  FoundAiAnswer,
  FoundAiPost,
  askFoundAi,
  decideAutopilotApproval,
  fetchAutopilot,
  runAutopilotNow,
  writeFoundAiPost,
} from '../lib/core-operations-api'
import { QuantumButton, QuantumCard, QuantumPill, QuantumText, quantumColors, quantumRadius, quantumSpace } from './QuantumUI'

const FOUNDAI = '#24C47A'
const WORKSPACE_LABEL: Record<string, string> = { retail: 'Retail', logistics: 'Logistics', finance: 'Finance', marketing: 'Marketing', talent: 'Talent', health: 'Health', intelligence: 'Intelligence' }
const money = (pence: number | null) => (pence === null ? '' : `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`)
const ago = (iso: string) => {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`
}
const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString()

function Badge() {
  return <View style={styles.badge}><QuantumText variant="overline" color="#04111f">FoundAI</QuantumText></View>
}

export function FoundAiAutopilotCard({ compact = false, onChanged }: { compact?: boolean; onChanged?: () => void }) {
  const [state, setState] = useState<AutopilotState | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const load = useCallback(async () => {
    try { setState(await fetchAutopilot()); setError('') } catch (cause: any) { setError(cause?.status === 401 ? 'Sign in to see what FoundAI is doing.' : cause?.message || 'FoundAI is unavailable right now.') }
  }, [])
  useEffect(() => { load() }, [load])

  const decide = async (id: string, approve: boolean) => {
    setBusy(id); setNote('')
    try {
      const result = await decideAutopilotApproval(id, approve)
      setNote(approve ? (result.status === 'Approved' ? 'Approved — FoundAI has done it.' : 'That item had already changed, so nothing was done.') : 'Declined. FoundAI won’t do it.')
      await load(); onChanged?.()
    } catch (cause: any) { setNote(cause?.message || 'Could not complete that') } finally { setBusy(null) }
  }
  const runNow = async () => {
    setBusy('run'); setNote('')
    try {
      const result = await runAutopilotNow()
      setNote(result.enabled ? `FoundAI did ${result.executed.length} thing${result.executed.length === 1 ? '' : 's'} and has ${result.queued.length} waiting for you.` : 'Autopilot is switched off in your rules.')
      await load(); onChanged?.()
    } catch (cause: any) { setNote(cause?.message || 'FoundAI could not run') } finally { setBusy(null) }
  }

  const pending = state?.approvals.filter((item) => item.status === 'Pending') ?? []
  const doneToday = state?.activity.filter((item) => isToday(item.createdAt)).length ?? 0
  const recent = state?.activity.slice(0, compact ? 3 : 8) ?? []

  return (
    <QuantumCard accent={FOUNDAI}>
      <View style={styles.row}>
        <Badge />
        <QuantumText variant="overline" color={FOUNDAI}>Autopilot {state ? (state.policy.enabled ? '· on' : '· off') : ''}</QuantumText>
      </View>
      <QuantumText variant="h3">{state ? `${doneToday} done today · ${pending.length} waiting for you` : 'FoundAI runs your business'}</QuantumText>
      <QuantumText variant="caption" color={quantumColors.neutral200}>
        FoundAI does routine work itself — invoices, reminders, reorders, rebookings, posts — and only asks you about refunds, big spends, people and regulated decisions.
      </QuantumText>
      {!state && !error ? <ActivityIndicator color={FOUNDAI} style={{ marginTop: quantumSpace.md }} /> : null}
      {error ? <QuantumText variant="caption" color={quantumColors.warning}>{error}</QuantumText> : null}
      {note ? <QuantumText variant="caption" color={FOUNDAI}>{note}</QuantumText> : null}

      {pending.length ? <QuantumText variant="overline" color={quantumColors.warning} style={styles.section}>Needs you</QuantumText> : null}
      {pending.slice(0, compact ? 3 : 20).map((item) => (
        <View key={item.id} style={[styles.item, styles.ask]}>
          <QuantumText variant="caption" color="#38BDF8">{WORKSPACE_LABEL[item.decision.workspace] ?? item.decision.workspace}</QuantumText>
          <QuantumText variant="label">{item.decision.action}: {item.decision.recordName}{item.decision.valuePence ? ` · ${money(item.decision.valuePence)}` : ''}</QuantumText>
          <QuantumText variant="caption" color={quantumColors.neutral200}>{item.decision.reason}</QuantumText>
          <View style={styles.buttons}>
            <QuantumButton disabled={busy !== null} onPress={() => decide(item.id, true)} style={styles.button}>{busy === item.id ? '…' : 'Approve'}</QuantumButton>
            <QuantumButton disabled={busy !== null} onPress={() => decide(item.id, false)} tone="secondary" style={styles.button}>Decline</QuantumButton>
          </View>
        </View>
      ))}

      {recent.length ? <QuantumText variant="overline" color={quantumColors.neutral300} style={styles.section}>What FoundAI did</QuantumText> : null}
      {recent.map((item) => {
        const via = item.decision.sent ? ` — ${item.decision.sent.channel === 'email' ? 'emailed' : 'WhatsApp sent'} to ${item.decision.sent.to}` : item.decision.posted ? ` — posted to ${item.decision.posted.channel}` : ''
        return (
          <View key={item.id} style={styles.item}>
            <QuantumText variant="caption" color={FOUNDAI}>✓ {WORKSPACE_LABEL[item.decision.workspace] ?? item.decision.workspace} · {ago(item.createdAt)}{item.decision.approvedBy ? ' · you approved' : ''}</QuantumText>
            <QuantumText variant="body">{item.decision.action}: {item.decision.recordName}{via}</QuantumText>
          </View>
        )
      })}
      {state && !recent.length && !pending.length ? <QuantumText variant="caption" color={quantumColors.neutral200} style={styles.section}>Nothing to do yet. FoundAI checks every hour and whenever you open a workspace.</QuantumText> : null}

      {state ? <QuantumButton disabled={busy !== null} onPress={runNow} tone="ghost" style={styles.section}>{busy === 'run' ? 'FoundAI is working…' : 'Run FoundAI now'}</QuantumButton> : null}
    </QuantumCard>
  )
}

const SUGGESTIONS = ['What needs my attention today?', 'Who owes me money?', 'What stock is running low?', 'How did sales do this week?']

export function AskFoundAiCard({ workspace }: { workspace?: string }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<FoundAiAnswer | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const ask = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setQuestion(trimmed); setBusy(true); setError(''); setAnswer(null)
    try { setAnswer(await askFoundAi(trimmed, workspace)) } catch (cause: any) { setError(cause?.message || 'FoundAI could not answer that') } finally { setBusy(false) }
  }
  return (
    <QuantumCard accent="#38BDF8">
      <View style={styles.row}><Badge /><QuantumText variant="overline" color="#38BDF8">Ask FoundAI</QuantumText></View>
      <QuantumText variant="caption" color={quantumColors.neutral200}>Answers come from your real customers, orders, invoices, stock and messages.</QuantumText>
      <View style={styles.inputRow}>
        <TextInput
          onChangeText={setQuestion}
          onSubmitEditing={() => ask(question)}
          placeholder="Ask anything about your business…"
          placeholderTextColor={quantumColors.neutral300}
          returnKeyType="send"
          style={styles.input}
          value={question}
        />
        <Pressable disabled={busy} onPress={() => ask(question)} style={styles.send}><QuantumText variant="label" color="#04111f">{busy ? '…' : 'Ask'}</QuantumText></Pressable>
      </View>
      {!answer && !busy ? <View style={styles.pills}>{SUGGESTIONS.map((item) => <QuantumPill key={item} onPress={() => ask(item)}>{item}</QuantumPill>)}</View> : null}
      {busy ? <ActivityIndicator color="#38BDF8" style={{ marginTop: quantumSpace.md }} /> : null}
      {error ? <QuantumText variant="caption" color={quantumColors.warning}>{error}</QuantumText> : null}
      {answer ? (
        <View style={styles.answer}>
          <QuantumText variant="body">{answer.answer}</QuantumText>
          {answer.suggestedActions.length ? <QuantumText variant="caption" color={FOUNDAI}>{answer.suggestedActions.map((item) => `→ ${item}`).join('\n')}</QuantumText> : null}
          {answer.citations.length ? <QuantumText variant="caption" color={quantumColors.neutral300}>From: {answer.citations.map((item) => item.name || item.reference).slice(0, 4).join(', ')}</QuantumText> : null}
        </View>
      ) : null}
    </QuantumCard>
  )
}

const FORMATS = ['Social post', 'Email', 'Ad copy']
const CHANNELS = ['Instagram', 'Facebook', 'LinkedIn']
const TONES = ['Professional', 'Playful', 'Bold']

export function FoundAiPostWriter() {
  const [topic, setTopic] = useState('')
  const [type, setType] = useState(FORMATS[0])
  const [platform, setPlatform] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [post, setPost] = useState<FoundAiPost | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const write = async () => {
    setBusy(true); setError('')
    try { setPost(await writeFoundAiPost({ topic, type, tone, platform, previous: post?.headline })) } catch (cause: any) { setError(cause?.message || 'FoundAI could not write that') } finally { setBusy(false) }
  }
  const text = post ? [post.headline, post.body, post.hashtags.join(' ')].filter(Boolean).join('\n\n') : ''
  return (
    <QuantumCard accent="#EC4899">
      <View style={styles.row}><Badge /><QuantumText variant="overline" color="#EC4899">Write with FoundAI</QuantumText></View>
      <QuantumText variant="caption" color={quantumColors.neutral200}>FoundAI writes posts in your brand voice using your real products and offers.</QuantumText>
      <TextInput onChangeText={setTopic} placeholder="What are you promoting? e.g. the autumn menu" placeholderTextColor={quantumColors.neutral300} style={[styles.input, styles.fullInput]} value={topic} />
      <View style={styles.pills}>{FORMATS.map((item) => <QuantumPill accent="#EC4899" active={type === item} key={item} onPress={() => setType(item)}>{item}</QuantumPill>)}</View>
      {type === 'Social post' ? <View style={styles.pills}>{CHANNELS.map((item) => <QuantumPill accent="#EC4899" active={platform === item} key={item} onPress={() => setPlatform(item)}>{item}</QuantumPill>)}</View> : null}
      <View style={styles.pills}>{TONES.map((item) => <QuantumPill accent="#EC4899" active={tone === item} key={item} onPress={() => setTone(item)}>{item}</QuantumPill>)}</View>
      <QuantumButton disabled={busy || !topic.trim()} onPress={write} style={styles.section}>{busy ? 'FoundAI is writing…' : post ? 'Write another version' : '✨ Write with FoundAI'}</QuantumButton>
      {error ? <QuantumText variant="caption" color={quantumColors.warning}>{error}</QuantumText> : null}
      {post ? (
        <View style={styles.answer}>
          <QuantumText variant="label">{post.headline}</QuantumText>
          <QuantumText variant="body">{post.body}</QuantumText>
          {post.hashtags.length ? <QuantumText variant="caption" color="#EC4899">{post.hashtags.join(' ')}</QuantumText> : null}
          <QuantumText variant="caption" color={FOUNDAI}>{post.cta}</QuantumText>
          {post.imageIdea ? <QuantumText variant="caption" color={quantumColors.neutral300}>Image idea: {post.imageIdea}</QuantumText> : null}
          <QuantumButton onPress={() => { void Share.share({ message: text }) }} tone="secondary">Share / post it</QuantumButton>
        </View>
      ) : null}
    </QuantumCard>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm, marginBottom: quantumSpace.xs },
  badge: { backgroundColor: FOUNDAI, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  section: { marginTop: quantumSpace.md },
  item: { marginTop: quantumSpace.sm, padding: quantumSpace.md, borderRadius: quantumRadius.md, backgroundColor: 'rgba(148,163,184,0.08)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.14)', gap: 2 },
  ask: { borderColor: 'rgba(255,209,102,0.55)', backgroundColor: 'rgba(255,209,102,0.08)' },
  buttons: { flexDirection: 'row', gap: quantumSpace.sm, marginTop: quantumSpace.sm },
  button: { flex: 1 },
  inputRow: { flexDirection: 'row', gap: quantumSpace.sm, marginTop: quantumSpace.md },
  input: { flex: 1, minHeight: 46, borderRadius: quantumRadius.md, borderWidth: 1, borderColor: 'rgba(148,163,184,0.3)', backgroundColor: 'rgba(2,6,23,0.35)', color: '#ffffff', paddingHorizontal: quantumSpace.md, fontSize: 16 },
  fullInput: { flex: 0, marginTop: quantumSpace.md },
  send: { backgroundColor: '#38BDF8', borderRadius: quantumRadius.md, paddingHorizontal: quantumSpace.lg, justifyContent: 'center' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm, marginTop: quantumSpace.sm },
  answer: { marginTop: quantumSpace.md, gap: quantumSpace.sm, padding: quantumSpace.md, borderRadius: quantumRadius.md, backgroundColor: 'rgba(56,189,248,0.08)' },
})
