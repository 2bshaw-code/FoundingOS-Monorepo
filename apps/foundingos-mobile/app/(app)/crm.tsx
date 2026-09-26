/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import {
  CoreOpsApiError,
  PipelineLead,
  createPipelineLead,
  fetchPipelineLeads,
  updatePipelineLeadStage,
} from '../../lib/core-operations-api'
import {
  QuantumButton,
  QuantumCard,
  QuantumLoadingScreen,
  QuantumMetric,
  QuantumNotice,
  QuantumPill,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../components/QuantumUI'

// Sales pipeline stages, in forward order. A deal can only move to the next
// stage from here (or be marked Lost from any stage) — mirrors the web
// test-workspaces/retail/sales-pipeline module so mobile and web feel the
// same. Backed by the real, tenant-scoped Lead model (POST/PATCH
// /api/v1/ops/leads) — stage moves persist to the real database, not just
// on this device.
const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'] as const
type Stage = (typeof STAGES)[number]
const LOST_STAGE = 'Lost'

const STAGE_ACCENT: Record<Stage, string> = {
  Lead: '#38BDF8',
  Qualified: '#A78BFA',
  Proposal: '#FBBF24',
  Negotiation: '#FB923C',
  Won: '#26E07F',
}

function formatCurrency(pence: number) {
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function nextStage(stage: Stage): Stage | null {
  const index = STAGES.indexOf(stage)
  if (index === -1 || index === STAGES.length - 1) return null
  return STAGES[index + 1]
}

function isKnownStage(stage: string): stage is Stage {
  return (STAGES as readonly string[]).includes(stage)
}

export default function CrmScreen() {
  const theme = useActiveQuantumTheme()
  const [leads, setLeads] = useState<PipelineLead[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Stage | 'All'>('All')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const data = await fetchPipelineLeads()
      setLeads(data)
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not load the sales pipeline. Pull to refresh to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Leads with no recognised stage yet (freshly imported, or created outside
  // this Kanban view) default into the first column rather than disappearing.
  const openDeals = useMemo(() => leads.filter((lead) => lead.stage !== LOST_STAGE), [leads])
  const dealStage = useCallback((lead: PipelineLead): Stage => (isKnownStage(lead.stage) ? lead.stage : 'Lead'), [])

  const pipelineValue = useMemo(
    () => openDeals.filter((lead) => dealStage(lead) !== 'Won').reduce((sum, lead) => sum + lead.valuePence, 0),
    [openDeals, dealStage],
  )
  const wonValue = useMemo(
    () => openDeals.filter((lead) => dealStage(lead) === 'Won').reduce((sum, lead) => sum + lead.valuePence, 0),
    [openDeals, dealStage],
  )
  const winRate = useMemo(() => {
    const decided = leads.filter((lead) => dealStage(lead) === 'Won' || lead.stage === LOST_STAGE)
    if (decided.length === 0) return 0
    return Math.round((leads.filter((lead) => dealStage(lead) === 'Won').length / decided.length) * 100)
  }, [leads, dealStage])

  const visibleDeals = filter === 'All' ? openDeals : openDeals.filter((lead) => dealStage(lead) === filter)

  async function advance(lead: PipelineLead) {
    const next = nextStage(dealStage(lead))
    if (!next) return
    setBusyId(lead.id)
    setError('')
    try {
      const updated = await updatePipelineLeadStage(lead.id, next)
      setLeads((current) => current.map((item) => (item.id === lead.id ? updated : item)))
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not update this deal — try again.')
    } finally {
      setBusyId(null)
    }
  }

  async function markLost(lead: PipelineLead) {
    setBusyId(lead.id)
    setError('')
    try {
      const updated = await updatePipelineLeadStage(lead.id, LOST_STAGE)
      setLeads((current) => current.map((item) => (item.id === lead.id ? updated : item)))
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not update this deal — try again.')
    } finally {
      setBusyId(null)
    }
  }

  async function addDeal() {
    setError('')
    try {
      const created = await createPipelineLead({ companyName: 'New deal', stage: 'Lead', valuePence: 0 })
      setLeads((current) => [created, ...current])
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not add a deal — try again.')
    }
  }

  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen
      contentStyle={styles.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.accent} />}
    >
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}

      <View style={styles.kpiRow}>
        <QuantumCard accent="#38BDF8" style={styles.kpiCard}>
          <QuantumMetric label="Open pipeline" value={formatCurrency(pipelineValue)} tone="info" />
        </QuantumCard>
        <QuantumCard accent="#26E07F" style={styles.kpiCard}>
          <QuantumMetric label="Won this cycle" value={formatCurrency(wonValue)} tone="good" />
        </QuantumCard>
        <QuantumCard accent="#FBBF24" style={styles.kpiCard}>
          <QuantumMetric label="Win rate" value={`${winRate}%`} tone="watch" />
        </QuantumCard>
      </View>

      <View style={styles.headerRow}>
        <QuantumSectionHeader label="Pipeline stage" />
        <QuantumButton tone="secondary" onPress={addDeal}>
          + Add deal
        </QuantumButton>
      </View>
      <View style={styles.pillRow}>
        <QuantumPill active={filter === 'All'} onPress={() => setFilter('All')}>
          All ({openDeals.length})
        </QuantumPill>
        {STAGES.map((stage) => (
          <QuantumPill key={stage} active={filter === stage} accent={STAGE_ACCENT[stage]} onPress={() => setFilter(stage)}>
            {stage} ({openDeals.filter((lead) => dealStage(lead) === stage).length})
          </QuantumPill>
        ))}
      </View>

      <View style={styles.dealList}>
        {visibleDeals.length === 0 ? (
          <QuantumNotice>No deals in this stage yet.</QuantumNotice>
        ) : (
          visibleDeals.map((lead) => {
            const stage = dealStage(lead)
            const stageAccent = STAGE_ACCENT[stage]
            const next = nextStage(stage)
            const busy = busyId === lead.id
            return (
              <QuantumCard key={lead.id} accent={stageAccent} style={styles.dealCard}>
                <View style={styles.dealHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <QuantumText variant="h3">{lead.companyName}</QuantumText>
                    <QuantumText variant="caption" color={theme.subtextColor}>
                      {lead.contactName || 'No contact on file'}
                    </QuantumText>
                  </View>
                  <QuantumText variant="h2" color={stageAccent}>
                    {formatCurrency(lead.valuePence)}
                  </QuantumText>
                </View>
                <View style={styles.dealActionsRow}>
                  {next ? (
                    <QuantumButton onPress={() => advance(lead)} disabled={busy}>
                      Move to {next}
                    </QuantumButton>
                  ) : null}
                  {stage !== 'Won' ? (
                    <QuantumButton tone="ghost" onPress={() => markLost(lead)} disabled={busy}>
                      Mark lost
                    </QuantumButton>
                  ) : null}
                </View>
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
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  kpiCard: { flex: 1, minWidth: 140, alignItems: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  dealList: { gap: quantumSpace.md },
  dealCard: { gap: quantumSpace.sm },
  dealHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: quantumSpace.md },
  dealActionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
})
