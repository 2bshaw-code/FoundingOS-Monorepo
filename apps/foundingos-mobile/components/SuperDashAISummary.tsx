/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { useAIAssistance } from '../lib/ai-assistance'
import { QuantumButton, QuantumCard, QuantumText, quantumSpace } from './QuantumUI'

export type SuperDashBrandRow = { brand: string; serviceLoad: number; previousServiceLoad: number; status: 'good' | 'watch' | 'risk' }
export type SuperDashAnomaly = { brand: string; signal: string; tone: 'good' | 'watch' | 'risk' }

type WhatMatters = { text: string; investigateLabel: string; investigateHref: string }
export type SuperDashAISummaryData = { dailySummary: string; whatChanged: string | null; whatMatters: WhatMatters | null }

export function computeSuperDashAISummary(brandRows: SuperDashBrandRow[], anomalies: SuperDashAnomaly[], guardianWarnings: string[]): SuperDashAISummaryData {
  const riskCount = brandRows.filter((row) => row.status === 'risk').length
  const watchCount = brandRows.filter((row) => row.status === 'watch').length

  let dailySummary: string
  if (riskCount > 0) {
    const watchNote = watchCount > 0 ? `, and ${watchCount} more worth watching` : ''
    dailySummary = `${riskCount} of ${brandRows.length} brands ${riskCount > 1 ? 'need' : 'needs'} attention right now${watchNote}.`
  } else if (watchCount > 0) {
    dailySummary = `Everything is stable with ${watchCount} brand${watchCount > 1 ? 's' : ''} worth monitoring.`
  } else {
    dailySummary = `All ${brandRows.length} brands are operating cleanly today.`
  }

  let whatChanged: string | null = null
  if (brandRows.length > 0) {
    const biggest = brandRows.reduce((a, b) => (Math.abs(b.serviceLoad - b.previousServiceLoad) > Math.abs(a.serviceLoad - a.previousServiceLoad) ? b : a))
    const delta = biggest.serviceLoad - biggest.previousServiceLoad
    if (delta !== 0) {
      whatChanged = `${biggest.brand} service load moved ${delta > 0 ? 'up' : 'down'} ${Math.abs(delta)} from ${biggest.previousServiceLoad} to ${biggest.serviceLoad}.`
    }
  }

  let whatMatters: WhatMatters | null = null
  if (guardianWarnings.length > 0) {
    whatMatters = { text: guardianWarnings[0], investigateLabel: 'Open Guardian', investigateHref: '/(app)/guardian' }
  } else if (anomalies.length > 0) {
    const topAnomaly = anomalies.find((anomaly) => anomaly.tone === 'risk') ?? anomalies[0]
    whatMatters = { text: `${topAnomaly.brand}: ${topAnomaly.signal}`, investigateLabel: 'View anomalies below', investigateHref: '' }
  } else {
    const worstBrand = brandRows.find((row) => row.status === 'risk') ?? brandRows.find((row) => row.status === 'watch')
    if (worstBrand) whatMatters = { text: `${worstBrand.brand} is flagged as ${worstBrand.status}.`, investigateLabel: 'View brand rows below', investigateHref: '' }
  }

  return { dailySummary, whatChanged, whatMatters }
}

export function SuperDashAISummary({ brandRows, anomalies, guardianWarnings, accent }: { brandRows: SuperDashBrandRow[]; anomalies: SuperDashAnomaly[]; guardianWarnings: string[]; accent: string }) {
  const [aiEnabled] = useAIAssistance()
  if (!aiEnabled) return null

  const summary = computeSuperDashAISummary(brandRows, anomalies, guardianWarnings)

  return (
    <View style={styles.stack}>
      <QuantumCard accent={accent}>
        <QuantumText variant="overline" color={accent}>AI daily summary</QuantumText>
        <QuantumText>{summary.dailySummary}</QuantumText>
      </QuantumCard>

      {summary.whatChanged ? (
        <QuantumCard accent={accent}>
          <QuantumText variant="overline" color={accent}>What changed</QuantumText>
          <QuantumText>{summary.whatChanged}</QuantumText>
        </QuantumCard>
      ) : null}

      {summary.whatMatters ? (
        <QuantumCard accent={accent}>
          <QuantumText variant="overline" color={accent}>What matters</QuantumText>
          <QuantumText>{summary.whatMatters.text}</QuantumText>
          {summary.whatMatters.investigateHref ? (
            <QuantumButton onPress={() => router.push(summary.whatMatters!.investigateHref as any)}>
              Investigate — {summary.whatMatters.investigateLabel}
            </QuantumButton>
          ) : (
            <QuantumText variant="caption">{summary.whatMatters.investigateLabel}</QuantumText>
          )}
        </QuantumCard>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  stack: { gap: quantumSpace.md },
})
