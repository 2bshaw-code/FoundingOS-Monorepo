/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { login as legacyLogin, getToken as getLegacyToken } from '../lib/api'
import { login as coreOpsLogin, getSession as getCoreOpsSession } from '../lib/core-operations-api'
import { login as coreWorkforceLogin, getSession as getCoreWorkforceSession } from '../lib/core-workforce-api'
import { FOUNDINGOS_ACCENT, FOUNDINGOS_BASE } from '../lib/brands'
import { QuantumSphere } from '../components/QuantumSphere'
import { QuantumButton, QuantumCard, QuantumFormField, QuantumNotice, QuantumPasswordInput, QuantumText, QuantumTextInput, quantumSpace } from '../components/QuantumUI'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    Promise.all([getCoreOpsSession(), getLegacyToken()]).then(([coreOpsSession, legacyToken]) => {
      if (coreOpsSession || legacyToken) router.replace('/(app)/home')
      setCheckingSession(false)
    })
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
      setLoading(false)
      router.replace('/(app)/home')
      return
    }
    const legacyResult = await legacyLogin(email.trim(), password.trim())
    setLoading(false)
    if (!legacyResult.ok) {
      setError(realResult.error || legacyResult.error)
      return
    }
    router.replace('/(app)/home')
  }

  if (checkingSession) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={FOUNDINGOS_ACCENT} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FOUNDINGOS_BASE, padding: quantumSpace.xl },
  keyboard: { flex: 1, justifyContent: 'center', gap: quantumSpace.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: FOUNDINGOS_BASE },
  brand: { alignItems: 'center', gap: quantumSpace.lg },
})
