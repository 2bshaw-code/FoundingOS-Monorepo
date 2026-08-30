/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
type MessagingBrand = { name: string; logo: string }

type DemoMessage = {
  from: 'customer' | 'staff' | 'automation'
  channel: string
  text: string
  time: string
}

const DEMO_THREAD: DemoMessage[] = [
  { from: 'customer', channel: 'WhatsApp', text: 'Hi, is this item still in stock?', time: '09:12' },
  { from: 'automation', channel: 'WhatsApp', text: 'Thanks for reaching out! Checking stock now — one moment.', time: '09:12' },
  { from: 'staff', channel: 'WhatsApp', text: 'Yes, we have 6 left in your size. Want me to hold one for you?', time: '09:14' },
  { from: 'customer', channel: 'Instagram DM', text: 'Can you send a photo of the packaging?', time: '09:20' },
  { from: 'staff', channel: 'Instagram DM', text: 'Of course — sending it over now.', time: '09:21' },
]

const DEMO_MEDIA_FLOWS = [
  { label: 'Product photo', description: 'Customer receives an auto-attached product image after asking about an item.' },
  { label: 'Order confirmation PDF', description: 'A generated receipt is sent automatically once payment is confirmed.' },
  { label: 'Delivery tracking link', description: 'A live tracking link is shared as soon as a courier is assigned.' },
]

const DEMO_AUTOMATION_FLOWS = [
  { label: 'Stock check', description: 'Automatically checks live inventory before a staff member replies.' },
  { label: 'Order status lookup', description: 'Pulls the latest order status and drafts a reply for staff to approve.' },
  { label: 'Follow-up reminder', description: 'Nudges a customer 24h after an unanswered question.' },
]

function toneFor(from: DemoMessage['from']) {
  if (from === 'customer') return 'watch'
  if (from === 'automation') return 'good'
  return 'good'
}

export type UnifiedMessagingVariant = 'limited' | 'full' | 'global' | 'preview'

const VARIANT_COPY: Record<UnifiedMessagingVariant, { eyebrow: string; summary: (name: string) => string }> = {
  limited: { eyebrow: 'Limited preview', summary: (name) => `A limited sample of ${name}'s customer conversations — upgrade to Growth for the full view.` },
  full: { eyebrow: 'Read-only preview', summary: (name) => `A sample of ${name}'s customer conversations, staff replies, media, and automation — for demos only.` },
  global: { eyebrow: 'Cross-brand view', summary: () => 'A sample of customer conversations across every brand, in one unified inbox.' },
  preview: { eyebrow: 'Preview', summary: (name) => `See how ${name} handles customer conversations across every channel.` },
}

export function DemoMessageBoard({ config, variant = 'full' }: { config: MessagingBrand; variant?: UnifiedMessagingVariant }) {
  const thread = variant === 'limited' || variant === 'preview' ? DEMO_THREAD.slice(0, 3) : DEMO_THREAD
  const copy = VARIANT_COPY[variant]
  const showFlows = variant === 'full' || variant === 'global'

  return (
    <section className="panel panel-premium demo-message-board quantum-card">
      <span className="quantum-corner-marker">{config.logo}</span>
      <header className="module-header">
        <p>{copy.eyebrow}</p>
        <h2>Unified Messaging</h2>
        <span>{copy.summary(config.name)}</span>
      </header>

      <div className="demo-message-thread">
        {thread.map((message, index) => (
          <article key={index} className={`dashboard-card ${toneFor(message.from)} demo-message-bubble demo-message-${message.from}`}>
            <span>{message.from === 'customer' ? 'Customer' : message.from === 'staff' ? 'Staff' : 'Automation'} · {message.channel}</span>
            <p>{message.text}</p>
            <small>{message.time}</small>
          </article>
        ))}
      </div>

      {showFlows && (
        <div className="module-card-grid">
          <div className="panel panel-premium">
            <h3>Example media flows</h3>
            <ul>
              {DEMO_MEDIA_FLOWS.map((flow) => (
                <li key={flow.label}><strong>{flow.label}:</strong> {flow.description}</li>
              ))}
            </ul>
          </div>
          <div className="panel panel-premium">
            <h3>Example automation flows</h3>
            <ul>
              {DEMO_AUTOMATION_FLOWS.map((flow) => (
                <li key={flow.label}><strong>{flow.label}:</strong> {flow.description}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}

export default DemoMessageBoard
