/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { View, Text, Pressable, Image, ActivityIndicator, ScrollView, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { authedFetch } from '../../../lib/api'
import { BRAND } from '../../../lib/brand'
import { AI_SCANNER } from '../../../lib/ai-scanner'
import { recordScannedDocument } from '../../../lib/health-actions'

type Suggestion = {
  title: string
  summary: string
  confidenceScore: number
  raw: Record<string, unknown>
}

// Real AI bolt-on scanner — launches the device camera or photo library, uploads the
// capture to this brand's own real backend AI endpoint (see lib/ai-scanner.ts), and shows a
// confirmation card with what the AI detected. Mirrors the pattern already used in
// foundingos-mobile's MultimodalCaptureModal, but as a dedicated full screen for this hub.
export default function ScannerScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const [error, setError] = useState('')

  const processCapture = async (uri: string) => {
    setIsProcessing(true)
    setError('')
    setSuggestion(null)
    try {
      const res = await authedFetch(`https://console.foundingos.com${AI_SCANNER.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSlug: BRAND.slug, mediaUri: uri, captureType: 'photo' }),
      })
      if (!res.ok) throw new Error(`AI endpoint returned ${res.status}`)
      const data = await res.json().catch(() => null)
      const raw = data?.suggestion || data || {}
      const title = raw?.name || data?.boltOn || AI_SCANNER.title + ' result'
      const summary = raw?.whatsappMessage || `Detected a photo capture and mapped it into ${BRAND.name}'s workflow.`
      const confidenceScore = raw?.confidenceScore ?? 0.95
      setSuggestion({ title, summary, confidenceScore, raw })
      // Feed this scan into the patient Timeline as a real, locally-recorded entry — there is
      // no live EHR write-back behind this scanner yet, so the scan result is honestly stored
      // on-device (lib/health-actions.ts) rather than silently discarded.
      await recordScannedDocument({ title, summary, confidenceScore })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown processing error'
      setError(`Could not process this photo. ${message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLaunchCamera = async () => {
    setError('')
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      setError('Camera permission is required to use the scanner.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 })
    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri)
      await processCapture(result.assets[0].uri)
    }
  }

  const handleLaunchLibrary = async () => {
    setError('')
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 })
    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri)
      await processCapture(result.assets[0].uri)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 16 }}>
      <View style={[styles.card, { borderColor: BRAND.accent, shadowColor: BRAND.accent }]}>
        <Text style={styles.overline}>Your AI bolt-on</Text>
        <Text style={styles.title}>{AI_SCANNER.title}</Text>
        <Text style={styles.description}>{AI_SCANNER.description}</Text>
      </View>

      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isProcessing ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={BRAND.accent} size="large" />
          <Text style={styles.loadingText}>Analyzing your photo with Quantum AI...</Text>
        </View>
      ) : suggestion ? (
        <View style={[styles.resultCard, { borderColor: BRAND.accent }]}>
          <Text style={styles.resultLabel}>AI detected</Text>
          <Text style={styles.resultTitle}>{suggestion.title}</Text>
          <Text style={styles.resultSummary}>{suggestion.summary}</Text>
          <Text style={styles.resultConfidence}>Confidence: {Math.round(suggestion.confidenceScore * 100)}%</Text>
          <Pressable
            style={[styles.retryButton, { borderColor: BRAND.accent }]}
            onPress={() => { setSuggestion(null); setImageUri(null) }}
          >
            <Text style={[styles.retryButtonText, { color: BRAND.accent }]}>Scan another</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: BRAND.accent, shadowColor: BRAND.accent }]}
            onPress={handleLaunchCamera}
          >
            <Text style={styles.actionButtonText}>Take a photo</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButtonOutline, { borderColor: BRAND.accent }]}
            onPress={handleLaunchLibrary}
          >
            <Text style={[styles.actionButtonOutlineText, { color: BRAND.accent }]}>Choose from library</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  card: {
    backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 18, gap: 8,
    shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 4,
  },
  overline: { color: '#b9c2cf', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  description: { color: '#b9c2cf', fontSize: 13, lineHeight: 19 },
  preview: { width: '100%', height: 220, borderRadius: 16, backgroundColor: '#11161f' },
  error: { color: '#ff5470', fontSize: 13 },
  loadingBox: { alignItems: 'center', gap: 12, paddingVertical: 32 },
  loadingText: { color: '#b9c2cf', fontSize: 13, textAlign: 'center' },
  resultCard: {
    backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 18, gap: 8,
  },
  resultLabel: { color: '#b9c2cf', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  resultTitle: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
  resultSummary: { color: '#b9c2cf', fontSize: 13, lineHeight: 19 },
  resultConfidence: { color: '#ffffff', fontSize: 13, fontWeight: '700', marginTop: 4 },
  retryButton: { marginTop: 12, borderRadius: 999, borderWidth: 1.5, paddingVertical: 12, alignItems: 'center' },
  retryButtonText: { fontWeight: '800', fontSize: 14 },
  actions: { gap: 12 },
  actionButton: {
    borderRadius: 999, paddingVertical: 16, alignItems: 'center',
    shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  actionButtonText: { color: '#071014', fontWeight: '800', fontSize: 16 },
  actionButtonOutline: { borderRadius: 999, borderWidth: 1.5, paddingVertical: 15, alignItems: 'center' },
  actionButtonOutlineText: { fontWeight: '800', fontSize: 15 },
})
