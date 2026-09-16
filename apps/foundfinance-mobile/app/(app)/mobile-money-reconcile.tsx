/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { reconcileMobileMoneyPayment } from '../../lib/core-api'

const PROVIDERS = ['mpesa', 'mtn-momo', 'paystack', 'flutterwave', 'upi']

// Mobile money reconciliation flow: staff enter the provider reference and
// MSISDN from an incoming mobile money notification (SMS/app) and reconcile
// it against a payment via the real Core.Operations API.
export default function MobileMoneyReconcileScreen() {
  const params = useLocalSearchParams<{ invoiceId?: string }>()
  const [paymentId, setPaymentId] = useState('')
  const [provider, setProvider] = useState('mpesa')
  const [reference, setReference] = useState('')
  const [msisdn, setMsisdn] = useState('')
  const [amountGbp, setAmountGbp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

  async function handleReconcile() {
    if (!paymentId) { setFeedback('Enter the payment ID to reconcile.'); return }
    setSubmitting(true)
    const result = await reconcileMobileMoneyPayment(paymentId, {
      provider,
      reference,
      msisdn,
      amountPence: amountGbp ? Math.round(Number(amountGbp) * 100) : undefined,
    })
    setSubmitting(false)
    if (!result) { setFeedback('Could not reconcile this payment — please retry.'); return }
    setFeedback('✓ Payment reconciled via mobile money.')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}>
      <Pressable onPress={() => router.back()}>
        <Text style={[styles.backText, { color: BRAND.accent }]}>‹ Back</Text>
      </Pressable>
      <Text style={styles.title}>Mobile Money Reconciliation</Text>
      <Text style={styles.subtitle}>{params.invoiceId ? `For invoice ${params.invoiceId}` : 'Reconcile an incoming mobile money payment.'}</Text>
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

      <Text style={styles.label}>Payment ID</Text>
      <TextInput style={styles.input} value={paymentId} onChangeText={setPaymentId} placeholder="pay_..." placeholderTextColor="#5b6472" />

      <Text style={styles.label}>Provider</Text>
      <View style={styles.providerRow}>
        {PROVIDERS.map((option) => (
          <Pressable key={option} style={[styles.providerChip, provider === option && { backgroundColor: BRAND.accent }]} onPress={() => setProvider(option)}>
            <Text style={[styles.providerText, provider === option && { color: '#071014' }]}>{option}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Provider reference</Text>
      <TextInput style={styles.input} value={reference} onChangeText={setReference} placeholder="e.g. QGH7X2..." placeholderTextColor="#5b6472" />

      <Text style={styles.label}>Sender phone (MSISDN)</Text>
      <TextInput style={styles.input} value={msisdn} onChangeText={setMsisdn} placeholder="+2547..." placeholderTextColor="#5b6472" keyboardType="phone-pad" />

      <Text style={styles.label}>Amount (£, optional override)</Text>
      <TextInput style={styles.input} value={amountGbp} onChangeText={setAmountGbp} placeholder="0.00" placeholderTextColor="#5b6472" keyboardType="decimal-pad" />

      <Pressable style={[styles.button, { backgroundColor: BRAND.accent }]} onPress={handleReconcile} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Reconciling…' : 'Reconcile payment'}</Text>
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
  providerRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  providerChip: { borderWidth: 1, borderColor: '#242c38', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  providerText: { color: '#b9c2cf', fontSize: 12, fontWeight: '700' },
  button: { borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#071014', fontSize: 14, fontWeight: '800' },
})
