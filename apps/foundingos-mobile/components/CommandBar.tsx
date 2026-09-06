/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { BRANDS } from '../lib/brands'
import { useQuantumStore } from '../lib/store'
import { enqueueOutboxAction } from '../lib/outbox-sync'
import { QuantumButton, QuantumListItem, QuantumModalSurface, QuantumNotice, QuantumSectionHeader, QuantumText, QuantumTextInput, quantumColors, quantumSpace } from './QuantumUI'

type CaptureType = 'voice' | 'photo' | 'video'

export function CommandBarModal({ onOpenMultimodal }: { onOpenMultimodal?: (type: CaptureType) => void }) {
  const commandBarOpen = useQuantumStore((state) => state.commandBarOpen)
  const setCommandBarOpen = useQuantumStore((state) => state.setCommandBarOpen)
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const [query, setQuery] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const filteredBrands = useMemo(
    () =>
      BRANDS.filter(
        (brand) =>
          brand.name.toLowerCase().includes(query.toLowerCase()) ||
          brand.tagline.toLowerCase().includes(query.toLowerCase()) ||
          brand.modules.some((module) => module.toLowerCase().includes(query.toLowerCase()))
      ),
    [query]
  )

  if (!commandBarOpen) return null

  const close = () => setCommandBarOpen(false)
  const openCapture = (type: CaptureType) => {
    close()
    onOpenMultimodal?.(type)
  }

  const quickActions = [
    {
      id: 'collect_payment',
      label: 'Collect payment',
      subtitle: 'Queue Mobile Money or card payment request.',
      action: async () => {
        await enqueueOutboxAction('COLLECT_PAYMENT', activeBrandSlug, {
          paymentType: 'mobile_money',
          amount: 1500,
          currency: 'KES',
          provider: 'M-Pesa',
        })
        setStatusMessage('Payment request queued to the offline Outbox worker.')
      },
    },
    {
      id: 'add_stock',
      label: 'Photo inventory intake',
      subtitle: 'Scan stock and create an AI suggestion.',
      action: () => openCapture('photo'),
    },
    {
      id: 'send_whatsapp_invoice',
      label: 'Send WhatsApp invoice',
      subtitle: 'Queue a WhatsApp-native payment link.',
      action: async () => {
        await enqueueOutboxAction('WHATSAPP_SEND_INVOICE', activeBrandSlug, {
          customerPhone: '+254712345678',
          amount: 450,
          currency: 'USD',
        })
        setStatusMessage('WhatsApp invoice link queued for automated delivery.')
      },
    },
    {
      id: 'voice_intake',
      label: 'Speak AI command',
      subtitle: 'Voice to structured workflow action.',
      action: () => openCapture('voice'),
    },
  ]

  return (
    <Modal visible={commandBarOpen} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <QuantumModalSurface style={styles.surface}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <QuantumText variant="overline">Command centre</QuantumText>
              <QuantumText variant="h2">Quantum Command Bar</QuantumText>
            </View>
            <QuantumButton tone="ghost" onPress={close} style={styles.closeButton}>Close</QuantumButton>
          </View>

          <QuantumTextInput
            placeholder="Search modules, brands, actions, or ask AI..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />

          <View style={styles.captureRow}>
            <QuantumButton tone="secondary" onPress={() => openCapture('voice')} style={styles.captureButton}>Voice AI</QuantumButton>
            <QuantumButton tone="secondary" onPress={() => openCapture('photo')} style={styles.captureButton}>Photo Intake</QuantumButton>
            <QuantumButton tone="secondary" onPress={() => openCapture('video')} style={styles.captureButton}>Video Scan</QuantumButton>
          </View>

          {statusMessage ? <QuantumNotice tone="success">{statusMessage}</QuantumNotice> : null}

          <ScrollView style={styles.resultsScroll} contentContainerStyle={styles.resultsContent} showsVerticalScrollIndicator={false}>
            <QuantumSectionHeader label="Instant actions" />
            {quickActions.map((action) => (
              <QuantumListItem key={action.id} title={action.label} subtitle={action.subtitle} onPress={action.action} accent={quantumColors.neutral200} />
            ))}

            <QuantumSectionHeader label="Brands & consoles" />
            {filteredBrands.map((brand) => (
              <QuantumListItem
                key={brand.slug}
                title={brand.name}
                subtitle={brand.tagline}
                accent={brand.accent}
                onPress={() => {
                  close()
                  router.push(`/brand-detail/${brand.slug}`)
                }}
              />
            ))}
          </ScrollView>
        </QuantumModalSurface>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 10, 0.86)',
    justifyContent: 'flex-start',
    paddingHorizontal: quantumSpace.lg,
    paddingTop: 60,
  },
  surface: { maxHeight: '82%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: quantumSpace.md },
  headerCopy: { flex: 1, gap: quantumSpace.xs },
  closeButton: { minHeight: 36, paddingVertical: quantumSpace.sm },
  captureRow: { flexDirection: 'row', gap: quantumSpace.sm },
  captureButton: { flex: 1, paddingHorizontal: quantumSpace.sm },
  resultsScroll: { flexGrow: 0 },
  resultsContent: { gap: quantumSpace.sm },
})
