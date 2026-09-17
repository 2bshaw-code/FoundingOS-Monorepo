'use client'

import { useState } from 'react'

type WorkflowStep = {
  title: string
  actor: string
  action: string
  automation: string
  output: string
}

type Workflow = {
  id: string
  label: string
  title: string
  summary: string
  steps: WorkflowStep[]
}

const workflows: Workflow[] = [
  {
    id: 'sell',
    label: 'Sell to cash',
    title: 'From a new order to reconciled payment',
    summary: 'See how Retail, Logistics, Finance, and Intelligence work as one process.',
    steps: [
      { title: 'Message the order', actor: 'Sales or store team · WhatsApp', action: 'Send “New order for John - 2x Blue T-shirts, deliver tomorrow” or use /order.', automation: 'Messaging Core verifies the sender, identifies the intent, and creates the customer and order records.', output: 'The order enters the shared Event Feed and WhatsApp confirms the reference.' },
      { title: 'Reserve stock', actor: 'Retail Workspace', action: 'Review availability and approve fulfilment.', automation: 'Inventory is reserved and low-stock risk is recalculated.', output: 'A pick-and-pack task is created.' },
      { title: 'Dispatch delivery', actor: 'Logistics Workspace', action: 'Assign a route, vehicle, and delivery window.', automation: 'The system checks capacity and flags likely delays.', output: 'The customer receives status updates.' },
      { title: 'Issue the invoice', actor: 'Finance Workspace', action: 'Review and send the generated invoice.', automation: 'Brand Studio applies the logo, colours, legal details, currency, and payment terms.', output: 'A versioned branded invoice is issued.' },
      { title: 'Reconcile payment', actor: 'Finance + Intelligence', action: 'Confirm or match the incoming payment.', automation: 'Bank or mobile-money references are matched and exceptions flagged.', output: 'The order closes and cash reporting updates.' },
    ],
  },
  {
    id: 'market',
    label: 'Campaign to revenue',
    title: 'From an opportunity to measured campaign revenue',
    summary: 'Use first-party customer and operating data without scraping.',
    steps: [
      { title: 'Message the campaign brief', actor: 'Marketing team · WhatsApp', action: 'Send “/campaign Summer Sale | returning customers | Reactivation”.', automation: 'Messaging Core verifies the role and Brand Studio checks the brief against prohibited terminology.', output: 'A brand-aware campaign draft is created and confirmed in WhatsApp.' },
      { title: 'Build the audience', actor: 'CRM + Retail', action: 'Choose a customer segment from purchase and engagement history.', automation: 'Eligibility and consent rules remove unsuitable recipients.', output: 'A first-party audience is ready.' },
      { title: 'Create content', actor: 'Marketing Workspace', action: 'Enter a brief or choose a campaign template.', automation: 'Brand Studio supplies the approved voice, identity, and claims guidance.', output: 'Channel-ready WhatsApp, email, and social copy is drafted.' },
      { title: 'Approve and publish', actor: 'Campaign owner', action: 'Review content, channels, timing, and inventory readiness.', automation: 'Approved posts enter the publishing calendar.', output: 'The campaign launches across selected channels.' },
      { title: 'Measure the result', actor: 'Core Intelligence', action: 'Review engagement, conversion, and attributed orders.', automation: 'Revenue and operational events are joined to the campaign.', output: 'The next-best campaign recommendation is generated.' },
    ],
  },
  {
    id: 'deliver',
    label: 'Delivery',
    title: 'From warehouse-ready to proof of delivery',
    summary: 'Coordinate route planning, drivers, exceptions, and customer communication.',
    steps: [
      { title: 'Release shipment', actor: 'Retail or warehouse team', action: 'Mark an order ready for dispatch.', automation: 'Address, package, and delivery requirements are validated.', output: 'A shipment enters the control tower.' },
      { title: 'Plan the route', actor: 'Logistics Workspace', action: 'Assign stops to a route and vehicle.', automation: 'Capacity, distance, and delivery windows are checked.', output: 'A dispatch-ready route is produced.' },
      { title: 'Track execution', actor: 'Driver and dispatcher', action: 'Update departure, arrival, and exceptions through the mobile workspace or WhatsApp.', automation: 'Late-stop risk triggers an alert and rerouting suggestion.', output: 'Operations and the customer see the same status.' },
      { title: 'Confirm delivery', actor: 'Driver · WhatsApp', action: 'Reply “/delivered ORDER-REFERENCE”.', automation: 'Messaging Core verifies the driver role and closes the matching delivery.', output: 'The Event Feed updates, billing is unlocked, and WhatsApp confirms the action.' },
      { title: 'Close the loop', actor: 'Finance Workspace', action: 'Review the released invoice or collection task.', automation: 'Delivery cost and revenue feed profitability reporting.', output: 'Fulfilment-to-cash reporting is complete.' },
    ],
  },
  {
    id: 'hire',
    label: 'Hire to payroll',
    title: 'From candidate selection to payroll-ready worker',
    summary: 'Connect recruitment, onboarding, scheduling, and payroll inputs.',
    steps: [
      { title: 'Select a candidate', actor: 'Recruiter', action: 'Move the chosen candidate to offer.', automation: 'Required checks and missing information are flagged.', output: 'An offer and onboarding workflow begins.' },
      { title: 'Complete onboarding', actor: 'Candidate + people team', action: 'Provide identity, role, policy, and payment information.', automation: 'Readiness checks track every outstanding item.', output: 'A verified worker record is created.' },
      { title: 'Assign work', actor: 'Workforce manager', action: 'Add the worker to a location, team, and schedule.', automation: 'Coverage gaps and conflicts are highlighted.', output: 'The worker receives their shift plan.' },
      { title: 'Record attendance', actor: 'Worker or manager', action: 'Confirm completed time and exceptions.', automation: 'Approved time feeds payroll inputs.', output: 'A payroll-ready timesheet is produced.' },
      { title: 'Approve payroll', actor: 'Finance or people lead', action: 'Review exceptions and approve the run.', automation: 'Cost, variance, and payment events update reporting.', output: 'Payroll is approved with a complete audit trail.' },
    ],
  },
  {
    id: 'care',
    label: 'Patient to payment',
    title: 'From appointment booking to reconciled care payment',
    summary: 'Coordinate patient flow, clinical operations, supplies, and billing.',
    steps: [
      { title: 'Book the visit', actor: 'Patient or care team', action: 'Choose service, location, and appointment time.', automation: 'Capacity and required preparation are checked.', output: 'The appointment is confirmed.' },
      { title: 'Prepare care', actor: 'Clinic operations', action: 'Review the patient queue and required resources.', automation: 'Supply and staffing risks are flagged before arrival.', output: 'The care team receives a ready list.' },
      { title: 'Deliver treatment', actor: 'Care team', action: 'Record attendance, treatment status, and follow-up.', automation: 'Used supplies and operational events are captured.', output: 'The care record and billing trigger are completed.' },
      { title: 'Create billing', actor: 'Health + Finance', action: 'Review charges, payer, and payment method.', automation: 'Brand Studio renders the customer-facing document.', output: 'A branded invoice or receipt is issued.' },
      { title: 'Monitor follow-up', actor: 'Care operations', action: 'Review follow-up and compliance tasks.', automation: 'Missed actions and capacity risks appear in Insights.', output: 'Care and payment workflows close together.' },
    ],
  },
]

export function WorkflowWalkthrough() {
  const [workflowId, setWorkflowId] = useState(workflows[0].id)
  const [stepIndex, setStepIndex] = useState(0)
  const workflow = workflows.find((item) => item.id === workflowId) ?? workflows[0]
  const step = workflow.steps[stepIndex] ?? workflow.steps[0]

  const selectWorkflow = (id: string) => {
    setWorkflowId(id)
    setStepIndex(0)
  }

  return (
    <section id="how-it-works" className="walkthrough-section">
      <div className="walkthrough-heading">
        <div><p className="eyebrow">How FoundingOS works</p><h2>Follow a real workflow, step by step</h2><p>Choose a business process. Then move through exactly what your team does, what FoundingOS automates, and what comes out.</p></div>
        <span className="demo-badge">Guided product tour</span>
      </div>

      <div className="walkthrough-tabs" role="tablist" aria-label="Business workflows">
        {workflows.map((item) => <button type="button" role="tab" aria-selected={item.id === workflow.id} className={item.id === workflow.id ? 'active' : ''} key={item.id} onClick={() => selectWorkflow(item.id)}>{item.label}</button>)}
      </div>

      <div className="walkthrough-layout">
        <ol className="walkthrough-steps">
          {workflow.steps.map((item, index) => (
            <li key={item.title}>
              <button type="button" className={index === stepIndex ? 'active' : ''} onClick={() => setStepIndex(index)}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{item.title}</strong><small>{item.actor}</small></div>
              </button>
            </li>
          ))}
        </ol>

        <article className="walkthrough-detail" aria-live="polite">
          <p className="eyebrow">Step {stepIndex + 1} of {workflow.steps.length} · {step.actor}</p>
          <h3>{step.title}</h3>
          <div className="walkthrough-detail-grid">
            <div><span>Your team does</span><p>{step.action}</p></div>
            <div><span>FoundingOS does</span><p>{step.automation}</p></div>
            <div><span>You get</span><p>{step.output}</p></div>
          </div>
          <div className="walkthrough-controls">
            <button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex((current) => Math.max(0, current - 1))}>Previous</button>
            <button type="button" disabled={stepIndex === workflow.steps.length - 1} onClick={() => setStepIndex((current) => Math.min(workflow.steps.length - 1, current + 1))}>Next step</button>
          </div>
        </article>
      </div>
      <div className="walkthrough-summary"><strong>{workflow.title}</strong><span>{workflow.summary}</span></div>
    </section>
  )
}
