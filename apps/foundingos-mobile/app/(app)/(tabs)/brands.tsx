/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Linking, Pressable, View, StyleSheet } from 'react-native'
import { FOUNDINGOS_ACCENT } from '../../../lib/brands'
import { getSession } from '../../../lib/core-operations-api'
import { SUITE_LINKS } from '../../../lib/nav-directory'
import { WORKSPACES } from '../../../lib/workspace-modules'
import { useQuantumStore } from '../../../lib/store'
import { logAction } from '../../../lib/action-logger'
import { redeemInvestorCode, signOut, useSuperDashAccess, useWorkspaceAccess, WORKSPACE_OFFERS } from '../../../lib/workspace-access'
import type { WorkspaceSlug } from '../../../lib/workspace-modules'
import { ProductRatingCard } from '../../../components/ProductRatingCard'
import { QuantumButton, QuantumCard, QuantumHeader, QuantumNotice, QuantumPasswordInput, QuantumScreen, QuantumSectionHeader, QuantumText, quantumSpace, useActiveQuantumTheme } from '../../../components/QuantumUI'

// Every destination in the app — the suites, their dedicated dashboards, and the
// live per-workspace module grids — lives on this one directory screen instead of
// being spread across a crowded 8-item tab bar. This mirrors the web app, where a
// single workspace picker is the front door and everything else is one tap deeper.

export default function WorkspaceDirectoryScreen() {
  const setActiveBrand = useQuantumStore((state) => state.setActiveBrand)
  const [connected, setConnected] = useState(false)
  const { mine, locked } = useWorkspaceAccess()
  const superDash = useSuperDashAccess()
  const canOpenSuperDash = superDash !== null
  const theme = useActiveQuantumTheme()
  const tileTheme = { borderColor: theme.borderColor, backgroundColor: theme.cardBg }

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

      <QuantumSectionHeader label="Core suites" action={<QuantumNotice tone={connectionNotice.tone}>{connectionNotice.label}</QuantumNotice>} />
      {CORE_SUITES.map((suite) => {
        const link = SUITE_LINKS.find((entry) => entry.slug === suite.slug)
        return (
          <QuantumCard key={suite.slug} accent={suite.accent} style={styles.suiteBlock}>
            <Pressable accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })} onPress={() => link && open(link.slug, link.route)}>
              <QuantumText variant="overline" color={suite.accent}>{suite.label}</QuantumText>
              <QuantumText variant="h3">{link?.name ?? suite.label} ›</QuantumText>
              <QuantumText variant="caption">{link?.tagline}</QuantumText>
            </Pressable>
            <View style={styles.tileGrid}>
              {suite.workspaces.map((slug) => {
                const workspace = WORKSPACES.find((entry) => entry.slug === slug)
                if (!workspace) return null
                const owned = mine.some((entry) => entry.slug === slug)
                const isLocked = !owned && locked.some((entry) => entry.slug === slug)
                if (!owned && !isLocked) return null
                return (
                  <Pressable
                    key={slug}
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.tile, tileTheme, { borderLeftColor: workspace.accent, opacity: pressed ? 0.7 : isLocked ? 0.75 : 1 }]}
                    onPress={() => (isLocked ? router.push({ pathname: '/(app)/upgrade', params: { add: slug } } as never) : router.push(`/workspace/${slug}`))}
                  >
                    <QuantumText variant="body" style={styles.tileTitle} numberOfLines={1}>{isLocked ? '🔒 ' : ''}{workspace.label}</QuantumText>
                    <QuantumText variant="caption" numberOfLines={1}>
                      {isLocked ? `${WORKSPACE_OFFERS[slug as WorkspaceSlug].price} · Add` : `${workspace.modules.length} modules`}
                    </QuantumText>
                  </Pressable>
                )
              })}
            </View>
          </QuantumCard>
        )
      })}

      <QuantumSectionHeader label="Tools" />
      <View style={styles.tileGrid}>
        {SUITE_LINKS.filter((suite) => !CORE_SUITES.some((core) => core.slug === suite.slug) && suite.label !== 'Account').map((suite) => (
          <Pressable key={suite.slug} accessibilityRole="button" style={({ pressed }) => [styles.tile, tileTheme, { borderLeftColor: suite.accent, opacity: pressed ? 0.7 : 1 }]} onPress={() => open(suite.slug, suite.route)}>
            <QuantumText variant="body" style={styles.tileTitle} numberOfLines={1}>{suite.name}</QuantumText>
            <QuantumText variant="caption" numberOfLines={2}>{suite.tagline}</QuantumText>
          </Pressable>
        ))}
      </View>

      <QuantumSectionHeader label="Account" />
      <View style={styles.tileGrid}>
        {SUITE_LINKS.filter((suite) => suite.label === 'Account').map((suite) => (
          <Pressable key={suite.slug} accessibilityRole="button" style={({ pressed }) => [styles.tile, tileTheme, { borderLeftColor: suite.accent, opacity: pressed ? 0.7 : 1 }]} onPress={() => open(suite.slug, suite.route)}>
            <QuantumText variant="body" style={styles.tileTitle} numberOfLines={1}>{suite.name}</QuantumText>
            <QuantumText variant="caption" numberOfLines={2}>{suite.tagline}</QuantumText>
          </Pressable>
        ))}
      </View>

      {canOpenSuperDash ? <QuantumButton onPress={() => router.push('/(app)/superdash' as never)}>Open SuperDash</QuantumButton> : connected ? <InvestorUnlockCard /> : null}
      <ProductRatingCard />
      <QuantumButton tone="ghost" onPress={() => router.push('/(app)/upgrade' as never)}>Manage your plan</QuantumButton>
      <QuantumButton tone="danger" onPress={() => { void signOut() }}>Sign out</QuantumButton>
      <View style={styles.legal}>
        <Pressable accessibilityRole="link" onPress={() => { Linking.openURL('https://www.foundingos.com/privacy').catch(() => undefined) }}>
          <QuantumText variant="caption" style={styles.legalLink}>Privacy &amp; cookies</QuantumText>
        </Pressable>
        <Pressable accessibilityRole="link" onPress={() => { Linking.openURL('https://www.foundingos.com/privacy#your-rights').catch(() => undefined) }}>
          <QuantumText variant="caption" style={styles.legalLink}>Your data rights</QuantumText>
        </Pressable>
      </View>
      <QuantumText align="center" variant="caption">© {new Date().getFullYear()} FoundingOS. All rights reserved.</QuantumText>
    </QuantumScreen>
  )
}

// Investors without a listed email unlock the read-only SuperDash preview with their website access code.
function InvestorUnlockCard() {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ tone: 'success' | 'warning'; text: string } | null>(null)
  const submit = async () => {
    if (!code.trim() || busy) return
    setBusy(true)
    setMessage(null)
    try {
      await redeemInvestorCode(code.trim())
      setMessage({ tone: 'success', text: 'Investor preview unlocked — SuperDash is now available.' })
      setCode('')
    } catch (error) {
      setMessage({ tone: 'warning', text: error instanceof Error ? error.message : 'That access code is not recognised.' })
    } finally {
      setBusy(false)
    }
  }
  return (
    <QuantumCard accent={FOUNDINGOS_ACCENT}>
      <QuantumText variant="overline" color={FOUNDINGOS_ACCENT}>Investors</QuantumText>
      <QuantumText variant="h3">Unlock the SuperDash preview</QuantumText>
      <QuantumText variant="caption">Enter the access code you were given for foundingos.com to see the full company dashboard with example figures.</QuantumText>
      <QuantumPasswordInput value={code} onChangeText={setCode} placeholder="Access code" autoCapitalize="none" autoCorrect={false} onSubmitEditing={() => { void submit() }} />
      {message ? <QuantumNotice tone={message.tone}>{message.text}</QuantumNotice> : null}
      <QuantumButton disabled={busy || !code.trim()} onPress={() => { void submit() }}>{busy ? 'Checking…' : 'Unlock'}</QuantumButton>
    </QuantumCard>
  )
}

const CORE_SUITES = [
  { slug: 'core_operations', label: 'Core.Operations', accent: '#26E07F', workspaces: ['retail', 'logistics', 'finance', 'marketing', 'health'] },
  { slug: 'core_workforce', label: 'Core.Workforce', accent: '#FFB703', workspaces: ['talent', 'hr'] },
  { slug: 'core_intelligence', label: 'Core.Intelligence', accent: '#A78BFA', workspaces: ['intelligence'] },
] as const

const styles = StyleSheet.create({
  suiteBlock: { gap: quantumSpace.sm },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: quantumSpace.sm, marginTop: quantumSpace.sm },
  tile: {
    width: '48.5%',
    minHeight: 64,
    paddingVertical: quantumSpace.sm,
    paddingHorizontal: quantumSpace.md,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 3,
    justifyContent: 'center',
    gap: 2,
  },
  tileTitle: { fontWeight: '700' },
  legal: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.md, justifyContent: 'center' },
  legalLink: { textDecorationLine: 'underline' },
})
