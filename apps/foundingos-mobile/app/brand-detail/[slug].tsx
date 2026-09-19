/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useState } from 'react'
import { BRANDS } from '../../lib/brands'
import { QuantumBackButton } from '../../components/QuantumBackButton'
import { QuantumButton, QuantumCard, QuantumScreen, QuantumSectionHeader, QuantumText, quantumSpace } from '../../components/QuantumUI'

const SUITE_ROUTES: Record<string, string> = {
  core_operations: '/(app)/home',
  core_workforce: '/(app)/workforce',
  core_intelligence: '/(app)/intelligence',
  foundingos: '/(app)/home',
}

// The FoundingOS Home overview brand's "modules" are already real, dedicated
// screens (not generic module-detail lists) — route straight there.
const FOUNDINGOS_HOME_MODULE_ROUTES: Record<string, string> = {
  'business-pulse': '/(app)/home',
  approvals: '/(app)/workflows',
  messaging: '/(app)/automation',
  'event-feed': '/(app)/activity',
}

export default function BrandDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const brand = BRANDS.find((entry) => entry.slug === slug)
  const [logoUnavailable, setLogoUnavailable] = useState(false)

  if (!brand) return null

  const suiteRoute = SUITE_ROUTES[brand.slug] ?? '/(app)/home'

  return (
    <QuantumScreen style={{ backgroundColor: brand.accent }}>
      <QuantumBackButton label="‹ Workspaces" />
      <QuantumCard accent={brand.accent}>
        <View style={styles.brandHero}>
          {logoUnavailable ? (
            <View style={[styles.logoFallback, { borderColor: brand.accent }]}>
              <QuantumText variant="h2" color={brand.accent} align="center">
                {brand.name.replace('Found', '').slice(0, 2).toUpperCase()}
              </QuantumText>
            </View>
          ) : (
            <Image source={brand.logo} resizeMode="contain" style={styles.logo} onError={() => setLogoUnavailable(true)} />
          )}
          <View style={styles.brandCopy}>
            <QuantumText variant="overline" color={brand.accent}>FoundingOS suite</QuantumText>
            <QuantumText variant="h1">{brand.name}</QuantumText>
            <QuantumText color="#D8D8D8">{brand.tagline}</QuantumText>
          </View>
        </View>
      </QuantumCard>

      <QuantumSectionHeader label="What this suite covers" />
      <View style={styles.grid}>
        {brand.modules.map((module) => {
          const moduleId = module.toLowerCase().replaceAll(' ', '-')
          const target = brand.slug === 'foundingos' ? FOUNDINGOS_HOME_MODULE_ROUTES[moduleId] : `/module-detail/${brand.slug}/${moduleId}`
          return (
            <Pressable key={module} onPress={() => target && router.push(target as never)}>
              <QuantumCard accent={brand.accent} style={styles.moduleChip}>
                <QuantumText>{module}</QuantumText>
              </QuantumCard>
            </Pressable>
          )
        })}
      </View>

      <QuantumButton onPress={() => router.push(suiteRoute as never)}>
        Open {brand.homeLabel}
      </QuantumButton>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  brandHero: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.md },
  brandCopy: { flex: 1, gap: quantumSpace.xs },
  logo: { width: 72, height: 72 },
  logoFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { gap: quantumSpace.sm },
  moduleChip: { paddingVertical: quantumSpace.sm },
})
