/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { brands } from '@foundingos/config'
import { QuantumButtonPrimary, QuantumCard, QuantumHeader, QuantumHintBanner, QuantumMetricCard, QuantumSectionHeader, QuantumToggle } from './quantum'

type AALDomainCard = {
  domain: 'Marketing' | 'Sales' | 'CRM' | 'Finance'
  endpoint: string
  capability: string
  guardrail: string
  tier: string
}

type AIDomain = 'marketing' | 'sales' | 'crm' | 'finance'
type AIStatus = 'off' | 'assisted' | 'autonomous'

export function AIHintBanner({ title = 'AI hint', children }: { title?: string; children: any }) {
  return <QuantumHintBanner title={title} brand={brands.foundingos}>{children}</QuantumHintBanner>
}

export function AIAssistanceToggle({ enabled, onChange }: { enabled: boolean; onChange: (enabled: boolean) => void }) {
  return <QuantumToggle label="AI assistance" checked={enabled} onChange={onChange} hint="Keeps recommendations brand-locked, entitlement-aware, and human-approved." />
}

export function QuantumAIStatusChip({ status }: { status: AIStatus }) {
  return <span className={`q-ai-status-chip q-ai-status-${status}`}>{status}</span>
}

export function QuantumAIInsightsCard({ title, insight, status = 'assisted' }: { title: string; insight: string; status?: AIStatus }) {
  return (
    <QuantumCard brand={brands.foundingos}>
      <QuantumSectionHeader label={title} action={<QuantumAIStatusChip status={status} />} />
      <p className="q-text-body">{insight}</p>
    </QuantumCard>
  )
}

export function QuantumAIRecommendationList({ recommendations }: { recommendations: Array<{ id: string; label: string; detail?: string; status?: AIStatus }> }) {
  return (
    <QuantumCard brand={brands.foundingos}>
      <QuantumSectionHeader label="AI recommendations" />
      <div className="q-list-stack">
        {recommendations.map((recommendation) => (
          <div className="q-list-row" key={recommendation.id}>
            <span>{recommendation.label}</span>
            <small>{recommendation.detail}</small>
            <QuantumAIStatusChip status={recommendation.status ?? 'assisted'} />
          </div>
        ))}
      </div>
    </QuantumCard>
  )
}

export function QuantumAISettingsPanel({ enabled, autonomousEnabled, tone, onAssistanceChange, onAutonomyChange }: { enabled: boolean; autonomousEnabled: boolean; tone: 'formal' | 'friendly' | 'direct'; onAssistanceChange: (enabled: boolean) => void; onAutonomyChange: (enabled: boolean) => void }) {
  return (
    <QuantumCard brand={brands.foundingos}>
      <QuantumSectionHeader label="AI settings" action={<QuantumAIStatusChip status={enabled ? (autonomousEnabled ? 'autonomous' : 'assisted') : 'off'} />} />
      <div className="q-ai-action-stack">
        <AIAssistanceToggle enabled={enabled} onChange={onAssistanceChange} />
        <QuantumToggle label="Autonomous modes" checked={autonomousEnabled} onChange={onAutonomyChange} hint="Autonomous workflows remain opt-in and never mutate data without an explicit trigger." />
        <p className="q-text-caption">Tone: {tone}</p>
      </div>
    </QuantumCard>
  )
}

export function QuantumAIActionPanel({ domain, actions, onRun }: { domain: AIDomain; actions: Array<{ id: string; label: string; description?: string }>; onRun: (actionId: string) => void }) {
  return (
    <QuantumCard brand={brands.foundingos}>
      <QuantumSectionHeader label={`${domain} AI actions`} />
      <div className="q-ai-action-stack">
        {actions.map((action) => (
          <div className="q-ai-action-row" key={action.id}>
            <div>
              <strong>{action.label}</strong>
              {action.description ? <p className="q-text-caption">{action.description}</p> : null}
            </div>
            <QuantumButtonPrimary type="button" onClick={() => onRun(action.id)}>Run</QuantumButtonPrimary>
          </div>
        ))}
      </div>
    </QuantumCard>
  )
}

export function AIOnboardingCard() {
  return (
    <QuantumCard brand={brands.foundingos}>
      <QuantumSectionHeader label="AI onboarding" />
      <p className="q-text-body">AAL reads the selected brand shell, Package Model D tier, usage signals, and user intent before recommending the safest next workflow.</p>
    </QuantumCard>
  )
}

export function QuantumAITrendGraph({ points }: { points: number[] }) {
  const max = Math.max(...points, 1)
  return (
    <QuantumCard brand={brands.foundingos}>
      <QuantumSectionHeader label="AI trend graph" />
      <div className="q-ai-trend-bars">
        {points.map((point, index) => (
          <span className="q-ai-trend-bar" data-level={Math.max(1, Math.round((point / max) * 10))} key={`${point}-${index}`} />
        ))}
      </div>
    </QuantumCard>
  )
}

const AAL_DOMAINS: AALDomainCard[] = [
  {
    domain: 'Marketing',
    endpoint: '/api/ai/marketing',
    capability: 'Segmentation, campaign drafting, send-time intelligence, and consent-safe WhatsApp activation.',
    guardrail: 'No campaign sends without consent and human approval.',
    tier: 'Starter analyse · Premium automate',
  },
  {
    domain: 'Sales',
    endpoint: '/api/ai/sales',
    capability: 'Lead scoring, pipeline prioritisation, next-best action, and conversion follow-up.',
    guardrail: 'No revenue is counted until signed or paid.',
    tier: 'Standard recommend · Premium forecast',
  },
  {
    domain: 'CRM',
    endpoint: '/api/ai/crm',
    capability: 'Customer summarisation, retention risk, upsell prompts, and relationship timelines.',
    guardrail: 'No cross-brand customer data mixing.',
    tier: 'Starter analyse · Premium automate',
  },
  {
    domain: 'Finance',
    endpoint: '/api/ai/finance',
    capability: 'Invoice review, reconciliation evidence, approval checklists, and cashflow impact.',
    guardrail: 'Credit safe: no payment, credit, or approval executes without human confirmation.',
    tier: 'Standard analyse · Enterprise approve',
  },
]

export function QuantumAICommandCenter() {
  return (
    <section className="q-card-stack">
      <QuantumHeader
        brand={brands.foundingos}
        eyebrow="Autonomous AI Layer"
        title="AAL command center"
        description="One intelligence layer across Marketing, Sales, CRM, and Finance with brand-locked context, Package Model D entitlements, telemetry, and credit-safe guardrails."
      />
      <div className="q-ai-domain-grid">
        {AAL_DOMAINS.map((domain) => (
          <QuantumCard key={domain.domain} brand={brands.foundingos}>
            <QuantumSectionHeader label={domain.domain} action={<QuantumAIStatusChip status="assisted" />} />
            <p className="q-text-body">{domain.capability}</p>
            <QuantumMetricCard label="Entitlement" value={domain.tier} />
            <QuantumHintBanner title="Guardrail">{domain.guardrail}</QuantumHintBanner>
            <p className="q-text-caption">{domain.endpoint}</p>
          </QuantumCard>
        ))}
      </div>
    </section>
  )
}

export function QuantumAALArchitectureSummary() {
  return (
    <QuantumCard brand={brands.foundingos}>
      <QuantumSectionHeader label="Architecture" />
      <div className="q-ai-architecture-grid">
        <QuantumMetricCard label="Core services" value="Context · Entitlements · Orchestrator · EventBus" />
        <QuantumMetricCard label="Domain engines" value="Marketing · Sales · CRM · Finance" />
        <QuantumMetricCard label="Shared data" value="Brand registry · Model D · pricing · tenant context" />
        <QuantumMetricCard label="UI integration" value="Superdash · Quantum cards · command surfaces" />
      </div>
    </QuantumCard>
  )
}
