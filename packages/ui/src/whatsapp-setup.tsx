'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { productionRequest } from './workspace-production-client'
import { WhatsAppEmbeddedSignup } from './whatsapp-embedded-signup'

type Diagnostics = {
  credentials: { status: string; lastCheckedAt: string | null; lastError: string | null } | null
  webhookVerifiedAt: string | null; lastInboundAt: string | null
  lastAcceptedReplyAt: string | null; lastDeliveredReplyAt: string | null; failedRepliesLast24Hours: number
}

export function WhatsAppSetup({ simulation, webhookUrl }: { simulation: boolean; webhookUrl?: string }) {
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  async function refresh() {
    setLoading(true)
    setError('')
    try { setDiagnostics(await productionRequest<Diagnostics>('/messaging/whatsapp-diagnostics')) } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Connection checks could not be loaded.')
    } finally { setLoading(false) }
  }
  useEffect(() => { if (!simulation) void refresh() }, [simulation])
  async function copyCallback() {
    if (!webhookUrl) return
    try { await navigator.clipboard.writeText(webhookUrl); setCopied(true) } catch {
      setError('Copy was unavailable. Select the callback URL and copy it manually.')
    }
  }
  return <section id="whatsapp-setup" className="retail-app-panel whatsapp-setup" aria-label="WhatsApp setup guide">
    <div className="retail-app-panel-heading"><div><p>WhatsApp setup guide</p><h2>Connect your business number, step by step</h2></div><span>{simulation ? 'Demo only - no messages sent' : 'Owner setup'}</span></div>
    <p>You configure this once. After that, customer messages appear in WhatsApp Inbox and you can reply without switching apps. Have your Meta business account and business phone ready.</p>
    {simulation ? null : <WhatsAppEmbeddedSignup onConnected={() => void refresh()} />}
    <h3 className="whatsapp-manual-heading">Set up manually with your own Meta app</h3>
    <ol>
      <li><strong>Open Meta and prepare your number.</strong> In <a className="text-link" href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer">Meta for Developers</a>, open your business app. For a new app choose the “Connect with customers through WhatsApp” use case, select your business portfolio, then open Customize use case → Connect on WhatsApp → Quickstart → Start using the API. Older apps may show WhatsApp → API Setup instead. You need a WhatsApp Business Account and a Cloud API phone number. Start with Meta’s test number if you are learning; add and verify your real business number for launch. Check number eligibility or migration/coexistence with Meta before changing an existing WhatsApp number. <a className="text-link" href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" target="_blank" rel="noreferrer">Official Meta setup instructions</a>.</li>
      <li><strong>Find the four credentials.</strong> In your Meta app, WhatsApp → API Setup shows the Access token and Phone number ID (not your displayed phone number or WhatsApp Business Account ID). App settings → Basic shows the App secret. Choose a long random Verify token; this is your own shared value, not the access token. Temporary access tokens expire; for production, follow Meta’s system-user token process with the required WhatsApp permissions and business assets. Never share tokens or secrets in chat.</li>
      <li><strong>Save in FoundingOS.</strong> Scroll to WhatsApp Cloud API below, select Configure, paste the four values and select Save and check. Business Account ID is optional. “Credentials verified” means Meta accepted the phone/token check; it is not proof of delivery. If Meta rejects the check, correct the permission, number ID or expired token shown in the error.</li>
      <li><strong>Verify the callback in Meta.</strong> In WhatsApp → Configuration, edit the webhook. Paste your Company callback URL below and the exact same Verify token you saved here. Select Verify and save, then subscribe to the <code>messages</code> webhook field. Keep your App secret correct so signed incoming requests can be accepted.</li>
    </ol>
    <details><summary>Production access token: exact steps</summary><p>Open <a className="text-link" href="https://business.facebook.com/latest/settings" target="_blank" rel="noreferrer">Meta Business Settings</a> → System users → Add. Select the system user → Assign assets: give access to your app and WhatsApp Business account. Select Generate token for the correct app. Meta’s current guide lists <code>business_management</code>, <code>whatsapp_business_messaging</code> and <code>whatsapp_business_management</code>. Choose an appropriate expiry where available and store the token securely. Account verification and app review requirements vary by rollout; follow the publishing requirements Meta displays.</p></details>
    {webhookUrl ? <div><label>Company callback URL<input aria-label="Company callback URL" readOnly value={webhookUrl} onFocus={(event) => event.target.select()} /></label><button className="retail-app-secondary" onClick={() => void copyCallback()} type="button">{copied ? 'Callback copied' : 'Copy callback URL'}</button></div> : <p>{simulation ? 'The live account provides your company-specific callback URL. Demo connections are simulated.' : 'Sign in with your company owner account to view the company-specific callback URL.'}</p>}
    <ol start={5}>
      <li><strong>Start your first conversation.</strong> From your own opted-in test phone, send “Hello” to the configured business number. For Meta’s test number, first add and verify your recipient in API Setup. Open <Link className="text-link" href="/app/retail/inbox">WhatsApp Inbox</Link> and select Refresh conversations. Open the incoming message; customer contacts do not need a staff account.</li>
      <li><strong>Send a reply.</strong> Write a reply in Inbox, confirm the contact has opted in and select Send WhatsApp reply. “Accepted by Meta” is not delivered yet: refresh the conversation until Meta reports delivered or read. Free-text replies need a customer message within the last 24 hours; outside that window an approved template is required. Meta’s customer-service window, template rules and messaging charges apply.</li>
    </ol>
    {!simulation ? <div aria-label="WhatsApp connection checks"><div className="retail-app-panel-heading"><h3>Your connection checks</h3><button className="retail-app-secondary" disabled={loading} onClick={() => void refresh()} type="button">{loading ? 'Checking…' : 'Refresh connection checks'}</button></div>
      <ul>
        <li>Credentials: {diagnostics ? diagnostics.credentials?.status === 'ready' ? 'Verified by Meta' : 'Save and check required' : 'Not checked yet'}</li>
        <li>Webhook callback: {diagnostics?.webhookVerifiedAt ? `Verified ${new Date(diagnostics.webhookVerifiedAt).toLocaleString()}` : 'Awaiting Meta verification'}</li>
        <li>Incoming message: {diagnostics?.lastInboundAt ? `Received ${new Date(diagnostics.lastInboundAt).toLocaleString()}` : 'Send your first test message'}</li>
        <li>Reply accepted: {diagnostics?.lastAcceptedReplyAt ? 'Meta accepted a reply' : 'Reply from Inbox after your test message'}</li>
        <li>Reply delivered: {diagnostics?.lastDeliveredReplyAt ? 'Delivery confirmed by Meta' : 'Awaiting delivery confirmation'}</li>
      </ul>
      {diagnostics?.credentials?.lastError ? <p role="alert">{diagnostics.credentials.lastError}</p> : null}
      {diagnostics?.failedRepliesLast24Hours ? <p role="alert">{diagnostics.failedRepliesLast24Hours} failed replies in the last 24 hours. Open Inbox to inspect message status.</p> : null}
    </div> : null}
    {error ? <div className="complete-workspace-error" role="alert">{error}</div> : null}
    <details><summary>Troubleshooting and safe launch</summary><p>No incoming message? Confirm you subscribed to messages, callback verification passed, Phone number ID matches API Setup and App secret matches the Meta app. Test-number recipients must be verified in Meta. Token rejected? Check expiry, assigned business assets and permissions. Reply failed? Check the 24-hour window, contact opt-in and Meta account restrictions. Connection checks show stored evidence, not a guarantee of future delivery.</p><p>This is guided Cloud API setup, not one-click Meta embedded signup. Meta labels may vary by account. Need help? <a className="text-link" href="mailto:hello@foundingos.com?subject=WhatsApp%20setup%20help">Request setup assistance</a> (do not include tokens or secrets).</p></details>
  </section>
}
