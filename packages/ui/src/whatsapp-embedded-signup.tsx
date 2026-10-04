'use client'

import { useEffect, useRef, useState } from 'react'
import { productionRequest } from './workspace-production-client'

type SignupConfig = { enabled: boolean; appId: string | null; configId: string | null; graphVersion: string }
type SyncSummary = { contacts: { started: boolean; error: string | null } | null; history: { started: boolean; error: string | null } | null } | null
type ConnectResult = { phone: { displayPhoneNumber: string | null; verifiedName: string | null }; coexistence: boolean; sync: SyncSummary }
type SessionInfo = { event: string; wabaId?: string; phoneNumberId?: string; businessId?: string; detail?: string }

type FacebookSdk = {
  init: (options: Record<string, unknown>) => void
  login: (callback: (response: { authResponse?: { code?: string } | null }) => void, options: Record<string, unknown>) => void
}
declare global { interface Window { FB?: FacebookSdk; fbAsyncInit?: () => void } }

let sdkPromise: Promise<FacebookSdk> | null = null
function loadFacebookSdk(appId: string, version: string) {
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise<FacebookSdk>((resolve, reject) => {
    const ready = () => {
      window.FB!.init({ appId, autoLogAppEvents: true, xfbml: false, version })
      resolve(window.FB!)
    }
    if (window.FB) return ready()
    window.fbAsyncInit = ready
    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    script.onerror = () => { sdkPromise = null; reject(new Error('Facebook could not load. Allow connect.facebook.net or disable content blockers, then try again.')) }
    document.body.appendChild(script)
  })
  return sdkPromise
}

const parseSessionMessage = (event: MessageEvent): SessionInfo | null => {
  if (!/(^|\.)facebook\.com$/.test(new URL(event.origin).hostname)) return null
  try {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
    if (data?.type !== 'WA_EMBEDDED_SIGNUP') return null
    const info = data.data || {}
    return { event: String(data.event || ''), wabaId: info.waba_id, phoneNumberId: info.phone_number_id, businessId: info.business_id, detail: info.error_message || info.current_step }
  } catch { return null }
}

type Stage = 'idle' | 'meta' | 'connecting' | 'done' | 'error'

export function WhatsAppEmbeddedSignup({ onConnected }: { onConnected?: () => void }) {
  const [config, setConfig] = useState<SignupConfig | null>(null)
  const [stage, setStage] = useState<Stage>('idle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<ConnectResult | null>(null)
  const session = useRef<SessionInfo | null>(null)

  useEffect(() => {
    productionRequest<SignupConfig>('/messaging/whatsapp/embedded-signup/config').then(setConfig).catch(() => setConfig(null))
    const listener = (event: MessageEvent) => {
      const info = parseSessionMessage(event)
      if (info) session.current = info
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  if (!config?.enabled) return null

  async function waitForSession() {
    for (let i = 0; i < 25 && !session.current; i += 1) await new Promise((resolve) => setTimeout(resolve, 200))
    return session.current
  }

  async function finish(code: string) {
    setStage('connecting')
    const info = await waitForSession()
    if (info?.event === 'CANCEL') { setStage('error'); setMessage(info.detail ? `Meta stopped at: ${info.detail}. Start again when ready.` : 'Connection was cancelled. Start again when ready.'); return }
    try {
      const connected = await productionRequest<ConnectResult>('/messaging/whatsapp/embedded-signup', { method: 'POST', body: JSON.stringify({ code, event: info?.event, wabaId: info?.wabaId, phoneNumberId: info?.phoneNumberId, businessId: info?.businessId }) })
      setResult(connected)
      setStage('done')
      onConnected?.()
    } catch (cause) {
      setStage('error')
      setMessage(cause instanceof Error ? cause.message : 'Meta could not finish the connection. Start again.')
    }
  }

  async function start(coexistence: boolean) {
    setMessage('')
    setResult(null)
    session.current = null
    try {
      const FB = await loadFacebookSdk(config!.appId!, config!.graphVersion)
      setStage('meta')
      FB.login((response) => {
        const code = response.authResponse?.code
        if (code) void finish(code)
        else { setStage('idle'); setMessage('The Meta window was closed before finishing. Nothing was changed.') }
      }, {
        config_id: config!.configId,
        response_type: 'code',
        override_default_response_type: true,
        extras: { setup: {}, sessionInfoVersion: '3', ...(coexistence ? { featureType: 'whatsapp_business_app_onboarding' } : {}) },
      })
    } catch (cause) {
      setStage('error')
      setMessage(cause instanceof Error ? cause.message : 'Meta could not be opened.')
    }
  }

  async function retrySync() {
    try {
      const data = await productionRequest<{ sync: SyncSummary }>('/messaging/whatsapp/embedded-signup/sync', { method: 'POST', body: '{}' })
      setResult((current) => current ? { ...current, sync: data.sync } : current)
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Chat sync could not be retried.') }
  }

  const busy = stage === 'meta' || stage === 'connecting'
  const syncFailed = Boolean(result?.sync && (result.sync.contacts?.error || result.sync.history?.error))
  return <section className="whatsapp-quick-connect" aria-label="Connect WhatsApp with Meta">
    <div>
      <p className="whatsapp-quick-connect-eyebrow">Recommended · about 3 minutes</p>
      <h3>Connect WhatsApp with Meta</h3>
      <p>Sign in with Facebook, choose your business and number, and FoundingOS sets everything else up for you — no tokens or codes to copy.</p>
    </div>
    <div className="whatsapp-quick-connect-options">
      <article>
        <h4>Keep using the WhatsApp Business app</h4>
        <p>Use the same number on your phone and in FoundingOS. Your recent chats and contacts are copied in, and replies from either place appear in both.</p>
        <button className="retail-app-primary" type="button" disabled={busy} onClick={() => void start(true)}>{busy ? 'Connecting…' : 'Connect my WhatsApp Business app'}</button>
      </article>
      <article>
        <h4>Use a new or API-only number</h4>
        <p>For a number not already on WhatsApp, or one you will only use through FoundingOS. Meta will send a code to verify it.</p>
        <button className="retail-app-secondary" type="button" disabled={busy} onClick={() => void start(false)}>Connect a new number</button>
      </article>
    </div>
    <details>
      <summary>Before you start (Business app)</summary>
      <ul>
        <li>Update the WhatsApp Business app on your phone to the latest version.</li>
        <li>Keep the app open on your phone until FoundingOS says chats are syncing — Meta shows a QR code or prompt there to approve.</li>
        <li>Linked computers and tablets are unlinked once; link them again afterwards (Windows and Wear OS companions are not supported).</li>
        <li>Broadcast lists become read-only, and disappearing messages, view-once and live location are turned off. Group chats are not copied.</li>
        <li>Messages you send from the phone app stay free; messages sent through FoundingOS follow Meta’s conversation pricing.</li>
      </ul>
    </details>
    {stage === 'meta' ? <p role="status">Finish the steps in the Meta window. Keep this tab open.</p> : null}
    {stage === 'connecting' ? <p role="status">Connecting your number and setting up messages…</p> : null}
    {stage === 'done' && result ? <div role="status" className="whatsapp-quick-connect-done">
      <strong>Connected: {result.phone.verifiedName || 'WhatsApp'} {result.phone.displayPhoneNumber || ''}</strong>
      <p>{result.coexistence ? 'Your chats and contacts are syncing now; this can take a few minutes. Keep the WhatsApp Business app open on your phone. New messages appear in WhatsApp Inbox.' : 'Your number is ready. Send “Hello” to it from another phone, then open WhatsApp Inbox.'}</p>
      {syncFailed ? <button className="retail-app-secondary" type="button" onClick={() => void retrySync()}>Retry chat sync</button> : null}
    </div> : null}
    {message ? <p role="alert">{message}</p> : null}
  </section>
}
