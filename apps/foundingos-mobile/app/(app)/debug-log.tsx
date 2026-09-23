/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Hidden diagnostics screen — not linked from any tab or menu. Reached only
// via a secret gesture (long-press the FOUNDINGOS wordmark on the Today tab,
// see home.tsx) or by navigating to /debug-log directly in development.
// Shows only what the action logger records: action type, outcome, and small
// non-sensitive metadata — never record contents. Intended to be the seed
// for the telemetry pipeline described in docs/telemetry.md, not a
// replacement for it.
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import { ActionLogEntry, clearActionLog, getActionLog, subscribeToActionLog } from '../../lib/action-logger'
import {
  QuantumButton,
  QuantumCard,
  QuantumHeader,
  QuantumNotice,
  QuantumScreen,
  QuantumText,
  getSemanticColor,
} from '../../components/QuantumUI'

export default function DebugLogScreen() {
  const [entries, setEntries] = useState<ActionLogEntry[]>(getActionLog())

  useEffect(() => subscribeToActionLog(() => setEntries(getActionLog())), [])

  return (
    <QuantumScreen>
      <QuantumHeader eyebrow="Diagnostics" title="Action Log" accent={FOUNDINGOS_ACCENT} />
      <QuantumText variant="caption">
        In-memory only — clears on app restart, never leaves this device. Records action type and outcome, no record
        contents.
      </QuantumText>
      <QuantumButton tone="secondary" onPress={clearActionLog}>
        Clear log
      </QuantumButton>
      {entries.length === 0 ? (
        <QuantumNotice>Nothing logged yet this session.</QuantumNotice>
      ) : (
        entries.map((entry) => (
          <QuantumCard key={entry.id} accent={getSemanticColor(entry.outcome === 'success' ? 'good' : 'risk')}>
            <QuantumText variant="overline" color={getSemanticColor(entry.outcome === 'success' ? 'good' : 'risk')}>
              {entry.type} · {entry.outcome}
            </QuantumText>
            <QuantumText variant="caption">{new Date(entry.occurredAt).toLocaleString('en-GB')}</QuantumText>
            {entry.metadata ? (
              <QuantumText variant="caption" style={styles.metadata}>
                {Object.entries(entry.metadata)
                  .map(([key, value]) => `${key}: ${String(value)}`)
                  .join(' · ')}
              </QuantumText>
            ) : null}
          </QuantumCard>
        ))
      )}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  metadata: { opacity: 0.7 },
})
