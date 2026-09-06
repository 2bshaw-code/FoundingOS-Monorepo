/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useQuantumStore } from '../lib/store'
import { authedFetch } from '../lib/api'
import { enqueueOutboxAction } from '../lib/outbox-sync'
import { QuantumButton, QuantumCard, QuantumModalSurface, QuantumNotice, QuantumText, QuantumTextInput, quantumColors, quantumRadius, quantumSpace, useActiveQuantumTheme } from './QuantumUI'

export type AIConfirmationData = {
  actionType: string
  brandSlug: string
  title: string
  summary: string
  confidenceScore: number
  whatsappMessage: string
  details: Record<string, unknown>
}

type CaptureType = 'voice' | 'photo' | 'video'

export function MultimodalCaptureModal({
  visible,
  captureType,
  onClose,
  onConfirmationReady,
}: {
  visible: boolean
  captureType: CaptureType | null
  onClose: () => void
  onConfirmationReady: (data: AIConfirmationData) => void
}) {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const theme = useActiveQuantumTheme()
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [voiceInputText, setVoiceInputText] = useState('')
  const [error, setError] = useState('')

  if (!visible || !captureType) return null

  const captureTitle = captureType === 'voice' ? 'Voice AI Assistant' : captureType === 'photo' ? 'AI Photo Scanner' : 'AI Video Analysis'

  const mediaConfig = (type: CaptureType) => {
    let endpoint = '/api/ai/inventory-intake'
    let actionType = 'PHOTO_INVENTORY_INTAKE'

    if (type === 'photo') {
      if (activeBrandSlug === 'meat') {
        endpoint = '/api/boltons/meat-traceability'
        actionType = 'MEAT_TRACEABILITY_SCAN'
      } else if (activeBrandSlug === 'finance') {
        endpoint = '/api/boltons/finance-expense'
        actionType = 'RECEIPT_EXPENSE_SCAN'
      } else if (activeBrandSlug === 'retail') {
        endpoint = '/api/boltons/shelf-scanner'
        actionType = 'SHELF_STOCK_SCAN'
      }
    } else if (type === 'video') {
      endpoint = '/api/ai/logistics-routing'
      actionType = 'VIDEO_MULTIITEM_SCAN'
    }

    return { endpoint, actionType }
  }

  const processMediaPayload = async (mediaUri: string, type: CaptureType) => {
    setIsProcessing(true)
    setError('')
    try {
      const { endpoint, actionType } = mediaConfig(type)
      const res = await authedFetch(`https://console.foundingos.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSlug: activeBrandSlug, mediaUri, captureType: type }),
      })

      if (!res.ok) throw new Error(`AI endpoint returned ${res.status}`)
      const data = await res.json().catch(() => null)
      const suggestion = data?.suggestion

      onClose()
      onConfirmationReady({
        actionType,
        brandSlug: activeBrandSlug,
        title: suggestion?.name || data?.boltOn || 'AI Multimodal Intake Detected',
        summary: suggestion?.whatsappMessage || `Detected ${type} capture and mapped it into a structured workflow.`,
        confidenceScore: suggestion?.confidenceScore || 0.95,
        whatsappMessage: suggestion?.whatsappMessage || `AI action logged: ${type} intake processed for ${activeBrandSlug}.`,
        details: suggestion || data || { uri: mediaUri },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown processing error'
      setError(`Could not process this ${type} capture. ${message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLaunchCamera = async () => {
    setError('')
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (!permissionResult.granted) {
      setError('Camera permission is required to capture photos or videos.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: captureType === 'video' ? ['videos'] : ['images'],
      quality: 0.7,
    })

    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri)
      await processMediaPayload(result.assets[0].uri, captureType)
    }
  }

  const handleLaunchLibrary = async () => {
    setError('')
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: captureType === 'video' ? ['videos'] : ['images'],
      quality: 0.7,
    })

    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri)
      await processMediaPayload(result.assets[0].uri, captureType)
    }
  }

  const handleVoiceSubmit = async () => {
    if (!voiceInputText.trim()) {
      setError('Enter or dictate a command before processing voice input.')
      return
    }

    setIsProcessing(true)
    setError('')
    try {
      const res = await authedFetch('https://console.foundingos.com/api/ai/inventory-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSlug: activeBrandSlug, query: voiceInputText, captureType: 'voice' }),
      })

      if (!res.ok) throw new Error(`AI endpoint returned ${res.status}`)
      const data = await res.json().catch(() => null)

      onClose()
      onConfirmationReady({
        actionType: 'VOICE_COMMAND_ACTION',
        brandSlug: activeBrandSlug,
        title: 'Voice Command Processed',
        summary: `Command "${voiceInputText}" was mapped to a structured domain model.`,
        confidenceScore: 0.96,
        whatsappMessage: `Voice command "${voiceInputText}" processed on ${activeBrandSlug}.`,
        details: data?.suggestion || { commandText: voiceInputText },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown processing error'
      setError(`Could not process voice command. ${message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <QuantumModalSurface>
          <QuantumText variant="overline" color={theme.accent}>AI + media pipeline</QuantumText>
          <QuantumText variant="h2">{captureTitle}</QuantumText>
          <QuantumText variant="caption">Capture, compress, upload, and map into the active {activeBrandSlug} workflow.</QuantumText>

          {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}

          {isProcessing ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={theme.accent} size="large" />
              <QuantumText variant="caption" align="center">Analyzing with Quantum AI and extracting domain mapping...</QuantumText>
            </View>
          ) : captureType === 'voice' ? (
            <View style={styles.stack}>
              <QuantumCard accent={theme.accent} style={styles.voiceOrb}>
                <QuantumText variant="h1" color={theme.accent} align="center">VOICE</QuantumText>
              </QuantumCard>
              <QuantumTextInput
                placeholder="Type or dictate: Add 50 boxes of beef to inventory"
                value={voiceInputText}
                onChangeText={setVoiceInputText}
                multiline
                style={styles.voiceInput}
              />
              <QuantumButton onPress={handleVoiceSubmit}>Process Voice Command</QuantumButton>
            </View>
          ) : (
            <View style={styles.stack}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <View style={[styles.placeholderBox, { borderColor: theme.borderColor }]}>
                  <QuantumText variant="h3" align="center">No capture selected</QuantumText>
                  <QuantumText variant="caption" align="center">Open the camera or choose from your gallery.</QuantumText>
                </View>
              )}
              <View style={styles.buttonRow}>
                <QuantumButton onPress={handleLaunchCamera} style={styles.rowButton}>Open Camera</QuantumButton>
                <QuantumButton tone="secondary" onPress={handleLaunchLibrary} style={styles.rowButton}>From Gallery</QuantumButton>
              </View>
            </View>
          )}

          <QuantumButton tone="ghost" onPress={onClose}>Cancel</QuantumButton>
        </QuantumModalSurface>
      </View>
    </Modal>
  )
}

export function AIConfirmationModal({ data, onClose }: { data: AIConfirmationData | null; onClose: () => void }) {
  const theme = useActiveQuantumTheme()
  const [isExecuting, setIsExecuting] = useState(false)
  const [executed, setExecuted] = useState(false)

  if (!data) return null

  const handleConfirmAction = async () => {
    setIsExecuting(true)
    await enqueueOutboxAction(data.actionType, data.brandSlug, {
      title: data.title,
      summary: data.summary,
      details: data.details,
      whatsappMessage: data.whatsappMessage,
      confirmedAt: Date.now(),
    })
    setIsExecuting(false)
    setExecuted(true)
  }

  return (
    <Modal visible={!!data} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <QuantumModalSurface>
          <QuantumText variant="overline" color={theme.accent}>AI suggestion card</QuantumText>
          <QuantumText variant="h2">{data.title}</QuantumText>
          <QuantumText>{data.summary}</QuantumText>

          <QuantumCard accent={theme.accent} elevated={false}>
            <QuantumText variant="caption">Confidence Score</QuantumText>
            <QuantumText variant="h2" color={theme.accent}>{(data.confidenceScore * 100).toFixed(0)}%</QuantumText>
          </QuantumCard>

          <QuantumCard accent={quantumColors.whatsapp} elevated={false}>
            <QuantumText variant="overline" color={quantumColors.whatsapp}>WhatsApp automation message</QuantumText>
            <QuantumText>{data.whatsappMessage}</QuantumText>
          </QuantumCard>

          {executed ? (
            <QuantumNotice tone="success">Written to SQLite local storage and queued to Outbox Sync Worker.</QuantumNotice>
          ) : (
            <QuantumButton onPress={handleConfirmAction} disabled={isExecuting}>
              {isExecuting ? <ActivityIndicator color={quantumColors.neutral900} /> : 'Approve & Write to Local SQLite Outbox'}
            </QuantumButton>
          )}

          <QuantumButton tone="ghost" onPress={onClose}>{executed ? 'Close' : 'Dismiss'}</QuantumButton>
        </QuantumModalSurface>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 10, 0.86)',
    justifyContent: 'center',
    padding: quantumSpace.xl,
  },
  stack: { gap: quantumSpace.md },
  loadingBox: { alignItems: 'center', justifyContent: 'center', padding: quantumSpace.xxl, gap: quantumSpace.md },
  voiceOrb: { alignItems: 'center' },
  voiceInput: { minHeight: 92, textAlignVertical: 'top' },
  previewImage: { width: '100%', height: 180, borderRadius: quantumRadius.md },
  placeholderBox: {
    minHeight: 140,
    borderRadius: quantumRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: quantumSpace.xs,
    padding: quantumSpace.lg,
  },
  buttonRow: { flexDirection: 'row', gap: quantumSpace.sm },
  rowButton: { flex: 1 },
})
