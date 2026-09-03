/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { login, getStoredSession } from '../lib/api'
import { BRAND } from '../lib/brand'

// Real login screen — calls the same real /api/tester/login endpoint every web brand console
// uses. No demo/mock accounts: a real tester/admin email and password/access code is required,
// exactly like the web sign-in.
export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    getStoredSession().then((session) => {
      if (session) router.replace('/(app)')
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
    router.replace('/(app)')
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
        <View style={[styles.logo, { backgroundColor: BRAND.accent }]}>
          <Text style={styles.logoText}>FO</Text>
        </View>
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
          style={[styles.button, { backgroundColor: BRAND.accent }]}
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
  container: { flex: 1, backgroundColor: '#05060a', padding: 24, justifyContent: 'center' },
  center: { flex: 1, backgroundColor: '#05060a', alignItems: 'center', justifyContent: 'center' },
  brand: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoText: { color: '#071014', fontWeight: '900', fontSize: 18 },
  title: { color: '#ffffff', fontSize: 26, fontWeight: '800', marginBottom: 8 },
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
  button: { marginTop: 20, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#071014', fontWeight: '800', fontSize: 15 },
})
