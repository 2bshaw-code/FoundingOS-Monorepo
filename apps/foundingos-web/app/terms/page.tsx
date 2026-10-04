/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Public (excluded from the access gate in middleware.ts): Meta app review requires a live terms URL.
export const metadata = {
  title: 'Terms of Service — FoundingOS',
}

export default function TermsPage() {
  return (
    <main className="complete-workspace-access">
      <section className="privacy-policy" style={{ maxWidth: 760, textAlign: 'left' }}>
        <div className="complete-workspace-access-brand"><span>F</span><div><strong>FoundingOS</strong><small>Terms of Service</small></div></div>
        <p className="eyebrow">Last updated 4 October 2026</p>
        <h1>Terms of Service</h1>

        <p>
          These terms apply when you or your company use FoundingOS — Core.Operations, Core.Workforce and
          Core.Intelligence — through our website, web app, desktop app or mobile app. By creating an account or
          using FoundingOS you agree to them on behalf of yourself and the company you represent.
        </p>

        <h2>Your account</h2>
        <ul>
          <li>Keep your sign-in details secure and tell us promptly about any unauthorised use.</li>
          <li>Account owners decide who can access their workspace and are responsible for their team&apos;s use.</li>
          <li>You must provide accurate information and be authorised to act for your company.</li>
        </ul>

        <h2>Plans and payment</h2>
        <p>
          Lite accounts are free. Paid plans and add-ons are billed in advance through Stripe and activate once
          payment is confirmed. You can cancel at any time; access continues until the end of the paid period.
        </p>

        <h2>Your data</h2>
        <p>
          You keep ownership of the business records you put into FoundingOS. We process them only to provide the
          service, as described in our <a href="/privacy">Privacy &amp; Cookies policy</a>. You can export your
          data or ask us to <a href="/data-deletion">delete it</a>.
        </p>

        <h2>Connected services</h2>
        <p>
          When you connect WhatsApp or other third-party services, you also agree to their terms, including the
          WhatsApp Business terms and Meta&apos;s messaging policies. You are responsible for having your customers&apos;
          consent before messaging them. Messaging charges set by Meta apply to messages sent through FoundingOS.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Do not send spam or unlawful, misleading or harmful content.</li>
          <li>Do not try to access other companies&apos; data, disrupt the service or reverse-engineer it.</li>
          <li>We may suspend accounts that break these rules or put other customers at risk.</li>
        </ul>

        <h2>FoundAI</h2>
        <p>
          AI suggestions can be wrong. Review important answers and actions before relying on them.
        </p>

        <h2>Service and liability</h2>
        <p>
          We work to keep FoundingOS available and secure but cannot promise it will be uninterrupted or error-free.
          To the extent the law allows, our total liability is limited to the fees you paid in the twelve months
          before the claim, and we are not liable for indirect or consequential loss. Nothing in these terms limits
          liability that cannot be limited by law.
        </p>

        <h2>Changes and law</h2>
        <p>
          We may update these terms and will tell account owners about significant changes. These terms are
          governed by the laws of England and Wales.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms: <a href="mailto:info@wros.co.uk">info@wros.co.uk</a>.
        </p>

        <p><small>© 2024–2026 FoundingOS. All rights reserved.</small></p>
      </section>
    </main>
  )
}
