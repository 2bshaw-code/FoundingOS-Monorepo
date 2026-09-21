/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Pressable, View, StyleSheet } from 'react-native'
import { BRANDS, FOUNDINGOS_ACCENT } from '../../../lib/brands'
import { getSession } from '../../../lib/core-operations-api'
import { WORKSPACES } from '../../../lib/workspace-modules'
import { useQuantumStore } from '../../../lib/store'
import { QuantumButton, QuantumCard, QuantumHeader, QuantumNotice, QuantumScreen, QuantumSectionHeader, QuantumText, quantumSpace } from '../../../components/QuantumUI'

export default function WorkspaceDirectoryScreen() {
  const setActiveBrand = useQuantumStore((state) => state.setActiveBrand)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    getSession().then((session) => setConnected(Boolean(session)))
  }, [])

  const statuses = useMemo(() => ({
    foundingos: { label: connected ? 'Shell active' : 'Shell ready', tone: 'info' as const, route: '/home' },
    core_operations: { label: connected ? 'Live Core.Operations data connected' : 'Sign in required', tone: connected ? 'success' as const : 'warning' as const, route: '/home' },
    core_workforce: { label: 'Not yet connected to a real backend', tone: 'warning' as const, route: null },
    core_intelligence: { label: connected ? 'Live intelligence via Core.Operations' : 'Sign in required', tone: connected ? 'success' as const : 'warning' as const, route: '/intelligence' },
  }), [connected])

  const openWorkspace = (slug: string, route: string | null) => {
    setActiveBrand(slug)
    if (route) router.push(route)
  }

  return (
    <QuantumScreen>
      <QuantumHeader
        eyebrow="Unified suite directory"
        title="Workspace Directory"
        description="Only the four current suite entries remain in the shell: Home, Core.Operations, Core.Workforce, and Core.Intelligence."
        accent={FOUNDINGOS_ACCENT}
      />

      {BRANDS.map((brand) => {
        const state = statuses[brand.slug as keyof typeof statuses]
        return (
          <QuantumCard key={brand.slug} accent={brand.accent}>
            <View style={styles.rowBetween}>
              <View style={styles.flex}>
                <QuantumText variant="overline" color={brand.accent}>{brand.homeLabel}</QuantumText>
                <QuantumText variant="h2">{brand.name}</QuantumText>
                <QuantumText variant="caption">{brand.tagline}</QuantumText>
              </View>
              <QuantumNotice tone={state.tone}>{state.label}</QuantumNotice>
            </View>
            <View style={styles.moduleGrid}>
              {brand.modules.map((module) => (
                <QuantumButton key={module} tone="ghost" onPress={state.route ? () => openWorkspace(brand.slug, state.route) : undefined}>
                  {module}
                </QuantumButton>
              ))}
            </View>
            <QuantumButton onPress={() => openWorkspace(brand.slug, state.route)} disabled={!state.route}>
              {state.route ? `Open ${brand.shortName}` : 'Backend not connected yet'}
            </QuantumButton>
          </QuantumCard>
        )
      })}

      <QuantumSectionHeader label="Live workspaces · full module access" />
      <QuantumText variant="caption">
        Every module below reads and writes the same real, tenant-scoped data as the web app — sales pipelines, orders,
        inventory, campaigns, payroll, and more.
      </QuantumText>
      <View style={styles.workspaceGrid}>
        {WORKSPACES.map((workspace) => (
          <Pressable key={workspace.slug} style={styles.workspaceCard} onPress={() => router.push(`/workspace/${workspace.slug}`)}>
            <QuantumCard accent={workspace.accent}>
              <QuantumText variant="h3">{workspace.label}</QuantumText>
              <QuantumText variant="caption">{workspace.modules.length} modules</QuantumText>
            </QuantumCard>
          </Pressable>
        ))}
      </View>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  flex: { flex: 1 },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  workspaceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  workspaceCard: { minWidth: 150, flexGrow: 1 },
})
