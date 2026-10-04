/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Public (excluded from the access gate in middleware.ts): Meta app review requires data deletion instructions.
export const metadata = {
  title: 'Delete your data — FoundingOS',
}

export default function DataDeletionPage() {
  return (
    <main className="complete-workspace-access">
      <section className="privacy-policy" style={{ maxWidth: 760, textAlign: 'left' }}>
        <div className="complete-workspace-access-brand"><span>F</span><div><strong>FoundingOS</strong><small>Data deletion</small></div></div>
        <p className="eyebrow">Last updated 4 October 2026</p>
        <h1>Delete your data</h1>

        <p>
          You can ask us to delete your FoundingOS account and the data connected to it at any time, including data
          received when you connected Facebook or WhatsApp.
        </p>

        <h2>Disconnect WhatsApp or Facebook</h2>
        <ol>
          <li>Sign in to FoundingOS and open <strong>Integrations → WhatsApp</strong>.</li>
          <li>Disconnect the number. FoundingOS stops sending and receiving messages for it immediately.</li>
          <li>You can also remove FoundingOS in Facebook under <strong>Settings → Business integrations</strong>, or
            in Meta Business Suite under <strong>Business settings → Integrations</strong>.</li>
        </ol>

        <h2>Delete your account and data</h2>
        <ol>
          <li>Email <a href="mailto:privacy@foundingos.com?subject=Delete%20my%20FoundingOS%20data">privacy@foundingos.com</a> from
            the address on your account, with the subject “Delete my FoundingOS data”.</li>
          <li>We confirm your identity and reply within one month.</li>
          <li>We delete your workspace data, stored WhatsApp messages, contacts and connection credentials. Records
            we must keep by law, such as billing records, are kept only as long as required.</li>
        </ol>

        <p>
          More detail is in our <a href="/privacy">Privacy &amp; Cookies policy</a>.
        </p>

        <p><small>© 2024–2026 FoundingOS. All rights reserved.</small></p>
      </section>
    </main>
  )
}
