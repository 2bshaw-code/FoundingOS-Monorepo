/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { openWhatsAppChat, generatePaymentWhatsAppMessage } from '../lib/whatsapp'
import { useQuantumStore } from '../lib/store'
import { QuantumButton, QuantumCard, QuantumFormField, QuantumNotice, QuantumText, QuantumTextInput, quantumColors, quantumSpace } from './QuantumUI'

export function WhatsAppActionCard({
  title = 'WhatsApp Quick Action',
  defaultPhone = '+254712345678',
  defaultAmount = 450,
  defaultRef = 'INV-9921',
}: {
  title?: string
  defaultPhone?: string
  defaultAmount?: number
  defaultRef?: string
}) {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const [phone, setPhone] = useState(defaultPhone)
  const [amount, setAmount] = useState(String(defaultAmount))
  const [status, setStatus] = useState('')

  const handleSendLink = async () => {
    const numAmount = parseFloat(amount) || defaultAmount
    const msg = generatePaymentWhatsAppMessage(numAmount, 'USD', defaultRef)
    await openWhatsAppChat(phone, msg, activeBrandSlug)
    setStatus('Opening WhatsApp with a pre-filled payment message.')
    setTimeout(() => setStatus(''), 4000)
  }

  return (
    <QuantumCard accent={quantumColors.whatsapp}>
      <QuantumText variant="overline" color={quantumColors.whatsapp}>WhatsApp native</QuantumText>
      <QuantumText variant="h3">{title}</QuantumText>
      <QuantumText variant="caption">
        Send payment requests, receipts, and workflow links directly to customers or suppliers.
      </QuantumText>
      <View style={styles.inputRow}>
        <QuantumFormField label="Phone">
          <QuantumTextInput value={phone} onChangeText={setPhone} placeholder="Phone (+254...)" keyboardType="phone-pad" />
        </QuantumFormField>
        <QuantumFormField label="Amount">
          <QuantumTextInput value={amount} onChangeText={setAmount} placeholder="Amount" keyboardType="numeric" />
        </QuantumFormField>
      </View>
      {status ? <QuantumNotice tone="success">{status}</QuantumNotice> : null}
      <QuantumButton onPress={handleSendLink}>Open WhatsApp & Send Link</QuantumButton>
    </QuantumCard>
  )
}

const styles = StyleSheet.create({
  inputRow: { gap: quantumSpace.md },
})
