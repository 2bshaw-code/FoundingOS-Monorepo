/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { QuantumBackButton } from '../../../components/QuantumBackButton'
import {
  QuantumCard,
  QuantumHeader,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  quantumSpace,
} from '../../../components/QuantumUI'
import { findWorkspace } from '../../../lib/workspace-modules'

export default function WorkspaceModulesScreen() {
  const { workspace: workspaceSlug } = useLocalSearchParams<{ workspace: string }>()
  const workspace = findWorkspace(String(workspaceSlug || ''))

  const groups = useMemo(() => {
    if (!workspace) return []
    const byGroup = new Map<string, typeof workspace.modules>()
    for (const item of workspace.modules) {
      if (!byGroup.has(item.group)) byGroup.set(item.group, [])
      byGroup.get(item.group)!.push(item)
    }
    return Array.from(byGroup.entries())
  }, [workspace])

  if (!workspace) return null

  return (
    <QuantumScreen>
      <QuantumBackButton label="‹ Workspaces" fallbackHref="/brands" />
      <QuantumHeader
        eyebrow="Live workspace"
        title={workspace.label}
        description={workspace.description}
        accent={workspace.accent}
      />
      {groups.map(([group, items]) => (
        <View key={group} style={styles.groupBlock}>
          <QuantumSectionHeader label={group} />
          <View style={styles.moduleGrid}>
            {items
              .filter((item) => item.id !== 'overview')
              .map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.moduleCard}
                  onPress={() => router.push(`/workspace/${workspace.slug}/${item.id}`)}
                >
                  <QuantumCard accent={workspace.accent}>
                    <QuantumText variant="h3">{item.label}</QuantumText>
                    <QuantumText variant="caption">{item.statuses ? item.statuses.join(' · ') : 'Records'}</QuantumText>
                  </QuantumCard>
                </Pressable>
              ))}
          </View>
        </View>
      ))}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  groupBlock: { gap: quantumSpace.sm },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  moduleCard: { minWidth: 150, flexGrow: 1 },
})
