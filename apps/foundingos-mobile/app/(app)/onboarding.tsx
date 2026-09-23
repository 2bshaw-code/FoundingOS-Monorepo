/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { Linking, RefreshControl, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import {
  CoreOpsApiError,
  MessagingReadiness,
  TenantOnboarding,
  fetchMessagingReadiness,
  fetchOnboarding,
  saveOnboarding,
} from '../../lib/core-operations-api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import { DEMO_MESSAGING_READINESS, DEMO_ONBOARDING } from '../../lib/demo-data'
import { ENTRANCE_DURATION_MS, staggerDelay, useReducedMotionPreference } from '../../lib/motion'
import { useQuantumStore } from '../../lib/store'
import {
  QuantumButton,
  QuantumCard,
  QuantumConfidenceBar,
  QuantumFormField,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumSkeletonList,
  QuantumText,
  QuantumTextInput,
  getSemanticColor,
  quantumSpace,
} from '../../components/QuantumUI'

const SETUP_STEPS = [
  { id: 'business', label: 'Business profile saved' },
  { id: 'owner', label: 'Owner account confirmed' },
  { id: 'whatsapp', label: 'WhatsApp connected' },
  { id: 'first-action', label: 'First governed AI action reviewed' },
]

export default function OnboardingScreen() {
  const [onboarding, setOnboarding] = useState<TenantOnboarding | null>(null)
  const [readiness, setReadiness] = useState<MessagingReadiness | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const reduceMotion = useReducedMotionPreference()

  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [industry, setIndustry] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      // Demo mode serves the same canned onboarding/messaging data as
      // Today's KPI strip, so this screen never shows a 401 while demoing.
      if (useQuantumStore.getState().demoMode) {
        setOnboarding(DEMO_ONBOARDING)
        setReadiness(DEMO_MESSAGING_READINESS)
        setBusinessName(DEMO_ONBOARDING.businessName || '')
        setOwnerName(DEMO_ONBOARDING.ownerName || '')
        setIndustry(DEMO_ONBOARDING.industry || '')
        return
      }
      const [data, messaging] = await Promise.all([
        fetchOnboarding().catch(() => null),
        fetchMessagingReadiness().catch(() => null),
      ])
      setOnboarding(data)
      setReadiness(messaging)
      if (data) {
        setBusinessName(data.businessName || '')
        setOwnerName(data.ownerName || '')
        setIndustry(data.industry || '')
      }
    } catch (err) {
      if (err instanceof CoreOpsApiError && err.status === 401) {
        setError('Onboarding requires a signed-in session.')
      } else {
        setError('Could not load onboarding status. Pull down to try again.')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const whatsappConnected = (readiness?.activeConnections || []).some((c) => c.channel === 'whatsapp' && c.active)

  // Real completion state, not fabricated — derived from what the backend actually
  // has on record (business profile) and the live WhatsApp connection status,
  // never assumed complete just because the screen was opened.
  const completedStepIds = new Set<string>(onboarding?.completedSteps || [])
  if (businessName.trim() && ownerName.trim()) completedStepIds.add('business')
  if (onboarding?.acceptedTermsAt) completedStepIds.add('owner')
  if (whatsappConnected) completedStepIds.add('whatsapp')

  const handleSaveProfile = async () => {
    if (!businessName.trim() || !ownerName.trim()) {
      setError('Enter a business name and owner name to continue.')
      return
    }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      // Demo mode mutates the local, in-memory copy only — never a real save.
      if (useQuantumStore.getState().demoMode) {
        setOnboarding((prev) => ({ ...(prev ?? DEMO_ONBOARDING), businessName: businessName.trim(), ownerName: ownerName.trim(), industry: industry.trim() || null }))
        setNotice('Business profile saved. (Demo mode — not persisted.)')
        return
      }
      const completedSteps = Array.from(new Set([...(onboarding?.completedSteps || []), 'business', 'owner']))
      const saved = await saveOnboarding({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        industry: industry.trim() || undefined,
        completedSteps,
        goLiveStatus: onboarding?.goLiveStatus || 'setup',
      })
      setOnboarding(saved)
      setNotice('Business profile saved.')
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not save business profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleGoLive = async () => {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      if (useQuantumStore.getState().demoMode) {
        setOnboarding((prev) => ({ ...(prev ?? DEMO_ONBOARDING), goLiveStatus: 'live' }))
        setNotice('Workspace is live. Welcome to FoundingOS. (Demo mode — not persisted.)')
        return
      }
      const saved = await saveOnboarding({
        businessName: businessName.trim() || onboarding?.businessName,
        ownerName: ownerName.trim() || onboarding?.ownerName,
        completedSteps: Array.from(new Set([...(onboarding?.completedSteps || []), ...completedStepIds])),
        goLiveStatus: 'live',
        acceptTerms: true,
      })
      setOnboarding(saved)
      setNotice('Workspace is live. Welcome to FoundingOS.')
    } catch (err) {
      setError(err instanceof CoreOpsApiError ? err.message : 'Could not complete onboarding.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <QuantumScreen>
        <QuantumText variant="overline" color={FOUNDINGOS_ACCENT}>Setup & Onboarding</QuantumText>
        <QuantumText variant="h1">Get your workspace live</QuantumText>
        <QuantumSkeletonList count={3} />
      </QuantumScreen>
    )
  }

  const allStepsComplete = SETUP_STEPS.every((step) => completedStepIds.has(step.id) || step.id === 'first-action')
  const isLive = onboarding?.goLiveStatus === 'live'
  const requiredSteps = SETUP_STEPS.filter((step) => step.id !== 'first-action')
  const requiredDoneCount = requiredSteps.filter((step) => completedStepIds.has(step.id)).length
  const progressPercent = isLive ? 100 : (requiredDoneCount / requiredSteps.length) * 100
  const fade = (index: number) => (reduceMotion ? undefined : FadeInDown.delay(staggerDelay(index)).duration(ENTRANCE_DURATION_MS).springify().damping(18))

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
      {notice ? <QuantumNotice tone="success">{notice}</QuantumNotice> : null}

      {/* Premium hero — one glance tells you exactly how close to "live" you
          are, instead of a checklist buried under a plain status banner. */}
      <Animated.View entering={fade(0)}>
        <QuantumCard accent={isLive ? getSemanticColor('good') : FOUNDINGOS_ACCENT}>
          <QuantumText variant="overline" color={isLive ? getSemanticColor('good') : FOUNDINGOS_ACCENT}>
            {isLive ? 'Live' : 'Getting started'}
          </QuantumText>
          <QuantumText variant="h2">
            {isLive ? 'Your workspace is live' : 'A few minutes from going live'}
          </QuantumText>
          <QuantumText variant="caption" style={styles.heroCopy}>
            {isLive
              ? 'Every action here runs through the real governed AI workflow engine — nothing is simulated.'
              : 'Three short steps unlock the full FoundingOS command deck: your business profile, WhatsApp, and your first governed AI decision.'}
          </QuantumText>
          <View style={styles.heroBar}>
            <QuantumConfidenceBar label="Setup progress" percent={progressPercent} tone={isLive ? 'good' : progressPercent > 50 ? 'info' : 'watch'} />
          </View>
        </QuantumCard>
      </Animated.View>

      <QuantumSectionHeader label="Setup checklist" />
      <Animated.View entering={fade(1)}>
        <QuantumCard accent={FOUNDINGOS_ACCENT}>
          {SETUP_STEPS.map((step) => {
            const done = completedStepIds.has(step.id)
            return (
              <View key={step.id} style={styles.stepRow}>
                <View style={[styles.stepDot, { backgroundColor: done ? getSemanticColor('good') : 'transparent', borderColor: getSemanticColor(done ? 'good' : 'watch') }]} />
                <QuantumText variant="caption">{step.label}{step.id === 'first-action' ? ' (from Work & Approvals)' : ''}</QuantumText>
              </View>
            )
          })}
        </QuantumCard>
      </Animated.View>

      <QuantumSectionHeader label="Business profile" />
      <Animated.View entering={fade(2)}>
        <QuantumCard accent={FOUNDINGOS_ACCENT}>
          <QuantumFormField label="Business name">
            <QuantumTextInput value={businessName} onChangeText={setBusinessName} placeholder="Your company name" />
          </QuantumFormField>
          <QuantumFormField label="Owner name">
            <QuantumTextInput value={ownerName} onChangeText={setOwnerName} placeholder="Founder / owner name" />
          </QuantumFormField>
          <QuantumFormField label="Industry (optional)">
            <QuantumTextInput value={industry} onChangeText={setIndustry} placeholder="e.g. Retail, Logistics, Services" />
          </QuantumFormField>
          <QuantumButton onPress={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving…' : 'Save business profile'}
          </QuantumButton>
        </QuantumCard>
      </Animated.View>

      <QuantumSectionHeader label="WhatsApp connection" />
      <Animated.View entering={fade(3)}>
        <QuantumCard accent={getSemanticColor(whatsappConnected ? 'good' : 'watch')}>
          <QuantumText style={styles.title}>{whatsappConnected ? 'WhatsApp connected' : 'WhatsApp not yet connected'}</QuantumText>
          <QuantumText variant="caption">
            {readiness ? `${readiness.authorizedParticipants} authorized participant(s)` : 'Connection status unavailable.'}
          </QuantumText>
          {!whatsappConnected && readiness?.webFallbackUrl ? (
            <QuantumButton tone="secondary" onPress={() => Linking.openURL(readiness.webFallbackUrl)}>
              Connect WhatsApp
            </QuantumButton>
          ) : null}
        </QuantumCard>
      </Animated.View>

      <QuantumSectionHeader label="Go live" />
      <Animated.View entering={fade(4)}>
        <QuantumCard accent={FOUNDINGOS_ACCENT}>
          <QuantumText variant="caption">
            {allStepsComplete
              ? 'All required setup steps are complete. Going live confirms the workspace is ready for real governed operations.'
              : 'Finish the business profile and WhatsApp connection above before going live.'}
          </QuantumText>
          <QuantumButton onPress={handleGoLive} disabled={saving || isLive}>
            {isLive ? 'Workspace is live' : saving ? 'Saving…' : 'Go live'}
          </QuantumButton>
        </QuantumCard>
      </Animated.View>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  title: { fontWeight: '600' },
  heroCopy: { marginTop: quantumSpace.xs, marginBottom: quantumSpace.xs },
  heroBar: { marginTop: quantumSpace.xs },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm, marginBottom: quantumSpace.xs },
  stepDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
})
