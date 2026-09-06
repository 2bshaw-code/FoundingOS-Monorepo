/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { login, getToken } from '../lib/api'
import { FOUNDINGOS_ACCENT, FOUNDINGOS_BASE } from '../lib/brands'
import { QuantumSphere } from '../components/QuantumSphere'
import { QuantumButton, QuantumCard, QuantumFormField, QuantumNotice, QuantumText, QuantumTextInput, quantumSpace } from '../components/QuantumUI'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    getToken().then((token) => {
      if (token) router.replace('/(app)/brands')
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
    const result = await login(email.trim(), password.trim())
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    router.replace('/(app)/brands')
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
          <QuantumText variant="h1" align="center">FoundingOS Quantum</QuantumText>
          <QuantumText color="#D8D8D8" align="center">
            One premium mobile command system for every FoundingOS brand.
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
            <QuantumTextInput placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
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
