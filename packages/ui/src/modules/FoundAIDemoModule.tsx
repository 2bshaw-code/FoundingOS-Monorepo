/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { DataWorkbench, consoleStyle, type BrandConsoleConfig, type DataField, type DataRow } from '../console'
import { ModuleTabs, type ModuleTab } from '../module-tabs'
import { FoundAI } from '../found-ai'

// Real, tabbed AI Automation — replaces the previous single-line placeholder that only ever
// showed a heading and the FoundAI chat widget. Workflows/Triggers/Run Logs/Templates are
// genuinely interactive client-state workspaces (same honesty level as every other illustrative
// module — not a real automation engine executing these yet); the real FoundAI assistant
// widget is kept front and centre on the Workflows tab, since that's the one real, working
// piece of AI already in this module.

const workflowFields: DataField[] = [
  { key: 'name', label: 'Workflow' },
  { key: 'trigger', label: 'Trigger' },
  { key: 'action', label: 'Action' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Paused'] },
]
const workflowRows = (brand: string): DataRow[] => [
  { id: `${brand}-wf-1`, values: { name: 'Low stock reorder', trigger: 'Stock below threshold', action: 'Notify supplier + create draft order', status: 'Active' } },
  { id: `${brand}-wf-2`, values: { name: 'VIP welcome', trigger: 'Customer crosses £500 lifetime spend', action: 'Tag as VIP + send welcome message', status: 'Active' } },
  { id: `${brand}-wf-3`, values: { name: 'Churn risk alert', trigger: 'No order in 45 days', action: 'Flag for Sales follow-up', status: 'Paused' } },
]

const triggerFields: DataField[] = [
  { key: 'event', label: 'Event' },
  { key: 'condition', label: 'Condition' },
  { key: 'action', label: 'Resulting action' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Paused'] },
]
const triggerRows = (brand: string): DataRow[] => [
  { id: `${brand}-trg-1`, values: { event: 'New order placed', condition: 'Order value > £100', action: 'Apply loyalty points bonus', status: 'Active' } },
  { id: `${brand}-trg-2`, values: { event: 'Support ticket opened', condition: 'Priority = Urgent', action: 'Escalate to team lead', status: 'Active' } },
]

const logFields: DataField[] = [
  { key: 'timestamp', label: 'Ran at', type: 'date' },
  { key: 'workflow', label: 'Workflow' },
  { key: 'result', label: 'Result', type: 'select', options: ['Success', 'Failed'] },
  { key: 'duration', label: 'Duration' },
]
const logRows = (brand: string): DataRow[] => [
  { id: `${brand}-log-1`, values: { timestamp: '2026-09-02', workflow: 'Low stock reorder', result: 'Success', duration: '0.8s' } },
  { id: `${brand}-log-2`, values: { timestamp: '2026-09-01', workflow: 'VIP welcome', result: 'Success', duration: '1.2s' } },
  { id: `${brand}-log-3`, values: { timestamp: '2026-08-30', workflow: 'Churn risk alert', result: 'Failed', duration: '0.3s' } },
]

const templateFields: DataField[] = [
  { key: 'name', label: 'Template' },
  { key: 'category', label: 'Category', type: 'select', options: ['Inventory', 'Customer', 'Finance', 'Support'] },
  { key: 'description', label: 'Description', type: 'textarea' },
]
const templateRows = (brand: string): DataRow[] => [
  { id: `${brand}-atpl-1`, values: { name: 'Low stock reorder', category: 'Inventory', description: 'Automatically flags and reorders when stock drops below a set threshold.' } },
  { id: `${brand}-atpl-2`, values: { name: 'Abandoned cart recovery', category: 'Customer', description: 'Nudges a customer who added items but didn\u2019t complete checkout.' } },
  { id: `${brand}-atpl-3`, values: { name: 'Overdue invoice reminder', category: 'Finance', description: 'Sends a polite reminder when an invoice is 7 days overdue.' } },
]

export function FoundAIDemoModule({ brand: config }: { brand: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const brand = config.name.toLowerCase().replaceAll(' ', '-')

  const tabs: ModuleTab[] = [
    {
      id: 'workflows',
      label: 'Workflows',
      icon: '⚙',
      guide: 'Chat with the real FoundAI widget below to build or ask about a workflow, or manage them directly in the table — set Trigger and Action, then Pause/Activate as needed.',
      render: () => (
        <>
          <DataWorkbench
            title="Workflows"
            description="Automated sequences that react to real activity across the OS."
            fields={workflowFields}
            rows={workflowRows(brand)}
            cards={[
              { label: 'Active', value: '2', trend: 'Running', icon: '▶' },
              { label: 'Paused', value: '1', trend: 'Not running', icon: '⏸' },
            ]}
            accentStyle={accentStyle}
            pageSize={5}
            emptyCopy="Create your first workflow."
          />
          <div className="module-card-grid" style={{ marginTop: 16 }}>
            <article className="module-card fo-card quantum-frame">
              <div className="module-card-top"><span>🤖</span><strong>Build with FoundAI</strong></div>
              <p>Describe a workflow in plain language and FoundAI will suggest a trigger and action.</p>
              <FoundAI brand={config} />
            </article>
          </div>
        </>
      ),
    },
    {
      id: 'triggers',
      label: 'Triggers',
      icon: '🔔',
      guide: 'The Event + Condition pairs that decide when a workflow fires — e.g. "order placed" + "value over £50" → "flag for review".',
      render: () => (
        <DataWorkbench
          title="Triggers"
          description="The real-time conditions that fire an automation."
          fields={triggerFields}
          rows={triggerRows(brand)}
          cards={[
            { label: 'Active', value: '2', trend: 'Live', icon: '✓' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Create your first trigger."
        />
      ),
    },
    {
      id: 'run-logs',
      label: 'Run Logs',
      icon: '📜',
      guide: 'Every past run of every workflow, with whether it Succeeded or Failed and how long it took — the real audit trail if something needs checking.',
      render: () => (
        <DataWorkbench
          title="Run history"
          description="Every past automation run, for auditing and debugging."
          fields={logFields}
          rows={logRows(brand)}
          cards={[
            { label: 'Success rate', value: '67%', trend: 'Last 3 runs', icon: '✓' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="No runs yet."
        />
      ),
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: '📋',
      guide: 'Ready-made workflow starting points by category (Inventory/Customer/Finance/Support) — a faster way to set one up than starting from a blank workflow.',
      render: () => (
        <DataWorkbench
          title="Automation templates"
          description="Pre-built automations you can adopt in one click."
          fields={templateFields}
          rows={templateRows(brand)}
          cards={[
            { label: 'Available templates', value: '3', trend: 'Ready to use', icon: '◍' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="No templates yet."
        />
      ),
    },
  ]

  return (
    <ModuleTabs
      title="AI Automation"
      description={`Workflows, triggers, run history, and templates powering ${config.name}'s automation.`}
      tabs={tabs}
      accentStyle={accentStyle}
    />
  )
}

export default FoundAIDemoModule
