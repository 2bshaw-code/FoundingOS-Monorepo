/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type CrossSellWorkspace = 'retail' | 'logistics' | 'finance' | 'marketing' | 'talent' | 'hr' | 'health' | 'intelligence'

export type CrossSellOffer = {
  target: CrossSellWorkspace
  label: string
  price: string
  headline: string
  examples: string[]
}

// What each other package adds *from the point of view of the workspace you're in*.
// Ordered by how naturally they pair, so the first locked one is the best pitch.
export const crossSellOffers: Record<CrossSellWorkspace, CrossSellOffer[]> = {
  retail: [
    { target: 'finance', label: 'Finance', price: '+£25/mo with Commerce Pro', headline: 'Every order becomes an invoice — and gets reconciled for you.', examples: ['FoundAI raises the invoice the moment an order is paid', 'Card and bank payments matched to orders automatically', 'Live cash flow and VAT ready for your accountant'] },
    { target: 'marketing', label: 'Marketing', price: 'from £19/mo', headline: 'Turn your best sellers into campaigns that sell more.', examples: ['FoundAI writes posts for products that are trending', 'Win-back offers sent to customers who went quiet', 'See which campaign drove each order'] },
    { target: 'intelligence', label: 'Core.Intelligence', price: '+£35/mo', headline: 'Know what will sell out before it does.', examples: ['Stock-out forecasts per product', 'Alerts when sales or margins move unusually', 'Weekly AI recommendations you approve with one tap'] },
    { target: 'hr', label: 'HR', price: '£19/mo', headline: 'Rotas that follow your busiest trading hours.', examples: ['Shifts planned around forecast footfall', 'Holiday and sickness tracked in one place', 'Timesheets ready for payroll'] },
  ],
  logistics: [
    { target: 'finance', label: 'Finance', price: '+£25/mo with Commerce Pro', headline: 'Bill every delivery the moment it is proved.', examples: ['Proof of delivery triggers the invoice', 'Fuel and fleet costs tracked per route', 'Chase overdue customer accounts automatically'] },
    { target: 'hr', label: 'HR', price: '£19/mo', headline: 'Drivers, rotas and hours in one place.', examples: ['Driver shifts built around dispatch volume', 'Licence and compliance expiry reminders', 'Hours worked flow straight to payroll'] },
    { target: 'intelligence', label: 'Core.Intelligence', price: '+£35/mo', headline: 'Spot late deliveries before customers do.', examples: ['Delay risk scored for every route', 'Demand forecasts to size your fleet', 'Anomaly alerts on cost per drop'] },
  ],
  finance: [
    { target: 'retail', label: 'Retail & Logistics', price: '£19/mo', headline: 'Sales flow straight into your books.', examples: ['Orders and payments post themselves', 'Stock valued automatically', 'No more re-keying from your till'] },
    { target: 'intelligence', label: 'Core.Intelligence', price: '+£35/mo', headline: 'See next quarter’s cash before it happens.', examples: ['Cash-flow forecasts from real trading', 'Unusual spend flagged instantly', 'AI-drafted board summaries'] },
    { target: 'hr', label: 'HR', price: '£19/mo', headline: 'Payroll inputs without the spreadsheet.', examples: ['Hours, holiday and sickness feed payroll', 'Headcount cost by team', 'Contract changes logged and audited'] },
  ],
  marketing: [
    { target: 'retail', label: 'Retail & Logistics', price: '£19/mo', headline: 'Prove which campaigns actually made money.', examples: ['Orders linked back to the post that drove them', 'Customer segments built from real purchases', 'Promote what is in stock, never what has sold out'] },
    { target: 'intelligence', label: 'Core.Intelligence', price: '+£35/mo', headline: 'Let FoundAI tell you what to post next.', examples: ['Best time and channel predicted per audience', 'Budget moved to the campaigns that work', 'Early warning when engagement drops'] },
    { target: 'finance', label: 'Finance', price: '+£25/mo with Commerce Pro', headline: 'Know the real return on every pound spent.', examples: ['Ad spend matched to revenue', 'Campaign ROI in your P&L', 'Marketing budgets tracked against actuals'] },
  ],
  talent: [
    { target: 'hr', label: 'HR', price: '£19/mo', headline: 'From hired to fully onboarded — automatically.', examples: ['Accepted offers become employee records', 'Contracts and onboarding checklists sent for you', 'Right-to-work and documents stored securely'] },
    { target: 'marketing', label: 'Marketing', price: 'from £19/mo', headline: 'Job ads that reach the right people.', examples: ['FoundAI writes and posts your roles to social', 'Employer-brand content calendar', 'See which channel brings the best hires'] },
    { target: 'intelligence', label: 'Core.Intelligence', price: '+£35/mo', headline: 'Hire before you are short-staffed.', examples: ['Hiring needs forecast from growth', 'Time-to-hire and drop-off insights', 'Candidate pools mapped by location'] },
  ],
  hr: [
    { target: 'talent', label: 'Talent', price: '£19/mo', headline: 'Fill vacancies without leaving FoundingOS.', examples: ['Post jobs and track candidates on one board', 'Interviews booked and scored by the team', 'New starters flow straight into HR'] },
    { target: 'finance', label: 'Finance', price: '+£25/mo with Commerce Pro', headline: 'Payroll and people costs in your books.', examples: ['Wage costs posted automatically', 'Expenses approved and reimbursed', 'Headcount budget vs actual'] },
    { target: 'intelligence', label: 'Core.Intelligence', price: '+£35/mo', headline: 'Spot burnout and absence trends early.', examples: ['Absence patterns flagged', 'Overtime and cost anomalies', 'Staffing forecasts for busy periods'] },
  ],
  health: [
    { target: 'hr', label: 'HR', price: '£19/mo', headline: 'Clinical rotas and compliance, handled.', examples: ['Rotas built around appointments', 'Registration and training expiry reminders', 'Timesheets ready for payroll'] },
    { target: 'finance', label: 'Finance', price: '+£25/mo with Commerce Pro', headline: 'Bill every appointment automatically.', examples: ['Completed appointments raise invoices', 'Insurer and patient payments reconciled', 'Clinic revenue by practitioner'] },
    { target: 'marketing', label: 'Marketing', price: 'from £19/mo', headline: 'Fill empty appointment slots.', examples: ['Reminders and recalls sent for you', 'Posts promoting quiet clinics', 'Reviews requested after visits'] },
  ],
  intelligence: [
    { target: 'retail', label: 'Retail & Logistics', price: '£19/mo', headline: 'Feed FoundAI live sales and stock.', examples: ['Forecasts from real orders', 'Stock-out and margin alerts', 'Recommendations it can act on'] },
    { target: 'finance', label: 'Finance', price: '+£25/mo with Commerce Pro', headline: 'Cash forecasts from your real books.', examples: ['Runway and cash-flow predictions', 'Spend anomalies flagged', 'Board-ready summaries'] },
    { target: 'marketing', label: 'Marketing', price: 'from £19/mo', headline: 'Let insights launch campaigns.', examples: ['Signals turned into campaigns', 'Audience trends acted on', 'Attribution back to revenue'] },
  ],
}

// Offers for workspaces the company hasn't switched on. `enabled` null = unknown (demo): show all.
export function crossSellFor(workspace: CrossSellWorkspace, enabled: ReadonlySet<string> | null, limit = 2): CrossSellOffer[] {
  return crossSellOffers[workspace].filter((offer) => !enabled || !enabled.has(offer.target)).slice(0, limit)
}

export type TickerItem = { target: CrossSellWorkspace; label: string; price: string; text: string; owned: boolean }

// One line per example for the bottom news ticker. Packages the company hasn't added come
// first; if it has everything, the ticker still shows what its other workspaces can do.
export function tickerItemsFor(workspace: CrossSellWorkspace, enabled: ReadonlySet<string> | null): TickerItem[] {
  const offers = crossSellOffers[workspace]
  const locked = offers.filter((offer) => !enabled || !enabled.has(offer.target))
  const source = locked.length ? locked : offers
  const owned = !locked.length
  const rounds = Math.max(...source.map((offer) => offer.examples.length + 1))
  const items: TickerItem[] = []
  for (let round = 0; round < rounds; round += 1) {
    for (const offer of source) {
      const text = round === 0 ? offer.headline : offer.examples[round - 1]
      if (text) items.push({ target: offer.target, label: offer.label, price: offer.price, text, owned })
    }
  }
  return items
}
