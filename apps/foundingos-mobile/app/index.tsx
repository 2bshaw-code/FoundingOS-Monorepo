/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { login as legacyLogin, getToken as getLegacyToken, verifyLegacyToken } from '../lib/api'
import { login as coreOpsLogin, getSession as getCoreOpsSession, verifySession as verifyCoreOpsSession } from '../lib/core-operations-api'
import { login as coreWorkforceLogin, getSession as getCoreWorkforceSession } from '../lib/core-workforce-api'
import { FOUNDINGOS_ACCENT, FOUNDINGOS_BASE } from '../lib/brands'
import { normalizeRole } from '../lib/permissions'
import { useQuantumStore } from '../lib/store'
import { QuantumSphere } from '../components/QuantumSphere'
import { QuantumButton, QuantumCard, QuantumFormField, QuantumNotice, QuantumPasswordInput, QuantumText, QuantumTextInput, quantumSpace, shadeColor } from '../components/QuantumUI'
export default function LoginScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>()
  const destination = typeof returnTo === 'string' && returnTo.startsWith('/') ? returnTo : '/(app)/home'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function checkExistingSession() {
      // A stored session/token can exist on disk without still being valid (revoked
      // account, expired token, stale install, etc.) — verifying before redirecting
      // stops the app from silently bouncing the user straight back past the login
      // screen into a broken "signed in but nothing loads" state, which looked like
      // the login page flashing and then disappearing.
      const [coreOpsSession, legacyToken] = await Promise.all([getCoreOpsSession(), getLegacyToken()])
      if (cancelled) return
      const [coreOpsValid, legacyValid] = await Promise.all([
        coreOpsSession ? verifyCoreOpsSession() : Promise.resolve(false),
        legacyToken ? verifyLegacyToken() : Promise.resolve(false),
      ])
      if (cancelled) return
      // Only skip the login screen for a verified real Core.Operations session. A
      // legacy-only token being valid is NOT enough to auto-skip: those tokens come
      // from the read-only tester system and have no real tenant behind them, so
      // silently bouncing a legacy-only user past this screen made it impossible to
      // ever enter real credentials — every tap of "Sign in" (from a Core.Operations
      // screen that requires a real session) landed back here and bounced straight
      // back to the overview, looking like a login/overview loop.
      void legacyValid
      if (coreOpsValid) {
        // Hydrate the real permission tier from the stored session's raw backend
        // role — previously this field was left at its 'founder' default forever,
        // making the Phase 26 permission matrix inert for existing sessions.
        if (coreOpsSession) useQuantumStore.getState().setRole(normalizeRole(coreOpsSession.role))
        // Keep checkingSession true (spinner stays up) until navigation actually
        // completes, instead of flashing the login form for a frame first. Return to
        // whichever tab sent the user here (via ?returnTo=...) instead of always
        // dropping back onto Overview.
        router.replace(destination as any)
        return
      }
      setCheckingSession(false)
    }
    checkExistingSession()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password or access code.')
      return
    }
    setError('')
    setLoading(true)
    // Try the real Core.Operations tenant-auth backend first (live governed-workflow
    // system). Fall back to the legacy tester-login system only if the real backend
    // rejects the credentials or is unreachable, so existing tester accounts keep working.
    const realResult = await coreOpsLogin(email.trim(), password.trim())
    if (realResult.ok) {
      // Core.Workforce runs its own independent auth/database — attempt a parallel
      // sign-in with the same credentials so a founder with access to both suites
      // gets a consistent session without a second login screen. Best-effort only:
      // if this account has no Core.Workforce identity yet, Workforce screens show
      // an honest "not connected" state rather than blocking Core.Operations sign-in.
      coreWorkforceLogin(email.trim(), password.trim()).catch(() => undefined)
      useQuantumStore.getState().setRole(normalizeRole(realResult.session.role))
      setLoading(false)
      router.replace(destination as any)
      return
    }
    const legacyResult = await legacyLogin(email.trim(), password.trim())
    setLoading(false)
    if (!legacyResult.ok) {
      setError(realResult.error || legacyResult.error)
      return
    }
    router.replace(destination as any)
  }

  // Lets anyone opening the app for the first time — investors, TestFlight testers,
  // anyone without real credentials — see the whole product immediately, instead of
  // hitting a locked sign-in wall. Turns on Smart Demo Mode (illustrative sample
  // data everywhere, no live tenant, no network calls) and goes straight in.
  function handleViewDemo() {
    useQuantumStore.getState().setDemoMode(true)
    router.replace(destination as any)
  }

  if (checkingSession) {
    return (
      <View style={styles.center}>
        <LinearGradient colors={[shadeColor(FOUNDINGOS_BASE, 8), FOUNDINGOS_BASE, '#000814']} style={StyleSheet.absoluteFill} />
        <ActivityIndicator color={FOUNDINGOS_ACCENT} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[shadeColor(FOUNDINGOS_BASE, 8), FOUNDINGOS_BASE, '#000814']} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={[`${FOUNDINGOS_ACCENT}29`, `${FOUNDINGOS_ACCENT}00`]}
        style={styles.glow}
      />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.keyboardWrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.keyboard}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.brand}>
              <QuantumSphere size={72} />
              <QuantumText variant="h1" align="center">FoundingOS</QuantumText>
              <QuantumText color="#D8D8D8" align="center">
                One command system for every workspace in your business.
              </QuantumText>
            </View>

            <QuantumCard accent={FOUNDINGOS_ACCENT}>
              <QuantumFormField label="Email">
                <QuantumTextInput
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </QuantumFormField>
              <QuantumFormField label="Password or access code">
                <QuantumPasswordInput placeholder="••••••••" value={password} onChangeText={setPassword} />
              </QuantumFormField>
              {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
              <QuantumButton onPress={handleSignIn} disabled={loading}>
                {loading ? <ActivityIndicator color={FOUNDINGOS_BASE} /> : 'Sign in'}
              </QuantumButton>
            </QuantumCard>

            <View style={styles.demoRow}>
              <View style={styles.demoDivider} />
              <QuantumText variant="caption" color="#9AA5B1">or</QuantumText>
              <View style={styles.demoDivider} />
            </View>
            <QuantumButton tone="secondary" onPress={handleViewDemo} disabled={loading}>
              View live demo
            </QuantumButton>
            <QuantumText variant="caption" align="center" color="#9AA5B1">
              Explore every workspace with realistic sample data — no account needed.
            </QuantumText>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FOUNDINGOS_BASE },
  safeArea: { flex: 1, padding: quantumSpace.xl },
  keyboardWrapper: { flex: 1 },
  keyboard: { flexGrow: 1, justifyContent: 'center', gap: quantumSpace.xxl, paddingVertical: quantumSpace.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: FOUNDINGOS_BASE },
  brand: { alignItems: 'center', gap: quantumSpace.lg },
  glow: { position: 'absolute', top: -160, left: -80, width: 340, height: 340, borderRadius: 170 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.md, marginTop: -quantumSpace.lg },
  demoDivider: { flex: 1, height: 1, backgroundColor: '#2A3541' },
})
