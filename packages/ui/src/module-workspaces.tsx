/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Purpose-built workspace screens (till, work queue, ledger, stock room, signal
// feed), realistic sample data per module, and the FoundAI command bar that
// proposes actions on a module's records for the owner to approve.

import { useMemo, useState, type FormEvent } from 'react'
import type { ModuleKpi } from './module-profiles'

export type WorkspaceLayout = 'till' | 'queue' | 'ledger' | 'stock' | 'feed'
export type LayoutRecord = { id: string; name: string; secondary: string; value: string; status: string; owner: string; updated: string; dueDate?: string; quantity?: number; reorderPoint?: number }

const layouts: Record<string, WorkspaceLayout> = {
  'retail/point-of-sale': 'till',
  'retail/orders': 'queue', 'retail/fulfilment': 'queue', 'retail/returns': 'queue', 'retail/service': 'queue', 'retail/production-orders': 'queue',
  'logistics/dispatch': 'queue', 'logistics/deliveries': 'queue', 'logistics/exceptions': 'queue', 'logistics/routes': 'queue',
  'health/triage': 'queue', 'health/follow-ups': 'queue', 'health/compliance': 'queue',
  'finance/approvals': 'queue', 'hr/time-off': 'queue', 'hr/onboarding': 'queue', 'hr/timesheets': 'queue', 'hr/sickness': 'queue', 'talent/references': 'queue',
  'finance/invoices': 'ledger', 'finance/bills': 'ledger', 'finance/expenses': 'ledger', 'finance/payments': 'ledger', 'finance/reconciliation': 'ledger', 'finance/tax': 'ledger',
  'retail/payments': 'ledger', 'retail/purchasing': 'ledger', 'logistics/billing': 'ledger', 'logistics/quotes': 'ledger', 'health/billing': 'ledger', 'health/claims': 'ledger', 'hr/payroll': 'ledger', 'talent/placements': 'ledger',
  'retail/inventory': 'stock', 'health/inventory': 'stock',
  'intelligence/signals': 'feed', 'intelligence/risks': 'feed', 'intelligence/anomalies': 'feed', 'intelligence/recommendations': 'feed',
}

export const getWorkspaceLayout = (workspace: string, moduleId: string): WorkspaceLayout | undefined => layouts[`${workspace}/${moduleId}`]

// Verb shown on the primary button for a record in a given stage, and the stage it moves to.
const steps: Record<string, Record<string, [string, string]>> = {
  orders: { New: ['Start picking', 'Picking'], Picking: ['Mark ready', 'Ready'], Ready: ['Mark delivered', 'Delivered'] },
  fulfilment: { Queued: ['Start picking', 'Picking'], Picking: ['Mark packed', 'Packed'], Packed: ['Dispatch', 'Dispatched'] },
  returns: { Requested: ['Approve return', 'Approved'], Approved: ['Mark received', 'Received'], Received: ['Issue refund', 'Refunded'] },
  service: { Open: ['Assign to me', 'Assigned'], Assigned: ['Reply to customer', 'Waiting'], Waiting: ['Resolve', 'Resolved'] },
  'production-orders': { Planned: ['Start production', 'In production'], 'In production': ['Send to QC', 'Quality check'], 'Quality check': ['Pass QC', 'Complete'] },
  dispatch: { Unassigned: ['Assign driver', 'Assigned'], Assigned: ['Mark loaded', 'Loaded'], Loaded: ['Depart', 'Departed'] },
  deliveries: { Booked: ['Send out', 'Out for delivery'], 'Out for delivery': ['Mark delivered', 'Delivered'], Attempted: ['Rebook & deliver', 'Delivered'] },
  exceptions: { Open: ['Investigate', 'Investigating'], Investigating: ['Start recovery', 'Recovering'], Recovering: ['Resolve', 'Resolved'] },
  routes: { Planned: ['Optimise route', 'Optimised'], Optimised: ['Start route', 'Active'], Active: ['Complete route', 'Complete'] },
  triage: { New: ['Assess', 'Assessed'], Assessed: ['Assign clinician', 'Assigned'], Assigned: ['Complete', 'Complete'] },
  approvals: { Requested: ['Review', 'Review'], Review: ['Approve', 'Approved'], Approved: ['Close', 'Complete'] },
  'time-off': { Requested: ['Review', 'Review'], Review: ['Approve', 'Approved'], Approved: ['Mark taken', 'Complete'] },
  invoices: { Draft: ['Send invoice', 'Sent'], Sent: ['Record payment', 'Paid'], Overdue: ['Record payment', 'Paid'] },
  bills: { Received: ['Approve', 'Approved'], Approved: ['Schedule payment', 'Scheduled'], Scheduled: ['Mark paid', 'Paid'] },
  expenses: { Submitted: ['Review', 'Review'], Review: ['Approve', 'Approved'], Approved: ['Reimburse', 'Reimbursed'] },
  payments: { Pending: ['Authorise', 'Authorised'], Authorised: ['Mark paid', 'Paid'], Paid: ['Reconcile', 'Reconciled'] },
  reconciliation: { Unmatched: ['Suggest match', 'Suggested'], Suggested: ['Accept match', 'Matched'], Matched: ['Verify', 'Verified'] },
  purchasing: { Draft: ['Approve', 'Approved'], Approved: ['Place order', 'Ordered'], Ordered: ['Mark received', 'Received'] },
  billing: { Draft: ['Issue', 'Issued'], Issued: ['Mark paid', 'Paid'], Paid: ['Reconcile', 'Reconciled'] },
  claims: { Prepared: ['Submit claim', 'Submitted'], Submitted: ['Start review', 'Review'], Review: ['Mark settled', 'Settled'] },
  payroll: { Preparing: ['Submit for review', 'Review'], Review: ['Approve run', 'Approved'], Approved: ['Pay staff', 'Paid'] },
  signals: { Detected: ['Enrich', 'Enriched'], Enriched: ['Review', 'Reviewed'], Reviewed: ['Resolve', 'Resolved'] },
  risks: { Open: ['Investigate', 'Investigating'], Investigating: ['Mitigate', 'Mitigating'], Mitigating: ['Resolve', 'Resolved'] },
  anomalies: { Detected: ['Investigate', 'Investigating'], Investigating: ['Recover', 'Recovering'], Recovering: ['Resolve', 'Resolved'] },
  recommendations: { Proposed: ['Review', 'Review'], Review: ['Approve', 'Approved'], Approved: ['Execute', 'Executed'] },
}

export function nextStep(moduleId: string, status: string, statuses: string[]): { label: string; to: string } | null {
  const custom = steps[moduleId]?.[status]
  if (custom) return { label: custom[0], to: custom[1] }
  const index = statuses.indexOf(status)
  if (index < 0 || index >= statuses.length - 1) return null
  return { label: `Move to ${statuses[index + 1]}`, to: statuses[index + 1] }
}

// Realistic starting records so each module reads like the tool people expect.
// Format: "name|secondary|value". Missing modules fall back to generic seed data.
const sampleText: Record<string, string[]> = {
  'retail/sales-pipeline': ['Office coffee contract|Harbour Cafe|£4,800', 'Wholesale bread supply|Willowbrook Bakery|£12,400', 'Corporate gifting|North & Co|£3,250', 'Event catering|Deacon & Rye|£6,900', 'Monthly deli restock|The Corner Deli|£2,150', 'Franchise pilot|Priya Anand|£18,000'],
  'retail/orders': ['#1042|Amina Yusuf · 3 items · WhatsApp|£86.40', '#1043|Harbour Cafe · 12 items · Wholesale|£412.00', '#1044|Sofia Martins · 1 item · Website|£24.99', '#1045|North & Co · 6 items · Instagram|£158.20', '#1046|Priya Anand · 2 items · In store|£41.50', '#1047|The Corner Deli · 20 items · Wholesale|£620.00'],
  'retail/point-of-sale': ['Sale #3301|2 × Flat white, 1 × Croissant|£9.00', 'Sale #3302|Sourdough loaf, Strawberry jam|£8.25', 'Sale #3303|Coffee beans 1kg|£18.00', 'Sale #3304|Gift hamper|£45.00', 'Sale #3305|3 × Croissant, Oat milk 1L|£9.90'],
  'retail/crm': ['Amina Yusuf|amina.yusuf@mail.com · 07700 900123|£1,240', 'Harbour Cafe|orders@harbourcafe.co.uk · Trade|£8,420', 'Sofia Martins|sofia.m@mail.com · 07700 900456|£312', 'North & Co|buying@northco.co.uk · Trade|£5,180', 'Priya Anand|priya.a@mail.com · 07700 900789|£960', 'The Corner Deli|hello@cornerdeli.co.uk · Trade|£3,640'],
  'retail/segments': ['Lapsed 60 days|No order in the last 60 days|214', 'VIP spenders|Lifetime value over £500|86', 'WhatsApp opted-in|Consented to WhatsApp updates|1120', 'New this month|First order in the last 30 days|63'],
  'retail/loyalty': ['Amina Yusuf|Gold · 50 pts to next reward|2450', 'Priya Anand|Silver · 120 pts to next reward|980', 'Sofia Martins|Bronze · 300 pts to next reward|420', 'Tom Hale|Gold · reward ready|3100', 'Grace Obi|Silver · 60 pts to next reward|1140'],
  'retail/products': ['Sourdough loaf|Bakery · BR-001|£4.50', 'Flat white|Coffee · CF-010|£3.20', 'Croissant|Bakery · BR-014|£2.60', 'Oat milk 1L|Grocery · GR-220|£2.10', 'Strawberry jam|Pantry · PN-031|£3.75', 'Coffee beans 1kg|Coffee · CF-100|£18.00', 'Granola 500g|Pantry · PN-044|£5.40', 'Gift hamper|Gifts · GF-001|£45.00'],
  'retail/inventory': ['Coffee beans 1kg|Bean Roasters Ltd · CF-100', 'Oat milk 1L|Dairy Alt Co · GR-220', 'Sourdough flour 16kg|Millstone Flour · BR-900', 'Takeaway cups 12oz|EcoPack Supplies · PK-012', 'Strawberry jam|Orchard Preserves · PN-031', 'Granola 500g|Hillside Granola · PN-044'],
  'retail/promotions': ['10% off first order|Code WELCOME10 · Website|£1,240', 'Coffee + pastry £4|In store · weekday mornings|£860', 'Free delivery over £30|Website & WhatsApp|£2,110', 'Double loyalty points|VIP segment|£640'],
  'retail/channels': ['Website|Online storefront|£8,420', 'WhatsApp|Orders via chat|£5,130', 'Instagram Shop|Social commerce|£2,210', 'In store|Point of sale|£12,860', 'Wholesale|Trade accounts|£6,400'],
  'retail/production-orders': ['Sourdough × 120|Bakery line · due 06:00|£540', 'Croissant × 200|Pastry line · due 05:30|£520', 'Granola × 60 bags|Kitchen · due Thu|£324', 'Gift hampers × 25|Packing bench · due Fri|£1,125'],
  'retail/boms': ['Sourdough loaf|Flour 500g, water, salt, starter|£0.82', 'Croissant|Flour, butter, sugar, yeast|£0.64', 'Gift hamper|Jam, granola, beans, box|£21.40', 'Granola 500g|Oats, honey, nuts, seeds|£1.95'],
  'retail/purchasing': ['PO-2201|Bean Roasters Ltd · 20 × Coffee beans 1kg|£260.00', 'PO-2202|Dairy Alt Co · 48 × Oat milk 1L|£67.20', 'PO-2203|Millstone Flour · 10 × 16kg sacks|£185.00', 'PO-2204|EcoPack Supplies · 2,000 cups|£140.00', 'PO-2205|Orchard Preserves · 36 jars|£72.00'],
  'retail/suppliers': ['Bean Roasters Ltd|Coffee · 3-day lead time|£4,200', 'Dairy Alt Co|Milk alternatives · next-day|£1,860', 'Millstone Flour|Flour · 5-day lead time|£2,940', 'EcoPack Supplies|Packaging · 7-day lead time|£1,120', 'Orchard Preserves|Pantry · 4-day lead time|£760'],
  'retail/fulfilment': ['#1039|Tracked 24 · 2 parcels · Amina Yusuf|£86.40', '#1040|Local courier · Harbour Cafe|£412.00', '#1041|Click & collect · Sofia Martins|£24.99', '#1038|Tracked 48 · North & Co|£158.20', '#1037|Local courier · The Corner Deli|£620.00'],
  'retail/returns': ['RMA-501|#1021 · Damaged in transit · Sofia Martins|£24.99', 'RMA-502|#1025 · Wrong size · Priya Anand|£41.50', 'RMA-503|#1030 · Changed mind · Tom Hale|£18.00', 'RMA-504|#1033 · Faulty · North & Co|£158.20'],
  'retail/service': ['Order arrived late|Sofia Martins · WhatsApp|High', 'Wrong item sent|North & Co · Email|High', 'Refund question|Priya Anand · Web chat|Medium', 'Allergen information|Harbour Cafe · Phone|Low', 'Change delivery address|Amina Yusuf · WhatsApp|Medium'],
  'retail/payments': ['PAY-7781|Card · #1042 Amina Yusuf|£86.40', 'PAY-7782|Bank transfer · #1043 Harbour Cafe|£412.00', 'PAY-7783|Mobile money · #1045 North & Co|£158.20', 'PAY-7784|Card · #1044 Sofia Martins|£24.99', 'PAY-7785|Cash · #1046 Priya Anand|£41.50'],
  campaigns: ['Summer menu launch|WhatsApp broadcast · 1,120 recipients|£640', 'Loyalty double points|Email · VIP segment|£220', 'Weekend brunch promo|Instagram ads|£480', 'Back to school bundles|SMS · Families segment|£310', 'Win back lapsed customers|WhatsApp · Lapsed 60 days|£150'],
  content: ['Seasonal menu reveal|Instagram carousel|Launch', 'Meet the baker|Short video|Brand', 'Wholesale price list|PDF · Trade|Sales', 'Customer of the month|Instagram story|Community'],
  'marketing/leads': ['Grace Obi|Downloaded wholesale price list|£2,400', 'Tom Hale|Asked about event catering|£1,800', 'Kofi Mensah|Instagram DM · office coffee|£3,600', 'Lena Fischer|Website form · franchise|£18,000', 'Omar Haddad|WhatsApp · gift hampers|£900'],
  'marketing/audiences': ['WhatsApp subscribers|Opted in via checkout|1120', 'Instagram followers|Social|4830', 'Email list|Newsletter sign-ups|2260', 'Trade buyers|Wholesale accounts|74'],
  'marketing/segments': ['High intent|Visited pricing twice this week|142', 'Cart abandoners|Left checkout in last 7 days|58', 'Local 5 miles|Within delivery radius|1640', 'Birthday this month|Date of birth on file|37'],
  'marketing/channels': ['WhatsApp|Broadcasts & replies|£5,130', 'Instagram|Organic & ads|£2,210', 'Email|Newsletter|£1,480', 'Google Ads|Search|£960'],
  'marketing/journeys': ['Welcome series|3 WhatsApp messages over 7 days|412', 'Abandoned cart|Reminder after 2 hours|58', 'Win-back|Offer after 60 days inactive|214', 'Post-purchase review|Ask for review after 3 days|380'],
  'marketing/brand-studio': ['Primary logo|SVG · approved|Brand', 'Colour palette|6 colours · approved|Brand', 'Menu template|Canva · draft|Print', 'Social templates|12 layouts|Social'],
  'finance/invoices': ['INV-1042|Harbour Cafe|£1,240.00', 'INV-1043|North & Co|£3,480.00', 'INV-1044|The Corner Deli|£620.00', 'INV-1045|Deacon & Rye|£2,150.00', 'INV-1046|Willowbrook Bakery|£4,900.00', 'INV-1047|Priya Anand|£310.00'],
  'finance/bills': ['Bean Roasters Ltd|Coffee beans · bill 88213|£620.00', 'Energy supplier|Electricity · March|£410.00', 'Landlord|Rent · Q2|£3,600.00', 'EcoPack Supplies|Packaging · bill 5521|£185.00', 'Millstone Flour|Flour · bill 1190|£370.00'],
  'finance/banking': ['Business current account|High-street bank ••4412|£18,240', 'Savings reserve|••9021|£25,000', 'Card settlements|Payment processor payouts|£2,140', 'Petty cash|Till float|£200'],
  'finance/reconciliation': ['Payout 14 Mar|Bank line · CARD PAYOUT|£1,284.50', 'Harbour Cafe payment|Bank line · HARBOUR CAFE LTD|£1,240.00', 'Rent Q2|Bank line · LANDLORD STO|£3,600.00', 'Unknown transfer|Bank line · REF 88213|£620.00', 'Energy direct debit|Bank line · DD ENERGY|£410.00'],
  'finance/expenses': ['Train to supplier visit|Travel · Amina Yusuf|£48.20', 'Client lunch|Meals · Tom Hale|£62.00', 'Market stall fee|Events · Priya Anand|£85.00', 'Card machine rolls|Supplies · Sofia Martins|£14.99', 'Van fuel|Travel · Kofi Mensah|£72.40'],
  'finance/payments': ['Supplier run — week 12|4 bills|£4,815.00', 'Payroll transfer|March staff pay|£11,420.00', 'HMRC VAT|Q1 return|£4,210.00', 'Card fees|Payment processor|£96.30'],
  'finance/budgets': ['Marketing|Q2 budget|£6,000', 'Stock purchasing|Q2 budget|£24,000', 'Staff|Q2 budget|£36,000', 'Equipment|Q2 budget|£4,000'],
  'finance/tax': ['VAT return Q1|Due 7 May · HMRC|£4,210.00', 'PAYE & NI March|Due 22 Apr · HMRC|£2,860.00', 'Corporation tax|FY 2025 · estimate|£8,900.00', 'Business rates|Council · instalment|£640.00'],
  'finance/approvals': ['New espresso machine|Capex · Tom Hale|£2,400', 'Extra weekend staff|Staffing · Priya Anand|£680', 'Instagram ad boost|Marketing · Sofia Martins|£300', 'Supplier switch|Contract · Amina Yusuf|£1,200'],
  'talent/candidates': ['Amara Okafor|Barista · via job board|£24,000', 'Daniel Price|Store manager · referral|£34,000', 'Mei Chen|Pastry chef · Instagram|£28,000', 'Lucas Silva|Delivery driver · WhatsApp|£23,000', 'Hannah Moore|Bookkeeper · LinkedIn|£30,000', 'Yusuf Ali|Barista · walk-in|£24,000'],
  'talent/jobs': ['Barista (full-time)|Harbour St store · 14 applicants|£24,000', 'Store manager|Harbour St store · 6 applicants|£34,000', 'Pastry chef|Central kitchen · 9 applicants|£28,000', 'Delivery driver|Logistics · 11 applicants|£23,000'],
  'talent/interviews': ['Amara Okafor|Barista · trial shift|Round 2', 'Daniel Price|Store manager · video call|Round 1', 'Mei Chen|Pastry chef · practical|Round 2', 'Hannah Moore|Bookkeeper · phone screen|Round 1'],
  'talent/offers': ['Mei Chen|Pastry chef · start 1 May|£28,000', 'Amara Okafor|Barista · start 22 Apr|£24,000', 'Lucas Silva|Delivery driver · start 29 Apr|£23,000'],
  'hr/onboarding': ['Mei Chen|Right to work, contract, uniform|Day 1', 'Amara Okafor|Food hygiene course, till training|Week 1', 'Lucas Silva|Licence check, van induction|Day 1', 'Grace Obi|Bank details, pension opt-in|Week 2'],
  'hr/people': ['Tom Hale|Store manager · Harbour St|Full-time', 'Priya Anand|Head baker · Central kitchen|Full-time', 'Sofia Martins|Barista · Harbour St|Part-time', 'Kofi Mensah|Driver · Logistics|Full-time', 'Grace Obi|Bookkeeper · Office|Part-time', 'Amina Yusuf|Operations lead · Office|Full-time'],
  'hr/performance': ['Tom Hale|Q1 review · store targets|92', 'Priya Anand|Q1 review · waste reduction|88', 'Sofia Martins|Q1 review · customer score|81', 'Kofi Mensah|Q1 review · on-time delivery|76'],
  'hr/time-off': ['Sofia Martins|Annual leave · 3 days · 14–16 May|3 days', 'Kofi Mensah|Sick leave · 1 day|1 day', 'Tom Hale|Annual leave · 1 week · June|5 days', 'Priya Anand|Training day|1 day'],
  'hr/learning': ['Food hygiene level 2|Required · 4 staff|4 enrolled', 'Allergen awareness|Required · 6 staff|6 enrolled', 'Till & refunds|Onboarding|2 enrolled', 'First aid at work|Optional|1 enrolled'],
  'hr/payroll': ['March payroll|12 staff · monthly|£11,420.00', 'March overtime|4 staff|£640.00', 'Holiday pay adjustment|2 staff|£310.00', 'April payroll|12 staff · monthly|£11,580.00'],
  'talent/talent-pool': ['Grace Obi|Bookkeeper · available now|£28,000', 'Leo Byrne|Chef de partie · 2 weeks notice|£30,000', 'Nadia Karim|Warehouse lead · temp-to-perm|£14/hr', 'Sam Otieno|Delivery driver · weekends|£13/hr'],
  'talent/clients': ['Harbour Cafe Group|Hospitality · 3 open roles|15%', 'North & Co Logistics|Warehousing · 5 open roles|£1,800', 'Willowbrook Bakery|Food production · 1 open role|12%'],
  'talent/placements': ['Leo Byrne|Harbour Cafe Group · chef|£4,500', 'Nadia Karim|North & Co · warehouse lead|£1,800', 'Grace Obi|Willowbrook · bookkeeper|£3,360'],
  'talent/references': ['Mei Chen|Former employer · Riverside Hotel|Positive', 'Amara Okafor|Character reference|Pending', 'Lucas Silva|DVLA licence check|Clear'],
  'hr/contracts': ['Mei Chen|Permanent · 40 hrs|£28,000', 'Amara Okafor|Permanent · 30 hrs|£24,000', 'Lucas Silva|Fixed term 6 months|£23,000', 'Sofia Martins|Part-time · 20 hrs|£12.60/hr'],
  'hr/rotas': ['Mon early|Sofia Martins · Harbour St|8', 'Mon late|Tom Hale · Harbour St|8', 'Tue bake|Priya Anand · Central kitchen|9', 'Sat delivery|Unassigned · Logistics|6'],
  'hr/timesheets': ['Sofia Martins|Week 14|22.5', 'Kofi Mensah|Week 14|41', 'Priya Anand|Week 14|45', 'Tom Hale|Week 14|40'],
  'hr/sickness': ['Kofi Mensah|Flu · 2–3 Apr|2', 'Sofia Martins|Migraine · 9 Apr|1', 'Priya Anand|Back injury · fit note|5'],
  'hr/right-to-work': ['Mei Chen|Share code check|2028-06-30', 'Lucas Silva|UK passport|No expiry', 'Amara Okafor|Visa · skilled worker|2027-01-15'],
  'hr/documents': ['Employment contract|Mei Chen|Contract', 'Food hygiene certificate|Amara Okafor|Certificate', 'Payslip consent|Lucas Silva|Form'],
  'hr/policies': ['Staff handbook 2026|Everyone|10/12', 'Holiday policy|Everyone|12/12', 'Lone working policy|Drivers|3/4', 'Allergen policy|Kitchen and front of house|8/9'],
  'hr/engagement': ['Pulse survey April|Response rate 83%|7.9', 'Harbour St team|Store team score|8.2', 'Central kitchen|Kitchen team score|7.1', 'Drivers|Logistics team score|6.8'],
  'logistics/dispatch': ['Load 14 · North|8 drops · Van 3 · Kofi Mensah|8 drops', 'Load 15 · City centre|12 drops · Van 1|12 drops', 'Load 16 · Coastal|5 drops · Van 2|5 drops', 'Load 17 · Wholesale|3 drops · Truck 1|3 drops'],
  'logistics/deliveries': ['DEL-3301|Harbour Cafe · 12 Quay St|£412.00', 'DEL-3302|North & Co · Unit 4, Mill Rd|£158.20', 'DEL-3303|Amina Yusuf · 8 Elm Close|£86.40', 'DEL-3304|The Corner Deli · 2 High St|£620.00', 'DEL-3305|Deacon & Rye · 19 Market Sq|£2,150.00'],
  'logistics/exceptions': ['Failed delivery — no access|DEL-3298 · Deacon & Rye|High', 'Damaged parcel|DEL-3290 · Sofia Martins|Medium', 'Van breakdown|Load 12 · Van 2|High', 'Address not found|DEL-3295 · Tom Hale|Low'],
  'logistics/routes': ['North loop|8 stops · 42 miles|2h 40m', 'City centre|12 stops · 18 miles|3h 10m', 'Coastal|5 stops · 55 miles|2h 05m', 'Wholesale run|3 stops · 30 miles|1h 30m'],
  'logistics/billing': ['LB-801|Harbour Cafe · March deliveries|£240.00', 'LB-802|North & Co · March deliveries|£180.00', 'LB-803|Deacon & Rye · pallet move|£420.00', 'LB-804|The Corner Deli · March deliveries|£96.00'],
  'logistics/quotes': ['Q-311|Weekly wholesale run · Deacon & Rye|£1,200.00', 'Q-312|Event delivery · North & Co|£340.00', 'Q-313|Pallet storage · Willowbrook Bakery|£860.00'],
  'health/triage': ['Chest discomfort|Patient J. Evans · phone|Urgent', 'Medication query|Patient A. Khan · web form|Routine', 'Rash follow-up|Patient L. Brown · photo|Soon', 'Repeat prescription|Patient M. Ito · app|Routine'],
  'health/follow-ups': ['J. Evans|Blood results review|2 days', 'L. Brown|Dermatology check|1 week', 'A. Khan|Medication review|2 weeks', 'R. Patel|Physio progress|1 week'],
  'health/compliance': ['Fire safety check|Annual · main clinic|Due', 'Data protection audit|Quarterly|Due', 'Controlled drugs register|Weekly|Due', 'Staff DBS renewals|3 staff|Due'],
  'health/billing': ['HB-201|J. Evans · consultation|£85.00', 'HB-202|L. Brown · follow-up|£55.00', 'HB-203|A. Khan · physio session|£60.00', 'HB-204|R. Patel · assessment|£120.00'],
  'health/claims': ['CL-901|J. Evans · insurer claim|£85.00', 'CL-902|R. Patel · insurer claim|£120.00', 'CL-903|M. Ito · insurer claim|£60.00'],
  'health/inventory': ['Nitrile gloves (box 100)|MedSupply Co · GL-100', 'Syringes 5ml|MedSupply Co · SY-005', 'Dressing packs|CarePlus · DR-020', 'Hand sanitiser 500ml|CarePlus · HS-500'],
  'intelligence/signals': ['Coffee beans will run out in 4 days|Retail · Inventory|High', 'Overdue invoices up 18% this week|Finance · Invoices|Medium', 'Weekend orders up 32%|Retail · Orders|Low', 'Driver on-time rate fell to 81%|Logistics · Deliveries|Medium', 'Two staff on leave during peak week|Workforce · Time off|Medium'],
  'intelligence/risks': ['Single supplier for coffee beans|Supply chain|High', 'Cash runway under 3 months if sales dip 20%|Finance|Medium', 'Key baker has no cover|Workforce|Medium', 'Card processor fees rising|Finance|Low'],
  'intelligence/anomalies': ['Refunds 3× normal on Tuesday|Retail · Returns|High', 'Energy bill 40% higher than usual|Finance · Bills|Medium', 'Unusual login location|Security|High', 'Order value drop on website|Retail · Orders|Low'],
  'intelligence/recommendations': ['Reorder 20 kg coffee beans now|Saves a stock-out on Friday|£260', 'Chase 3 overdue invoices by WhatsApp|Recovers cash this week|£6,250', 'Add a Saturday driver|Keeps on-time rate above 95%|£180', 'Run win-back offer to lapsed customers|214 customers · est. revenue|£1,900'],
}

export function moduleSamples(workspace: string, moduleId: string): Array<{ name: string; secondary: string; value?: string }> | undefined {
  const rows = sampleText[`${workspace}/${moduleId}`] ?? sampleText[moduleId]
  return rows?.map((row) => {
    const [name, secondary, value] = row.split('|')
    return { name, secondary, value }
  })
}

const money = (value: string) => Number(value.replace(/[^0-9.]/g, '')) || 0
const gbp = (value: number) => `£${value.toLocaleString('en-GB', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || '•'
const daysUntil = (dueDate?: string) => {
  if (!dueDate) return null
  const due = new Date(`${dueDate}T00:00:00`)
  if (Number.isNaN(due.getTime())) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - today.getTime()) / 86400000)
}
const isOverdue = (record: LayoutRecord, statuses: string[]) => record.status === 'Overdue' || (record.status !== statuses.at(-1) && (daysUntil(record.dueDate) ?? 1) < 0)
const dueLabel = (dueDate?: string) => {
  const days = daysUntil(dueDate)
  if (days === null) return '—'
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Today'
  return new Date(`${dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
const plainDate = (dueDate?: string) => dueDate ? new Date(`${dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'
const severity = (record: LayoutRecord): 'high' | 'medium' | 'low' => {
  const text = `${record.value} ${record.secondary}`.toLowerCase()
  if (/high|urgent/.test(text)) return 'high'
  if (/medium|soon/.test(text)) return 'medium'
  return 'low'
}

export type WorkspaceViewProps = {
  layout: WorkspaceLayout
  moduleId: string
  noun: string
  fields: { name: string; secondary: string; value: string; owner: string }
  records: LayoutRecord[]
  statuses: string[]
  selectedId?: string
  onSelect: (id: string) => void
  onMove: (record: LayoutRecord, status: string) => void
  onNote: (record: LayoutRecord, note: string) => void
  onCount: (record: LayoutRecord, quantity: number) => void
  onSell: (sale: { summary: string; total: number; method: string }) => Promise<void>
  catalogue: LayoutRecord[]
  busy: boolean
}

export function ModuleWorkspaceView(props: WorkspaceViewProps) {
  if (props.layout === 'till') return <TillView {...props} />
  if (props.layout === 'ledger') return <LedgerView {...props} />
  if (props.layout === 'stock') return <StockView {...props} />
  if (props.layout === 'feed') return <FeedView {...props} />
  return <QueueView {...props} />
}

function StatusTabs({ statuses, records, active, onChange }: { statuses: string[]; records: LayoutRecord[]; active: string; onChange: (status: string) => void }) {
  return <div className="mw-tabs" role="tablist">
    {['all', ...statuses].map((status) => <button aria-selected={active === status} key={status} onClick={() => onChange(status)} role="tab" type="button">
      {status === 'all' ? 'All' : status}<b>{status === 'all' ? records.length : records.filter((record) => record.status === status).length}</b>
    </button>)}
  </div>
}

function QueueView({ moduleId, fields, records, statuses, selectedId, onSelect, onMove, busy, noun }: WorkspaceViewProps) {
  const [tab, setTab] = useState('all')
  const rows = tab === 'all' ? records : records.filter((record) => record.status === tab)
  return <div className="mw-card">
    <StatusTabs active={tab} onChange={setTab} records={records} statuses={statuses} />
    <div className="mw-queue">
      {rows.map((record) => {
        const step = nextStep(moduleId, record.status, statuses)
        const late = isOverdue(record, statuses)
        return <article className={`mw-queue-row${selectedId === record.id ? ' selected' : ''}${late ? ' late' : ''}`} key={record.id} onClick={() => onSelect(record.id)}>
          <div className="mw-queue-main"><strong>{record.name}</strong><span>{record.secondary}</span></div>
          <div className="mw-queue-meta"><small>{fields.value}</small><b>{record.value}</b></div>
          <div className="mw-queue-meta"><small>{fields.owner}</small><span className="mw-avatar-line"><i>{initials(record.owner)}</i>{record.owner}</span></div>
          <div className="mw-queue-meta"><small>{record.dueDate ? 'Due' : 'Updated'}</small><span className={late ? 'mw-late' : ''}>{record.dueDate ? dueLabel(record.dueDate) : record.updated}</span></div>
          <span className="mw-chip" data-stage={statuses.indexOf(record.status)}>{record.status}</span>
          {step ? <button className="mw-action" disabled={busy} onClick={(event) => { event.stopPropagation(); onMove(record, step.to) }} type="button">{step.label}</button> : <span className="mw-done">✓ Done</span>}
        </article>
      })}
      {rows.length === 0 ? <p className="mw-empty">Nothing in {tab === 'all' ? 'this queue' : `“${tab}”`}. No {noun}s waiting here.</p> : null}
    </div>
  </div>
}

function LedgerView({ moduleId, fields, records, statuses, selectedId, onSelect, onMove, onNote, busy }: WorkspaceViewProps) {
  const [tab, setTab] = useState('all')
  const rows = tab === 'all' ? records : records.filter((record) => record.status === tab)
  const totals = statuses.map((status) => ({ status, total: records.filter((record) => record.status === status).reduce((sum, record) => sum + money(record.value), 0) }))
  const overdueRecords = records.filter((record) => isOverdue(record, statuses))
  return <div className="mw-card">
    <div className="mw-ledger-totals">
      {totals.map(({ status, total }) => <button aria-pressed={tab === status} key={status} onClick={() => setTab(tab === status ? 'all' : status)} type="button"><small>{status}</small><strong>{gbp(total)}</strong></button>)}
      {overdueRecords.length && !statuses.includes('Overdue') ? <div className="mw-ledger-alert"><small>Overdue</small><strong>{gbp(overdueRecords.reduce((sum, record) => sum + money(record.value), 0))}</strong></div> : null}
    </div>
    <div className="mw-table-scroll"><table className="mw-ledger">
      <thead><tr><th>{fields.name}</th><th>{fields.secondary}</th><th>Due</th><th className="num">{fields.value}</th><th>Status</th><th /></tr></thead>
      <tbody>
        {rows.map((record) => {
          const step = nextStep(moduleId, record.status, statuses)
          const late = isOverdue(record, statuses)
          return <tr className={selectedId === record.id ? 'selected' : ''} key={record.id} onClick={() => onSelect(record.id)}>
            <td><strong>{record.name}</strong></td>
            <td className="muted">{record.secondary}</td>
            <td className={late ? 'mw-late' : ''}>{record.status === statuses.at(-1) ? plainDate(record.dueDate) : dueLabel(record.dueDate)}</td>
            <td className="num"><strong>{record.value}</strong></td>
            <td><span className="mw-chip" data-late={late || undefined} data-stage={statuses.indexOf(record.status)}>{late && record.status !== 'Overdue' ? 'Overdue' : record.status}</span></td>
            <td className="mw-row-actions" onClick={(event) => event.stopPropagation()}>
              {late ? <button disabled={busy} onClick={() => onNote(record, 'Payment reminder sent on WhatsApp')} type="button">Send reminder</button> : null}
              {step ? <button className="mw-action" disabled={busy} onClick={() => onMove(record, step.to)} type="button">{step.label}</button> : <span className="mw-done">✓</span>}
            </td>
          </tr>
        })}
      </tbody>
      <tfoot><tr><td colSpan={3}>{rows.length} {rows.length === 1 ? 'item' : 'items'}</td><td className="num"><strong>{gbp(rows.reduce((sum, record) => sum + money(record.value), 0))}</strong></td><td colSpan={2} /></tr></tfoot>
    </table></div>
  </div>
}

function StockView({ records, selectedId, onSelect, onCount, onNote, busy }: WorkspaceViewProps) {
  const [counting, setCounting] = useState<string | null>(null)
  const [count, setCount] = useState('')
  const low = records.filter((record) => (record.quantity ?? 0) <= (record.reorderPoint ?? 0))
  const submit = (event: FormEvent, record: LayoutRecord) => {
    event.preventDefault()
    const quantity = Number(count)
    if (!Number.isFinite(quantity) || quantity < 0) return
    onCount(record, quantity)
    setCounting(null)
    setCount('')
  }
  return <div className="mw-card">
    {low.length ? <div className="mw-banner risk">⚠ {low.length} {low.length === 1 ? 'item is' : 'items are'} at or below the reorder point: {low.map((record) => record.name).join(', ')}</div> : <div className="mw-banner good">✓ Every item is above its reorder point</div>}
    <div className="mw-table-scroll"><table className="mw-ledger mw-stock">
      <thead><tr><th>Item</th><th>Supplier · SKU</th><th>On hand</th><th className="num">Reorder at</th><th /></tr></thead>
      <tbody>
        {records.map((record) => {
          const quantity = record.quantity ?? money(record.value)
          const reorder = record.reorderPoint ?? 0
          const isLow = quantity <= reorder
          const fill = Math.min(100, Math.round((quantity / Math.max(reorder * 3, 1)) * 100))
          return <tr className={selectedId === record.id ? 'selected' : ''} key={record.id} onClick={() => onSelect(record.id)}>
            <td><strong>{record.name}</strong></td>
            <td className="muted">{record.secondary}</td>
            <td><div className="mw-level" data-low={isLow || undefined}><em><i style={{ width: `${fill}%` }} /></em><span>{quantity} units</span></div></td>
            <td className="num">{reorder}</td>
            <td className="mw-row-actions" onClick={(event) => event.stopPropagation()}>
              {counting === record.id ? <form className="mw-inline-form" onSubmit={(event) => submit(event, record)}><input aria-label={`Counted units of ${record.name}`} autoFocus min={0} onChange={(event) => setCount(event.target.value)} placeholder="Counted" type="number" value={count} /><button className="mw-action" type="submit">Save</button></form> : <button disabled={busy} onClick={() => { setCounting(record.id); setCount('') }} type="button">Count</button>}
              {isLow ? <button className="mw-action" disabled={busy} onClick={() => onNote(record, `Reorder requested: ${Math.max(reorder * 3 - quantity, reorder)} units`)} type="button">Reorder</button> : null}
            </td>
          </tr>
        })}
      </tbody>
    </table></div>
  </div>
}

function FeedView({ moduleId, records, statuses, selectedId, onSelect, onMove, busy }: WorkspaceViewProps) {
  const [showResolved, setShowResolved] = useState(false)
  const done = statuses.at(-1)
  const rank = { high: 0, medium: 1, low: 2 }
  const rows = [...records].filter((record) => showResolved || record.status !== done).sort((a, b) => rank[severity(a)] - rank[severity(b)])
  return <div className="mw-card">
    <div className="mw-feed-head"><span>{rows.length} {showResolved ? 'items' : 'need attention'}</span><label><input checked={showResolved} onChange={(event) => setShowResolved(event.target.checked)} type="checkbox" /> Show resolved</label></div>
    <div className="mw-feed">
      {rows.map((record) => {
        const step = nextStep(moduleId, record.status, statuses)
        const level = severity(record)
        return <article className={`mw-feed-item${selectedId === record.id ? ' selected' : ''}`} data-severity={level} key={record.id} onClick={() => onSelect(record.id)}>
          <span className="mw-severity">{level}</span>
          <div><strong>{record.name}</strong><p>{record.secondary} · {record.updated} · {record.status}</p></div>
          <div className="mw-row-actions" onClick={(event) => event.stopPropagation()}>
            {step ? <button className="mw-action" disabled={busy} onClick={() => onMove(record, step.to)} type="button">{step.label}</button> : null}
            {record.status !== done && done ? <button disabled={busy} onClick={() => onMove(record, done)} type="button">Dismiss</button> : null}
          </div>
        </article>
      })}
      {rows.length === 0 ? <p className="mw-empty">All clear. Nothing needs your attention.</p> : null}
    </div>
  </div>
}

function TillView({ records, catalogue, onSell, busy, statuses, selectedId, onSelect }: WorkspaceViewProps) {
  const [basket, setBasket] = useState<Record<string, number>>({})
  const [method, setMethod] = useState('Card')
  const [done, setDone] = useState('')
  const items = catalogue.filter((product) => money(product.value) > 0)
  const lines = items.filter((product) => basket[product.id]).map((product) => ({ product, qty: basket[product.id] }))
  const total = lines.reduce((sum, line) => sum + money(line.product.value) * line.qty, 0)
  const add = (id: string, delta: number) => setBasket((current) => {
    const qty = Math.max(0, (current[id] ?? 0) + delta)
    const next = { ...current, [id]: qty }
    if (!qty) delete next[id]
    return next
  })
  const charge = async () => {
    if (!lines.length) return
    const summary = lines.map((line) => `${line.qty > 1 ? `${line.qty} × ` : ''}${line.product.name}`).join(', ')
    await onSell({ summary, total, method })
    setBasket({})
    setDone(`${gbp(total)} taken by ${method.toLowerCase()}`)
  }
  const paid = records.filter((record) => ['Paid', 'Closed'].includes(record.status))
  return <div className="mw-till">
    <section className="mw-card mw-till-products">
      <header className="mw-card-head"><strong>Products</strong><small>Tap to add to the basket</small></header>
      <div className="mw-tiles">
        {items.map((product) => <button className="mw-tile" key={product.id} onClick={() => { add(product.id, 1); setDone('') }} type="button">
          <i>{initials(product.name)}</i><strong>{product.name}</strong><span>{product.value}</span>{basket[product.id] ? <b>{basket[product.id]}</b> : null}
        </button>)}
        {items.length === 0 ? <p className="mw-empty">Add products with prices in Products to sell them here.</p> : null}
      </div>
    </section>
    <section className="mw-card mw-basket">
      <header className="mw-card-head"><strong>Basket</strong>{lines.length ? <button onClick={() => setBasket({})} type="button">Clear</button> : null}</header>
      {lines.length ? <ul>{lines.map((line) => <li key={line.product.id}>
        <span>{line.product.name}</span>
        <div className="mw-qty"><button aria-label={`Remove one ${line.product.name}`} onClick={() => add(line.product.id, -1)} type="button">−</button><b>{line.qty}</b><button aria-label={`Add one ${line.product.name}`} onClick={() => add(line.product.id, 1)} type="button">+</button></div>
        <strong>{gbp(money(line.product.value) * line.qty)}</strong>
      </li>)}</ul> : <p className="mw-empty">{done ? `✓ ${done}` : 'Basket is empty'}</p>}
      <div className="mw-basket-total"><span>Total</span><strong>{gbp(total)}</strong></div>
      <div className="mw-pay-methods" role="group">{['Card', 'Cash', 'Mobile money'].map((option) => <button aria-pressed={method === option} key={option} onClick={() => setMethod(option)} type="button">{option}</button>)}</div>
      <button className="mw-charge" disabled={busy || !lines.length} onClick={() => void charge()} type="button">Charge {gbp(total)}</button>
    </section>
    <section className="mw-card mw-till-sales">
      <header className="mw-card-head"><strong>Today’s sales</strong><small>{paid.length} paid · {gbp(paid.reduce((sum, record) => sum + money(record.value), 0))}</small></header>
      <ul>{records.map((record) => <li className={selectedId === record.id ? 'selected' : ''} key={record.id} onClick={() => onSelect(record.id)}>
        <div><strong>{record.name}</strong><span>{record.secondary}</span></div><b>{record.value}</b><span className="mw-chip" data-stage={statuses.indexOf(record.status)}>{record.status}</span>
      </li>)}</ul>
    </section>
  </div>
}

// ── FoundAI command bar ──────────────────────────────────────────────────────

type AiKind = 'advance' | 'remind' | 'reorder' | 'summary' | 'top' | 'first'
type AiAction = { label: string; kind: AiKind; note?: string }
export type AiPlan = { title: string; lines: string[]; targets: LayoutRecord[]; apply?: { label: string; kind: 'advance' | 'note'; note?: string } }

const aiActions: Record<string, AiAction[]> = {
  'point-of-sale': [{ label: 'Summarise today’s takings', kind: 'summary' }, { label: 'Close the till', kind: 'advance' }, { label: 'Show biggest sales', kind: 'top' }],
  orders: [{ label: 'Move orders to the next step', kind: 'advance' }, { label: 'Message customers with late orders', kind: 'remind', note: 'Delay update sent to customer on WhatsApp' }, { label: 'Summarise today’s orders', kind: 'summary' }],
  fulfilment: [{ label: 'Pick and pack the queue', kind: 'advance' }, { label: 'Find late shipments', kind: 'remind', note: 'Courier chased and customer updated' }, { label: 'Summarise fulfilment', kind: 'summary' }],
  returns: [{ label: 'Approve new returns', kind: 'first' }, { label: 'Refund received returns', kind: 'advance' }, { label: 'Summarise returns', kind: 'summary' }],
  service: [{ label: 'Assign unassigned tickets', kind: 'first' }, { label: 'Reply to overdue tickets', kind: 'remind', note: 'FoundAI drafted a reply for approval' }, { label: 'Summarise the queue', kind: 'summary' }],
  inventory: [{ label: 'Reorder everything running low', kind: 'reorder', note: 'Purchase order drafted by FoundAI' }, { label: 'Summarise stock health', kind: 'summary' }, { label: 'Show highest stock', kind: 'top' }],
  invoices: [{ label: 'Chase overdue invoices on WhatsApp', kind: 'remind', note: 'Payment reminder sent on WhatsApp' }, { label: 'Send all draft invoices', kind: 'first' }, { label: 'Summarise money owed', kind: 'summary' }],
  bills: [{ label: 'Approve bills received', kind: 'first' }, { label: 'Show bills due soon', kind: 'remind', note: 'Payment scheduled before due date' }, { label: 'Summarise what we owe', kind: 'summary' }],
  expenses: [{ label: 'Review submitted expenses', kind: 'first' }, { label: 'Show largest claims', kind: 'top' }, { label: 'Summarise spend', kind: 'summary' }],
  reconciliation: [{ label: 'Suggest matches for unmatched lines', kind: 'first' }, { label: 'Accept suggested matches', kind: 'advance' }, { label: 'Summarise reconciliation', kind: 'summary' }],
  purchasing: [{ label: 'Approve draft purchase orders', kind: 'first' }, { label: 'Chase late deliveries from suppliers', kind: 'remind', note: 'Supplier chased for delivery date' }, { label: 'Summarise spend with suppliers', kind: 'summary' }],
  candidates: [{ label: 'Screen new applicants', kind: 'first' }, { label: 'Show strongest candidates', kind: 'top' }, { label: 'Summarise hiring', kind: 'summary' }],
  'time-off': [{ label: 'Review new requests', kind: 'first' }, { label: 'Summarise who is off', kind: 'summary' }],
  payroll: [{ label: 'Prepare the next pay run', kind: 'advance' }, { label: 'Summarise payroll', kind: 'summary' }],
  'sales-pipeline': [{ label: 'Follow up stalled deals', kind: 'remind', note: 'Follow-up message drafted by FoundAI' }, { label: 'Show biggest deals', kind: 'top' }, { label: 'Forecast this month', kind: 'summary' }],
  crm: [{ label: 'Find customers to re-engage', kind: 'first' }, { label: 'Show most valuable customers', kind: 'top' }, { label: 'Summarise customers', kind: 'summary' }],
  campaigns: [{ label: 'Schedule draft campaigns', kind: 'first' }, { label: 'Show best performing', kind: 'top' }, { label: 'Summarise campaigns', kind: 'summary' }],
  signals: [{ label: 'Triage new signals', kind: 'first' }, { label: 'Summarise what changed', kind: 'summary' }],
  risks: [{ label: 'Start mitigating open risks', kind: 'first' }, { label: 'Summarise risk exposure', kind: 'summary' }],
  anomalies: [{ label: 'Investigate new anomalies', kind: 'first' }, { label: 'Summarise anomalies', kind: 'summary' }],
  recommendations: [{ label: 'Approve recommendations under review', kind: 'advance' }, { label: 'Show highest value', kind: 'top' }, { label: 'Summarise recommendations', kind: 'summary' }],
}
const fallbackActions: AiAction[] = [{ label: 'Move work to the next step', kind: 'advance' }, { label: 'Find overdue items', kind: 'remind', note: 'Follow-up sent by FoundAI' }, { label: 'Summarise this module', kind: 'summary' }]
export const moduleAiActions = (moduleId: string) => aiActions[moduleId] ?? fallbackActions

const describe = (record: LayoutRecord) => `${record.name} — ${record.secondary} · ${record.value}`

export function planAiAction(action: AiAction, records: LayoutRecord[], statuses: string[], noun: string, moduleLabel: string, kpis: ModuleKpi[]): AiPlan {
  const done = statuses.at(-1)
  if (action.kind === 'summary') {
    const lines = kpis.length ? kpis.map((kpi) => `${kpi.label}: ${kpi.value}`) : [`${records.length} ${noun}s in ${moduleLabel}`]
    const stages = statuses.map((status) => `${records.filter((record) => record.status === status).length} ${status.toLowerCase()}`).join(' · ')
    return { title: `${moduleLabel} at a glance`, lines: [...lines, ...(statuses.length ? [stages] : [])], targets: [] }
  }
  if (action.kind === 'top') {
    const targets = [...records].sort((a, b) => money(b.value) - money(a.value)).slice(0, 3)
    return { title: `Top ${targets.length} ${noun}s by value`, lines: targets.map(describe), targets }
  }
  if (action.kind === 'reorder') {
    const targets = records.filter((record) => (record.quantity ?? Infinity) <= (record.reorderPoint ?? -1))
    return { title: targets.length ? `${targets.length} ${targets.length === 1 ? 'item needs' : 'items need'} reordering` : 'Nothing needs reordering', lines: targets.map((record) => `${record.name}: ${record.quantity} on hand, reorder at ${record.reorderPoint}`), targets, apply: targets.length ? { label: `Draft ${targets.length} purchase ${targets.length === 1 ? 'order' : 'orders'}`, kind: 'note', note: action.note } : undefined }
  }
  if (action.kind === 'remind') {
    let targets = records.filter((record) => isOverdue(record, statuses))
    if (!targets.length) targets = records.filter((record) => record.status !== done && (daysUntil(record.dueDate) ?? 99) <= 3)
    return { title: targets.length ? `${targets.length} ${noun}${targets.length === 1 ? '' : 's'} need chasing` : `Nothing overdue in ${moduleLabel}`, lines: targets.map((record) => `${describe(record)} · ${dueLabel(record.dueDate)}`), targets, apply: targets.length ? { label: `Send ${targets.length} follow-up${targets.length === 1 ? '' : 's'}`, kind: 'note', note: action.note } : undefined }
  }
  const targets = action.kind === 'first' ? records.filter((record) => record.status === statuses[0]) : records.filter((record) => record.status !== done && statuses.includes(record.status))
  return { title: targets.length ? `${targets.length} ${noun}${targets.length === 1 ? '' : 's'} ready to move on` : `Nothing waiting in ${moduleLabel}`, lines: targets.map((record) => `${record.name}: ${record.status} → ${statuses[statuses.indexOf(record.status) + 1] ?? record.status}`), targets, apply: targets.length ? { label: `Move ${targets.length} ${noun}${targets.length === 1 ? '' : 's'} on`, kind: 'advance' } : undefined }
}

const intentFor = (text: string, actions: AiAction[]): AiAction => {
  const query = text.toLowerCase()
  const byKind = (kind: AiKind) => actions.find((action) => action.kind === kind)
  if (/overdue|late|chase|remind|unpaid|follow/.test(query)) return byKind('remind') ?? { label: text, kind: 'remind', note: 'Follow-up sent by FoundAI' }
  if (/stock|reorder|run out|low/.test(query)) return byKind('reorder') ?? { label: text, kind: 'reorder', note: 'Purchase order drafted by FoundAI' }
  if (/biggest|top|largest|best|most/.test(query)) return byKind('top') ?? { label: text, kind: 'top' }
  if (/new|approve|assign|screen|review|triage|send/.test(query)) return byKind('first') ?? byKind('advance') ?? { label: text, kind: 'first' }
  if (/move|advance|process|next|clear|close|pay/.test(query)) return byKind('advance') ?? { label: text, kind: 'advance' }
  return byKind('summary') ?? { label: text, kind: 'summary' }
}

export type LiveAnswer = { answer: string; suggestedActions: string[]; citations: Array<{ reference: string; name: string }>; model: string }

export function ModuleAiBar({ moduleId, moduleLabel, noun, records, statuses, kpis, onApply, askLive }: { moduleId: string; moduleLabel: string; noun: string; records: LayoutRecord[]; statuses: string[]; kpis: ModuleKpi[]; onApply: (plan: AiPlan) => Promise<void>; askLive?: (question: string) => Promise<LiveAnswer> }) {
  const actions = useMemo(() => moduleAiActions(moduleId), [moduleId])
  const [prompt, setPrompt] = useState('')
  const [plan, setPlan] = useState<AiPlan | null>(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState('')
  const [live, setLive] = useState<LiveAnswer | null>(null)
  const [thinking, setThinking] = useState(false)
  const [liveError, setLiveError] = useState('')
  const run = (action: AiAction) => {
    setApplied('')
    setLive(null)
    setLiveError('')
    setPlan(planAiAction(action, records, statuses, noun, moduleLabel, kpis))
  }
  const ask = async (event: FormEvent) => {
    event.preventDefault()
    const question = prompt.trim()
    if (!question) return
    setPrompt('')
    if (!askLive) {
      run(intentFor(question, actions))
      return
    }
    setPlan(null)
    setApplied('')
    setLive(null)
    setLiveError('')
    setThinking(true)
    try {
      setLive(await askLive(question))
    } catch (cause) {
      setLiveError(cause instanceof Error ? cause.message : 'FoundAI could not answer right now.')
      setPlan(planAiAction(intentFor(question, actions), records, statuses, noun, moduleLabel, kpis))
    } finally {
      setThinking(false)
    }
  }
  const approve = async () => {
    if (!plan?.apply) return
    setApplying(true)
    try {
      await onApply(plan)
      setApplied(`✓ Done: ${plan.apply.label.toLowerCase()}. Every change is recorded in each ${noun}'s activity log.`)
      setPlan(null)
    } finally {
      setApplying(false)
    }
  }
  return <section className="mw-ai">
    <form className="mw-ai-input" onSubmit={(event) => void ask(event)}>
      <span className="mw-ai-badge">FoundAI</span>
      <input aria-label={`Ask FoundAI about ${moduleLabel}`} onChange={(event) => setPrompt(event.target.value)} placeholder={`Ask or tell FoundAI to do something in ${moduleLabel.toLowerCase()}…`} value={prompt} />
      <button disabled={thinking} type="submit">{thinking ? 'Thinking…' : 'Ask'}</button>
    </form>
    <div className="mw-ai-chips">{actions.map((action) => <button key={action.label} onClick={() => run(action)} type="button">{action.label}</button>)}</div>
    {plan ? <div className="mw-ai-plan">
      <header><strong>{plan.title}</strong><button aria-label="Dismiss" onClick={() => setPlan(null)} type="button">×</button></header>
      {plan.lines.length ? <ul>{plan.lines.slice(0, 6).map((line) => <li key={line}>{line}</li>)}</ul> : null}
      {plan.apply ? <footer><small>Nothing changes until you approve.</small><button className="mw-action" disabled={applying} onClick={() => void approve()} type="button">{applying ? 'Working…' : `Approve: ${plan.apply.label}`}</button></footer> : null}
    </div> : null}
    {live ? <div className="mw-ai-plan">
      <header><strong>FoundAI</strong><button aria-label="Dismiss" onClick={() => setLive(null)} type="button">×</button></header>
      <p className="mw-ai-answer">{live.answer}</p>
      {live.suggestedActions.length ? <><small className="mw-ai-label">Suggested next steps</small><ul>{live.suggestedActions.map((action) => <li key={action}>{action}</li>)}</ul></> : null}
      {live.citations.length ? <p className="mw-ai-sources">Based on: {live.citations.map((citation) => citation.name || citation.reference).join(', ')}</p> : null}
    </div> : null}
    {liveError ? <p className="mw-ai-error">Live FoundAI is unavailable ({liveError}). Showing a quick answer from this module instead.</p> : null}
    {applied ? <p className="mw-ai-applied">{applied}</p> : null}
    {!askLive ? <p className="mw-ai-note">Demo mode: answers come from this module’s sample data. When you’re signed in, typed questions are answered by FoundAI from your real business records.</p> : null}
  </section>
}
