/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { BRANDS } from '../lib/brands'
import { FOUNDINGOS_SHELL_THEME, useQuantumStore } from '../lib/store'
import { QuantumBackButton } from './QuantumBackButton'
import { QuantumCard, QuantumScreen, QuantumText, quantumRadius, quantumSpace } from './QuantumUI'

export function Brand360Changer() {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const setActiveBrand = useQuantumStore((state) => state.setActiveBrand)
  const [missingLogos, setMissingLogos] = useState<Record<string, boolean>>({})

  return (
    <QuantumScreen>
      <QuantumBackButton label="‹ Home" />
      <QuantumCard accent={FOUNDINGOS_SHELL_THEME.accent}>
        <QuantumText variant="overline" color={FOUNDINGOS_SHELL_THEME.accent}>
          FoundingOS BrandWheel
        </QuantumText>
        <QuantumText variant="h1" numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.72}>
          360 Brand Changer
        </QuantumText>
        <QuantumText variant="caption">
          Switch the active brand accent only. The FoundingOS royal-blue Quantum shell stays locked.
        </QuantumText>
      </QuantumCard>

      <View style={styles.grid}>
        {BRANDS.map((brand) => {
          const isActive = brand.slug === activeBrandSlug

          return (
            <Pressable
              key={brand.slug}
              accessibilityRole="button"
              accessibilityLabel={`Switch to ${brand.name}`}
              onPress={() => setActiveBrand(brand.slug)}
              style={({ pressed }) => [
                styles.brandButton,
                {
                  borderColor: isActive ? brand.accent : FOUNDINGOS_SHELL_THEME.borderColor,
                  backgroundColor: isActive ? brand.accent : FOUNDINGOS_SHELL_THEME.cardBg,
                  shadowColor: brand.accent,
                  opacity: pressed ? 0.86 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View style={[styles.logoFrame, { borderColor: isActive ? FOUNDINGOS_SHELL_THEME.bgPrimary : brand.accent }]}>
                {missingLogos[brand.slug] ? (
                  <QuantumText variant="caption" color={isActive ? FOUNDINGOS_SHELL_THEME.bgPrimary : brand.accent} align="center">
                    {brand.slug === 'foundingos' ? 'OS' : brand.name.replace('Found', '').slice(0, 2).toUpperCase()}
                  </QuantumText>
                ) : (
                  <Image
                    source={brand.logo}
                    resizeMode="contain"
                    style={styles.logo}
                    onError={() => setMissingLogos((current) => ({ ...current, [brand.slug]: true }))}
                  />
                )}
              </View>
              <View style={styles.copy}>
                <QuantumText
                  variant="h3"
                  color={isActive ? FOUNDINGOS_SHELL_THEME.bgPrimary : brand.accent}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                >
                  {brand.name}
                </QuantumText>
                <QuantumText
                  variant="caption"
                  color={isActive ? FOUNDINGOS_SHELL_THEME.bgPrimary : undefined}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.78}
                >
                  {isActive ? 'Active accent' : brand.tagline}
                </QuantumText>
              </View>
            </Pressable>
          )
        })}
      </View>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  grid: {
    gap: quantumSpace.md,
  },
  brandButton: {
    minHeight: 82,
    borderWidth: 1,
    borderRadius: quantumRadius.lg,
    padding: quantumSpace.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: quantumSpace.md,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  logoFrame: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 34,
    height: 34,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: quantumSpace.xs,
  },
})
