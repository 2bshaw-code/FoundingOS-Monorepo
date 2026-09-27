/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// One switch for example records across every workspace (Retail, Logistics, Finance, Health…) and SuperDash.
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { isDemoData, setDemoData, subscribeDemoData } from '../lib/demo-data'
import { QuantumButton, QuantumText, quantumColors, quantumSpace } from './QuantumUI'

export function useDemoFlag() {
  const [demo, setDemo] = useState(isDemoData)
  useEffect(() => subscribeDemoData(setDemo), [])
  return demo
}

export function DemoDataBar({ label }: { label: string }) {
  const demo = useDemoFlag()
  return (
    <View style={[styles.bar, demo ? styles.on : null]}>
      <View style={styles.copy}>
        <QuantumText variant="label" color={demo ? quantumColors.warning : undefined}>{demo ? 'Demo data on' : 'See it in action'}</QuantumText>
        <QuantumText variant="caption" color={quantumColors.neutral300}>{demo ? 'Made-up example records in every workspace. Changes stay on this phone and never touch your real account.' : `Fill ${label} with realistic example records to explore every tool.`}</QuantumText>
      </View>
      <QuantumButton tone={demo ? 'secondary' : undefined} onPress={() => setDemoData(!demo)}>{demo ? 'Back to my data' : 'Load demo data'}</QuantumButton>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: quantumSpace.sm, padding: quantumSpace.sm, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(148,163,184,0.45)' },
  on: { borderStyle: 'solid', borderColor: quantumColors.warning, backgroundColor: 'rgba(245,158,11,0.08)' },
  copy: { flex: 1, minWidth: 180, gap: 2 },
})
