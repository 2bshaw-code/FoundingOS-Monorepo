/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Mirrors packages/config/src/pro-playbooks.ts (the mobile app does not import @foundingos/config).
export type ExperienceMode = 'guided' | 'pro'

// The professional FoundAI stands in for in each workspace.
export const workspaceExperts: Record<string, string> = {
  retail: 'retail operations director',
  logistics: 'transport and logistics manager',
  finance: 'chartered accountant (ACA)',
  marketing: 'marketing director',
  talent: 'senior recruitment consultant',
  hr: 'CIPD-qualified HR director',
  health: 'practice manager',
  intelligence: 'head of data and analytics',
}

// [what a professional's version of this module looks like, then the three things they do every week].
type Playbook = [standard: string, step1: string, step2: string, step3: string]

export const modulePlaybooks: Record<string, Playbook> = {
  // Sales and customers
  'sales-pipeline': ['Every deal has an owner, a value, a close date and a next step — and nothing sits in a stage longer than two weeks.', 'Qualify new deals within 48 hours (budget, authority, need, timing).', 'Book the next step before you leave every call.', 'Review stale deals weekly and close out the ones that won’t move.'],
  leads: ['New leads get a reply within 1 hour and are qualified or disqualified within 3 days.', 'Reply to every new lead the same day.', 'Score leads by fit and intent, then work the hottest first.', 'Hand qualified leads to a deal with a clear owner.'],
  crm: ['One clean record per customer with an owner, contact details and a history of every conversation.', 'Merge duplicates and fill missing emails and phone numbers.', 'Log every call, email and meeting against the customer.', 'Give every key account an owner and a review date.'],
  customers: ['Every customer has contact details, an owner and a clear lifetime value.', 'Keep contact details complete and up to date.', 'Segment customers by value and how recently they bought.', 'Contact top customers before they go quiet.'],
  segments: ['Segments are defined by behaviour (recency, frequency, value), not guesswork, and each one has a purpose.', 'Build RFM segments: champions, loyal, at-risk, lapsed.', 'Attach a campaign or offer to every segment.', 'Refresh segments monthly and retire unused ones.'],
  loyalty: ['Repeat customers are rewarded automatically and loyalty costs are tracked against the extra revenue.', 'Reward the second purchase — it’s the hardest one to win.', 'Remind members of points before they expire.', 'Measure repeat-purchase rate monthly.'],
  service: ['Every ticket is answered within 4 working hours and resolved within 2 days, with no ticket left unassigned.', 'Assign every new ticket immediately.', 'Reply first, investigate second — acknowledge within the hour.', 'Review the top three complaint reasons every week and fix the cause.'],
  inbox: ['No conversation waits more than an hour for a first reply, and every thread has an owner.', 'Triage the inbox at the start and end of every day.', 'Use saved replies for common questions, then personalise.', 'Close threads once resolved so the inbox shows real work.'],
  'follow-ups': ['Every promised follow-up happens on the day it was promised.', 'Put a due date on every follow-up.', 'Work overdue follow-ups before anything new.', 'Log the outcome so the next person knows where it stands.'],
  quotes: ['Quotes go out within 24 hours, are followed up in 3 days and expire after 30.', 'Send quotes the same day you’re asked.', 'Follow up every open quote after 3 days.', 'Turn accepted quotes straight into orders or invoices.'],
  // Commerce
  orders: ['Orders are confirmed instantly and dispatched within 24 hours, with no order stuck in one stage.', 'Confirm and release new orders to picking the same day.', 'Clear anything stuck for more than a day first.', 'Check exceptions (payment failed, out of stock) every morning.'],
  'point-of-sale': ['Every sale is recorded with its payment method and the till reconciles to the bank daily.', 'Open and close each till with a float count.', 'Record refunds against the original sale.', 'Reconcile card takings to the bank the next day.'],
  products: ['Every product has a price, cost, margin, stock level and a clear description.', 'Fill in cost prices so margins are real.', 'Write descriptions that sell, with good photos.', 'Review slow sellers monthly: promote, bundle or retire.'],
  inventory: ['Stock counts are accurate, every item has a reorder point and nothing runs out unexpectedly.', 'Set a reorder point for every product.', 'Cycle-count your top sellers weekly.', 'Reorder before you hit the reorder point, not after.'],
  promotions: ['Every promotion has a goal, an end date and a measured result.', 'Set a target (revenue, new customers, stock cleared) before launching.', 'Always give promotions an end date.', 'Compare results with the same period without the offer.'],
  channels: ['Every sales channel shows its revenue, fees and margin so you know which ones really pay.', 'Keep prices and stock in sync across channels.', 'Track fees per channel, not just revenue.', 'Put effort into the channels with the best margin.'],
  'production-orders': ['Production runs to plan, materials are reserved before work starts and yield is tracked.', 'Check materials are in stock before releasing a job.', 'Record actual output and waste against every job.', 'Review late jobs daily and re-plan capacity.'],
  boms: ['Every made product has an accurate bill of materials so costs and stock are right.', 'List every component and its quantity.', 'Update costs when supplier prices change.', 'Version BOMs when a recipe or design changes.'],
  purchasing: ['Every purchase is approved, raised against a supplier and matched to delivery and invoice.', 'Raise a purchase order before you buy.', 'Match deliveries to the order on arrival.', 'Match the supplier invoice before you pay it.'],
  suppliers: ['Every supplier has terms, lead times, contacts and a performance rating.', 'Record payment terms and lead times.', 'Rate suppliers on price, quality and on-time delivery.', 'Keep a backup supplier for anything critical.'],
  fulfilment: ['Orders are picked, packed and shipped the same day with tracking sent to the customer.', 'Pick in batches by location to save time.', 'Send tracking as soon as the label is printed.', 'Review mis-picks weekly and fix the cause.'],
  returns: ['Returns are authorised, received and refunded within 5 days, with a reason logged every time.', 'Log a reason for every return.', 'Inspect and restock or write off on arrival.', 'Review return reasons monthly to fix product or description issues.'],
  payments: ['Every payment is matched to an order or invoice and failures are chased the same day.', 'Match payments to orders daily.', 'Retry or chase failed payments immediately.', 'Reconcile payouts to the bank weekly.'],
  // Marketing
  campaigns: ['Every campaign has an audience, a goal, a budget, a schedule and a measured return.', 'Write the goal and success measure before you start.', 'Test two versions of the message and keep the winner.', 'Report cost per lead and revenue per campaign.'],
  content: ['Content goes out on a planned calendar, on brand, with a call to action every time.', 'Plan content two weeks ahead.', 'Repurpose each strong piece across channels.', 'Measure engagement and double down on what works.'],
  calendar: ['Nothing is published without being on the calendar, and there are no gaps in the week.', 'Fill the next two weeks before this week ends.', 'Balance promotional and helpful posts (roughly 1 in 4 selling).', 'Check nothing clashes with key dates or launches.'],
  audiences: ['Audiences are built from real customer data and each one has a message written for it.', 'Build audiences from behaviour, not guesses.', 'Write a message for each audience.', 'Exclude recent buyers from acquisition ads.'],
  journeys: ['Automated journeys welcome, nurture and win back customers without manual work.', 'Start with welcome, abandoned basket and win-back journeys.', 'Keep each step to one clear action.', 'Review drop-off at each step monthly.'],
  engagement: ['Every comment, mention and message gets a reply within a day.', 'Reply to comments and DMs daily.', 'Thank and reshare customer posts.', 'Track which topics get the most engagement.'],
  'brand-studio': ['Every asset uses the same logo, colours, fonts and tone of voice.', 'Keep one approved set of brand assets.', 'Write a short tone-of-voice guide.', 'Check new content against the brand before it’s published.'],
  attribution: ['Every sale is traced back to the channel and campaign that won it.', 'Tag every link with UTM codes.', 'Compare first-touch and last-touch results.', 'Move budget to the channels with the lowest cost per sale.'],
  budgets: ['Every budget has an owner and is tracked against actual spend monthly.', 'Set budgets per channel and campaign.', 'Record actual spend as it happens.', 'Review variances monthly and reallocate.'],
  // Finance
  invoices: ['Invoices go out the day work is done, with clear terms, and nothing goes more than 7 days overdue without a chase.', 'Invoice on the day you deliver.', 'Chase at 1, 7 and 14 days overdue.', 'Review aged debtors every week.'],
  bills: ['Every bill is approved, coded and paid on time — never early, never late.', 'Code bills to the right category on arrival.', 'Get approval before paying anything unusual.', 'Schedule payments for their due date to protect cash.'],
  expenses: ['Every expense has a receipt, a category and an approver, and is reimbursed within a week.', 'Snap receipts at the time of purchase.', 'Approve or query expenses weekly.', 'Watch for spend outside policy.'],
  banking: ['Bank accounts reconcile weekly and every transaction is explained.', 'Import bank feeds daily.', 'Match transactions to invoices and bills.', 'Investigate anything unexplained straight away.'],
  reconciliation: ['Every bank line matches a transaction in the books and the balances agree at month end.', 'Reconcile weekly, not just at month end.', 'Clear unmatched items before they pile up.', 'Sign off the reconciliation at month end.'],
  cashflow: ['You can see 13 weeks of cash ahead and act before a shortfall.', 'Update the forecast weekly with real receipts and payments.', 'Plan for your lowest cash week, not the average.', 'Speed up collections before cutting costs.'],
  tax: ['VAT and tax returns are filed on time from records that are already reconciled.', 'Reconcile before you file.', 'Keep digital records for Making Tax Digital.', 'Set aside tax as you earn it.'],
  // Logistics
  dispatch: ['Every job is assigned to a driver and vehicle before its slot, with nothing left unassigned.', 'Assign tomorrow’s jobs by the end of today.', 'Balance loads across drivers and vehicles.', 'Re-plan the moment a vehicle or driver drops out.'],
  routes: ['Routes are optimised for time and fuel and drivers know their stops in advance.', 'Optimise routes daily from confirmed jobs.', 'Group drops by area and time window.', 'Compare planned and actual times to improve plans.'],
  deliveries: ['Every delivery has a time window, proof of delivery and a customer notification.', 'Send the customer an ETA on the morning of delivery.', 'Capture a photo or signature as proof of delivery.', 'Follow up failed deliveries the same day.'],
  tracking: ['Customers and staff can see where every delivery is, live.', 'Share live tracking links with customers.', 'Watch for vehicles running late and warn customers early.', 'Review late deliveries weekly.'],
  exceptions: ['Every failed or damaged delivery is logged, owned and resolved within 24 hours.', 'Log the reason for every exception.', 'Contact the customer before they contact you.', 'Fix recurring causes (addresses, packaging, timings).'],
  fleet: ['Every vehicle has its MOT, service, insurance and tax dates tracked, with no surprises.', 'Record every vehicle’s key dates.', 'Book services before they’re due.', 'Track cost per mile per vehicle.'],
  drivers: ['Every driver’s licence, hours and training are checked and in date.', 'Check licences regularly (DVLA).', 'Monitor driving hours against the rules.', 'Review incidents and give feedback.'],
  warehouses: ['Every location is labelled, stock is where the system says, and space is used well.', 'Label every bin and location.', 'Put fast movers nearest dispatch.', 'Count a section every week.'],
  billing: ['Every completed job is billed promptly with proof of delivery attached.', 'Bill completed jobs daily.', 'Attach proof of delivery to invoices.', 'Chase disputed charges quickly.'],
  // Talent (recruitment)
  jobs: ['Every role has a clear job description, salary range, hiring manager and target start date.', 'Agree the must-haves with the hiring manager first.', 'Always publish a salary range — it gets more applicants.', 'Review open roles weekly and close filled ones.'],
  candidates: ['Every applicant hears back within 5 working days and moves stage or is declined kindly.', 'Screen new applicants within 48 hours.', 'Keep every candidate informed at each stage.', 'Decline unsuccessful candidates with a respectful message.'],
  interviews: ['Interviews are structured, scored against the same criteria and fed back within 48 hours.', 'Use the same questions and scorecard for every candidate.', 'Collect scores from each interviewer before discussing.', 'Give candidates feedback within two days.'],
  offers: ['Offers go out within 24 hours of a decision with salary, start date and conditions in writing.', 'Call to offer, then send it in writing the same day.', 'Make conditions (references, right to work) clear.', 'Keep in touch until the first day.'],
  'talent-pool': ['Strong candidates you didn’t hire stay warm for the next role.', 'Tag silver-medal candidates with their skills.', 'Contact the pool before advertising a new role.', 'Refresh consent and contact details yearly.'],
  clients: ['Every agency client has agreed terms, fee rates and a named contact.', 'Agree terms of business before you start a search.', 'Keep a regular update call with each client.', 'Track fill rate and time to fill per client.'],
  placements: ['Every placement is invoiced on start and checked in on during the rebate period.', 'Invoice on the candidate’s start date.', 'Check in at week 1 and month 1.', 'Track rebate periods so there are no surprises.'],
  references: ['References and background checks are complete before anyone starts.', 'Request references as soon as an offer is accepted.', 'Record who gave each reference and when.', 'Don’t confirm a start date until checks are clear.'],
  // HR
  people: ['Every employee has a complete record: contract, contact details, emergency contact, manager and start date.', 'Fill missing emergency contacts first.', 'Record every change (role, pay, manager) with a date.', 'Audit records every quarter.'],
  onboarding: ['New starters have their equipment, accounts and a plan for their first week before day one.', 'Send a welcome pack a week before they start.', 'Give every new starter a buddy.', 'Hold 30, 60 and 90-day check-ins.'],
  contracts: ['Everyone has a signed written statement of terms from their first day, stored securely.', 'Issue a written statement on or before day one (UK law).', 'Get contracts signed before the start date.', 'Update contracts when terms change.'],
  rotas: ['Rotas are published at least two weeks ahead, cover every shift and respect working-time rules.', 'Publish rotas two weeks in advance.', 'Check cover against expected demand.', 'Watch for anyone breaching the 48-hour weekly limit.'],
  timesheets: ['Timesheets are submitted and approved every week before payroll.', 'Remind staff to submit by the same day each week.', 'Approve or query timesheets promptly.', 'Check overtime against the rota.'],
  'time-off': ['Holiday requests are answered within 2 days and everyone takes their full entitlement.', 'Respond to requests within two days.', 'Watch for clashes before approving.', 'Nudge people who haven’t booked holiday.'],
  sickness: ['Every absence is recorded, return-to-work meetings happen and patterns are spotted early.', 'Record every absence on the day.', 'Hold a return-to-work chat after every absence.', 'Review absence patterns monthly.'],
  payroll: ['Payroll inputs (hours, overtime, absence, changes) are complete and checked before the cut-off.', 'Collect all changes before the payroll cut-off.', 'Double-check new starters and leavers.', 'Reconcile payroll to the bank after it runs.'],
  performance: ['Everyone has clear goals and a regular one-to-one, with a review at least twice a year.', 'Agree 3–5 goals per person.', 'Hold one-to-ones at least monthly.', 'Record reviews and development plans.'],
  learning: ['Mandatory training is tracked, in date and linked to each role.', 'List the mandatory training for each role.', 'Track completion and expiry dates.', 'Book refreshers before training expires.'],
  'right-to-work': ['Every employee’s right to work is checked before they start and repeat checks happen on time.', 'Check right to work before day one.', 'Keep a copy of the documents checked.', 'Set reminders for time-limited visas.'],
  policies: ['Every employee has read and acknowledged the current handbook and key policies.', 'Keep one current version of each policy.', 'Collect acknowledgements from every employee.', 'Review policies yearly or when the law changes.'],
  compliance: ['Every compliance requirement has an owner, evidence and a renewal date.', 'List every requirement and who owns it.', 'Store evidence against each item.', 'Renew before expiry, not after.'],
  documents: ['Documents are filed against the right person or record and nothing sensitive is lying around.', 'File documents against a record as they arrive.', 'Restrict sensitive documents to the right people.', 'Delete documents past their retention period.'],
  // Health
  appointments: ['Clinics run on time, no-shows stay under 5% and every slot that can be filled is filled.', 'Send reminders 48 and 2 hours before.', 'Fill cancellations from a waiting list.', 'Review no-shows and follow up.'],
  patients: ['Every patient record is complete, consented and up to date.', 'Record consent and contact preferences.', 'Keep medical history and allergies current.', 'Recall patients when they’re due.'],
  'care-plans': ['Every patient has a care plan with goals, a named clinician and a review date.', 'Set clear, measurable goals.', 'Review plans on schedule.', 'Record progress at every visit.'],
  practitioners: ['Every practitioner’s registration, insurance and training is in date.', 'Record registration numbers and expiry dates.', 'Check indemnity insurance yearly.', 'Track CPD hours.'],
  claims: ['Insurance claims are submitted within a week of treatment and chased until paid.', 'Submit claims promptly with the right codes.', 'Chase unpaid claims after 14 days.', 'Track rejection reasons and fix them.'],
  triage: ['Urgent cases are identified and seen first, every time.', 'Use a consistent triage scale.', 'Escalate red flags immediately.', 'Audit triage decisions monthly.'],
  'clinical-inbox': ['Results and letters are reviewed and actioned within 2 working days.', 'Review the inbox twice a day.', 'Assign each item to a clinician.', 'Record the action taken.'],
  locations: ['Every site has opening hours, capacity and responsible manager recorded.', 'Keep opening hours and contact details current.', 'Track utilisation per room or site.', 'Review underused capacity monthly.'],
  // Intelligence
  signals: ['Every important signal has an owner and a decision, not just a notification.', 'Review new signals daily.', 'Assign each signal to someone who can act.', 'Record what you decided and why.'],
  anomalies: ['Unusual movements are investigated within a day and their cause is recorded.', 'Check anomalies each morning.', 'Separate real problems from one-off noise.', 'Fix the cause, not just the symptom.'],
  forecasts: ['Forecasts are updated weekly and compared with what actually happened.', 'Refresh forecasts weekly.', 'Track forecast accuracy over time.', 'Use ranges, not single numbers.'],
  recommendations: ['Every AI recommendation is accepted, rejected or parked — none are ignored.', 'Review recommendations weekly.', 'Measure the result of the ones you accept.', 'Tell FoundAI why you rejected one so it learns.'],
  scenarios: ['Big decisions are tested against best, expected and worst cases first.', 'Model best, expected and worst cases.', 'Write down the assumptions.', 'Revisit scenarios when assumptions change.'],
  risks: ['Every risk has a likelihood, impact, owner and mitigation.', 'Score each risk on likelihood and impact.', 'Give every risk an owner and a mitigation.', 'Review the risk register quarterly.'],
  models: ['Every model has a purpose, an owner and a measured accuracy.', 'Record what each model is for.', 'Track accuracy against real outcomes.', 'Retire models that no longer help.'],
  'data-sources': ['Every data source is connected, fresh and owned.', 'Check each source synced in the last 24 hours.', 'Fix broken connections straight away.', 'Remove sources nobody uses.'],
  workflows: ['Automated workflows are documented, monitored and produce measurable time savings.', 'Describe what each workflow does and why.', 'Check failures weekly.', 'Measure the hours each workflow saves.'],
  approvals: ['Approvals are decided within a day so work never stalls.', 'Clear approvals at least once a day.', 'Set spending limits so small items don’t need approval.', 'Record why something was rejected.'],
}

export type HealthRecord = { id: string; status: string; owner?: string; value?: string; dueDate?: string }
export type HealthCheck = { id: 'overdue' | 'unassigned' | 'waiting' | 'unvalued'; ok: boolean; count: number; label: string; firstId?: string }

// Checks every professional would run on any list of work, whatever the module.
export function moduleHealth(records: HealthRecord[], statuses: string[], noun: string, valued = true): { score: number; checks: HealthCheck[] } {
  const today = new Date().toISOString().slice(0, 10)
  const done = statuses.at(-1)
  const open = records.filter((record) => record.status !== done)
  const plural = (n: number) => `${n} ${noun}${n === 1 ? '' : 's'}`
  const overdue = open.filter((record) => record.dueDate && record.dueDate < today)
  const unassigned = open.filter((record) => !record.owner || /^(unassigned|—|-)$/i.test(record.owner.trim()))
  const waiting = statuses.length > 2 ? open.filter((record) => record.status === statuses[0]) : []
  const unvalued = valued ? open.filter((record) => !record.value || !/[1-9]/.test(record.value)) : []
  const checks: HealthCheck[] = [
    { id: 'overdue', ok: !overdue.length, count: overdue.length, label: overdue.length ? `${plural(overdue.length)} overdue` : 'Nothing overdue', firstId: overdue[0]?.id },
    { id: 'unassigned', ok: !unassigned.length, count: unassigned.length, label: unassigned.length ? `${plural(unassigned.length)} with no owner` : 'Everything has an owner', firstId: unassigned[0]?.id },
    { id: 'waiting', ok: waiting.length <= Math.max(2, Math.round(open.length * 0.3)), count: waiting.length, label: waiting.length ? `${plural(waiting.length)} still at “${statuses[0]}”` : `Nothing waiting at “${statuses[0] ?? 'start'}”`, firstId: waiting[0]?.id },
  ]
  if (valued) checks.push({ id: 'unvalued', ok: !unvalued.length, count: unvalued.length, label: unvalued.length ? `${plural(unvalued.length)} missing a value` : 'Every item has a value', firstId: unvalued[0]?.id })
  const score = records.length ? Math.round((checks.filter((check) => check.ok).length / checks.length) * 100) : 0
  return { score, checks }
}

export function playbookFor(moduleId: string, moduleLabel: string, statuses: string[]): Playbook {
  const known = modulePlaybooks[moduleId]
  if (known) return known
  const flow = statuses.length ? statuses.join(' → ') : 'each stage'
  return [`Every ${moduleLabel.toLowerCase()} item has an owner, a due date and moves steadily through ${flow}.`, 'Give every new item an owner and a due date.', 'Clear anything overdue before starting new work.', 'Review the list weekly and close what’s finished.']
}

export function coachQuestion(workspace: string, moduleLabel: string, standard: string): string {
  const expert = workspaceExperts[workspace] ?? 'senior operator'
  return `Act as an experienced ${expert}. Look at my ${moduleLabel} right now against this professional standard: "${standard}". Tell me in plain English the three most important things to do today, in order, and what "good" will look like when they're done.`
}
