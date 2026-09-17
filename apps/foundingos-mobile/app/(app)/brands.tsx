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
        eyebrow="One FoundingOS account"
        title="Workspace directory"
        description="Open the operational areas enabled for your role and plan without leaving the shared FoundingOS shell."
        accent={FOUNDINGOS_ACCENT}
      />

      <AIOnboardingCard
        accent={FOUNDINGOS_ACCENT}
        brandKey="foundingos-workspaces"
        brandName="FoundingOS"
        description="Tap a workspace to inspect its activity, or open one of its included modules directly."
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
      <QuantumButton tone="ghost" onPress={() => router.push('/about')}>About FoundingOS</QuantumButton>
      <QuantumText variant="caption" align="center">One account · Role-based workspaces · Shared Event Feed</QuantumText>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
})
