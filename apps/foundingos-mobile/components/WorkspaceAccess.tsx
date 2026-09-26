/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState, type ReactNode } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { WORKSPACE_OFFERS, useWorkspaceAccess } from '../lib/workspace-access'
import { findWorkspace, WorkspaceSlug } from '../lib/workspace-modules'
import { crossSellFor, crossSellOffers, type CrossSellWorkspace } from '../lib/cross-sell'
import { QuantumButton, QuantumCard, QuantumScreen, QuantumText, quantumColors, quantumSpace } from './QuantumUI'

// One-tap tiles for the workspaces this company has, plus an "Add" tile.
export function WorkspaceQuickAccess() {
  const { mine, locked } = useWorkspaceAccess()
  return (
    <View style={styles.grid}>
      {mine.map((workspace) => (
        <Pressable key={workspace.slug} style={({ pressed }) => [styles.tile, { opacity: pressed ? 0.7 : 1 }]} onPress={() => router.push(`/workspace/${workspace.slug}` as never)}>
          <View style={[styles.tileInner, { borderColor: `${workspace.accent}66`, backgroundColor: `${workspace.accent}1A` }]}>
            <View style={[styles.dot, { backgroundColor: workspace.accent }]} />
            <QuantumText variant="label">{workspace.label}</QuantumText>
            <QuantumText variant="caption" color={quantumColors.neutral300}>Open</QuantumText>
          </View>
        </Pressable>
      ))}
      {locked.length ? (
        <Pressable style={({ pressed }) => [styles.tile, { opacity: pressed ? 0.7 : 1 }]} onPress={() => router.push('/(app)/upgrade' as never)}>
          <View style={[styles.tileInner, styles.addTile]}>
            <QuantumText variant="h3" color="#38BDF8">+</QuantumText>
            <QuantumText variant="label">Add workspaces</QuantumText>
            <QuantumText variant="caption" color={quantumColors.neutral300}>{locked.length} available</QuantumText>
          </View>
        </Pressable>
      ) : null}
    </View>
  )
}

// Wraps a workspace screen; shows an upgrade prompt instead if the company hasn't added it.
export function WorkspaceGate({ slug, children }: { slug: string; children: ReactNode }) {
  const { isEnabled, loaded } = useWorkspaceAccess()
  if (!loaded || isEnabled(slug)) return <>{children}</>
  const workspace = findWorkspace(slug)
  const offer = WORKSPACE_OFFERS[slug as WorkspaceSlug]
  return (
    <QuantumScreen>
      <QuantumCard accent={workspace?.accent}>
        <QuantumText variant="overline" color={workspace?.accent}>Not in your plan yet</QuantumText>
        <QuantumText variant="h2">{workspace?.label ?? 'This workspace'}</QuantumText>
        <QuantumText>{offer?.pitch}</QuantumText>
        <QuantumText variant="caption">{offer ? `${offer.offer} · ${offer.price}` : ''}</QuantumText>
        <QuantumButton onPress={() => router.push({ pathname: '/(app)/upgrade', params: { add: slug } } as never)}>Add {workspace?.label ?? 'workspace'}</QuantumButton>
        <QuantumButton tone="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/home' as never))}>Back</QuantumButton>
      </QuantumCard>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  crossSell: { gap: quantumSpace.sm },
  crossSellHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  tile: { width: '31%', flexGrow: 1 },
  tileInner: { borderWidth: 1, borderRadius: 16, padding: quantumSpace.md, gap: 4, minHeight: 92 },
  addTile: { borderStyle: 'dashed', borderColor: '#38BDF866', backgroundColor: '#38BDF80F' },
  dot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
})

// "More from FoundingOS": what the company's other packages would add, seen from this workspace.
export function CrossSellBanner({ slug }: { slug: string }) {
  const { enabled, loaded } = useWorkspaceAccess()
  const [hidden, setHidden] = useState(false)
  if (!loaded || hidden || !(slug in crossSellOffers)) return null
  const offers = crossSellFor(slug as CrossSellWorkspace, enabled)
  if (!offers.length) return null
  return (
    <View style={styles.crossSell}>
      <View style={styles.crossSellHeader}>
        <QuantumText variant="overline" color="#38BDF8">More from FoundingOS</QuantumText>
        <Pressable accessibilityLabel="Hide" hitSlop={12} onPress={() => setHidden(true)}>
          <QuantumText variant="label" color={quantumColors.neutral300}>✕</QuantumText>
        </Pressable>
      </View>
      {offers.map((offer) => {
        const accent = findWorkspace(offer.target)?.accent ?? '#38BDF8'
        return (
          <QuantumCard key={offer.target} accent={accent}>
            <QuantumText variant="caption" color={accent}>{offer.label} · {offer.price}</QuantumText>
            <QuantumText variant="h3">{offer.headline}</QuantumText>
            {offer.examples.map((example) => (
              <QuantumText key={example} variant="caption" color={quantumColors.neutral300}>•  {example}</QuantumText>
            ))}
            <QuantumButton onPress={() => router.push({ pathname: '/(app)/upgrade', params: { add: offer.target } } as never)}>Add {offer.label}</QuantumButton>
          </QuantumCard>
        )
      })}
    </View>
  )
}
