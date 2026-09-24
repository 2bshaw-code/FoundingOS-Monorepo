/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Swipeable } from 'react-native-gesture-handler'
import {
  CoreOpsApiError,
  PipelineLead,
} from '../../lib/core-operations-api'
import { ENTRANCE_DURATION_MS, staggerDelay, useReducedMotionPreference } from '../../lib/motion'
import { getPipelineService } from '../../lib/services/pipelineService'
import {
  QuantumButton,
  QuantumCard,
  QuantumEmptyState,
  QuantumMetric,
  QuantumNotice,
  QuantumPill,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumSkeleton,
  QuantumSkeletonList,
  QuantumText,
  QuantumTextInput,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../components/QuantumUI'

// Sales pipeline stages, in forward order. A deal can only move to the next
// stage from here (or be marked Lost from any stage) — mirrors the web
// test-workspaces/retail/sales-pipeline module so mobile and web feel the
// same. Backed by the real, tenant-scoped Lead model (POST/PATCH
// /api/v1/ops/leads) — stage moves persist to the real database, not just
// on this device.
const STAGES = ['Lead', 'Qualified', 'Proposal', 'Won'] as const
type Stage = (typeof STAGES)[number]
const LOST_STAGE = 'Lost'

const STAGE_ACCENT: Record<Stage, string> = {
  Lead: '#38BDF8',
  Qualified: '#A78BFA',
  Proposal: '#FBBF24',
  Won: '#26E07F',
}

function formatCurrency(pence: number) {
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
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
  const [showDealForm, setShowDealForm] = useState(false)
  const [newDealCompany, setNewDealCompany] = useState('')
  const [newDealValue, setNewDealValue] = useState('')
  const [newDealStage, setNewDealStage] = useState<Stage>('Lead')
  const [creatingDeal, setCreatingDeal] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const reduceMotion = useReducedMotionPreference()
  const swipeRefs = useRef(new Map<string, Swipeable>())

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const data = await getPipelineService().fetchLeads()
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
      const updated = await getPipelineService().updateLeadStage(lead.id, next)
      setLeads((current) => current.map((item) => (item.id === lead.id ? updated : item)))
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not update this deal — try again.')
    } finally {
      setBusyId(null)
      swipeRefs.current.get(lead.id)?.close()
    }
  }

  async function markLost(lead: PipelineLead) {
    setBusyId(lead.id)
    setError('')
    try {
      const updated = await getPipelineService().updateLeadStage(lead.id, LOST_STAGE)
      setLeads((current) => current.map((item) => (item.id === lead.id ? updated : item)))
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not update this deal — try again.')
    } finally {
      setBusyId(null)
    }
  }

  async function addDeal() {
    const companyName = newDealCompany.trim()
    if (!companyName) {
      setError('Enter a company name before adding a deal.')
      return
    }
    const numericValue = Number(newDealValue.replace(/[^\d.]/g, ''))
    if (newDealValue.trim() && (!Number.isFinite(numericValue) || numericValue < 0)) {
      setError('Enter a valid deal value in pounds.')
      return
    }
    setCreatingDeal(true)
    setError('')
    try {
      const created = await getPipelineService().createLead({
        companyName,
        stage: newDealStage,
        valuePence: Math.round((numericValue || 0) * 100),
      })
      setLeads((current) => [created, ...current])
      setNewDealCompany('')
      setNewDealValue('')
      setNewDealStage('Lead')
      setShowDealForm(false)
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not add a deal — try again.')
    } finally {
      setCreatingDeal(false)
    }
  }

  if (loading) {
    return (
      <QuantumScreen contentStyle={styles.screen}>
        <QuantumText variant="overline" color={theme.accent}>Sales Pipeline</QuantumText>
        <View style={styles.kpiRow}>
          <QuantumSkeleton style={styles.kpiSkeleton} />
          <QuantumSkeleton style={styles.kpiSkeleton} />
          <QuantumSkeleton style={styles.kpiSkeleton} />
        </View>
        <QuantumSkeletonList count={4} />
      </QuantumScreen>
    )
  }

  if (error && leads.length === 0) {
    return (
      <QuantumScreen>
        <QuantumEmptyState glyph="⚠" title="Pipeline is unavailable" subtitle={error} action={<QuantumButton onPress={() => load()}>Try again</QuantumButton>} />
      </QuantumScreen>
    )
  }

  const fade = (index: number) => (reduceMotion ? undefined : FadeInDown.delay(staggerDelay(index)).duration(ENTRANCE_DURATION_MS).springify().damping(18))

  return (
    <QuantumScreen
      contentStyle={styles.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.accent} />}
    >
      {error ? <QuantumNotice tone="danger" onRetry={() => load()}>{error}</QuantumNotice> : null}

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
        <QuantumButton tone="secondary" onPress={() => setShowDealForm((visible) => !visible)}>
          {showDealForm ? 'Cancel' : '+ Add deal'}
        </QuantumButton>
      </View>
      {showDealForm ? (
        <QuantumCard accent={theme.accent} style={styles.dealForm}>
          <QuantumText variant="h3">New deal</QuantumText>
          <QuantumText variant="caption" color={theme.subtextColor}>Nothing is created until you choose the company, value, and starting stage.</QuantumText>
          <QuantumTextInput value={newDealCompany} onChangeText={setNewDealCompany} placeholder="Company name" autoCapitalize="words" />
          <QuantumTextInput value={newDealValue} onChangeText={setNewDealValue} placeholder="Value in pounds (optional)" keyboardType="decimal-pad" />
          <View style={styles.pillRow}>
            {STAGES.map((stage) => (
              <QuantumPill key={stage} active={newDealStage === stage} accent={STAGE_ACCENT[stage]} onPress={() => setNewDealStage(stage)}>
                {stage}
              </QuantumPill>
            ))}
          </View>
          <QuantumButton onPress={addDeal} disabled={creatingDeal}>
            {creatingDeal ? 'Adding deal…' : 'Add deal'}
          </QuantumButton>
        </QuantumCard>
      ) : null}
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
          <QuantumEmptyState glyph="◇" title="No deals in this stage" subtitle="Move a deal here, or add a new one with the button above." />
        ) : (
          visibleDeals.map((lead, i) => {
            const stage = dealStage(lead)
            const stageAccent = STAGE_ACCENT[stage]
            const next = nextStage(stage)
            const busy = busyId === lead.id
            const expanded = expandedId === lead.id
            // Swipe right-to-left "slide into next stage" gesture (Pipedrive/Monday-style):
            // dragging past the reveal threshold advances the deal, same as tapping
            // "Move to {next}" below — that button stays for accessibility/no-gesture use.
            const renderRightActions = next
              ? () => (
                  <Pressable
                    onPress={() => advance(lead)}
                    style={[styles.swipeAction, { backgroundColor: stageAccent }]}
                    accessibilityRole="button"
                    accessibilityLabel={`Move ${lead.companyName} to ${next}`}
                  >
                    <QuantumText variant="label" color="#061018">Move to{'\n'}{next} →</QuantumText>
                  </Pressable>
                )
              : undefined
            return (
              <Animated.View key={lead.id} entering={fade(i)}>
                <Swipeable
                  ref={(instance) => {
                    if (instance) swipeRefs.current.set(lead.id, instance)
                    else swipeRefs.current.delete(lead.id)
                  }}
                  renderRightActions={renderRightActions}
                  overshootRight={false}
                  rightThreshold={64}
                  onSwipeableOpen={(direction) => {
                    if (direction === 'right' && next && !busy) advance(lead)
                  }}
                  enabled={!!next}
                >
                  <QuantumCard accent={stageAccent} style={styles.dealCard}>
                    <Pressable
                      onPress={() => setExpandedId((current) => (current === lead.id ? null : lead.id))}
                      accessibilityRole="button"
                      accessibilityLabel={`${expanded ? 'Hide' : 'Show'} details for ${lead.companyName}`}
                    >
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
                      {expanded ? (
                        <View style={styles.dealDetail}>
                          <QuantumText variant="caption" color={theme.subtextColor}>Stage: {stage}</QuantumText>
                          <QuantumText variant="caption" color={theme.subtextColor}>Added: {formatDate(lead.createdAt)}</QuantumText>
                          <QuantumText variant="caption" color={theme.subtextColor}>Last updated: {formatDate(lead.updatedAt)}</QuantumText>
                          {next ? (
                            <QuantumText variant="caption" color={theme.subtextColor}>Tip: swipe this card left to move it to {next}.</QuantumText>
                          ) : null}
                        </View>
                      ) : null}
                    </Pressable>
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
                </Swipeable>
              </Animated.View>
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
  kpiCard: { flexGrow: 1, flexBasis: '30%', minWidth: 0, alignItems: 'center' },
  kpiSkeleton: { flexGrow: 1, flexBasis: '30%', minWidth: 0, height: 72, borderRadius: 16 },
  headerRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.sm },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  dealForm: { gap: quantumSpace.sm },
  dealList: { gap: quantumSpace.md },
  dealCard: { gap: quantumSpace.sm },
  dealHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: quantumSpace.md },
  dealActionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  dealDetail: { marginTop: quantumSpace.sm, gap: quantumSpace.xs },
  swipeAction: {
    width: 96,
    marginLeft: quantumSpace.sm,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: quantumSpace.sm,
  },
})
