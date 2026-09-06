/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { JOURNEY_COHORTS, JOURNEY_STAGES, journeyMaxForCohort, stageConversion, type JourneyCohort } from '../lib/customer-journey'
import { QuantumCard, QuantumPill, QuantumSectionHeader, QuantumText, quantumColors, quantumRadius, quantumSpace } from './QuantumUI'

export function CustomerJourneySection({ accent, brandName }: { accent: string; brandName: string }) {
  const [cohort, setCohort] = useState<JourneyCohort>('Medium')
  const max = journeyMaxForCohort(cohort)

  return (
    <View style={styles.wrap}>
      <QuantumSectionHeader label="Customer Journey" />
      <QuantumCard accent={accent}>
        <QuantumText variant="overline" color={accent}>{brandName} journey</QuantumText>
        <QuantumText variant="h2">Visual customer progression</QuantumText>
        <QuantumText variant="caption">
          Track how customers move from first touch to loyal repeat buyer, by cohort.
        </QuantumText>
        <View style={styles.cohortRow}>
          {JOURNEY_COHORTS.map((entry) => (
            <QuantumPill key={entry} accent={accent} active={cohort === entry} onPress={() => setCohort(entry)}>
              {entry}
            </QuantumPill>
          ))}
        </View>
      </QuantumCard>

      <QuantumCard accent={accent}>
        <View style={styles.journey}>
          <View style={[styles.quantumLine, { backgroundColor: accent }]} />
          {JOURNEY_STAGES.map((stage, index) => {
            const value = stage.values[cohort]
            const fill = Math.max(8, Math.round((value / max) * 100))
            return (
              <View key={stage.id} style={styles.stage}>
                <View style={[styles.stageDot, { borderColor: accent, backgroundColor: index === 0 ? accent : 'transparent' }]}>
                  <QuantumText variant="caption" color={index === 0 ? quantumColors.neutral900 : accent} align="center">
                    {stage.icon}
                  </QuantumText>
                </View>
                <View style={styles.stageCopy}>
                  <View style={styles.stageHeader}>
                    <QuantumText variant="h3" numberOfLines={1}>{stage.label}</QuantumText>
                    <QuantumText variant="caption" color={accent}>
                      {value.toLocaleString('en-GB')} · {stageConversion(stage, cohort)}
                    </QuantumText>
                  </View>
                  <QuantumText variant="caption">{stage.description}</QuantumText>
                  <View style={[styles.meterTrack, { borderColor: accent }]}>
                    <View style={[styles.meterFill, { width: `${fill}%`, backgroundColor: accent, shadowColor: accent }]} />
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </QuantumCard>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: quantumSpace.md },
  cohortRow: { flexDirection: 'row', gap: quantumSpace.sm },
  journey: { position: 'relative', gap: quantumSpace.lg, paddingLeft: quantumSpace.lg },
  quantumLine: {
    position: 'absolute',
    left: 19,
    top: quantumSpace.sm,
    bottom: quantumSpace.sm,
    width: 1,
    opacity: 0.4,
  },
  stage: { flexDirection: 'row', gap: quantumSpace.md, alignItems: 'flex-start' },
  stageDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -26 - quantumSpace.lg + 1,
  },
  stageCopy: { flex: 1, minWidth: 0, gap: quantumSpace.xs },
  stageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: quantumSpace.sm },
  meterTrack: {
    height: 8,
    borderWidth: 1,
    borderRadius: quantumRadius.pill,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: quantumRadius.pill,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
})
