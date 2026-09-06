/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useQuantumStore } from '../../lib/store'
import { enqueueOutboxAction } from '../../lib/outbox-sync'
import {
  QuantumButton,
  QuantumCard,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  QuantumTextInput,
  quantumColors,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../components/QuantumUI'

const WHATSAPP_WORKFLOWS = [
  {
    id: 'wa_pay_link',
    title: 'Send payment link',
    desc: 'Generate a secure collection link and prepare a WhatsApp-native message.',
    actionType: 'WHATSAPP_PAY_LINK',
    payload: { amount: 99, currency: 'USD' },
  },
  {
    id: 'wa_stock_alert',
    title: 'Supplier restock alert',
    desc: 'Notify suppliers when stock crosses a reorder threshold.',
    actionType: 'WHATSAPP_RESTOCK_ALERT',
    payload: { threshold: 10 },
  },
  {
    id: 'wa_candidate_ping',
    title: 'Candidate interview ping',
    desc: 'Send interview reminder, time, and directions to a candidate.',
    actionType: 'WHATSAPP_CANDIDATE_PING',
    payload: {},
  },
  {
    id: 'wa_ops_alert',
    title: 'Operations risk alert',
    desc: 'Escalate an operational exception to the responsible team.',
    actionType: 'WHATSAPP_RISK_ALERT',
    payload: {},
  },
]

export default function AutomationScreen() {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const theme = useActiveQuantumTheme()
  const [phone, setPhone] = useState('+254712345678')
  const [customMsg, setCustomMsg] = useState('')
  const [logNotice, setLogNotice] = useState('')

  const queueWorkflow = async (workflow: (typeof WHATSAPP_WORKFLOWS)[number]) => {
    await enqueueOutboxAction(workflow.actionType, activeBrandSlug, { phone, ...workflow.payload })
    setLogNotice(`${workflow.title} queued for WhatsApp delivery.`)
  }

  const handleCustomSend = async () => {
    if (!customMsg.trim()) return
    await enqueueOutboxAction('WHATSAPP_CUSTOM_MSG', activeBrandSlug, { phone, message: customMsg })
    setLogNotice('Custom WhatsApp message queued for delivery.')
    setCustomMsg('')
  }

  return (
    <QuantumScreen>
      <QuantumCard accent={quantumColors.whatsapp}>
        <QuantumText variant="overline" color={quantumColors.whatsapp}>
          WhatsApp-native automation
        </QuantumText>
        <QuantumText variant="h1">Automation</QuantumText>
        <QuantumText color={theme.subtextColor}>
          Queue customer, supplier, talent, and operations messages through the offline-first action engine.
        </QuantumText>
      </QuantumCard>

      {logNotice ? <QuantumNotice tone="success">{logNotice}</QuantumNotice> : null}

      <QuantumCard>
        <QuantumText variant="h3">Recipient</QuantumText>
        <QuantumTextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      </QuantumCard>

      <QuantumSectionHeader label="Preset flows" />
      {WHATSAPP_WORKFLOWS.map((workflow) => (
        <QuantumCard key={workflow.id} accent={quantumColors.whatsapp}>
          <View style={styles.rowBetween}>
            <View style={styles.flex}>
              <QuantumText variant="h3">{workflow.title}</QuantumText>
              <QuantumText variant="caption" color={theme.subtextColor}>
                {workflow.desc}
              </QuantumText>
            </View>
            <QuantumButton onPress={() => queueWorkflow(workflow)}>Queue</QuantumButton>
          </View>
        </QuantumCard>
      ))}

      <QuantumSectionHeader label="Custom message" />
      <QuantumCard>
        <QuantumTextInput
          value={customMsg}
          onChangeText={setCustomMsg}
          placeholder="Type a WhatsApp-ready update..."
          multiline
          style={styles.messageInput}
        />
        <QuantumButton onPress={handleCustomSend}>Dispatch to outbox</QuantumButton>
      </QuantumCard>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  messageInput: { minHeight: 88, textAlignVertical: 'top' },
})
