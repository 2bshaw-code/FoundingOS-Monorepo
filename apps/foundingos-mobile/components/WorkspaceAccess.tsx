/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { WORKSPACE_OFFERS, useWorkspaceAccess } from '../lib/workspace-access'
import { findWorkspace, WorkspaceSlug } from '../lib/workspace-modules'
import { crossSellOffers, tickerItemsFor, type CrossSellWorkspace } from '../lib/cross-sell'
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
  if (!loaded || isEnabled(slug)) return <View style={styles.gateFill}><View style={styles.gateFill}>{children}</View><CrossSellTicker slug={slug} /></View>
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

// Thin news-style strip pinned under every workspace screen, rotating through what the
// company's other packages would add (or, if it has them all, what they can do).
export function CrossSellTicker({ slug }: { slug: string }) {
  const { enabled, loaded } = useWorkspaceAccess()
  const [hidden, setHidden] = useState(false)
  const [index, setIndex] = useState(0)
  const insets = useSafeAreaInsets()
  const items = useMemo(() => (slug in crossSellOffers ? tickerItemsFor(slug as CrossSellWorkspace, enabled) : []), [slug, enabled])
  useEffect(() => {
    if (items.length < 2) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % items.length), 6000)
    return () => clearInterval(timer)
  }, [items.length])
  if (!loaded || hidden || !items.length) return null
  const item = items[index % items.length]
  const accent = findWorkspace(item.target)?.accent ?? '#38BDF8'
  const open = () => (item.owned ? router.push(`/workspace/${item.target}` as never) : router.push({ pathname: '/(app)/upgrade', params: { add: item.target } } as never))
  return (
    <View style={[styles.ticker, { borderTopColor: accent, paddingBottom: 8 + insets.bottom }]}>
      <View style={[styles.tickerTag, { backgroundColor: accent }]}>
        <QuantumText variant="overline" style={{ color: '#04111F' }}>{item.owned ? 'In plan' : 'New'}</QuantumText>
      </View>
      <Pressable style={styles.tickerText} onPress={open}>
        <QuantumText variant="caption" numberOfLines={2} style={{ color: '#E6EDF7' }}>
          <QuantumText variant="caption" style={{ color: '#FFFFFF', fontWeight: '800' }}>{item.label}  </QuantumText>
          {item.text}
        </QuantumText>
      </Pressable>
      <Pressable style={styles.tickerAction} onPress={open}>
        <QuantumText variant="caption" style={{ color: '#04111F', fontWeight: '800' }}>{item.owned ? 'Open' : 'Add'}</QuantumText>
      </Pressable>
      <Pressable accessibilityLabel="Hide" hitSlop={12} onPress={() => setHidden(true)}>
        <QuantumText variant="label" style={{ color: '#93A4BD' }}>✕</QuantumText>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  gateFill: { flex: 1 },
  ticker: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm, paddingHorizontal: quantumSpace.md, paddingTop: 8, paddingBottom: 8, backgroundColor: '#0F1D33', borderTopWidth: 3 },
  tickerTag: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tickerText: { flex: 1 },
  tickerAction: { backgroundColor: '#38BDF8', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  tile: { width: '31%', flexGrow: 1 },
  tileInner: { borderWidth: 1, borderRadius: 16, padding: quantumSpace.md, gap: 4, minHeight: 92 },
  addTile: { borderStyle: 'dashed', borderColor: '#38BDF866', backgroundColor: '#38BDF80F' },
  dot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
})

