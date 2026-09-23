/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Honest, plain-language "how this works" and "what you can customize" copy,
// keyed by the shared module `group` taxonomy in lib/workspace-modules.ts.
// This intentionally does not fabricate features — it describes the real
// modules that exist in each group, and is explicit when a capability isn't
// built yet rather than implying it is.
import { WorkspaceModuleDef } from './workspace-modules'

type GroupCopy = { howItWorks: string; extensibility: string; example: string }

const GROUP_COPY: Record<string, GroupCopy> = {
  Sales: {
    howItWorks: 'A deal moves through your pipeline stages as you update its status — from first contact through to won or lost. Nothing advances automatically unless you move it.',
    extensibility: 'Pipeline stages are fixed today. Custom stages are not yet available.',
    example: 'A founder adds a new lead after a trade-show conversation, moves it to "Qualified" once they confirm budget, then to "Won" when the contract is signed.',
  },
  Customers: {
    howItWorks: 'Each record here is a real customer or contact. Open one to see its details and update it directly — changes save immediately.',
    extensibility: 'Custom fields for customer records are not yet available.',
    example: 'A support call comes in — you find the customer here, confirm their order history, and update their notes before you hang up.',
  },
  Commerce: {
    howItWorks: 'Orders and products created here reflect real transactions. Update an order\'s status as it moves from received through to fulfilled.',
    extensibility: 'Custom order statuses are not yet available — the fulfillment stages shown are fixed.',
    example: 'An order comes in overnight — in the morning you mark it "Picked", then "Shipped" once the courier collects it.',
  },
  Operations: {
    howItWorks: 'This is where day-to-day running of the business happens — inventory, logistics, and delivery records update as real activity happens.',
    extensibility: 'Team permissions for who can edit operational records are managed in the Team module (Account section of Workspaces).',
    example: 'Stock runs low on a popular item — you spot it here first and reorder before it actually runs out.',
  },
  People: {
    howItWorks: 'People records track real team members and candidates. Open a record to update its stage or details.',
    extensibility: 'Team permissions and invitations are managed in the Team module (Account section of Workspaces).',
    example: 'A new hire starts Monday — you add them here so the rest of the team can see their role and start date.',
  },
  Recruiting: {
    howItWorks: 'Candidates move through shortlisting stages as decisions are made. Approvals for hiring actions appear in the Approvals tab.',
    extensibility: 'Custom shortlisting stages are not yet available.',
    example: 'A CV comes in for an open role — you add the candidate here and move them to "Interview" once you\'ve screened them.',
  },
  Finance: {
    howItWorks: 'Invoices and payments here reflect real amounts owed and received. Status updates as money actually moves — nothing here is projected.',
    extensibility: 'Custom payment terms and invoice templates are not yet available.',
    example: 'You send an invoice for a completed job — it shows as "Outstanding" here until the payment actually lands, then it updates to "Paid".',
  },
  Money: {
    howItWorks: 'Spend and budget records reflect real transactions. Figures update as expenses are recorded, not on a schedule.',
    extensibility: 'Custom budget categories are not yet available.',
    example: 'You buy new equipment for the team — logging it here keeps this month\'s spend accurate the moment it happens.',
  },
  Administration: {
    howItWorks: 'Settings, integrations, and access controls for this workspace live here. Changes take effect immediately.',
    extensibility: 'Team permissions are managed in the Team module (Account section of Workspaces). Most integrations here are configuration only — connecting a new one requires the relevant API keys.',
    example: 'You bring on a co-founder — you add them here and set their access before they touch anything else.',
  },
}

// Fallback for the 20+ groups without bespoke copy — still real and honest,
// just generated from the group's own module list instead of hand-written.
function fallbackCopy(groupName: string, items: WorkspaceModuleDef[]): GroupCopy {
  const names = items.map((item) => item.label).join(', ')
  return {
    howItWorks: `${groupName} covers ${names}. Open any module below to view or update its records — every change is saved immediately to live data.`,
    extensibility: 'Customization options for this group are not yet available.',
    example: `As your team works day to day, real ${groupName.toLowerCase()} activity will show up here — there's nothing to set up first.`,
  }
}

export function getGroupCopy(groupName: string, items: WorkspaceModuleDef[]): GroupCopy {
  return GROUP_COPY[groupName] ?? fallbackCopy(groupName, items)
}
