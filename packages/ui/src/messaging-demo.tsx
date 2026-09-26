'use client'

import { useState } from 'react'

type DemoScenario = {
  id: string
  label: string
  inbound: string
  sender: string
  role: string
  intent: string
  workspace: string
  action: string
  record: string
  event: string
  reply: string
}

const scenarios: DemoScenario[] = [
  {
    id: 'ask',
    label: 'Ask FoundAI',
    inbound: 'Who owes me money this week?',
    sender: '+44 7700 900123',
    role: 'Owner',
    intent: 'Question for FoundAI',
    workspace: 'Finance',
    action: 'FoundAI read the live invoices, payments and customer history for this business and answered in plain words. Nothing was changed.',
    record: '3 overdue invoices · £1,240 outstanding',
    event: 'ai.answered recorded with the question and sources',
    reply: 'Three customers owe you £1,240. Harbour Cafe is the biggest at £620 and 9 days late.\n\nNext steps:\n• Send Harbour Cafe a reminder\n• Call Nova Foods about INV-1036',
  },
  {
    id: 'approve',
    label: 'Approve with YES',
    inbound: 'YES',
    sender: '+44 7700 900123',
    role: 'Owner',
    intent: 'Approve FoundAI request',
    workspace: 'Finance',
    action: 'FoundAI had asked: "Send payment reminder INV-1042 to Harbour Cafe (£620.00) — reply YES or NO". The owner replied YES, so the reminder was sent and logged.',
    record: 'INV-1042 · Reminder sent · Approved on WhatsApp',
    event: 'autopilot.approved and autopilot.action.executed published',
    reply: 'Done ✅ Send payment reminder: INV-1042 Harbour Cafe (£620.00)\n\nThat\'s everything for now.',
  },
  {
    id: 'order',
    label: 'New order',
    inbound: 'New order for John - 2x Blue T-shirts, deliver tomorrow',
    sender: '+44 7700 900123',
    role: 'Founder',
    intent: 'Create order',
    workspace: 'Retail',
    action: 'Customer matched and order created with two items and a requested delivery date.',
    record: 'Order #1048 · John · 2 items · Awaiting fulfilment',
    event: 'order.created published to the Shared Event Feed',
    reply: 'Done — Order #1048 was created for John. 2x Blue T-shirts are due for delivery tomorrow.',
  },
  {
    id: 'delivery',
    label: 'Delivery update',
    inbound: '/delivered ORDER-1048',
    sender: '+44 7700 900456',
    role: 'Driver',
    intent: 'Confirm delivery',
    workspace: 'Logistics',
    action: 'Order ownership and driver permission checked, then delivery status changed to delivered.',
    record: 'Delivery ORDER-1048 · Delivered · 14:32',
    event: 'delivery.completed published; Finance follow-up suggested',
    reply: 'Confirmed — ORDER-1048 is marked delivered. Finance has been notified to review invoicing.',
  },
  {
    id: 'invoice',
    label: 'Send invoice',
    inbound: '/invoice ORDER-1048',
    sender: '+44 7700 900123',
    role: 'Founder',
    intent: 'Create invoice',
    workspace: 'Finance',
    action: 'The delivered order was checked and a branded invoice was generated from its immutable source data.',
    record: 'Invoice INV-1048 · John · Ready to send',
    event: 'invoice.created published; payment follow-up scheduled',
    reply: 'Invoice INV-1048 is ready for ORDER-1048. Review and send it here: foundingos.com/app/invoices/INV-1048',
  },
  {
    id: 'campaign',
    label: 'Launch campaign',
    inbound: '/campaign Summer Sale | retail customers | move seasonal stock',
    sender: '+44 7700 900789',
    role: 'Marketing',
    intent: 'Draft campaign',
    workspace: 'Marketing',
    action: 'Audience and objective were saved, then Brand Studio terminology rules were applied to the draft.',
    record: 'Summer Sale · Draft · Retail customers',
    event: 'campaign.created published for review and attribution',
    reply: 'Campaign draft created for retail customers. Brand checks passed. Review the copy before launch.',
  },
  {
    id: 'status',
    label: 'Today status',
    inbound: '/status',
    sender: '+44 7700 900123',
    role: 'Founder',
    intent: 'Get operating summary',
    workspace: 'Core Intelligence',
    action: 'Live orders, deliveries, invoices, and operational risks were summarised for this tenant.',
    record: '12 orders · 3 deliveries pending · 2 payments received',
    event: 'status.requested recorded with tenant and conversation context',
    reply: 'Today: 12 orders, 3 deliveries pending, 2 payments received. One overdue invoice needs review.',
  },
]

const stageLabels = ['Message received', 'Understood safely', 'Work completed', 'Confirmation sent']

export function MessagingDemo() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id)
  const [stage, setStage] = useState(0)
  const scenario = scenarios.find((candidate) => candidate.id === scenarioId) ?? scenarios[0]

  const chooseScenario = (id: string) => {
    setScenarioId(id)
    setStage(0)
  }

  return (
    <section className="messaging-demo" aria-labelledby="messaging-demo-title">
      <div className="messaging-demo-heading">
        <div>
          <p className="eyebrow">Try the operating loop</p>
          <h2 id="messaging-demo-title">See exactly how a WhatsApp message becomes work.</h2>
          <p>This is an interactive simulation using sample data. It does not send a real WhatsApp message or change a live business record.</p>
        </div>
        <span className="demo-badge">Safe product simulation</span>
      </div>

      <div className="messaging-demo-scenarios" role="tablist" aria-label="Choose a sample message">
        {scenarios.map((candidate) => (
          <button
            aria-selected={candidate.id === scenario.id}
            className={candidate.id === scenario.id ? 'active' : ''}
            key={candidate.id}
            onClick={() => chooseScenario(candidate.id)}
            role="tab"
            type="button"
          >
            {candidate.label}
          </button>
        ))}
      </div>

      <div className="messaging-demo-grid">
        <div className="whatsapp-phone">
          <div className="whatsapp-phone-header">
            <span>F</span>
            <div><strong>FoundingOS</strong><small>WhatsApp Business · online</small></div>
          </div>
          <div className="whatsapp-chat">
            <div className="chat-date">TODAY</div>
            <div className="chat-bubble chat-inbound">
              <p>{scenario.inbound}</p>
              <small>14:31 ✓✓</small>
            </div>
            {stage >= 3 && (
              <div className="chat-bubble chat-outbound">
                <p>{scenario.reply}</p>
                <small>14:32 ✓✓</small>
              </div>
            )}
          </div>
          <div className="whatsapp-input"><span>Message</span><b>➤</b></div>
        </div>

        <div className="message-processing">
          <div className="processing-heading">
            <div><p className="eyebrow">Messaging Core</p><h3>Processing trace</h3></div>
            <strong>{stage + 1}/4</strong>
          </div>
          <ol>
            <li className={stage >= 0 ? 'complete' : ''}>
              <span>1</span>
              <div><strong>Receive and secure</strong><p>Webhook signature accepted. Duplicate message check passed.</p></div>
            </li>
            <li className={stage >= 1 ? 'complete' : ''}>
              <span>2</span>
              <div><strong>Identify and understand</strong><p>{scenario.sender} is authorised as {scenario.role}. Intent: {scenario.intent}.</p></div>
            </li>
            <li className={stage >= 2 ? 'complete' : ''}>
              <span>3</span>
              <div><strong>Act in {scenario.workspace}</strong><p>{scenario.action}</p></div>
            </li>
            <li className={stage >= 3 ? 'complete' : ''}>
              <span>4</span>
              <div><strong>Record and confirm</strong><p>{scenario.event}. A clear reply is returned to WhatsApp.</p></div>
            </li>
          </ol>

          {stage >= 2 && (
            <div className="message-result">
              <span>Resulting FoundingOS record</span>
              <strong>{scenario.record}</strong>
              <small>{scenario.workspace} · Shared Event Feed connected</small>
            </div>
          )}

          <div className="processing-controls">
            <button className="btn btn-secondary" disabled={stage === 0} onClick={() => setStage((current) => Math.max(0, current - 1))} type="button">Previous</button>
            <button className="btn btn-primary" onClick={() => setStage((current) => current >= 3 ? 0 : current + 1)} type="button">
              {stage >= 3 ? 'Run again' : `Next: ${stageLabels[stage + 1]}`}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
