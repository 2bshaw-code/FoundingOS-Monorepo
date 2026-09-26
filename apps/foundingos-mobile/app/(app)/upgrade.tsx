/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { requestWorkspaceUpgrade } from '../../lib/core-operations-api'
import { WORKSPACE_OFFERS, useWorkspaceAccess } from '../../lib/workspace-access'
import { WorkspaceSlug } from '../../lib/workspace-modules'
import { QuantumButton, QuantumCard, QuantumHeader, QuantumNotice, QuantumScreen, QuantumSectionHeader, QuantumText, quantumColors, quantumSpace } from '../../components/QuantumUI'

export default function UpgradeScreen() {
  const { add } = useLocalSearchParams<{ add?: string }>()
  const { mine, locked } = useWorkspaceAccess()
  const [selected, setSelected] = useState<Set<string>>(() => new Set(typeof add === 'string' ? [add] : []))
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ tone: 'success' | 'danger'; message: string } | null>(null)

  const toggle = (slug: string) => setSelected((current) => {
    const next = new Set(current)
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    return next
  })

  const submit = async () => {
    if (!selected.size) return
    setBusy(true)
    setResult(null)
    try {
      await requestWorkspaceUpgrade([...selected])
      setResult({ tone: 'success', message: 'Request sent. We’ll switch these on for your account and confirm by email — usually the same day.' })
      setSelected(new Set())
    } catch (error: any) {
      setResult({ tone: 'danger', message: error?.status === 403 ? 'Only the account owner can change the plan. Ask them to add these workspaces.' : error?.message || 'Could not send your request. Try again.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <QuantumScreen>
      <QuantumHeader eyebrow="Your plan" title="Add workspaces" description="Only pay for the parts of the business you run. Add a workspace and FoundAI starts running it too." accent="#38BDF8" />

      <QuantumSectionHeader label="You have" />
      <View style={styles.chips}>
        {mine.map((workspace) => (
          <View key={workspace.slug} style={[styles.chip, { borderColor: `${workspace.accent}88` }]}>
            <QuantumText variant="caption" color={workspace.accent}>✓ {workspace.label}</QuantumText>
          </View>
        ))}
      </View>

      <QuantumSectionHeader label={locked.length ? 'Available to add' : 'Everything is switched on'} />
      {locked.map((workspace) => {
        const offer = WORKSPACE_OFFERS[workspace.slug as WorkspaceSlug]
        const on = selected.has(workspace.slug)
        return (
          <Pressable key={workspace.slug} onPress={() => toggle(workspace.slug)}>
            <QuantumCard accent={on ? workspace.accent : undefined} style={on ? { borderColor: workspace.accent } : undefined}>
              <View style={styles.row}>
                <View style={styles.rowText}>
                  <QuantumText variant="h3">{workspace.label}</QuantumText>
                  <QuantumText variant="caption" color={quantumColors.neutral300}>{offer.offer}</QuantumText>
                </View>
                <QuantumText variant="label" color={workspace.accent}>{offer.price}</QuantumText>
              </View>
              <QuantumText variant="caption">{offer.pitch}</QuantumText>
              <QuantumText variant="caption" color={on ? workspace.accent : quantumColors.neutral300}>{on ? '● Selected' : '○ Tap to select'}</QuantumText>
            </QuantumCard>
          </Pressable>
        )
      })}

      {locked.length ? (
        <QuantumCard accent="#24C47A">
          <QuantumText variant="overline" color="#24C47A">Best value</QuantumText>
          <QuantumText variant="h3">Complete · £89/mo</QuantumText>
          <QuantumText variant="caption">Retail, Marketing, Finance, Talent and Intelligence with 15 team members.</QuantumText>
          <QuantumButton tone="secondary" onPress={() => setSelected(new Set(locked.filter((w) => w.slug !== 'logistics' && w.slug !== 'health').map((w) => w.slug)))}>Choose Complete</QuantumButton>
        </QuantumCard>
      ) : null}

      {result ? <QuantumNotice tone={result.tone}>{result.message}</QuantumNotice> : null}
      {locked.length ? (
        <QuantumButton onPress={submit} disabled={busy || !selected.size}>
          {busy ? 'Sending…' : selected.size ? `Request ${selected.size} workspace${selected.size === 1 ? '' : 's'}` : 'Select workspaces to add'}
        </QuantumButton>
      ) : null}
      <QuantumText variant="caption" align="center" color={quantumColors.neutral300}>No lock-in. Change or remove workspaces any time.</QuantumText>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.xs },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.sm },
  rowText: { flex: 1, gap: 2 },
})
