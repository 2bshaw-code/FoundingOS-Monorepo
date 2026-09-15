/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { login, getToken } from '../lib/api'
import { BRAND } from '../lib/brand'
import { QuantumSphere } from '../components/QuantumSphere'

// Real login screen — calls the same real /api/tester/login endpoint every web brand console
// uses. No demo/mock accounts: a real tester/admin email and password/access code is required,
// exactly like the web sign-in. The quantum gradient background renders once at the root
// layout (app/_layout.tsx), tinted with this brand's own real accent colour.
export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    getToken().then((token) => {
      if (token) router.replace('/(app)/home')
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
    router.replace('/(app)/home')
  }

  if (checkingSession) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.brand}>
        <QuantumSphere size={64} accent={BRAND.accent} />
        <Text style={styles.title}>{BRAND.name}</Text>
        <Text style={styles.subtitle}>{BRAND.tagline}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#5b6472"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password or access code</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#5b6472"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={[styles.button, { backgroundColor: BRAND.accent, shadowColor: BRAND.accent }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#071014" /> : <Text style={styles.buttonText}>Sign in</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  brand: { alignItems: 'center', marginBottom: 40, gap: 16 },
  title: { color: '#ffffff', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 },
  form: { gap: 8 },
  label: { color: '#b9c2cf', fontSize: 13, fontWeight: '600', marginTop: 12 },
  input: {
    backgroundColor: '#11161f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#242c38',
    padding: 14,
    color: '#ffffff',
    fontSize: 15,
  },
  error: { color: '#ff5470', fontSize: 13, marginTop: 8 },
  button: {
    marginTop: 20, borderRadius: 999, paddingVertical: 14, alignItems: 'center',
    shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  buttonText: { color: '#071014', fontWeight: '800', fontSize: 15 },
})
