/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { WorkspaceGate } from '../../../components/WorkspaceAccess'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { QuantumBackButton } from '../../../components/QuantumBackButton'
import {
  QuantumCard,
  QuantumHeader,
  QuantumListItem,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  quantumColors,
  quantumSpace,
} from '../../../components/QuantumUI'
import { findWorkspace, WorkspaceModuleDef } from '../../../lib/workspace-modules'
import { getGroupCopy } from '../../../lib/workspace-copy'

// Groups that exist purely to hold the "overview" module (which is its own
// dedicated screen, not a card in this grid) — never rendered as a section.
const HIDDEN_GROUPS = new Set(['Workspace'])
// Deprioritized to the very bottom of every workspace, in a quieter compact
// list style instead of the full card grid — settings/access/integrations are
// necessary but shouldn't compete visually with the business-critical modules.
const SUNK_GROUPS = new Set(['Administration'])

type ModuleGroup = { name: string; items: WorkspaceModuleDef[] }

function WorkspaceModulesScreenInner() {
  const { workspace: workspaceSlug } = useLocalSearchParams<{ workspace: string }>()
  const workspace = findWorkspace(String(workspaceSlug || ''))
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const { primaryGroups, sunkGroups, recommendedNames } = useMemo(() => {
    if (!workspace) return { primaryGroups: [] as ModuleGroup[], sunkGroups: [] as ModuleGroup[], recommendedNames: new Set<string>() }
    const byGroup = new Map<string, WorkspaceModuleDef[]>()
    for (const item of workspace.modules) {
      if (item.id === 'overview' || HIDDEN_GROUPS.has(item.group)) continue
      if (!byGroup.has(item.group)) byGroup.set(item.group, [])
      byGroup.get(item.group)!.push(item)
    }
    const all: ModuleGroup[] = Array.from(byGroup.entries()).map(([name, items]) => ({ name, items }))
    const primary = all.filter((group) => !SUNK_GROUPS.has(group.name))
    const sunk = all.filter((group) => SUNK_GROUPS.has(group.name))
    // The catalogue already lists each workspace's modules in the order they
    // matter most to run the business (Sales/Customers before back-office
    // Administration) — the first two primary groups are surfaced as the
    // "start here" set for anyone new to the workspace, no separate list to
    // maintain.
    const recommended = new Set(primary.slice(0, 2).map((group) => group.name))
    return { primaryGroups: primary, sunkGroups: sunk, recommendedNames: recommended }
  }, [workspace])

  if (!workspace) return null

  return (
    <QuantumScreen>
      <QuantumBackButton label="‹ Workspaces" fallbackHref="/brands" />
      <QuantumHeader eyebrow="Live workspace" title={workspace.label} accent={workspace.accent} />

      <View style={styles.trustStrip}>
        <QuantumText variant="overline" color={quantumColors.neutral300}>What this workspace does</QuantumText>
        <QuantumText variant="body">{workspace.description}</QuantumText>
        <QuantumText variant="caption" color={quantumColors.neutral500}>
          Every module below reads and writes real, live tenant data — nothing here is a demo or mock.
        </QuantumText>
      </View>

      {primaryGroups.map((group) => (
        <View key={group.name} style={styles.groupBlock}>
          <QuantumSectionHeader
            label={group.name}
            action={recommendedNames.has(group.name) ? <QuantumNotice tone="info">Start here</QuantumNotice> : undefined}
          />
          <Pressable onPress={() => setExpandedGroup(expandedGroup === group.name ? null : group.name)}>
            <QuantumText variant="caption" color={quantumColors.neutral300}>
              {expandedGroup === group.name ? 'Hide how this works ▲' : 'How this works ▼'}
            </QuantumText>
          </Pressable>
          {expandedGroup === group.name ? (
            <View style={styles.howItWorksBox}>
              <QuantumText variant="caption" color={quantumColors.neutral300}>{getGroupCopy(group.name, group.items).howItWorks}</QuantumText>
              <QuantumText variant="caption" color={quantumColors.neutral500}>{getGroupCopy(group.name, group.items).extensibility}</QuantumText>
            </View>
          ) : null}
          <View style={styles.moduleGrid}>
            {group.items.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.moduleCard, { opacity: pressed ? 0.7 : 1 }]}
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

      {sunkGroups.map((group) => (
        <View key={group.name} style={styles.groupBlock}>
          <QuantumSectionHeader label={group.name} />
          {group.items.map((item) => (
            <QuantumListItem
              key={item.id}
              title={item.label}
              subtitle={item.statuses ? item.statuses.join(' · ') : undefined}
              accent={quantumColors.neutral500}
              onPress={() => router.push(`/workspace/${workspace.slug}/${item.id}`)}
            />
          ))}
        </View>
      ))}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  trustStrip: { gap: quantumSpace.xs },
  groupBlock: { gap: quantumSpace.sm },
  howItWorksBox: { gap: quantumSpace.xs, paddingHorizontal: quantumSpace.xs },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  moduleCard: { minWidth: 150, flexGrow: 1 },
})

export default function WorkspaceModulesScreen() {
  const { workspace: workspaceSlug } = useLocalSearchParams<{ workspace: string }>()
  return (
    <WorkspaceGate slug={String(workspaceSlug || '')}>
      <WorkspaceModulesScreenInner />
    </WorkspaceGate>
  )
}
