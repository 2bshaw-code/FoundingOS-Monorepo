'use client'

import Link from 'next/link'

export function CustomerLaunch({ root, products, loading, error, simulation }: {
  root: string; products: number; loading: boolean; error: string; simulation: boolean
}) {
  return <section className="retail-app-panel customer-launch" aria-label="Customer launch checklist">
    <div className="retail-app-panel-heading"><div><p>Your first useful result</p><h2>From first product to WhatsApp</h2></div><span>{simulation ? 'Demo walkthrough' : 'Customer setup'}</span></div>
    <p>Start with one product, connect your business number, then verify a message from your own phone. No bulk migration or automation needed to begin.</p>
    <ol>
      <li><strong>1. Add your first product</strong><span>{loading ? 'Checking your catalogue…' : error ? 'Catalogue status unavailable. Open Products to retry.' : products ? `${products} product${products === 1 ? '' : 's'} in your ${simulation ? 'demo' : 'live'} catalogue.` : 'Give it a name and price. Add a photo or import a CSV when ready.'}</span><Link className="retail-app-secondary" href={`${root}/retail/products`}>Open Products</Link></li>
      <li><strong>2. Connect WhatsApp</strong><span>Follow the setup guide. Accepted credentials are not proof that messages are reaching your inbox.</span><Link className="retail-app-secondary" href={`${root}/retail/integrations#whatsapp-setup`}>Set up WhatsApp</Link></li>
      <li><strong>3. Read and reply in Inbox</strong><span>Send a message from your own opted-in test phone, refresh Inbox, then reply. Connection checks distinguish messages received, replies accepted and delivery confirmed.</span><Link className="retail-app-secondary" href={`${root}/retail/inbox`}>Open WhatsApp Inbox</Link></li>
    </ol>
    <p>Build your catalogue first. Keep owner approval enabled and confirm live messaging is working before launch.</p>
  </section>
}
