/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  QuantumButton,
  QuantumCard,
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
// test-workspaces/retail/crm simulation so mobile and web feel the same.
const STAGES = ['Lead', 'Qualified', 'Proposal', 'Won'] as const
type Stage = (typeof STAGES)[number]

const STAGE_ACCENT: Record<Stage, string> = {
  Lead: '#38BDF8',
  Qualified: '#A78BFA',
  Proposal: '#FBBF24',
  Won: '#26E07F',
}

type Deal = {
  id: string
  company: string
  contact: string
  valuePence: number
  stage: Stage
  owner: string
  lost?: boolean
}

// Deterministic demo pipeline — no live CRM backend exists yet, so this is an
// honest interactive simulation (same pattern as the web CRM/sales-pipeline
// pages) rather than pretending to show real tenant data.
const INITIAL_DEALS: Deal[] = [
  { id: 'd1', company: 'Riverside Grocers', contact: 'Amara Yusuf', valuePence: 480000, stage: 'Lead', owner: 'You' },
  { id: 'd2', company: 'North Star Cafés', contact: 'Ola Benson', valuePence: 920000, stage: 'Lead', owner: 'You' },
  { id: 'd3', company: 'Harborlight Retail', contact: 'Priya Shah', valuePence: 1540000, stage: 'Qualified', owner: 'You' },
  { id: 'd4', company: 'Fenwick & Co', contact: 'Marcus Lee', valuePence: 2100000, stage: 'Qualified', owner: 'You' },
  { id: 'd5', company: 'Bloom Market Group', contact: 'Sofia Reyes', valuePence: 3650000, stage: 'Proposal', owner: 'You' },
  { id: 'd6', company: 'Anchor Supply Co', contact: 'Dev Patel', valuePence: 1275000, stage: 'Won', owner: 'You' },
]

function formatCurrency(pence: number) {
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function nextStage(stage: Stage): Stage | null {
  const index = STAGES.indexOf(stage)
  if (index === -1 || index === STAGES.length - 1) return null
  return STAGES[index + 1]
}

export default function CrmScreen() {
  const theme = useActiveQuantumTheme()
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS)
  const [filter, setFilter] = useState<Stage | 'All'>('All')

  const openDeals = useMemo(() => deals.filter((deal) => !deal.lost), [deals])
  const pipelineValue = useMemo(
    () => openDeals.filter((deal) => deal.stage !== 'Won').reduce((sum, deal) => sum + deal.valuePence, 0),
    [openDeals],
  )
  const wonValue = useMemo(() => openDeals.filter((deal) => deal.stage === 'Won').reduce((sum, deal) => sum + deal.valuePence, 0), [openDeals])
  const winRate = useMemo(() => {
    const decided = deals.filter((deal) => deal.stage === 'Won' || deal.lost)
    if (decided.length === 0) return 0
    return Math.round((deals.filter((deal) => deal.stage === 'Won').length / decided.length) * 100)
  }, [deals])

  const visibleDeals = filter === 'All' ? openDeals : openDeals.filter((deal) => deal.stage === filter)

  function advance(dealId: string) {
    setDeals((current) =>
      current.map((deal) => {
        if (deal.id !== dealId) return deal
        const next = nextStage(deal.stage)
        return next ? { ...deal, stage: next } : deal
      }),
    )
  }

  function markLost(dealId: string) {
    setDeals((current) => current.map((deal) => (deal.id === dealId ? { ...deal, lost: true } : deal)))
  }

  return (
    <QuantumScreen contentStyle={styles.screen}>
      <QuantumNotice tone="info">Interactive simulation · stage moves persist on this device only</QuantumNotice>

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

      <QuantumSectionHeader label="Pipeline stage" />
      <View style={styles.pillRow}>
        <QuantumPill active={filter === 'All'} onPress={() => setFilter('All')}>
          All ({openDeals.length})
        </QuantumPill>
        {STAGES.map((stage) => (
          <QuantumPill key={stage} active={filter === stage} accent={STAGE_ACCENT[stage]} onPress={() => setFilter(stage)}>
            {stage} ({openDeals.filter((deal) => deal.stage === stage).length})
          </QuantumPill>
        ))}
      </View>

      <View style={styles.dealList}>
        {visibleDeals.length === 0 ? (
          <QuantumNotice>No deals in this stage yet.</QuantumNotice>
        ) : (
          visibleDeals.map((deal) => {
            const stageAccent = STAGE_ACCENT[deal.stage]
            const next = nextStage(deal.stage)
            return (
              <QuantumCard key={deal.id} accent={stageAccent} style={styles.dealCard}>
                <View style={styles.dealHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <QuantumText variant="h3">{deal.company}</QuantumText>
                    <QuantumText variant="caption" color={theme.subtextColor}>
                      {deal.contact} · Owner: {deal.owner}
                    </QuantumText>
                  </View>
                  <QuantumText variant="h2" color={stageAccent}>
                    {formatCurrency(deal.valuePence)}
                  </QuantumText>
                </View>
                <View style={styles.dealActionsRow}>
                  {next ? <QuantumButton onPress={() => advance(deal.id)}>Move to {next}</QuantumButton> : null}
                  {deal.stage !== 'Won' ? (
                    <QuantumButton tone="ghost" onPress={() => markLost(deal.id)}>
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
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  dealList: { gap: quantumSpace.md },
  dealCard: { gap: quantumSpace.sm },
  dealHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: quantumSpace.md },
  dealActionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
})
