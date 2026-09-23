/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { FOUNDINGOS_ACCENT } from '../../../lib/brands'
import { getSession } from '../../../lib/core-operations-api'
import { SUITE_LINKS } from '../../../lib/nav-directory'
import { WORKSPACES } from '../../../lib/workspace-modules'
import { useQuantumStore } from '../../../lib/store'
import { logAction } from '../../../lib/action-logger'
import { QuantumCard, QuantumHeader, QuantumNotice, QuantumScreen, QuantumSectionHeader, QuantumText, quantumSpace } from '../../../components/QuantumUI'

// Every destination in the app — the suites, their dedicated dashboards, and the
// live per-workspace module grids — lives on this one directory screen instead of
// being spread across a crowded 8-item tab bar. This mirrors the web app, where a
// single workspace picker is the front door and everything else is one tap deeper.

export default function WorkspaceDirectoryScreen() {
  const setActiveBrand = useQuantumStore((state) => state.setActiveBrand)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    getSession().then((session) => setConnected(Boolean(session)))
  }, [])

  const connectionNotice = useMemo(
    () => (connected ? { label: 'Signed in · live data', tone: 'success' as const } : { label: 'Sign in required for live data', tone: 'warning' as const }),
    [connected],
  )

  const open = (slug: string, route: string) => {
    setActiveBrand(slug)
    logAction('workspace_switch', 'success', { workspace: slug })
    router.push(route as never)
  }

  return (
    <QuantumScreen>
      <QuantumHeader
        eyebrow="Everything, one tap away"
        title="Workspaces"
        description="Pick a suite or a live workspace below — this is the single starting point for the whole app."
        accent={FOUNDINGOS_ACCENT}
      />

      <QuantumSectionHeader label="Suites & dashboards" action={<QuantumNotice tone={connectionNotice.tone}>{connectionNotice.label}</QuantumNotice>} />
      <View style={styles.suiteGrid}>
        {SUITE_LINKS.filter((suite) => suite.label !== 'Account').map((suite, i) => (
          <QuantumCard key={suite.slug} accent={suite.accent} style={styles.suiteCard} index={i} onPress={() => open(suite.slug, suite.route)}>
            <QuantumText variant="overline" color={suite.accent}>{suite.label}</QuantumText>
            <QuantumText variant="h3">{suite.name}</QuantumText>
            <QuantumText variant="caption">{suite.tagline}</QuantumText>
          </QuantumCard>
        ))}
      </View>

      <QuantumSectionHeader label="Account" />
      <View style={styles.suiteGrid}>
        {SUITE_LINKS.filter((suite) => suite.label === 'Account').map((suite, i) => (
          <QuantumCard key={suite.slug} accent={suite.accent} style={styles.suiteCard} index={i} onPress={() => open(suite.slug, suite.route)}>
            <QuantumText variant="h3">{suite.name}</QuantumText>
            <QuantumText variant="caption">{suite.tagline}</QuantumText>
          </QuantumCard>
        ))}
      </View>

      <QuantumSectionHeader label="Live workspaces · full module access" />
      <QuantumText variant="caption">
        Every module below reads and writes the same real, tenant-scoped data as the web app — sales pipelines, orders,
        inventory, campaigns, payroll, and more.
      </QuantumText>
      <View style={styles.workspaceGrid}>
        {WORKSPACES.map((workspace, i) => (
          <QuantumCard key={workspace.slug} accent={workspace.accent} style={styles.workspaceCard} index={i} onPress={() => router.push(`/workspace/${workspace.slug}`)}>
            <QuantumText variant="h3">{workspace.label}</QuantumText>
            <QuantumText variant="caption">{workspace.modules.length} modules</QuantumText>
          </QuantumCard>
        ))}
      </View>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  suiteGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  suiteCard: { minWidth: 170, flexGrow: 1 },
  workspaceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  workspaceCard: { minWidth: 150, flexGrow: 1 },
})
