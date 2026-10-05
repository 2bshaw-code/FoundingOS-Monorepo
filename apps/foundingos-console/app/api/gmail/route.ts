import { cookies } from 'next/headers'
import { emailContent, object, readPart } from '../../superdashboard/gmail-data'
import { checkOrigin, connection, cookieOptions, failure, gmailConfig, gmailGet, GMAIL_COOKIE, GmailError, privateJson, requireFounder, STATE_COOKIE } from '../../superdashboard/gmail.server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function header(payload: Record<string, unknown>, name: string) {
  if (!Array.isArray(payload.headers)) return ''
  for (const value of payload.headers) {
    const item = object(value)
    if (typeof item.name === 'string' && item.name.toLowerCase() === name.toLowerCase() && typeof item.value === 'string') return item.value
  }
  return ''
}

function messageId(params: URLSearchParams) {
  const id = params.get('id') ?? ''
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw new GmailError('Choose a valid email.')
  return id
}

export async function GET(request: Request) {
  try {
    const ownerId = await requireFounder()
    const params = new URL(request.url).searchParams
    const action = params.get('action') ?? 'status'
    if (action === 'status') {
      gmailConfig()
      if (!cookies().get(GMAIL_COOKIE)?.value) return privateJson({ connected: false })
      return privateJson({ connected: true, email: connection(ownerId).email })
    }
    const { token } = connection(ownerId)
    if (action === 'messages') {
      const query = params.get('q')?.trim() || 'invoice OR receipt'
      if (query.length > 300) throw new GmailError('Please use a shorter search.')
      const search = new URLSearchParams({ q: query, maxResults: '10' })
      const pageToken = params.get('page')
      if (pageToken) {
        if (pageToken.length > 1000) throw new GmailError('Invalid page.')
        search.set('pageToken', pageToken)
      }
      const data = await gmailGet(token, `messages?${search}`)
      if (data.messages !== undefined && !Array.isArray(data.messages)) throw new GmailError('Google returned an unreadable message list.', 502)
      const messages = await Promise.all((Array.isArray(data.messages) ? data.messages : []).slice(0, 10).map(async (value) => {
        const item = object(value)
        if (typeof item.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(item.id)) throw new GmailError('Google returned an invalid message.', 502)
        const mail = await gmailGet(token, `messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`)
        const payload = object(mail.payload)
        return { id: item.id, subject: header(payload, 'Subject'), from: header(payload, 'From'), date: header(payload, 'Date') }
      }))
      return privateJson({ messages, nextPage: typeof data.nextPageToken === 'string' ? data.nextPageToken : null })
    }
    if (action === 'message' || action === 'attachment') {
      const id = messageId(params)
      const mail = await gmailGet(token, `messages/${id}?format=full`)
      const payload = object(mail.payload)
      const content = emailContent(readPart(payload))
      if (action === 'message') return privateJson({
        id, subject: header(payload, 'Subject'), from: header(payload, 'From'), date: header(payload, 'Date'), ...content,
      })
      const attachment = content.attachments.find((item) => item.id === params.get('attachment'))
      if (!attachment) throw new GmailError('This attachment was not found.', 404)
      if (attachment.size > 10 * 1024 * 1024) throw new GmailError('This attachment is larger than 10 MB. Please open it in Gmail.', 413)
      const data = await gmailGet(token, `messages/${id}/attachments/${encodeURIComponent(attachment.id)}`)
      if (typeof data.data !== 'string' || data.data.length > 14 * 1024 * 1024) throw new GmailError('The attachment is unreadable or too large.', 413)
      const bytes = Buffer.from(data.data, 'base64url')
      if (bytes.length > 10 * 1024 * 1024) throw new GmailError('The attachment is too large.', 413)
      return new Response(bytes, { headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="invoice-attachment"; filename*=UTF-8''${encodeURIComponent(attachment.filename).replace(/'/g, '%27')}`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "sandbox; default-src 'none'",
      } })
    }
    throw new GmailError('Unknown Gmail action.')
  } catch (error) { return failure(error) }
}

export async function POST(request: Request) {
  try {
    const ownerId = await requireFounder()
    checkOrigin(request)
    let token: string | null = null
    try { token = connection(ownerId).token } catch (error) {
      if (!(error instanceof GmailError) || error.status !== 401) throw error
    }
    let revoked = false
    try {
      if (!token) throw new GmailError('No active connection.', 401)
      const response = await fetch('https://oauth2.googleapis.com/revoke', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ token }), signal: AbortSignal.timeout(15000),
      })
      revoked = response.ok
    } catch { revoked = false }
    cookies().set(GMAIL_COOKIE, '', cookieOptions(0))
    cookies().set(STATE_COOKIE, '', cookieOptions(0))
    return privateJson({ disconnected: true, warning: revoked ? null : 'Disconnected here, but Google could not confirm removal of access. Remove FoundingOS access in your Google Account permissions too.' })
  } catch (error) { return failure(error) }
}
