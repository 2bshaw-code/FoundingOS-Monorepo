/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// SuperDash WhatsApp growth scenario: a sourced, assumption-led projection for investors.
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { MARKET_FACTS, SCENARIOS, whatsappScenario, type ScenarioInputs, type ScenarioName } from '@foundingos/ui/whatsapp-scenario'
import { QuantumCard, QuantumPill, QuantumSectionHeader, QuantumText, QuantumTextInput, quantumColors, quantumSpace } from '../QuantumUI'

const gbp = (value: number) => `£${Math.round(value).toLocaleString('en-GB')}`
const FIELDS: Array<[key: keyof ScenarioInputs, label: string]> = [
  ['whatsappSharePct', '% of UK small businesses on WhatsApp'],
  ['reachPct', '% of those on FoundingOS by month 24'],
  ['paidConversionPct', '% of accounts paying'],
  ['arpuGbp', 'Average £ per paying customer / month'],
  ['arrMultiple', 'ARR multiple'],
]

export function FounderScenarioPanel() {
  const [name, setName] = useState<ScenarioName | 'custom'>('breakout')
  const [inputs, setInputs] = useState<ScenarioInputs>(SCENARIOS.breakout.inputs)
  const result = whatsappScenario(inputs)
  const pick = (key: ScenarioName) => { setName(key); setInputs(SCENARIOS[key].inputs) }
  const edit = (key: keyof ScenarioInputs, value: string) => { setName('custom'); setInputs({ ...inputs, [key]: Number(value.replace(',', '.')) }) }

  return (
    <View style={styles.wrap}>
      <QuantumSectionHeader label="WhatsApp growth scenario" />
      <QuantumCard>
        <QuantumText variant="caption" color="#86efac">A projection from public figures and your pricing — not traction. Present it that way.</QuantumText>
        <View style={styles.pills}>
          {(Object.keys(SCENARIOS) as ScenarioName[]).map((key) => <QuantumPill active={name === key} key={key} onPress={() => pick(key)}>{SCENARIOS[key].label}</QuantumPill>)}
        </View>
        {name !== 'custom' ? <QuantumText variant="caption" color={quantumColors.neutral300}>{SCENARIOS[name].summary}</QuantumText> : null}
        <QuantumText variant="caption" color={quantumColors.neutral300}>WhatsApp-first UK businesses</QuantumText>
        <QuantumText variant="h2">{result.whatsappBusinesses.toLocaleString('en-GB')}</QuantumText>
        {result.milestones.map((row) => (
          <View key={row.label} style={styles.row}>
            <QuantumText variant="label" style={styles.flex}>{row.label}</QuantumText>
            <QuantumText variant="caption">{row.paying.toLocaleString('en-GB')} paying · ARR {gbp(row.arrGbp)}</QuantumText>
          </View>
        ))}
        <View style={styles.valuation}>
          <QuantumText variant="caption" color={quantumColors.neutral300}>Illustrative valuation · {inputs.arrMultiple}× month-24 ARR</QuantumText>
          <QuantumText variant="h2" color="#38BDF8">{gbp(result.illustrativeValuationGbp)}</QuantumText>
        </View>
      </QuantumCard>
      <QuantumCard>
        <QuantumText variant="label">Assumptions</QuantumText>
        {FIELDS.map(([key, label]) => (
          <View key={key} style={styles.field}>
            <QuantumText variant="caption" color={quantumColors.neutral300}>{label}</QuantumText>
            <QuantumTextInput keyboardType="decimal-pad" onChangeText={(value) => edit(key, value)} value={String(inputs[key])} />
          </View>
        ))}
        <QuantumText variant="caption" color={quantumColors.neutral300}>Sources: {MARKET_FACTS.ukSmallBusinessesSource}. {MARKET_FACTS.whatsappBusinessSource}. Other figures are assumptions to back with your own evidence.</QuantumText>
      </QuantumCard>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: quantumSpace.sm },
  flex: { flex: 1 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: quantumSpace.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3, flexWrap: 'wrap' },
  valuation: { marginTop: quantumSpace.sm, gap: 2 },
  field: { gap: 2 },
})
