/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { BRANDS, FOUNDINGOS_ACCENT } from '../../lib/brands'
import { logout } from '../../lib/api'
import { AIOnboardingCard } from '../../components/AIOnboardingCard'
import { QuantumButton, QuantumCard, QuantumHeader, QuantumListItem, QuantumScreen, QuantumText, quantumSpace } from '../../components/QuantumUI'

export default function DashboardScreen() {
  async function handleLogout() {
    await logout()
    router.dismissTo('/')
  }

  return (
    <QuantumScreen>
      <QuantumHeader
        eyebrow="FoundingOS base"
        title="Brand control room"
        description="Every brand keeps its own locked colour identity while sharing one Quantum operating shell."
        accent={FOUNDINGOS_ACCENT}
      />

      <AIOnboardingCard
        accent={FOUNDINGOS_ACCENT}
        brandKey="foundingos-brands"
        brandName="FoundingOS"
        description="Tap a brand to inspect live activity, or open a module directly from its brand card."
        actionLabel={BRANDS[0] ? `open ${BRANDS[0].name}` : undefined}
        onDoThisForMe={BRANDS[0] ? () => router.push(`/brand-detail/${BRANDS[0].slug}`) : undefined}
      />

      {BRANDS.map((brand) => (
        <QuantumCard key={brand.slug} accent={brand.accent}>
          <QuantumListItem
            title={brand.name}
            subtitle={brand.tagline}
            accent={brand.accent}
            onPress={() => router.push(`/brand-detail/${brand.slug}`)}
          />
          <View style={styles.moduleGrid}>
            {brand.modules.map((module) => (
              <QuantumButton
                key={module}
                tone="ghost"
                onPress={() => router.push(`/module-detail/${brand.slug}/${module.toLowerCase().replaceAll(' ', '-')}`)}
              >
                {module}
              </QuantumButton>
            ))}
          </View>
        </QuantumCard>
      ))}

      <QuantumButton tone="danger" onPress={handleLogout}>Log out</QuantumButton>
      <QuantumText variant="caption" align="center">FoundingOS Base · #0A0A0A · white accents</QuantumText>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
})
