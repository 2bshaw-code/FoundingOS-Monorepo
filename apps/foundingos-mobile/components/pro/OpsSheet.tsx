/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// App rendering of the specialist operational tools (HR, Talent, Logistics, Health, Retail ops,
// Intelligence). Same schemas and analysis as the web workspaces.
import { useEffect, useMemo, useState } from 'react'
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native'
import { opsPatch, readOps, str, type OpsField, type OpsRecordLike, type OpsSchema, type OpsTone, type OpsValues } from '@foundingos/ui/pro/ops'
import { QuantumButton, QuantumCard, QuantumPill, QuantumText, QuantumTextInput, getSemanticColor, quantumColors, quantumSpace, useActiveQuantumTheme } from '../QuantumUI'
import { saveProPatch } from '../../lib/pro-records'
import type { WorkspaceRecordDTO } from '../../lib/core-operations-api'

const text = (value: unknown) => (typeof value === 'string' ? value : '')
export const opsRecordFromDto = (record: WorkspaceRecordDTO): OpsRecordLike => {
  const data = (record.data || {}) as Record<string, unknown>
  return { id: record.id, name: record.name, secondary: text(data.secondary), status: record.status, owner: text(data.owner), dueDate: text(data.dueDate) || undefined, valuePence: record.valuePence ?? null, data }
}
const toneColor = (tone?: OpsTone) => (tone ? getSemanticColor(tone) : quantumColors.neutral200)

export function OpsInsightsCard({ schema, records, statuses, accent, onOpen }: { schema: OpsSchema; records: WorkspaceRecordDTO[]; statuses: string[]; accent: string; onOpen: (id: string) => void }) {
  const theme = useActiveQuantumTheme()
  const insight = useMemo(() => schema.insights(records.filter((record) => !record.id.startsWith('temp-')).map((record) => { const like = opsRecordFromDto(record); return { record: like, v: readOps(like, schema) } }), { statuses }), [records, schema, statuses])
  const [open, setOpen] = useState(false)
  if (!records.length) return null
  return (
    <QuantumCard accent={accent}>
      <Pressable onPress={() => setOpen((value) => !value)} style={styles.headRow}>
        <View style={{ flex: 1 }}>
          <QuantumText variant="overline" color={accent}>Specialist view</QuantumText>
          <QuantumText variant="label">{schema.title} analysis</QuantumText>
        </View>
        <QuantumText variant="caption" color={quantumColors.neutral300}>{open ? 'Hide ▲' : 'Show ▼'}</QuantumText>
      </Pressable>
      <View style={styles.kpis}>
        {insight.kpis.slice(0, open ? 8 : 4).map((kpi) => (
          <View key={kpi.label} style={[styles.kpi, { borderColor: kpi.tone && kpi.tone !== 'info' ? toneColor(kpi.tone) : theme.borderColor }]}>
            <QuantumText variant="caption" color={quantumColors.neutral300} numberOfLines={2}>{kpi.label}</QuantumText>
            <QuantumText variant="label">{kpi.value}</QuantumText>
          </View>
        ))}
      </View>
      {insight.alerts.slice(0, open ? 6 : 2).map((alert, index) => (
        <Pressable key={index} disabled={!alert.recordId} onPress={() => alert.recordId && onOpen(alert.recordId)} style={[styles.alert, { borderLeftColor: toneColor(alert.tone) }]}>
          <QuantumText variant="caption" style={{ flex: 1 }}>{alert.text}</QuantumText>
          {alert.recordId ? <QuantumText variant="caption" color={accent}>Open ›</QuantumText> : null}
        </Pressable>
      ))}
      {!insight.alerts.length ? <QuantumText variant="caption" color={quantumColors.success}>✓ Nothing needs attention.</QuantumText> : null}
      {open ? insight.bars.filter((bar) => bar.items.length).map((bar) => {
        const max = Math.max(1, ...bar.items.map((item) => item.value))
        return (
          <View key={bar.title} style={{ gap: 4, marginTop: quantumSpace.sm }}>
            <QuantumText variant="caption" color={quantumColors.neutral300}>{bar.title}</QuantumText>
            {bar.items.slice(0, 6).map((item) => (
              <View key={item.label} style={styles.barRow}>
                <QuantumText variant="caption" numberOfLines={1} style={{ width: '38%' }}>{item.label}</QuantumText>
                <View style={styles.barTrack}><View style={[styles.barFill, { width: `${Math.max(3, (item.value / max) * 100)}%`, backgroundColor: accent }]} /></View>
                <QuantumText variant="caption">{item.display}</QuantumText>
              </View>
            ))}
          </View>
        )
      }) : null}
      {open ? insight.tables.filter((table) => table.rows.length).map((table) => (
        <View key={table.title} style={{ gap: 4, marginTop: quantumSpace.sm }}>
          <QuantumText variant="caption" color={quantumColors.neutral300}>{table.title}</QuantumText>
          {table.rows.slice(0, 8).map((row, index) => (
            <View key={index} style={[styles.tableRow, { borderBottomColor: theme.borderColor }]}>
              <QuantumText variant="caption" numberOfLines={1} style={{ flex: 1 }}>{row[0]}</QuantumText>
              <QuantumText variant="caption" color={quantumColors.neutral300} numberOfLines={1}>{row.slice(1).join(' · ')}</QuantumText>
            </View>
          ))}
        </View>
      )) : null}
    </QuantumCard>
  )
}

const poundsText = (pence: unknown) => (typeof pence === 'number' && pence ? (pence / 100).toFixed(2) : '')

function FieldInput({ field, value, accent, onChange }: { field: OpsField; value: unknown; accent: string; onChange: (value: unknown) => void }) {
  const theme = useActiveQuantumTheme()
  if (field.type === 'select') {
    return <View style={styles.pills}>{field.options?.map((option) => <QuantumPill key={option} accent={accent} active={str(value) === option} onPress={() => onChange(str(value) === option ? '' : option)}>{option}</QuantumPill>)}</View>
  }
  if (field.type === 'checklist') {
    const checked = Array.isArray(value) ? value.map(String) : []
    return <View style={{ gap: 2 }}>{field.items?.map((item) => {
      const on = checked.includes(item)
      return (
        <Pressable key={item} onPress={() => onChange(on ? checked.filter((entry) => entry !== item) : [...checked, item])} style={[styles.check, { borderBottomColor: theme.borderColor }]}>
          <View style={[styles.box, { borderColor: on ? accent : theme.borderColor, backgroundColor: on ? accent : 'transparent' }]}>{on ? <QuantumText variant="caption" style={{ color: '#fff' }}>✓</QuantumText> : null}</View>
          <QuantumText variant="caption" style={{ flex: 1, flexShrink: 1, lineHeight: 20 }}>{item}</QuantumText>
        </Pressable>
      )
    })}</View>
  }
  if (field.type === 'score') {
    const current = value && typeof value === 'object' ? value as Record<string, number> : {}
    return <View style={{ gap: quantumSpace.sm }}>{field.criteria?.map((criterion) => (
      <View key={criterion} style={{ gap: 4 }}>
        <QuantumText variant="caption">{criterion}</QuantumText>
        <View style={styles.pills}>{[1, 2, 3, 4, 5].map((score) => <QuantumPill key={score} accent={accent} active={current[criterion] === score} onPress={() => onChange({ ...current, [criterion]: score })}>{String(score)}</QuantumPill>)}</View>
      </View>
    ))}</View>
  }
  if (field.type === 'money') return <QuantumTextInput key={`m-${str(value)}`} defaultValue={poundsText(value)} keyboardType="decimal-pad" placeholder="£0.00" onEndEditing={(event) => { const raw = event.nativeEvent.text.replace(/[^0-9.]/g, ''); onChange(raw ? Math.round(Number(raw) * 100) : '') }} />
  if (field.type === 'number') return <QuantumTextInput key={`n-${str(value)}`} defaultValue={value === undefined || value === '' ? '' : str(value)} keyboardType="decimal-pad" placeholder="0" onEndEditing={(event) => { const raw = event.nativeEvent.text.replace(/[^0-9.-]/g, ''); onChange(raw ? Number(raw) : '') }} />
  return (
    <QuantumTextInput
      defaultValue={str(value)}
      multiline={field.type === 'textarea'}
      placeholder={field.type === 'date' ? 'YYYY-MM-DD' : field.type === 'time' ? 'HH:MM' : field.placeholder}
      keyboardType={field.type === 'date' || field.type === 'time' ? 'numbers-and-punctuation' : 'default'}
      onChangeText={onChange}
      style={field.type === 'textarea' ? { minHeight: 80, textAlignVertical: 'top' } : undefined}
    />
  )
}

export function OpsSheet({ schema, record, accent, onClose, onSaved }: { schema: OpsSchema; record: WorkspaceRecordDTO; accent: string; onClose: () => void; onSaved: (record: WorkspaceRecordDTO) => void }) {
  const theme = useActiveQuantumTheme()
  const like = useMemo(() => opsRecordFromDto(record), [record])
  const [values, setValues] = useState<OpsValues>(() => readOps(like, schema))
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => { setValues(readOps(like, schema)); setDirty(false) }, [like, schema])
  const summary = schema.summary?.(values, like) ?? []
  const set = (key: string, value: unknown) => { setValues((current) => ({ ...current, [key]: value })); setDirty(true) }
  const save = async () => {
    setBusy(true)
    try {
      const updated = await saveProPatch(record, opsPatch(values, schema))
      onSaved(updated)
      setDirty(false)
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Try again')
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
        <View style={[styles.sheetHead, { borderBottomColor: theme.borderColor }]}>
          <View style={{ flex: 1 }}>
            <QuantumText variant="overline" color={accent}>{schema.title}</QuantumText>
            <QuantumText variant="h3" numberOfLines={1}>{record.name}</QuantumText>
          </View>
          <QuantumButton tone="ghost" onPress={onClose}>Done</QuantumButton>
        </View>
        <ScrollView contentContainerStyle={styles.sheetBody} keyboardShouldPersistTaps="handled">
          <QuantumText variant="caption" color={quantumColors.neutral300}>{schema.intro}</QuantumText>
          {summary.length ? <View style={styles.pills}>{summary.map((stat) => (
            <View key={stat.label} style={[styles.badge, { borderColor: stat.tone && stat.tone !== 'info' ? toneColor(stat.tone) : theme.borderColor }]}>
              <QuantumText variant="caption">{stat.label}: {stat.value}</QuantumText>
            </View>
          ))}</View> : null}
          {schema.fields.map((field) => (
            <View key={field.key} style={{ gap: 4 }}>
              <QuantumText variant="overline" color={quantumColors.neutral300}>{field.label}{field.unit ? ` (${field.unit})` : ''}</QuantumText>
              <FieldInput accent={accent} field={field} onChange={(value) => set(field.key, value)} value={values[field.key]} />
              {field.hint ? <QuantumText variant="caption" color={quantumColors.neutral500}>{field.hint}</QuantumText> : null}
            </View>
          ))}
          <View style={styles.pills}>
            <QuantumButton disabled={busy || !dirty} onPress={() => void save()}>{busy ? 'Saving…' : dirty ? `Save ${schema.title.toLowerCase()}` : 'Saved'}</QuantumButton>
            {schema.letter ? <QuantumButton tone="secondary" onPress={() => void Share.share({ message: schema.letter!.build(values, like) })}>Share {schema.letter.label.toLowerCase()}</QuantumButton> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  headRow: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm },
  kpis: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm, marginTop: quantumSpace.sm },
  kpi: { width: '48%', borderWidth: 1, borderRadius: 12, padding: quantumSpace.sm, gap: 2 },
  alert: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm, borderLeftWidth: 3, paddingLeft: quantumSpace.sm, paddingVertical: 4, marginTop: quantumSpace.xs },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm },
  barTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(148,163,184,0.25)', overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  tableRow: { flexDirection: 'row', gap: quantumSpace.sm, paddingVertical: 4, borderBottomWidth: StyleSheet.hairlineWidth },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  check: { flexDirection: 'row', alignItems: 'flex-start', gap: quantumSpace.sm, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  box: { width: 22, height: 22, flexShrink: 0, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.md, padding: quantumSpace.lg, paddingTop: quantumSpace.xl, borderBottomWidth: StyleSheet.hairlineWidth },
  sheetBody: { padding: quantumSpace.lg, gap: quantumSpace.lg, paddingBottom: 80 },
})
