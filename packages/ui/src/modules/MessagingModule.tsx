/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { DataWorkbench, consoleStyle, type BrandConsoleConfig, type DataField, type DataRow } from '../console'
import { ModuleTabs, type ModuleTab } from '../module-tabs'
import { AnimatedMessageFlow } from '../animated-message-flow'

// Real, tabbed Messaging — replaces the previous single generic table. Inbox reuses the real,
// already-built AnimatedMessageFlow conversation preview; Templates/Automations/Analytics are
// genuinely interactive client-state workspaces (same honesty level as every other illustrative
// module — not a real delivery/automation engine yet).

const templateFields: DataField[] = [
  { key: 'name', label: 'Template' },
  { key: 'channel', label: 'Channel', type: 'select', options: ['WhatsApp', 'SMS', 'Email', 'Telegram'] },
  { key: 'content', label: 'Content preview', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Approved'] },
]
const templateRows = (brand: string): DataRow[] => [
  { id: `${brand}-mtpl-1`, values: { name: 'Order confirmation', channel: 'WhatsApp', content: 'Thanks for your order! We\u2019ll let you know as soon as it ships.', status: 'Approved' } },
  { id: `${brand}-mtpl-2`, values: { name: 'Delivery update', channel: 'SMS', content: 'Your order is out for delivery today.', status: 'Approved' } },
  { id: `${brand}-mtpl-3`, values: { name: 'Support follow-up', channel: 'Email', content: 'Just checking in — did we resolve everything for you?', status: 'Draft' } },
]

const automationFields: DataField[] = [
  { key: 'trigger', label: 'Trigger' },
  { key: 'action', label: 'Action' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Paused'] },
  { key: 'lastRun', label: 'Last run', type: 'date' },
]
const automationRows = (brand: string): DataRow[] => [
  { id: `${brand}-auto-1`, values: { trigger: 'New order placed', action: 'Send order confirmation template', status: 'Active', lastRun: '2026-09-02' } },
  { id: `${brand}-auto-2`, values: { trigger: 'No reply after 24h', action: 'Send gentle follow-up', status: 'Active', lastRun: '2026-09-01' } },
  { id: `${brand}-auto-3`, values: { trigger: 'Order marked delivered', action: 'Request a review', status: 'Paused', lastRun: '2026-08-20' } },
]

export function MessagingModule({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const brand = config.name.toLowerCase().replaceAll(' ', '-')

  const tabs: ModuleTab[] = [
    {
      id: 'inbox',
      label: 'Inbox',
      icon: '💬',
      guide: 'This is where real conversations across WhatsApp/SMS/Email/Telegram land in one place — open a conversation to reply, and it stays here even after you switch tabs.',
      render: () => (
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>💬</span><strong>Unified inbox</strong></div>
          <p>Every channel {config.name} uses, in one place. Live preview of the message style below.</p>
          <AnimatedMessageFlow />
        </article>
      ),
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: '📄',
      guide: 'Write a message once, approve it, and reuse it across every channel instead of retyping the same reply. Move Status from Draft to Approved when it\u2019s ready.',
      render: () => (
        <DataWorkbench
          title="Message templates"
          description="Pre-approved, reusable messages for every channel."
          fields={templateFields}
          rows={templateRows(brand)}
          cards={[
            { label: 'Approved', value: '2', trend: 'Ready to send', icon: '✓' },
            { label: 'In draft', value: '1', trend: 'Needs review', icon: '✎' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Create your first template."
        />
      ),
    },
    {
      id: 'automations',
      label: 'Automations',
      icon: '⚡',
      guide: 'Set a Trigger (e.g. "order placed") and an Action (e.g. "send confirmation") so replies go out automatically without someone typing them each time. Pause one anytime by changing its Status.',
      render: () => (
        <DataWorkbench
          title="Automations"
          description="Trigger a template automatically based on real customer activity."
          fields={automationFields}
          rows={automationRows(brand)}
          cards={[
            { label: 'Active', value: '2', trend: 'Running', icon: '▶' },
            { label: 'Paused', value: '1', trend: 'Not running', icon: '⏸' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Create your first automation."
        />
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊',
      guide: 'A quick read on messaging volume and response speed. Illustrative for now — useful as a template for what a real messaging analytics view should track.',
      render: () => (
        <div className="module-card-grid">
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>📨</span><strong>Messages sent</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>1,284</p>
            <p><small>Illustrative — last 30 days.</small></p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>↩</span><strong>Response rate</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>76%</p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>⏱</span><strong>Avg response time</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>4m 12s</p>
          </article>
        </div>
      ),
    },
  ]

  return (
    <ModuleTabs
      title="Messaging"
      description={`Unified inbox, templates, and automations for every channel ${config.name} uses.`}
      tabs={tabs}
      accentStyle={accentStyle}
    />
  )
}

export default MessagingModule
