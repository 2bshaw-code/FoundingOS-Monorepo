/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { login as legacyLogin, getToken as getLegacyToken, verifyLegacyToken } from '../lib/api'
import { createFreeAccount, login as coreOpsLogin, getSession as getCoreOpsSession, verifySession as verifyCoreOpsSession } from '../lib/core-operations-api'
import { login as coreWorkforceLogin, getSession as getCoreWorkforceSession } from '../lib/core-workforce-api'
import { FOUNDINGOS_ACCENT, FOUNDINGOS_BASE } from '../lib/brands'
import { normalizeRole } from '../lib/permissions'
import { useQuantumStore } from '../lib/store'
import { signOut } from '../lib/workspace-access'
import { QuantumSphere } from '../components/QuantumSphere'
import { AppHomeSections, FoundAiMovie, WhatsAppHero } from '../components/AppHome'
import { QuantumButton, QuantumCard, QuantumFormField, QuantumNotice, QuantumPasswordInput, QuantumText, QuantumTextInput, quantumSpace, shadeColor } from '../components/QuantumUI'

export default function LoginScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>()
  const destination = typeof returnTo === 'string' && returnTo.startsWith('/') ? returnTo : '/(app)/home'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)
  const [signedInAs, setSignedInAs] = useState<string | null>(null)
  const openBusiness = () => router.replace(destination as any)
  const scrollRef = useRef<ScrollView>(null)
  const [signInY, setSignInY] = useState(0)
  const goToSignIn = () => scrollRef.current?.scrollTo({ y: Math.max(0, signInY - quantumSpace.xl), animated: true })
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [ownerName, setOwnerName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const createAccount = () => { setError(''); setMode('signup'); setTimeout(goToSignIn, 50) }
  const showSignIn = () => { setError(''); setMode('signin'); setTimeout(goToSignIn, 50) }

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
        // Deep links (returnTo) go straight through; opening the app shows the home page first.
        if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
          router.replace(destination as any)
          return
        }
        setSignedInAs(coreOpsSession?.email || 'your account')
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

  async function handleSignUp() {
    if (!ownerName.trim() || !businessName.trim() || !email.trim()) {
      setError('Enter your name, business name and email.')
      return
    }
    if (password.length < 12) {
      setError('Choose a password with at least 12 characters.')
      return
    }
    setError('')
    setLoading(true)
    const created = await createFreeAccount({ ownerName: ownerName.trim(), businessName: businessName.trim(), email: email.trim(), password })
    if (!created.ok) {
      setLoading(false)
      setError(created.error)
      return
    }
    const session = await coreOpsLogin(email.trim(), password)
    setLoading(false)
    if (!session.ok) {
      setMode('signin')
      setError('Your account is ready — sign in to continue.')
      return
    }
    coreWorkforceLogin(email.trim(), password).catch(() => undefined)
    useQuantumStore.getState().setRole(normalizeRole(session.session.role))
    router.replace('/(app)/home' as any)
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
            ref={scrollRef}
            contentContainerStyle={styles.keyboard}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topBar}>
              <View style={styles.topBrand}>
                <QuantumSphere size={30} />
                <QuantumText variant="label">FoundingOS</QuantumText>
              </View>
              {signedInAs
                ? <QuantumText variant="label" color={FOUNDINGOS_ACCENT} onPress={() => { void signOut().then(() => setSignedInAs(null)) }}>Sign out</QuantumText>
                : <QuantumText variant="label" color={FOUNDINGOS_ACCENT} onPress={showSignIn}>Sign in</QuantumText>}
            </View>

            <View style={styles.hero}>
              <View style={styles.pill}><QuantumText variant="overline" color="#04111f">FoundAI</QuantumText></View>
              <QuantumText variant="overline" color="#24C47A">The AI that runs your business</QuantumText>
              <QuantumText variant="h1" style={styles.heroTitle}>Your business, run by AI. Right inside WhatsApp.</QuantumText>
              <QuantumText color="#D8D8D8">
                Message FoundAI like a manager: ask who owes you money, take an order, approve a refund with one word. It handles invoices, stock, deliveries, customers and posts — and only asks you when a decision needs a human.
              </QuantumText>
              <View style={styles.ctaRow}>
                {signedInAs ? (
                  <QuantumButton onPress={openBusiness} style={styles.cta}>Open my business →</QuantumButton>
                ) : (
                  <>
                    <QuantumButton onPress={createAccount} style={styles.cta}>Get started free</QuantumButton>
                    <QuantumButton onPress={showSignIn} tone="secondary" style={styles.cta}>Sign in</QuantumButton>
                  </>
                )}
              </View>
            </View>

            <WhatsAppHero />

            <FoundAiMovie />

            <AppHomeSections />

            {signedInAs ? (
              <QuantumCard accent={FOUNDINGOS_ACCENT}>
                <QuantumText variant="overline" color="#24C47A">Signed in</QuantumText>
                <QuantumText variant="h3">{signedInAs}</QuantumText>
                <QuantumText variant="caption" color="#A9B8C8">FoundAI has been working while you were away. Open your business to see what it did and what needs you.</QuantumText>
                <QuantumButton onPress={openBusiness}>Open my business →</QuantumButton>
              </QuantumCard>
            ) : (
              <>
            <View onLayout={(event) => setSignInY(event.nativeEvent.layout.y)} style={styles.signInHeading}>
              <QuantumText variant="h2">{mode === 'signup' ? 'Create your free account' : 'Sign in'}</QuantumText>
              <QuantumText variant="caption" color="#A9B8C8">
                {mode === 'signup'
                  ? 'Free forever on Lite. No card needed — add Core and workspaces whenever you are ready.'
                  : 'Use the email and password for your FoundingOS account.'}
              </QuantumText>
            </View>
            <QuantumCard accent={FOUNDINGOS_ACCENT}>
              {mode === 'signup' ? (
                <>
                  <QuantumFormField label="Your name">
                    <QuantumTextInput placeholder="Alex Morgan" autoCapitalize="words" textContentType="name" value={ownerName} onChangeText={setOwnerName} />
                  </QuantumFormField>
                  <QuantumFormField label="Business name">
                    <QuantumTextInput placeholder="Morgan & Co" autoCapitalize="words" textContentType="organizationName" value={businessName} onChangeText={setBusinessName} />
                  </QuantumFormField>
                </>
              ) : null}
              <QuantumFormField label="Email">
                <QuantumTextInput
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType={mode === 'signup' ? 'username' : 'emailAddress'}
                  value={email}
                  onChangeText={setEmail}
                />
              </QuantumFormField>
              <QuantumFormField label={mode === 'signup' ? 'Choose a password (12+ characters)' : 'Password or access code'}>
                <QuantumPasswordInput placeholder="••••••••" value={password} onChangeText={setPassword} />
              </QuantumFormField>
              {error ? <QuantumNotice tone={error.startsWith('Your account is ready') ? 'success' : 'danger'}>{error}</QuantumNotice> : null}
              <QuantumButton onPress={mode === 'signup' ? handleSignUp : handleSignIn} disabled={loading}>
                {loading ? <ActivityIndicator color={FOUNDINGOS_BASE} /> : mode === 'signup' ? 'Create free account' : 'Sign in'}
              </QuantumButton>
            </QuantumCard>
            {mode === 'signup' ? (
              <QuantumText variant="caption" color="#A9B8C8" align="center">
                Already have an account? <QuantumText variant="caption" color={FOUNDINGOS_ACCENT} onPress={showSignIn}>Sign in</QuantumText>
              </QuantumText>
            ) : (
              <QuantumText variant="caption" color="#A9B8C8" align="center">
                New to FoundingOS? <QuantumText variant="caption" color={FOUNDINGOS_ACCENT} onPress={createAccount}>Create your free account</QuantumText>
              </QuantumText>
            )}
              </>
            )}
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
  keyboard: { flexGrow: 1, gap: quantumSpace.xxl, paddingVertical: quantumSpace.md, paddingBottom: quantumSpace.xxl * 2 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topBrand: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm },
  hero: { gap: quantumSpace.md },
  heroTitle: { fontSize: 40, lineHeight: 44 },
  pill: { alignSelf: 'flex-start', backgroundColor: '#24C47A', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  ctaRow: { flexDirection: 'row', gap: quantumSpace.sm, marginTop: quantumSpace.sm },
  cta: { flex: 1 },
  signInHeading: { gap: quantumSpace.xs },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: FOUNDINGOS_BASE },
  brand: { alignItems: 'center', gap: quantumSpace.lg },
  glow: { position: 'absolute', top: -160, left: -80, width: 340, height: 340, borderRadius: 170 },
})
