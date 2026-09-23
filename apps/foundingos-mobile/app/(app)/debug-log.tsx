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
import { CORE_OPS_API_BASE } from '../../lib/core-operations-api'
import { CORE_WORKFORCE_API_BASE } from '../../lib/core-workforce-api'
import {
  QuantumButton,
  QuantumCard,
  QuantumHeader,
  QuantumNotice,
  QuantumScreen,
  QuantumText,
  getSemanticColor,
} from '../../components/QuantumUI'
import { useQuantumStore } from '../../lib/store'

type ServiceStatus = 'checking' | 'ok' | 'down'

const SERVICES: { label: string; url: string }[] = [
  { label: 'Core.Operations', url: `${CORE_OPS_API_BASE}/health` },
  { label: 'Core.Workforce', url: `${CORE_WORKFORCE_API_BASE}/health` },
]

// Phase 31 — minimal internal status view. Pings each backend's fast /health
// endpoint (never /ready, which is heavier and DB-dependent) so this never
// blocks or slows down opening the debug screen.
function useServiceStatus() {
  const [status, setStatus] = useState<Record<string, ServiceStatus>>(
    Object.fromEntries(SERVICES.map((s) => [s.label, 'checking'])),
  )

  useEffect(() => {
    let cancelled = false
    SERVICES.forEach(({ label, url }) => {
      fetch(url, { signal: AbortSignal.timeout(4_000) })
        .then((res) => { if (!cancelled) setStatus((prev) => ({ ...prev, [label]: res.ok ? 'ok' : 'down' })) })
        .catch(() => { if (!cancelled) setStatus((prev) => ({ ...prev, [label]: 'down' })) })
    })
    return () => { cancelled = true }
  }, [])

  return status
}

export default function DebugLogScreen() {
  const [entries, setEntries] = useState<ActionLogEntry[]>(getActionLog())
  const serviceStatus = useServiceStatus()
  const demoMode = useQuantumStore((state) => state.demoMode)
  const setDemoMode = useQuantumStore((state) => state.setDemoMode)

  useEffect(() => subscribeToActionLog(() => setEntries(getActionLog())), [])

  return (
    <QuantumScreen>
      <QuantumHeader eyebrow="Diagnostics" title="Action Log" accent={FOUNDINGOS_ACCENT} />

      <QuantumText variant="overline">Demo mode</QuantumText>
      <QuantumCard accent={demoMode ? getSemanticColor('watch') : undefined}>
        <QuantumText variant="caption">
          Populates Today and Approvals with realistic sample data — no real backend, workspace, or tenant required.
          Ideal for investor and buyer demos. Off by default and never affects real data.
        </QuantumText>
        <QuantumButton tone={demoMode ? 'danger' : 'primary'} onPress={() => setDemoMode(!demoMode)} style={styles.demoButton}>
          {demoMode ? 'Turn off demo mode' : 'Turn on demo mode'}
        </QuantumButton>
      </QuantumCard>

      <QuantumText variant="overline">Service status</QuantumText>
      {SERVICES.map(({ label }) => {
        const state = serviceStatus[label]
        return (
          <QuantumCard key={label} accent={getSemanticColor(state === 'ok' ? 'good' : state === 'down' ? 'risk' : 'watch')}>
            <QuantumText variant="caption">
              {label} · {state === 'checking' ? 'checking…' : state === 'ok' ? 'operational' : 'unreachable'}
            </QuantumText>
          </QuantumCard>
        )
      })}
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
  demoButton: { marginTop: 10 },
})
