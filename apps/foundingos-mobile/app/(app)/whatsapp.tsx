/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Connect a WhatsApp Business number and authorise the owner's phone, all in the app.
// Credentials go straight to the backend (encrypted at rest) and are never shown again.
import { useCallback, useEffect, useState } from 'react'
import { Linking, RefreshControl, Share, StyleSheet, View } from 'react-native'
import {
  CORE_OPS_API_BASE,
  CoreOpsApiError,
  MessagingParticipant,
  MessagingReadiness,
  checkWhatsAppIntegration,
  fetchMessagingParticipants,
  fetchMessagingReadiness,
  getSession,
  saveMessagingParticipant,
  saveWhatsAppIntegration,
} from '../../lib/core-operations-api'
import {
  QuantumButton,
  QuantumCard,
  QuantumFormField,
  QuantumLoadingScreen,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  QuantumTextInput,
  quantumColors,
  quantumSpace,
} from '../../components/QuantumUI'

const WA_GREEN = '#25D366'
const message = (error: unknown, fallback: string) => (error instanceof CoreOpsApiError || error instanceof Error ? error.message : fallback)
const digits = (value: string) => value.replace(/\D/g, '')

export default function WhatsAppConnectScreen() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [readiness, setReadiness] = useState<MessagingReadiness | null>(null)
  const [participants, setParticipants] = useState<MessagingParticipant[]>([])
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const [phoneNumberId, setPhoneNumberId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [businessAccountId, setBusinessAccountId] = useState('')
  const [verifyToken, setVerifyToken] = useState('')
  const [appSecret, setAppSecret] = useState('')
  const [myNumber, setMyNumber] = useState('')

  const load = useCallback(async () => {
    try {
      const session = await getSession()
      setTenantId(session?.tenantId ?? null)
      setUserId(session?.userId ?? null)
      const [ready, people] = await Promise.all([
        fetchMessagingReadiness().catch(() => null),
        fetchMessagingParticipants().catch(() => [] as MessagingParticipant[]),
      ])
      setReadiness(ready)
      setParticipants(Array.isArray(people) ? people : [])
    } catch (cause) {
      setError(message(cause, 'Could not load WhatsApp status.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const connected = (readiness?.activeConnections ?? []).some((item) => item.channel === 'whatsapp' && item.active)
  const owners = participants.filter((item) => item.active && (item.role === 'founder' || item.role === 'admin'))
  const webhookUrl = tenantId ? `${CORE_OPS_API_BASE}/api/v1/ops/whatsapp/webhook/${tenantId}` : ''

  const connect = async () => {
    setError('')
    setNotice('')
    if (!phoneNumberId.trim() || !accessToken.trim() || !verifyToken.trim() || !appSecret.trim()) {
      setError('Fill in the Phone number ID, access token, verify token and app secret.')
      return
    }
    setBusy(true)
    try {
      await saveWhatsAppIntegration({
        phoneNumberId: digits(phoneNumberId),
        accessToken: accessToken.trim(),
        verifyToken: verifyToken.trim(),
        appSecret: appSecret.trim(),
        ...(businessAccountId.trim() ? { businessAccountId: digits(businessAccountId) } : {}),
      })
      try {
        const checked = await checkWhatsAppIntegration()
        setNotice(checked.status === 'ready' ? 'WhatsApp connected and verified with Meta.' : 'WhatsApp saved. Meta has not confirmed it yet — check the details if messages do not arrive.')
      } catch (cause) {
        setError(`Saved, but Meta rejected the check: ${message(cause, 'unknown error')}`)
      }
      setAccessToken('')
      setAppSecret('')
      await load()
    } catch (cause) {
      setError(message(cause, 'Could not save WhatsApp details.'))
    } finally {
      setBusy(false)
    }
  }

  const addMe = async () => {
    setError('')
    setNotice('')
    const address = digits(myNumber)
    if (address.length < 8) {
      setError('Enter your mobile number with country code, e.g. 447700900123.')
      return
    }
    setBusy(true)
    try {
      await saveMessagingParticipant({ address, role: 'founder', displayName: 'Owner', userId })
      setMyNumber('')
      setNotice('Your number can now chat with FoundAI and approve its work.')
      await load()
    } catch (cause) {
      setError(message(cause, 'Could not add your number.'))
    } finally {
      setBusy(false)
    }
  }

  const shareValue = (value: string) => { Share.share({ message: value }).catch(() => undefined) }

  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load() }} tintColor={WA_GREEN} />}>
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
      {notice ? <QuantumNotice tone="success">{notice}</QuantumNotice> : null}

      <QuantumCard accent={WA_GREEN}>
        <QuantumText variant="overline" color={WA_GREEN}>FoundAI on WhatsApp</QuantumText>
        <QuantumText variant="h3">{connected && owners.length ? 'Live' : connected ? 'Almost there — add your number' : 'Not connected yet'}</QuantumText>
        <QuantumText variant="caption" color={quantumColors.neutral200}>
          Connect your WhatsApp Business number, then add your own phone. You can then text FoundAI questions and approve its work by replying YES.
        </QuantumText>
      </QuantumCard>

      <QuantumSectionHeader label="1 · Business number" />
      <QuantumCard>
        {connected ? (
          <QuantumText variant="caption">✓ Connected: {(readiness?.activeConnections ?? []).filter((item) => item.channel === 'whatsapp').map((item) => item.displayName || item.externalAccountId).join(', ')}</QuantumText>
        ) : null}
        <QuantumText variant="caption" color={quantumColors.neutral200}>
          Find these in Meta for Developers → your app → WhatsApp → API Setup, and App settings → Basic for the app secret.
        </QuantumText>
        <QuantumFormField label="Phone number ID">
          <QuantumTextInput value={phoneNumberId} onChangeText={setPhoneNumberId} keyboardType="number-pad" autoCapitalize="none" autoCorrect={false} placeholder="e.g. 109876543210987" />
        </QuantumFormField>
        <QuantumFormField label="WhatsApp Business Account ID (for templates)">
          <QuantumTextInput value={businessAccountId} onChangeText={setBusinessAccountId} keyboardType="number-pad" autoCapitalize="none" autoCorrect={false} placeholder="Optional" />
        </QuantumFormField>
        <QuantumFormField label="Permanent access token">
          <QuantumTextInput value={accessToken} onChangeText={setAccessToken} secureTextEntry autoCapitalize="none" autoCorrect={false} placeholder="EAAG…" />
        </QuantumFormField>
        <QuantumFormField label="App secret">
          <QuantumTextInput value={appSecret} onChangeText={setAppSecret} secureTextEntry autoCapitalize="none" autoCorrect={false} />
        </QuantumFormField>
        <QuantumFormField label="Verify token (make one up)">
          <QuantumTextInput value={verifyToken} onChangeText={setVerifyToken} autoCapitalize="none" autoCorrect={false} placeholder="Any secret word — use it in Meta too" />
        </QuantumFormField>
        <QuantumButton onPress={() => void connect()} disabled={busy}>{busy ? 'Saving…' : connected ? 'Update connection' : 'Connect WhatsApp'}</QuantumButton>
        <QuantumButton tone="secondary" onPress={() => { Linking.openURL('https://developers.facebook.com/apps').catch(() => undefined) }}>Open Meta for Developers</QuantumButton>
      </QuantumCard>

      <QuantumSectionHeader label="2 · Webhook (paste into Meta)" />
      <QuantumCard>
        <QuantumText variant="caption" color={quantumColors.neutral200}>In Meta → WhatsApp → Configuration, set the callback URL below, use your verify token, and subscribe to “messages”.</QuantumText>
        {webhookUrl ? <>
          <QuantumText variant="caption" style={styles.mono}>{webhookUrl}</QuantumText>
          <QuantumButton tone="secondary" onPress={() => shareValue(webhookUrl)}>Copy or share webhook URL</QuantumButton>
        </> : <QuantumText variant="caption">Sign in again to see your webhook URL.</QuantumText>}
      </QuantumCard>

      <QuantumSectionHeader label="3 · Your phone" />
      <QuantumCard>
        {owners.length ? owners.map((item) => (
          <QuantumText key={item.id} variant="caption">✓ +{item.address} · {item.role === 'founder' ? 'Owner' : 'Admin'}</QuantumText>
        )) : <QuantumText variant="caption" color={quantumColors.neutral200}>Add the mobile number you will message FoundAI from.</QuantumText>}
        <QuantumFormField label="Your mobile number (with country code)">
          <QuantumTextInput value={myNumber} onChangeText={setMyNumber} keyboardType="phone-pad" placeholder="e.g. +44 7700 900123" />
        </QuantumFormField>
        <QuantumButton onPress={() => void addMe()} disabled={busy}>Add my number</QuantumButton>
      </QuantumCard>

      <View style={styles.gap} />
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  mono: { fontFamily: 'Menlo', fontSize: 12 },
  gap: { height: quantumSpace.xl },
})
