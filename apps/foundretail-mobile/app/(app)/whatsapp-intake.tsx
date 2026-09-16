/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Switch } from 'react-native'
import { router } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { createOrder } from '../../lib/core-api'

// WhatsApp-native order intake: staff transcribe an incoming WhatsApp order message
// into a real Order (source: 'whatsapp'), the same createSpecOrder path used by
// web and the in-app New Sale flow, so it emits the same order.confirmed event.
export default function WhatsAppOrderIntakeScreen() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [totalGbp, setTotalGbp] = useState('')
  const [autoInvoice, setAutoInvoice] = useState(true)
  const [autoFulfil, setAutoFulfil] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

  async function handleSubmit() {
    setSubmitting(true)
    setFeedback('')
    const order = await createOrder({
      totalPence: Math.round(Number(totalGbp || 0) * 100),
      source: 'whatsapp',
      autoInvoice,
      autoFulfil,
      items: [{ raw: message }],
      notes: `WhatsApp order from ${phone}`,
    })
    setSubmitting(false)
    if (!order) { setFeedback('Could not create the order — please retry.'); return }
    setFeedback(`✓ Order ${order.reference} created from WhatsApp message.`)
    setPhone(''); setMessage(''); setTotalGbp('')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}>
      <Pressable onPress={() => router.back()}>
        <Text style={[styles.backText, { color: BRAND.accent }]}>‹ Back</Text>
      </Pressable>
      <Text style={styles.title}>WhatsApp Order Intake</Text>
      <Text style={styles.subtitle}>Turn a customer's WhatsApp message into a real order.</Text>
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

      <Text style={styles.label}>Customer WhatsApp number</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+2547..." placeholderTextColor="#5b6472" keyboardType="phone-pad" />

      <Text style={styles.label}>Order message</Text>
      <TextInput style={[styles.input, { height: 90 }]} value={message} onChangeText={setMessage} placeholder="2x rice, 1x cooking oil" placeholderTextColor="#5b6472" multiline />

      <Text style={styles.label}>Order total (£)</Text>
      <TextInput style={styles.input} value={totalGbp} onChangeText={setTotalGbp} placeholder="0.00" placeholderTextColor="#5b6472" keyboardType="decimal-pad" />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Auto-generate invoice</Text>
        <Switch value={autoInvoice} onValueChange={setAutoInvoice} trackColor={{ true: BRAND.accent }} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Auto-trigger fulfilment</Text>
        <Switch value={autoFulfil} onValueChange={setAutoFulfil} trackColor={{ true: BRAND.accent }} />
      </View>

      <Pressable style={[styles.button, { backgroundColor: BRAND.accent }]} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Creating…' : 'Create order from WhatsApp message'}</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  backText: { fontSize: 14, fontWeight: '700' },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 13 },
  feedback: { color: '#b9c2cf', fontSize: 13 },
  label: { color: '#b9c2cf', fontSize: 12, fontWeight: '600' },
  input: { backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 12, padding: 12, color: '#ffffff' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  button: { borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#071014', fontSize: 14, fontWeight: '800' },
})
