'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { productionRequest } from './workspace-production-client'

type Message = { id: string; direction: string; messageType: string; body: string | null; status: string; createdAt: string }
type Conversation = { id: string; channel: string; participantAddress: string; lastMessageAt: string; latestMessage: Message | null }
type Thread = { id: string; participantAddress: string; messages: Message[] }

export function LiveWhatsAppInbox({ integrationsHref }: { integrationsHref: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState('')
  const [thread, setThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [draft, setDraft] = useState('')
  const [consent, setConsent] = useState(false)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const request = useRef<{ body: string; key: string } | null>(null)
  const selection = useRef('')

  async function refresh() {
    setError('')
    setLoading(true)
    try {
      const items = await productionRequest<Conversation[]>('/messaging/inbox')
      setConversations(items)
      const id = selection.current || items[0]?.id || ''
      if (id !== selection.current) {
        selection.current = id
        setSelected(id)
      }
      if (id) {
        const loaded = await productionRequest<Thread>(`/messaging/inbox/${encodeURIComponent(id)}`)
        if (selection.current === id) setThread(loaded)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Conversations could not be loaded.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { void refresh() }, [])

  async function select(id: string) {
    selection.current = id
    setSelected(id)
    setThread(null)
    setDraft('')
    setConsent(false)
    setNotice('')
    setError('')
    request.current = null
    try {
      const loaded = await productionRequest<Thread>(`/messaging/inbox/${encodeURIComponent(id)}`)
      if (selection.current === id) setThread(loaded)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Conversation could not be loaded.')
    }
  }

  async function send() {
    if (sending || !selected || !draft.trim() || !consent) return
    const body = draft.trim()
    if (!request.current || request.current.body !== body) request.current = { body, key: crypto.randomUUID() }
    setSending(true)
    setError('')
    setNotice('')
    try {
      const reply = await productionRequest<Message>(`/messaging/inbox/${encodeURIComponent(selected)}/replies`, {
        method: 'POST', headers: { 'Idempotency-Key': request.current.key }, body: JSON.stringify({ body, consent }),
      })
      setDraft('')
      request.current = null
      setNotice(['delivered', 'read'].includes(reply.status) ? `Reply ${reply.status}.` : 'Meta accepted your reply. Refresh to check delivery.')
      await refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Reply could not be sent.')
    } finally {
      setSending(false)
    }
  }
  const filtered = conversations.filter((item) => `${item.participantAddress} ${item.latestMessage?.body ?? ''}`.toLowerCase().includes(query.toLowerCase()))
  const latestInbound = thread?.messages.filter((item) => item.direction === 'inbound').at(-1)
  const canReply = Boolean(latestInbound && Date.now() - Date.parse(latestInbound.createdAt) < 24 * 60 * 60_000)
  return <>
    <header className="retail-app-heading"><div><p>Connected conversations</p><h1>WhatsApp Inbox</h1><p>Read real inbound messages and reply from the same workspace. Email and SMS threads are not available here yet.</p></div><button className="retail-app-secondary" disabled={loading || sending} onClick={() => void refresh()} type="button">{loading ? 'Refreshing…' : 'Refresh conversations'}</button></header>
    {error ? <div className="complete-workspace-error" role="alert">{error}</div> : null}
    {notice ? <p role="status">{notice}</p> : null}
    <div className="retail-app-inbox-layout">
      <div className="retail-app-inbox-folders"><h2>WhatsApp</h2><p>{conversations.length} conversations</p><Link className="retail-app-secondary" href={integrationsHref}>Connect your number</Link><p>Customers do not need staff access. Only authorised messaging participants can issue business commands.</p></div>
      <div className="retail-app-inbox-list"><input aria-label="Search conversations" className="retail-app-inbox-search" onChange={(event) => setQuery(event.target.value)} placeholder="Search number or message…" type="search" value={query} /><div className="retail-app-inbox-rows">
        {filtered.map((item) => <button disabled={sending} className={`retail-app-inbox-row${selected === item.id ? ' selected' : ''}`} key={item.id} onClick={() => void select(item.id)} type="button"><span className="retail-app-inbox-row-body"><b>{item.participantAddress}</b><span>{item.latestMessage?.body || `[${item.latestMessage?.messageType ?? 'message'}]`}</span><small>{new Date(item.lastMessageAt).toLocaleString()}</small></span></button>)}
        {!loading && !filtered.length ? <div className="retail-app-board-empty"><h2>Your first conversation starts here</h2><p>Connect your number, verify the webhook, then send a message from your own opted-in test phone. Select Refresh conversations to see it.</p><Link href={integrationsHref}>Open WhatsApp setup</Link></div> : null}
      </div></div>
      <div className="retail-app-inbox-thread">{thread ? <>
        <div className="retail-app-inbox-thread-head"><h2>{thread.participantAddress}</h2><span>WhatsApp</span></div>
        <div className="retail-app-inbox-thread-body">{thread.messages.map((message) => <article className="retail-app-panel" key={message.id}><small>{message.direction === 'inbound' ? 'Contact' : 'Your business'} · {new Date(message.createdAt).toLocaleString()}</small><p style={{ whiteSpace: 'pre-wrap' }}>{message.body || `[${message.messageType} message]`}</p><span>{message.direction === 'outbound' && message.status === 'sent' ? 'Accepted by Meta - delivery pending' : message.status}</span></article>)}</div>
        <div className="retail-app-inbox-reply">
          {!canReply ? <p>The 24-hour reply window is closed. Ask this contact to message again or send an approved template through your template workflow.</p> : null}
          <textarea aria-label="Reply message" disabled={sending || !canReply} maxLength={4096} onChange={(event) => setDraft(event.target.value)} placeholder="Write your reply…" rows={3} value={draft} />
          <label><input checked={consent} disabled={sending} onChange={(event) => setConsent(event.target.checked)} type="checkbox" /> This contact has opted in to messages from my business.</label>
          <button className="retail-app-primary" disabled={sending || !canReply || !consent || !draft.trim()} onClick={() => void send()} type="button">{sending ? 'Sending…' : 'Send WhatsApp reply'}</button>
        </div>
      </> : <p className="retail-app-board-empty">{loading ? 'Loading conversations…' : 'Select a conversation to read and reply.'}</p>}</div>
    </div>
  </>
}
