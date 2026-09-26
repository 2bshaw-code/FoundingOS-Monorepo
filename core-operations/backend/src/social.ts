/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real social publishing for FoundAI: posts approved content to the tenant's own Facebook Page,
// Instagram professional account (Meta Graph API) or LinkedIn page/profile (LinkedIn Posts API).
// A record only becomes "Published" once the network returns a post id.
import { prisma } from './auth.js'
import { getIntegrationCredentials } from './platform.js'
import { OutboundBlocked } from './outbound.js'

export type SocialChannel = 'facebook' | 'instagram' | 'linkedin'
export type SocialResult = { channel: SocialChannel; providerId: string; url: string | null; text: string }

const GRAPH = 'https://graph.facebook.com/v22.0'
const text = (value: unknown) => String(value ?? '').trim()
const label: Record<SocialChannel, string> = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn' }

export function socialChannelOf(data: Record<string, unknown>): SocialChannel | 'unsupported' | null {
  const raw = `${text(data.channel)} ${text(data.secondary)}`.toLowerCase()
  if (raw.includes('instagram')) return 'instagram'
  if (raw.includes('facebook')) return 'facebook'
  if (raw.includes('linkedin')) return 'linkedin'
  if (/tiktok|email|whatsapp|blog/.test(raw)) return 'unsupported'
  return null
}

// Post text: explicit postText, otherwise headline + the body part of "Type · Channel · body".
export function socialTextOf(name: string, data: Record<string, unknown>) {
  const explicit = text(data.postText)
  if (explicit) return explicit
  const parts = text(data.secondary).split(' \u00b7 ')
  const body = parts.length > 1 ? parts.slice(parts.length >= 3 && socialChannelOf({ channel: parts[1] }) ? 2 : 1).join(' \u00b7 ') : parts[0]
  return [name, body].filter(Boolean).join('\n\n').slice(0, 2_900)
}

async function connected(tenantId: string, provider: 'meta' | 'linkedin') {
  const record = await prisma.integrationCredential.findUnique({ where: { tenantId_provider: { tenantId, provider } }, select: { status: true } })
  return Boolean(record && ['configured', 'ready'].includes(record.status))
}

async function graph<T>(path: string, body: Record<string, string>) {
  const response = await fetch(`${GRAPH}/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(30_000) })
  const payload = await response.json().catch(() => null) as (T & { error?: { message?: string } }) | null
  if (!response.ok || !payload) throw new Error(payload?.error?.message || `Meta returned HTTP ${response.status}`)
  return payload
}

async function graphPhotoUpload(pageId: string, token: string, dataUrl: string, caption: string) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl)
  if (!match) throw new Error('Image is not a valid upload')
  const form = new FormData()
  form.append('source', new Blob([Buffer.from(match[2], 'base64')], { type: match[1] }), 'post-image')
  form.append('caption', caption)
  form.append('access_token', token)
  const response = await fetch(`${GRAPH}/${encodeURIComponent(pageId)}/photos`, { method: 'POST', body: form, signal: AbortSignal.timeout(60_000) })
  const payload = await response.json().catch(() => null) as { id?: string; post_id?: string; error?: { message?: string } } | null
  if (!response.ok || !payload?.id) throw new Error(payload?.error?.message || `Meta returned HTTP ${response.status}`)
  return payload.post_id || payload.id
}

async function publishFacebook(credentials: Record<string, unknown>, message: string, image: string) {
  const pageId = text(credentials.pageId)
  const token = text(credentials.pageAccessToken)
  if (image.startsWith('data:')) {
    const id = await graphPhotoUpload(pageId, token, image, message)
    return { providerId: id, url: `https://www.facebook.com/${id}` }
  }
  const result = image
    ? await graph<{ id?: string; post_id?: string }>(`${encodeURIComponent(pageId)}/photos`, { url: image, caption: message, access_token: token })
    : await graph<{ id?: string }>(`${encodeURIComponent(pageId)}/feed`, { message, access_token: token })
  const id = text((result as { post_id?: string }).post_id || result.id)
  return { providerId: id, url: id ? `https://www.facebook.com/${id}` : null }
}

async function publishInstagram(credentials: Record<string, unknown>, caption: string, image: string) {
  const account = text(credentials.instagramAccountId)
  const token = text(credentials.pageAccessToken)
  if (!account) throw new OutboundBlocked('Add your Instagram account ID to the Meta connection in Integrations so FoundAI can post to Instagram')
  // Instagram's API only accepts images it can fetch from a public URL.
  if (!/^https:\/\//.test(image)) throw new OutboundBlocked('Instagram posts need an image — attach one hosted at a public https:// link (uploaded files can go to Facebook, not Instagram)')
  const container = await graph<{ id?: string }>(`${encodeURIComponent(account)}/media`, { image_url: image, caption, access_token: token })
  if (!container.id) throw new Error('Instagram did not accept the image')
  const published = await graph<{ id?: string }>(`${encodeURIComponent(account)}/media_publish`, { creation_id: container.id, access_token: token })
  return { providerId: text(published.id), url: null }
}

async function publishLinkedIn(credentials: Record<string, unknown>, commentary: string) {
  const author = text(credentials.authorUrn)
  if (!/^urn:li:(organization|person):/.test(author)) throw new OutboundBlocked('LinkedIn author must look like urn:li:organization:123 or urn:li:person:abc — update it in Integrations')
  const response = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${text(credentials.accessToken)}`, 'Content-Type': 'application/json', 'LinkedIn-Version': text(credentials.apiVersion) || '202506', 'X-Restli-Protocol-Version': '2.0.0' },
    body: JSON.stringify({ author, commentary: commentary.replace(/([\\|{}@[\]()<>#*_~])/g, '\\$1'), visibility: 'PUBLIC', distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] }, lifecycleState: 'PUBLISHED', isReshareDisabledByAuthor: false }),
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(payload?.message || `LinkedIn returned HTTP ${response.status}`)
  }
  const id = response.headers.get('x-restli-id') || response.headers.get('x-linkedin-id') || ''
  return { providerId: id, url: id ? `https://www.linkedin.com/feed/update/${id}` : null }
}

// Throws OutboundBlocked when a human needs to connect/fix something; returns only when the network accepted the post.
export async function publishSocial(tenantId: string, record: { name: string; data: Record<string, unknown> }, override?: SocialChannel): Promise<SocialResult> {
  const detected = override ?? socialChannelOf(record.data)
  if (detected === 'unsupported') throw new OutboundBlocked('FoundAI can publish to Facebook, Instagram and LinkedIn. Post this one yourself (use Copy), then mark it Published')
  if (!detected) throw new OutboundBlocked(`Say which channel "${record.name}" is for (Facebook, Instagram or LinkedIn) so FoundAI can publish it`)
  const channel = detected
  const provider = channel === 'linkedin' ? 'linkedin' : 'meta'
  if (!(await connected(tenantId, provider))) throw new OutboundBlocked(`Connect ${channel === 'linkedin' ? 'LinkedIn' : 'Facebook & Instagram (Meta)'} in Integrations so FoundAI can publish to ${label[channel]}`)
  const credentials = await getIntegrationCredentials(tenantId, provider)
  const message = socialTextOf(record.name, record.data)
  const image = text(record.data.attachment || record.data.imageUrl)
  const result = channel === 'facebook' ? await publishFacebook(credentials, message, image)
    : channel === 'instagram' ? await publishInstagram(credentials, message, image)
      : await publishLinkedIn(credentials, message)
  if (!result.providerId) throw new Error(`${label[channel]} did not return a post id`)
  return { channel, ...result, text: message }
}
