/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { DataWorkbench, consoleStyle, type BrandConsoleConfig, type DataField, type DataRow } from '../console'
import { ModuleTabs, type ModuleTab } from '../module-tabs'
import { AnimatedMessageFlow } from '../animated-message-flow'

// Real, tabbed Customer Service — replaces the previous single generic table. Tickets, Live
// Chat, Knowledge Base, and SLA are each genuinely interactive client-state workspaces (same
// honesty level as every other illustrative module — not a real ticketing/chat backend yet).

const ticketFields: DataField[] = [
  { key: 'subject', label: 'Subject' },
  { key: 'customer', label: 'Customer' },
  { key: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Urgent'] },
  { key: 'status', label: 'Status', type: 'select', options: ['Open', 'In Progress', 'Resolved', 'Closed'] },
  { key: 'assignee', label: 'Assignee' },
]
const ticketRows = (brand: string): DataRow[] => [
  { id: `${brand}-tkt-1`, values: { subject: 'Order arrived damaged', customer: 'Northside Group', priority: 'High', status: 'In Progress', assignee: 'Ava' } },
  { id: `${brand}-tkt-2`, values: { subject: 'Question about delivery time', customer: 'Harbour Team', priority: 'Low', status: 'Open', assignee: 'Noah' } },
  { id: `${brand}-tkt-3`, values: { subject: 'Refund request', customer: 'Summit Co', priority: 'Urgent', status: 'Open', assignee: 'Mia' } },
  { id: `${brand}-tkt-4`, values: { subject: 'Wrong item received', customer: 'Bluebird Ltd', priority: 'Medium', status: 'Resolved', assignee: 'Zoe' } },
]

const kbFields: DataField[] = [
  { key: 'title', label: 'Article' },
  { key: 'category', label: 'Category', type: 'select', options: ['Orders', 'Delivery', 'Returns', 'Account'] },
  { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Published'] },
  { key: 'views', label: 'Views (30d)' },
]
const kbRows = (brand: string): DataRow[] => [
  { id: `${brand}-kb-1`, values: { title: 'How do I track my order?', category: 'Orders', status: 'Published', views: '412' } },
  { id: `${brand}-kb-2`, values: { title: 'Returns and refunds policy', category: 'Returns', status: 'Published', views: '298' } },
  { id: `${brand}-kb-3`, values: { title: 'Changing your delivery address', category: 'Delivery', status: 'Draft', views: '0' } },
]

export function CustomerServiceModule({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const brand = config.name.toLowerCase().replaceAll(' ', '-')

  const tabs: ModuleTab[] = [
    {
      id: 'tickets',
      label: 'Tickets',
      icon: '🎫',
      render: () => (
        <DataWorkbench
          title="Support tickets"
          description="Every customer issue, tracked from open to resolved."
          fields={ticketFields}
          rows={ticketRows(brand)}
          cards={[
            { label: 'Open', value: '2', trend: 'Needs attention', icon: '!' },
            { label: 'In progress', value: '1', trend: 'Being worked', icon: '◷' },
            { label: 'Resolved (30d)', value: '1', trend: 'Closed out', icon: '✓' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="No tickets yet."
        />
      ),
    },
    {
      id: 'live-chat',
      label: 'Live Chat',
      icon: '💬',
      render: () => (
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>💬</span><strong>Live chat preview</strong></div>
          <p>What a real-time support conversation looks like for {config.name}.</p>
          <AnimatedMessageFlow />
        </article>
      ),
    },
    {
      id: 'knowledge-base',
      label: 'Knowledge Base',
      icon: '📚',
      render: () => (
        <DataWorkbench
          title="Knowledge base"
          description="Self-serve articles that deflect tickets before they're ever raised."
          fields={kbFields}
          rows={kbRows(brand)}
          cards={[
            { label: 'Published', value: '2', trend: 'Live', icon: '✓' },
            { label: 'In draft', value: '1', trend: 'Needs review', icon: '✎' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Write your first article."
        />
      ),
    },
    {
      id: 'sla',
      label: 'SLA',
      icon: '⏱',
      render: () => (
        <div className="module-card-grid">
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>⏱</span><strong>Avg first response</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>18m</p>
            <p><small>Illustrative — target is under 30 minutes.</small></p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>✓</span><strong>Avg resolution time</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>4h 40m</p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>😊</span><strong>Satisfaction score</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>94%</p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>⚠</span><strong>SLA breaches (30d)</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>1</p>
          </article>
        </div>
      ),
    },
  ]

  return (
    <ModuleTabs
      title="Customer Service"
      description={`Tickets, live chat, knowledge base, and SLA tracking for ${config.name}.`}
      tabs={tabs}
      accentStyle={accentStyle}
    />
  )
}

export default CustomerServiceModule
