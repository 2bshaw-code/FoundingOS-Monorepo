/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useRef, useState } from 'react'
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native'
import { BRANDS } from '../lib/brands'
import { useQuantumStore } from '../lib/store'
import { QuantumSphere } from './QuantumSphere'
import { QuantumButton, QuantumCard, QuantumModalSurface, QuantumPill, QuantumText, quantumColors, quantumRadius, quantumSpace, useActiveQuantumTheme } from './QuantumUI'

export function QuantumWheelModal() {
  const quantumWheelOpen = useQuantumStore((state) => state.quantumWheelOpen)
  const setQuantumWheelOpen = useQuantumStore((state) => state.setQuantumWheelOpen)
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const setActiveBrand = useQuantumStore((state) => state.setActiveBrand)
  const theme = useActiveQuantumTheme()
  const rotateAnim = useRef(new Animated.Value(0)).current
  const [selectedIndex, setSelectedIndex] = useState(Math.max(0, BRANDS.findIndex((brand) => brand.slug === activeBrandSlug)))

  useEffect(() => {
    if (!quantumWheelOpen) return
    const nextIndex = Math.max(0, BRANDS.findIndex((brand) => brand.slug === activeBrandSlug))
    setSelectedIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex))
  }, [activeBrandSlug, quantumWheelOpen])

  if (!quantumWheelOpen) return null

  const radius = 110
  const centerOffset = 130
  const selectedBrand = BRANDS[selectedIndex]

  const handleSelectBrand = (index: number, slug: string) => {
    setSelectedIndex(index)
    setActiveBrand(slug)
    Animated.spring(rotateAnim, {
      toValue: index * (360 / BRANDS.length),
      useNativeDriver: true,
      friction: 6,
      tension: 40,
    }).start()
  }

  return (
    <Modal visible={quantumWheelOpen} transparent animationType="fade" onRequestClose={() => setQuantumWheelOpen(false)}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setQuantumWheelOpen(false)} />
        <QuantumModalSurface style={styles.surface}>
          <QuantumText variant="overline" color={theme.accent} align="center">Quantum wheel</QuantumText>
          <QuantumText variant="h2" align="center">360° Brand Switcher</QuantumText>
          <QuantumText variant="caption" align="center">Choose the active brand shell, console context, and accent skin.</QuantumText>

          <View style={styles.activeHub}>
            <QuantumCard accent={theme.accent} style={styles.activeBubble}>
              <QuantumSphere size={52} accent={theme.accent} />
              <QuantumText variant="h3" align="center">{selectedBrand?.name ?? 'FoundingOS'}</QuantumText>
            </QuantumCard>
          </View>

          <Animated.View style={styles.radialRing}>
            {BRANDS.map((brand, index) => {
              const angleDeg = index * (360 / BRANDS.length) - 90
              const angleRad = (angleDeg * Math.PI) / 180
              const left = radius * Math.cos(angleRad) + centerOffset - 24
              const top = radius * Math.sin(angleRad) + centerOffset - 24
              const isSelected = activeBrandSlug === brand.slug

              return (
                <Pressable
                  key={brand.slug}
                  onPress={() => handleSelectBrand(index, brand.slug)}
                  style={[
                    styles.brandNode,
                    {
                      left,
                      top,
                      borderColor: brand.accent,
                      backgroundColor: isSelected ? brand.accent : quantumColors.neutral800,
                      shadowColor: brand.accent,
                    },
                  ]}
                >
                  <QuantumText variant="caption" color={isSelected ? quantumColors.neutral900 : brand.accent}>
                    {brand.slug === 'foundingos' ? 'OS' : brand.name.replace('Found', '').slice(0, 2).toUpperCase()}
                  </QuantumText>
                </Pressable>
              )
            })}
          </Animated.View>

          {selectedBrand ? (
            <QuantumCard accent={selectedBrand.accent}>
              <QuantumText variant="h3">{selectedBrand.name}</QuantumText>
              <QuantumText variant="caption">{selectedBrand.tagline}</QuantumText>
              <View style={styles.modulesRow}>
                {selectedBrand.modules.map((module) => (
                  <QuantumPill key={module} accent={selectedBrand.accent}>{module}</QuantumPill>
                ))}
              </View>
            </QuantumCard>
          ) : null}

          <QuantumButton onPress={() => setQuantumWheelOpen(false)}>Apply Console Skin</QuantumButton>
        </QuantumModalSurface>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 10, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: quantumSpace.xl,
  },
  surface: {
    alignItems: 'stretch',
  },
  activeHub: {
    alignItems: 'center',
    marginVertical: quantumSpace.sm,
  },
  activeBubble: {
    width: 150,
    alignItems: 'center',
  },
  radialRing: {
    width: 260,
    height: 260,
    alignSelf: 'center',
    position: 'relative',
    marginVertical: quantumSpace.sm,
  },
  brandNode: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: quantumRadius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modulesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: quantumSpace.sm,
  },
})
