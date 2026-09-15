/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native'
import { router } from 'expo-router'
import { BRAND } from '../lib/brand'
import { fetchEntitlements, trialDaysRemaining, type Entitlements, type TrialInfo } from '../lib/entitlements'

const TIER_COPY: Record<Entitlements['tier'], { blurb: string; nextTier: Entitlements['tier'] | null }> = {
  Starter: { blurb: 'Starter gives you everything to run day-to-day operations on this brand.', nextTier: 'Growth' },
  Growth: { blurb: 'Growth adds deeper operations, reporting, and customer channels.', nextTier: 'Enterprise' },
  Enterprise: { blurb: 'Enterprise — every module and every AI bolt-on is unlocked.', nextTier: null },
}

// Module ids are kebab-case (e.g. "route-planner") — this only affects display, the real
// gating everywhere else stays id-based so it can never drift from the config's own ids.
function formatModuleId(id: string): string {
  return id.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

// Real upgrade screen — reads this brand's own live entitlements (same
// GET /api/console/entitlements every native app already calls on home) so the exact
// locked modules/bolt-ons shown here always match what's actually locked, never a
// hand-maintained duplicate list. No live billing/checkout is wired up yet (see
// packages/config/src/package-model-d.ts's own "demo/front-end package catalog" note) — the
// real upgrade path today is contacting the team directly, same as the web console's own
// package activation flow.
export default function UpgradeScreen() {
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null)
  const [trial, setTrial] = useState<TrialInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntitlements().then((result) => {
      setEntitlements(result?.entitlements ?? null)
      setTrial(result?.trial ?? null)
      setLoading(false)
    })
  }, [])

  const tier = entitlements?.tier ?? 'Enterprise'
  const copy = TIER_COPY[tier]

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 100, gap: 16 }}>
      <Pressable onPress={() => router.back()}>
        <Text style={[styles.back, { color: BRAND.accent }]}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Upgrade {BRAND.name}</Text>
      <Text style={styles.subtitle}>{loading ? 'Checking your plan…' : copy.blurb}</Text>

      {trialDaysRemaining(trial) !== null ? (
        <View style={[styles.card, { borderColor: BRAND.accent }]}>
          <Text style={styles.cardLabel}>Free trial active</Text>
          <Text style={[styles.cardValue, { color: BRAND.accent }]}>
            {trialDaysRemaining(trial)} day{trialDaysRemaining(trial) === 1 ? '' : 's'} left
          </Text>
          <Text style={styles.listItem}>You're one of our first 100 signups — full Enterprise access, free, for 14 days. Upgrade before it ends to keep everything.</Text>
        </View>
      ) : null}

      {!loading && entitlements ? (
        <>
          <View style={[styles.card, { borderColor: BRAND.accent }]}>
            <Text style={styles.cardLabel}>Your current plan</Text>
            <Text style={[styles.cardValue, { color: BRAND.accent }]}>{tier}</Text>
          </View>

          {entitlements.lockedModules.length > 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Modules you'll unlock</Text>
              {entitlements.lockedModules.map((id) => (
                <Text key={id} style={styles.listItem}>🔓 {formatModuleId(id)}</Text>
              ))}
            </View>
          ) : null}

          {entitlements.availableBoltOns.length > entitlements.enabledBoltOns.length ? (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>AI bolt-ons you'll unlock</Text>
              {entitlements.availableBoltOns
                .filter((slug) => !entitlements.enabledBoltOns.includes(slug))
                .map((slug) => (
                  <Text key={slug} style={styles.listItem}>✨ {slug}</Text>
                ))}
            </View>
          ) : null}

          {copy.nextTier ? (
            <Pressable
              style={[styles.upgradeButton, { backgroundColor: BRAND.accent }]}
              onPress={() => Linking.openURL('mailto:hello@foundingos.com?subject=Upgrade%20request')}
            >
              <Text style={styles.upgradeButtonText}>Talk to us about {copy.nextTier}</Text>
            </Pressable>
          ) : (
            <Text style={styles.subtitle}>You're already on our top plan — thank you!</Text>
          )}
        </>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0e14' },
  back: { fontSize: 15, fontWeight: '700' },
  title: { color: '#ffffff', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 14 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderColor: '#3a4150', borderRadius: 18, padding: 16, gap: 8 },
  cardLabel: { color: '#7c8797', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  cardValue: { fontSize: 22, fontWeight: '800' },
  listItem: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  upgradeButton: { borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  upgradeButtonText: { color: '#0b0e14', fontSize: 15, fontWeight: '800' },
})
