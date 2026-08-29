/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ModuleHeader } from '@foundingos/ui/console'
import { ResourceWorkbench, type WorkbenchSpec } from '@foundingos/ui/workbench'
import '@foundingos/ui/messaging.css'
import { brandConfig } from '../../brand-config'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'KYC records' }

const spec: WorkbenchSpec = {
  resource: 'kyc-records',
  quantumSubject: 'kyc-records',
  title: 'KYC records',
  description: 'Identity verification, documents, and risk rating.',
  labelField: 'subject',
  statusField: 'status',
  statusOptions: ["pending","in_review","approved","rejected"],
  fields: [
    { name: 'subject', label: 'Subject', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ["pending","in_review","approved","rejected"] },
    { name: 'riskRating', label: 'Risk rating', type: 'select', options: ["low","medium","high"] },
  ],
  whatsappTemplate: `Hi {label}, please upload a valid photo ID to complete verification.`,
}

export default function kycPage() {
  return (
    <section className="console-page" style={{ ['--accent' as string]: brandConfig.colors.accent }}>
      <ModuleHeader config={brandConfig} title={spec.title} description={spec.description} />
      <ResourceWorkbench spec={spec} />
    </section>
  )
}
