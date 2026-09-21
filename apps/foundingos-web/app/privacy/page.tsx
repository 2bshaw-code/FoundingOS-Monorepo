// Publicly accessible (not behind the site access gate — see middleware.ts matcher)
// because Apple App Store Connect and Google Play both require a live, unauthenticated
// privacy policy URL for app review.
export const metadata = {
  title: 'Privacy Policy — FoundingOS',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="complete-workspace-access">
      <section style={{ maxWidth: 720, textAlign: 'left' }}>
        <div className="complete-workspace-access-brand"><span>F</span><div><strong>FoundingOS</strong><small>Privacy Policy</small></div></div>
        <p className="eyebrow">Last updated 21 September 2026</p>
        <h1>Privacy Policy</h1>

        <p>
          FoundingOS ("we", "us") provides a business operating system covering sales,
          marketing, finance, workforce, logistics, health, and intelligence workspaces,
          accessible via our web app and mobile app. This policy explains what data we
          collect, why, and how it is handled.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>Account details: your name, email address, and password or access code.</li>
          <li>Business data you enter or import: orders, invoices, inventory, campaigns,
            candidates, patients, deliveries, and related records for the workspaces you use.</li>
          <li>Usage data: device type, app version, and basic diagnostic/crash information
            needed to keep the service reliable.</li>
          <li>Communications data: messages sent or received through connected channels
            (e.g. WhatsApp) when you enable those integrations.</li>
        </ul>

        <h2>What we do not collect</h2>
        <ul>
          <li>Government ID numbers.</li>
          <li>Payment card details (payments, where enabled, are processed by a
            third-party payment provider — we do not store card numbers).</li>
          <li>Sensitive biometric data.</li>
        </ul>

        <h2>How your data is used</h2>
        <p>
          Data you enter is used to operate the workspace features you use — for example,
          to show your invoices, calculate aging, render your marketing calendar, or track
          your hiring pipeline. We do not sell your data to third parties.
        </p>

        <h2>How your data is stored</h2>
        <p>
          Data is stored in our operational databases, scoped to your account, and
          transmitted over encrypted connections (HTTPS/TLS). Mobile app sessions
          authenticate against the same backend services as the web app.
        </p>

        <h2>Your choices</h2>
        <p>
          You can request a copy of your data or request deletion of your account and
          associated data at any time by contacting us at the address below.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions or data requests, contact us at{' '}
          <a href="mailto:privacy@foundingos.com">privacy@foundingos.com</a>.
        </p>
      </section>
    </main>
  )
}
