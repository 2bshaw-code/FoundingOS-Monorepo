import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { seal } from '../../../superdashboard/gmail-data'
import { cookieOptions, failure, gmailConfig, GmailError, GMAIL_SCOPE, requireFounder, STATE_COOKIE } from '../../../superdashboard/gmail.server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const ownerId = await requireFounder()
    const config = gmailConfig()
    if (new URL(request.url).origin !== config.origin) throw new GmailError('Open SuperDash on the configured console domain before connecting Gmail.', 400)
    const state = randomBytes(32).toString('base64url')
    const verifier = randomBytes(32).toString('base64url')
    cookies().set(STATE_COOKIE, seal({ ownerId, state, verifier, expiresAt: Date.now() + 600000 }, config.key), cookieOptions(600))
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: GMAIL_SCOPE,
      access_type: 'online',
      prompt: 'select_account consent',
      state,
      code_challenge: createHash('sha256').update(verifier).digest('base64url'),
      code_challenge_method: 'S256',
    })
    const response = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
    response.headers.set('Cache-Control', 'no-store')
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  } catch (error) { return failure(error) }
}
