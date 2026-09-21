/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { QuantumBackButton } from '../../../components/QuantumBackButton'
import {
  CoreOpsApiError,
  WorkspaceRecordDTO,
  createWorkspaceRecord,
  fetchWorkspaceRecords,
  updateWorkspaceRecord,
} from '../../../lib/core-operations-api'
import { findModule, findWorkspace } from '../../../lib/workspace-modules'
import {
  QuantumButton,
  QuantumCard,
  QuantumHeader,
  QuantumLoadingScreen,
  QuantumNotice,
  QuantumPill,
  QuantumScreen,
  QuantumText,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../../components/QuantumUI'

function formatValue(pence: number | null): string {
  if (pence === null || pence === undefined) return ''
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

// Every module in every workspace (retail, logistics, finance, marketing,
// talent, health, intelligence) renders through this single generic screen,
// backed by the same tenant-scoped WorkspaceRecord model the web app's
// production mode uses (GET/POST /platform/workspaces/:workspace/:module/records,
// PATCH /platform/records/:id) — no per-module backend or UI work required.
export default function WorkspaceModuleScreen() {
  const theme = useActiveQuantumTheme()
  const { workspace: workspaceSlug, module: moduleId } = useLocalSearchParams<{ workspace: string; module: string }>()
  const workspace = findWorkspace(String(workspaceSlug || ''))
  const module = findModule(String(workspaceSlug || ''), String(moduleId || ''))
  const statuses = module?.statuses

  const [records, setRecords] = useState<WorkspaceRecordDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('All')

  const load = useCallback(
    async (isRefresh = false) => {
      if (!workspace || !module) return
      if (isRefresh) setRefreshing(true)
      setError('')
      try {
        const data = await fetchWorkspaceRecords(workspace.slug, module.id)
        setRecords(data)
      } catch (err) {
        setError(err instanceof CoreOpsApiError ? err.message : 'Could not load this module. Pull to refresh to try again.')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [workspace, module],
  )

  useEffect(() => {
    load()
  }, [load])

  const visibleRecords = filter === 'All' ? records : records.filter((record) => record.status === filter)

  function nextStatus(status: string): string | null {
    if (!statuses) return null
    const index = statuses.indexOf(status)
    if (index === -1 || index === statuses.length - 1) return null
    return statuses[index + 1]
  }

  async function advance(record: WorkspaceRecordDTO) {
    const next = nextStatus(record.status)
    if (!next || !module) return
    setBusyId(record.id)
    setError('')
    try {
      const updated = await updateWorkspaceRecord(record.id, { version: record.version, status: next })
      setRecords((current) => current.map((item) => (item.id === record.id ? updated : item)))
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not update this record — try again.')
    } finally {
      setBusyId(null)
    }
  }

  async function addRecord() {
    if (!workspace || !module) return
    setError('')
    try {
      const created = await createWorkspaceRecord(workspace.slug, module.id, {
        reference: `${module.id}-${Date.now()}`,
        name: `New ${module.label.toLowerCase()}`,
        status: statuses?.[0] ?? 'New',
      })
      setRecords((current) => [created, ...current])
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not add a record — try again.')
    }
  }

  const filterOptions = useMemo(() => statuses ?? Array.from(new Set(records.map((record) => record.status))), [statuses, records])

  if (!workspace || !module) return null
  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen
      contentStyle={styles.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={workspace.accent} />}
    >
      <QuantumBackButton label={`‹ ${workspace.label}`} fallbackHref={`/workspace/${workspace.slug}`} />
      <QuantumHeader eyebrow={workspace.label} title={module.label} accent={workspace.accent} />
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}

      <View style={styles.headerRow}>
        <QuantumText variant="caption" color={theme.subtextColor}>
          {records.length} record{records.length === 1 ? '' : 's'}
        </QuantumText>
        <QuantumButton tone="secondary" onPress={addRecord}>
          + Add
        </QuantumButton>
      </View>

      {filterOptions.length > 0 ? (
        <View style={styles.pillRow}>
          <QuantumPill active={filter === 'All'} onPress={() => setFilter('All')}>
            All ({records.length})
          </QuantumPill>
          {filterOptions.map((status) => (
            <QuantumPill key={status} active={filter === status} accent={workspace.accent} onPress={() => setFilter(status)}>
              {status} ({records.filter((record) => record.status === status).length})
            </QuantumPill>
          ))}
        </View>
      ) : null}

      <View style={styles.list}>
        {visibleRecords.length === 0 ? (
          <QuantumNotice>No records yet — tap Add to create one.</QuantumNotice>
        ) : (
          visibleRecords.map((record) => {
            const next = nextStatus(record.status)
            const busy = busyId === record.id
            return (
              <QuantumCard key={record.id} accent={workspace.accent} style={styles.recordCard}>
                <View style={styles.recordHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <QuantumText variant="h3">{record.name}</QuantumText>
                    <QuantumText variant="caption" color={theme.subtextColor}>
                      {record.status} · {record.reference}
                    </QuantumText>
                  </View>
                  {record.valuePence !== null ? (
                    <QuantumText variant="h3" color={workspace.accent}>
                      {formatValue(record.valuePence)}
                    </QuantumText>
                  ) : null}
                </View>
                {next ? (
                  <QuantumButton onPress={() => advance(record)} disabled={busy}>
                    Move to {next}
                  </QuantumButton>
                ) : null}
              </QuantumCard>
            )
          })
        )}
      </View>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  screen: { gap: quantumSpace.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  list: { gap: quantumSpace.md },
  recordCard: { gap: quantumSpace.sm },
  recordHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: quantumSpace.md },
})
