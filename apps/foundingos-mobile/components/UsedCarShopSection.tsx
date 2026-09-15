/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { BODY_TYPE_FILTERS, MILEAGE_FILTERS, PRICE_FILTERS, filterUsedCars, formatMileage, formatPrice, type UsedCar } from '../lib/used-car-shop'
import { QuantumButton, QuantumCard, QuantumPill, QuantumSectionHeader, QuantumText, quantumRadius, quantumSpace } from './QuantumUI'

export function UsedCarShopSection({ accent }: { accent: string }) {
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [maxMileage, setMaxMileage] = useState<number | undefined>(undefined)
  const [bodyType, setBodyType] = useState<(typeof BODY_TYPE_FILTERS)[number]>('All')
  const [selectedCar, setSelectedCar] = useState<UsedCar | null>(null)

  const cars = filterUsedCars({ maxPrice, maxMileage, bodyType })

  return (
    <View style={styles.wrap}>
      <QuantumSectionHeader label="Used Car Shop" />
      <QuantumCard accent={accent}>
        <QuantumText variant="overline" color={accent}>FoundRetail automotive</QuantumText>
        <QuantumText variant="h2">Forecourt inventory</QuantumText>
        <QuantumText variant="caption">
          Example used-car stock with price, mileage, body type, and finance options.
        </QuantumText>
      </QuantumCard>

      <QuantumCard accent={accent}>
        <QuantumText variant="caption" color={accent}>Filters</QuantumText>
        <View style={styles.filterRow}>
          {PRICE_FILTERS.map((filter) => (
            <QuantumPill key={filter.label} accent={accent} active={maxPrice === filter.value} onPress={() => setMaxPrice(filter.value)}>
              {filter.label}
            </QuantumPill>
          ))}
        </View>
        <View style={styles.filterRow}>
          {MILEAGE_FILTERS.map((filter) => (
            <QuantumPill key={filter.label} accent={accent} active={maxMileage === filter.value} onPress={() => setMaxMileage(filter.value)}>
              {filter.label}
            </QuantumPill>
          ))}
        </View>
        <View style={styles.filterRow}>
          {BODY_TYPE_FILTERS.map((filter) => (
            <QuantumPill key={filter} accent={accent} active={bodyType === filter} onPress={() => setBodyType(filter)}>
              {filter}
            </QuantumPill>
          ))}
        </View>
      </QuantumCard>

      {cars.length === 0 ? (
        <QuantumCard accent={accent}>
          <QuantumText variant="caption" align="center">No vehicles match those filters.</QuantumText>
        </QuantumCard>
      ) : (
        cars.map((car) => (
          <QuantumCard key={car.id} accent={accent}>
            <View style={styles.carHeader}>
              <View style={[styles.photoFrame, { borderColor: accent }]}>
                <QuantumText variant="h2" color={accent} align="center">◈</QuantumText>
                <QuantumText variant="caption" align="center">{car.color}</QuantumText>
              </View>
              <View style={styles.carCopy}>
                <QuantumText variant="h3" numberOfLines={2}>{car.name}</QuantumText>
                <QuantumText variant="caption" color={accent}>
                  {formatPrice(car)} · {formatMileage(car)} · {car.year}
                </QuantumText>
                <QuantumText variant="caption">
                  {car.bodyType} · {car.fuel} · {car.transmission}
                </QuantumText>
              </View>
            </View>

            {selectedCar?.id === car.id ? (
              <View style={styles.detail}>
                <QuantumText variant="caption">{car.description}</QuantumText>
                <QuantumText variant="caption" color={accent}>
                  Finance: {car.finance.depositPct}% deposit · ${car.finance.monthly}/mo · {car.finance.termMonths} months
                </QuantumText>
                <QuantumText variant="caption">Photos: 8 angles + interior (demo placeholders)</QuantumText>
              </View>
            ) : null}

            <QuantumButton
              tone="secondary"
              onPress={() => setSelectedCar((current) => (current?.id === car.id ? null : car))}
            >
              {selectedCar?.id === car.id ? 'Hide details' : 'View details'}
            </QuantumButton>
          </QuantumCard>
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: quantumSpace.md },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  carHeader: { flexDirection: 'row', gap: quantumSpace.md, alignItems: 'center' },
  photoFrame: {
    width: 72,
    height: 72,
    borderRadius: quantumRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: quantumSpace.xs,
  },
  carCopy: { flex: 1, minWidth: 0, gap: quantumSpace.xs },
  detail: { gap: quantumSpace.sm },
})
