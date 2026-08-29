/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ModuleHeader } from '@foundingos/ui/console'
import { ResourceWorkbench, type WorkbenchSpec } from '@foundingos/ui/workbench'
import '@foundingos/ui/messaging.css'
import { brandConfig } from '../../brand-config'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'AML alerts' }

const spec: WorkbenchSpec = {
  resource: 'aml-alerts',
  quantumSubject: 'aml-alerts',
  title: 'AML alerts',
  description: 'Transaction screening, risk scores, and case management.',
  labelField: 'subject',
  statusField: 'status',
  statusOptions: ["open","investigating","escalated","closed"],
  fields: [
    { name: 'subject', label: 'Subject', type: 'text', required: true },
    { name: 'riskScore', label: 'Risk score', type: 'number' },
    { name: 'severity', label: 'Severity', type: 'select', options: ["low","medium","high"] },
    { name: 'status', label: 'Status', type: 'select', options: ["open","investigating","escalated","closed"] },
    { name: 'detail', label: 'Detail', type: 'text' },
  ],
  whatsappTemplate: `Compliance review opened for {label}.`,
}

export default function amlPage() {
  return (
    <section className="console-page" style={{ ['--accent' as string]: brandConfig.colors.accent }}>
      <ModuleHeader config={brandConfig} title={spec.title} description={spec.description} />
      <ResourceWorkbench spec={spec} />
    </section>
  )
}
