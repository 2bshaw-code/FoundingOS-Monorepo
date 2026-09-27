/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Publicly accessible (not behind the site access gate — see middleware.ts matcher)
// because Apple App Store Connect and Google Play both require a live, unauthenticated
// privacy policy URL for app review. Keep the cookie table in step with what the code sets.
export const metadata = {
  title: 'Privacy & Cookies — FoundingOS',
}

const cookies: Array<[string, string, string, string]> = [
  ['foundingos_site_access', 'Cookie (HTTP-only)', 'Keeps you signed in to protected FoundingOS pages.', 'Until you log out or it expires'],
  ['foundingos-theme', 'Cookie', 'Remembers day or night mode when you choose it.', '1 year'],
  ['foundingos-lite', 'Cookie', 'Remembers the lighter display mode when you choose it.', '1 year'],
  ['fo_ai_assistance, fo_onboarded_brands', 'Cookie', 'Remembers whether you turned FoundAI guidance on or off and which intros you have seen.', '1 year'],
  ['Workspace session', 'Browser storage', 'Holds your signed-in workspace session on this device.', 'Until you sign out'],
  ['Preferences (language, currency, layout, saved views, card order, demo data)', 'Browser storage', 'Remembers settings you choose so the app looks the way you left it.', 'Until you clear them'],
  ['Test workspace data', 'Browser storage', 'Stores data you enter in the interactive test workspaces on this device only.', 'Until you reset or clear it'],
]

export default function PrivacyPolicyPage() {
  return (
    <main className="complete-workspace-access">
      <section className="privacy-policy" style={{ maxWidth: 760, textAlign: 'left' }}>
        <div className="complete-workspace-access-brand"><span>F</span><div><strong>FoundingOS</strong><small>Privacy &amp; Cookies</small></div></div>
        <p className="eyebrow">Last updated 27 September 2026</p>
        <h1>Privacy &amp; Cookies</h1>

        <p>
          FoundingOS (“we”, “us”) provides a business operating system — Core.Operations, Core.Workforce and
          Core.Intelligence — through our website, web app and mobile app. This page explains what personal data we
          handle, why, who helps us process it, and the choices you have. We handle personal data in line with UK
          and EU data protection law (UK GDPR, EU GDPR and PECR).
        </p>

        <h2>Who is responsible</h2>
        <p>
          For your account and our website, FoundingOS is the data controller. For business records your company
          puts into FoundingOS (for example its customers, candidates or staff), your company is the controller and
          we process that data on its behalf and on its instructions.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>Account details: name, email address, role and a securely hashed password.</li>
          <li>Business records you enter or import: orders, products and product photos, invoices, inventory,
            campaigns, deals, candidates, employee records, deliveries and related notes.</li>
          <li>Billing details: plan, subscription status and invoices. Card payments are handled by Stripe; we never
            see or store full card numbers.</li>
          <li>Messages sent or received through channels you connect, such as WhatsApp, when you turn them on.</li>
          <li>Security and audit logs: sign-ins and changes made in your workspace, so actions can be traced.</li>
          <li>Optional private ratings and comments you send through “Rate FoundingOS”. These go only to the
            FoundingOS team and are never published.</li>
        </ul>

        <h2>Why we use it (lawful basis)</h2>
        <ul>
          <li>To provide the service you signed up for — <em>contract</em>.</li>
          <li>To keep FoundingOS secure, prevent abuse and improve it using your feedback — <em>legitimate interests</em>.</li>
          <li>To keep financial and tax records — <em>legal obligation</em>.</li>
        </ul>
        <p>We do not sell your data, and we do not use it for advertising.</p>

        <h2>Who helps us (processors)</h2>
        <ul>
          <li>Vercel — website and app hosting, and product photo storage.</li>
          <li>Our managed PostgreSQL database provider — storage of workspace data.</li>
          <li>Stripe — subscription billing and payments.</li>
          <li>Anthropic — powers FoundAI answers when you ask it a question.</li>
          <li>Resend — sends account and notification emails.</li>
          <li>Meta (WhatsApp Business) — only if you connect WhatsApp.</li>
        </ul>
        <p>
          Some providers may process data outside the UK or EEA. Where they do, we rely on recognised safeguards
          such as the UK International Data Transfer Agreement or EU Standard Contractual Clauses.
        </p>

        <h2 id="cookies">Cookies and browser storage</h2>
        <p>
          FoundingOS uses only cookies and browser storage that are strictly necessary to run the service or that
          remember choices you make. We do not use advertising, cross-site tracking or third-party analytics cookies,
          so there is nothing optional to switch off. If we add optional analytics in future, we will ask for your
          consent first.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 14, width: '100%' }}>
            <thead><tr>{['Name', 'Type', 'Purpose', 'How long'].map((heading) => <th key={heading} style={{ borderBottom: '1px solid #cfd8e3', padding: '6px 8px', textAlign: 'left' }}>{heading}</th>)}</tr></thead>
            <tbody>{cookies.map(([name, type, purpose, duration]) => <tr key={name}>{[name, type, purpose, duration].map((cell, index) => <td key={index} style={{ borderBottom: '1px solid #e6ebf1', padding: '6px 8px', verticalAlign: 'top' }}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          You can clear cookies and site data in your browser settings at any time. Doing so signs you out and
          resets your saved preferences. The mobile app stores your sign-in securely on your device in the same way.
        </p>

        <h2>How long we keep data</h2>
        <p>
          We keep account and workspace data while your account is active. When a company asks us to close its
          account, we delete its workspace data, except records we must keep by law (such as billing records).
        </p>

        <h2>How we protect it</h2>
        <p>
          Data is encrypted in transit (HTTPS/TLS). Each company’s data is kept separate, access is based on roles,
          integration credentials are encrypted, and changes are recorded in an audit log.
        </p>

        <h2 id="your-rights">Your data rights</h2>
        <p>
          You can ask to see, correct, export or delete your personal data, object to or restrict how we use it, and
          ask for a copy in a portable format. Company owners can export their workspace data from settings. Email us
          to make a request — we reply within one month. If you are unhappy with how we handle your data, you can
          complain to the UK Information Commissioner’s Office (ico.org.uk) or your local data protection authority.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions or data requests, contact{' '}
          <a href="mailto:privacy@foundingos.com">privacy@foundingos.com</a>.
        </p>

        <p><small>© 2024–2026 FoundingOS. All rights reserved.</small></p>
      </section>
    </main>
  )
}
