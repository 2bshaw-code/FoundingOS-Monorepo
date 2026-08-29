/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ModuleHeader } from '@foundingos/ui/console'
import { ResourceWorkbench, type WorkbenchSpec } from '@foundingos/ui/workbench'
import '@foundingos/ui/messaging.css'
import { brandConfig } from '../../brand-config'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Policies' }

const spec: WorkbenchSpec = {
  resource: 'compliance-policies',
  quantumSubject: 'compliance-policies',
  title: 'Policies',
  description: 'Policy register, jurisdictions, and audit evidence.',
  labelField: 'name',
  statusField: 'status',
  statusOptions: ["draft","active","under_review","retired"],
  fields: [
    { name: 'name', label: 'Policy', type: 'text', required: true },
    { name: 'jurisdiction', label: 'Jurisdiction', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ["draft","active","under_review","retired"] },
  ],
  whatsappTemplate: `Policy {label} has been updated.`,
}

export default function compliancePage() {
  return (
    <section className="console-page" style={{ ['--accent' as string]: brandConfig.colors.accent }}>
      <ModuleHeader config={brandConfig} title={spec.title} description={spec.description} />
      <ResourceWorkbench spec={spec} />
    </section>
  )
}
