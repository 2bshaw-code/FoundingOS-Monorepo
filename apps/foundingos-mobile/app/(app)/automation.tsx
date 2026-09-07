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

// Short, plain-language steps only — no images, no long paragraphs — this app is built for
// Africa-ready, low-end/low-data devices, so this stays light and collapsed by default.
const WHATSAPP_SETUP_STEPS = [
  'Your WhatsApp Business number (new or existing).',
  'A verified Meta Business Account (Meta\u2019s own requirement, not ours).',
  'Your WhatsApp Business Account ID + access token, added in Settings.',
  'Approve your message templates (we provide ready-made ones).',
  'Go live \u2014 FoundAI reads and replies automatically, with you always able to step in.',
]

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
  const [setupOpen, setSetupOpen] = useState(false)

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
        <QuantumButton tone="ghost" onPress={() => setSetupOpen((open) => !open)}>
          {setupOpen ? 'Hide what we need to connect WhatsApp' : 'What we need to connect your WhatsApp'}
        </QuantumButton>
        {setupOpen ? (
          <View style={styles.setupList}>
            {WHATSAPP_SETUP_STEPS.map((step, index) => (
              <View style={styles.setupRow} key={step}>
                <QuantumText variant="caption" color={quantumColors.whatsapp}>{index + 1}</QuantumText>
                <QuantumText variant="caption" style={styles.flex}>{step}</QuantumText>
              </View>
            ))}
          </View>
        ) : null}
      </QuantumCard>

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
  setupList: { gap: quantumSpace.xs, marginTop: quantumSpace.sm },
  setupRow: { flexDirection: 'row', gap: quantumSpace.sm, alignItems: 'flex-start' },
})
