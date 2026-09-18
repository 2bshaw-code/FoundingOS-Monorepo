/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { StyleSheet, View } from 'react-native'
import { QuantumText, quantumColors, quantumRadius, quantumSpace, useActiveQuantumTheme } from './QuantumUI'

export function QuantumMiniBars({
  values,
  accent,
  emptyLabel,
  footerLabel,
}: {
  values: number[]
  accent: string
  emptyLabel: string
  footerLabel?: string
}) {
  const theme = useActiveQuantumTheme()
  const cleaned = values.filter((value) => Number.isFinite(value) && value >= 0)
  const max = Math.max(...cleaned, 0)

  if (!cleaned.length || max <= 0) {
    return <QuantumText variant="caption" color={theme.subtextColor}>{emptyLabel}</QuantumText>
  }

  return (
    <View style={styles.chartWrap}>
      <View style={styles.barRow}>
        {cleaned.map((value, index) => (
          <View key={`${index}-${value}`} style={styles.barSlot}>
            <View
              style={[
                styles.bar,
                {
                  backgroundColor: accent,
                  opacity: 0.35 + (value / max) * 0.65,
                  height: Math.max(6, Math.round((value / max) * 42)),
                },
              ]}
            />
          </View>
        ))}
      </View>
      {footerLabel ? <QuantumText variant="caption" color={theme.subtextColor}>{footerLabel}</QuantumText> : null}
    </View>
  )
}

export function QuantumComparisonBars({
  current,
  previous,
  accent,
  labels = { current: 'Current', previous: 'Previous' },
}: {
  current: number
  previous: number
  accent: string
  labels?: { current: string; previous: string }
}) {
  const theme = useActiveQuantumTheme()
  const max = Math.max(current, previous, 1)

  return (
    <View style={styles.comparisonWrap}>
      {[
        { key: 'current', value: current, label: labels.current, color: accent },
        { key: 'previous', value: previous, label: labels.previous, color: quantumColors.neutral300 },
      ].map((entry) => (
        <View key={entry.key} style={styles.comparisonRow}>
          <QuantumText variant="caption" color={theme.subtextColor} style={styles.comparisonLabel}>
            {entry.label}
          </QuantumText>
          <View style={[styles.track, { backgroundColor: theme.bgSecondary, borderColor: theme.borderColor }]}>
            <View
              style={[
                styles.fill,
                {
                  backgroundColor: entry.color,
                  width: `${Math.max(8, Math.round((entry.value / max) * 100))}%`,
                  opacity: entry.key === 'current' ? 1 : 0.55,
                },
              ]}
            />
          </View>
          <QuantumText variant="caption" color={entry.key === 'current' ? accent : theme.subtextColor}>
            {entry.value}%
          </QuantumText>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  chartWrap: {
    gap: quantumSpace.xs,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: quantumSpace.xs,
    minHeight: 44,
  },
  barSlot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: quantumRadius.sm,
    minHeight: 6,
  },
  comparisonWrap: {
    gap: quantumSpace.sm,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: quantumSpace.sm,
  },
  comparisonLabel: {
    width: 54,
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: quantumRadius.pill,
    overflow: 'hidden',
    borderWidth: 1,
  },
  fill: {
    height: '100%',
    borderRadius: quantumRadius.pill,
  },
})
