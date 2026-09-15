/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useQuantumStore, UserTier } from '../../lib/store'
import { BRANDS } from '../../lib/brands'
import { MultimodalCaptureModal, AIConfirmationModal, AIConfirmationData } from '../../components/MultimodalCaptureModal'
import {
  QuantumButton,
  QuantumCard,
  QuantumNotice,
  QuantumPill,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../components/QuantumUI'

type BoltOn = {
  id: string
  brandSlug: string
  name: string
  icon: string
  description: string
  endpoint: string
  allowedTiers: UserTier[]
}

const BOLT_ON_CATALOG: BoltOn[] = [
  {
    id: 'shelfScanner',
    brandSlug: 'retail',
    name: 'Shelf Stock Scanner',
    icon: '◐',
    description: 'Photo capture maps shelf state to inventory suggestions and reorder alerts.',
    endpoint: '/boltons/shelf-scanner',
    allowedTiers: ['starter', 'growth', 'enterprise'],
  },
  {
    id: 'meatTraceability',
    brandSlug: 'meat',
    name: 'Traceability Scanner',
    icon: '◇',
    description: 'Label capture resolves batch history, cold-chain state, and supplier provenance.',
    endpoint: '/boltons/meat-traceability',
    allowedTiers: ['growth', 'enterprise'],
  },
  {
    id: 'financeExpense',
    brandSlug: 'finance',
    name: 'Expense Intake',
    icon: '▣',
    description: 'Receipt capture extracts vendor, amount, tax, due date, and reconciliation hints.',
    endpoint: '/boltons/finance-expense',
    allowedTiers: ['starter', 'growth', 'enterprise'],
  },
  {
    id: 'logisticsRoute',
    brandSlug: 'logistics',
    name: 'Route Optimiser',
    icon: '⟡',
    description: 'Orders become a driver-ready route with fuel, timing, and WhatsApp dispatch context.',
    endpoint: '/boltons/logistics-route',
    allowedTiers: ['growth', 'enterprise'],
  },
  {
    id: 'productDiscovery',
    brandSlug: 'foundthat',
    name: 'Visual Product Discovery',
    icon: '◎',
    description: 'Product imagery maps to catalog matches, pricing context, and lead capture.',
    endpoint: '/api/ai/inventory-intake',
    allowedTiers: ['starter', 'growth', 'enterprise'],
  },
  {
    id: 'cvScanner',
    brandSlug: 'talent',
    name: 'Candidate Matcher',
    icon: '▤',
    description: 'CV or voice intake extracts skills, seniority, fit, and outreach recommendations.',
    endpoint: '/api/ai/talent-intake',
    allowedTiers: ['growth', 'enterprise'],
  },
  {
    id: 'cryptoCompliance',
    brandSlug: 'crypto',
    name: 'Compliance Checker',
    icon: '◈',
    description: 'Wallet or transaction context maps to risk scoring and clearance suggestions.',
    endpoint: '/api/ai/crypto-compliance',
    allowedTiers: ['enterprise'],
  },
  {
    id: 'healthRecordExtractor',
    brandSlug: 'health',
    name: 'Record Extractor',
    icon: '✦',
    description: 'Documents become structured health records, vitals, and follow-up prompts.',
    endpoint: '/api/ai/health-records',
    allowedTiers: ['growth', 'enterprise'],
  },
]

export default function WorkflowsScreen() {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const role = useQuantumStore((state) => state.role)
  const tier = useQuantumStore((state) => state.tier)
  const theme = useActiveQuantumTheme()
  const [captureModalType, setCaptureModalType] = useState<'voice' | 'photo' | 'video' | null>(null)
  const [confirmationData, setConfirmationData] = useState<AIConfirmationData | null>(null)

  const currentBrand = BRANDS.find((brand) => brand.slug === activeBrandSlug) ?? BRANDS[0]
  const activeBoltOns = BOLT_ON_CATALOG.filter((boltOn) => {
    const isRelevantBrand = boltOn.brandSlug === activeBrandSlug
    const isTierAllowed = boltOn.allowedTiers.includes(tier)
    return isRelevantBrand && isTierAllowed
  })

  const handleLaunchBoltOn = (boltOnId: string) => {
    if (['shelfScanner', 'meatTraceability', 'financeExpense', 'productDiscovery'].includes(boltOnId)) {
      setCaptureModalType('photo')
      return
    }

    if (['cvScanner', 'healthRecordExtractor'].includes(boltOnId)) {
      setCaptureModalType('voice')
      return
    }

    setCaptureModalType('video')
  }

  return (
    <QuantumScreen>
      <QuantumCard accent={theme.accent}>
        <QuantumText variant="overline" color={theme.accent}>
          {role} · {tier}
        </QuantumText>
        <QuantumText variant="h1">{currentBrand.name} Workflows</QuantumText>
        <QuantumText color={theme.subtextColor}>{currentBrand.tagline}</QuantumText>
      </QuantumCard>

      <QuantumSectionHeader label="Multimodal intake" />
      <View style={styles.multimodalRow}>
        <QuantumButton tone="secondary" style={styles.launcher} onPress={() => setCaptureModalType('voice')}>
          Voice
        </QuantumButton>
        <QuantumButton tone="secondary" style={styles.launcher} onPress={() => setCaptureModalType('photo')}>
          Photo
        </QuantumButton>
        <QuantumButton tone="secondary" style={styles.launcher} onPress={() => setCaptureModalType('video')}>
          Video
        </QuantumButton>
      </View>

      <QuantumSectionHeader label="Active AI bolt-ons" />
      {activeBoltOns.length > 0 ? (
        activeBoltOns.map((boltOn) => (
          <QuantumCard key={boltOn.id} accent={boltOn.brandSlug === activeBrandSlug ? theme.accent : undefined}>
            <View style={styles.boltOnHeader}>
              <QuantumText variant="h2" color={theme.accent} style={styles.boltOnIcon}>
                {boltOn.icon}
              </QuantumText>
              <View style={styles.boltOnCopy}>
                <QuantumText variant="h3">{boltOn.name}</QuantumText>
                <QuantumText variant="caption" color={theme.subtextColor}>
                  {boltOn.description}
                </QuantumText>
              </View>
            </View>
            <View style={styles.boltOnFooter}>
              <QuantumPill accent={theme.accent}>{boltOn.allowedTiers.join(' / ')}</QuantumPill>
              <QuantumButton onPress={() => handleLaunchBoltOn(boltOn.id)}>Launch</QuantumButton>
            </View>
            <QuantumText variant="caption" color={theme.subtextColor}>
              Endpoint: {boltOn.endpoint}
            </QuantumText>
          </QuantumCard>
        ))
      ) : (
        <QuantumNotice tone="warning">No bolt-ons are enabled for this brand/tier combination.</QuantumNotice>
      )}

      <QuantumSectionHeader label="Console modules" />
      <View style={styles.moduleGrid}>
        {currentBrand.modules.map((moduleName) => (
          <QuantumCard key={moduleName} style={styles.moduleCard}>
            <QuantumText variant="h3">{moduleName}</QuantumText>
            <QuantumText variant="caption" color={theme.accent}>
              Live workflow sync
            </QuantumText>
          </QuantumCard>
        ))}
      </View>

      <MultimodalCaptureModal
        visible={!!captureModalType}
        captureType={captureModalType}
        onClose={() => setCaptureModalType(null)}
        onConfirmationReady={(data) => setConfirmationData(data)}
      />
      <AIConfirmationModal data={confirmationData} onClose={() => setConfirmationData(null)} />
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  multimodalRow: { flexDirection: 'row', gap: quantumSpace.sm },
  launcher: { flex: 1 },
  boltOnHeader: { flexDirection: 'row', gap: quantumSpace.md, alignItems: 'center' },
  boltOnIcon: { width: 32, textAlign: 'center' },
  boltOnCopy: { flex: 1, gap: quantumSpace.xs },
  boltOnFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.md },
  moduleCard: { flexGrow: 1, flexBasis: '47%', minWidth: 148 },
})
