import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { object, unseal } from '../../../superdashboard/gmail-data'
import { cookieOptions, failure, gmailConfig, gmailGet, GmailError, GMAIL_SCOPE, googleJson, requireFounder, saveConnection, STATE_COOKIE } from '../../../superdashboard/gmail.server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const ownerId = await requireFounder()
    const config = gmailConfig()
    const params = new URL(request.url).searchParams
    const stored = cookies().get(STATE_COOKIE)?.value
    cookies().set(STATE_COOKIE, '', cookieOptions(0))
    let state: Record<string, unknown>
    try { state = object(unseal(stored ?? '', config.key)) } catch { throw new GmailError('The Gmail sign-in has expired. Please start again.') }
    if (state.ownerId !== ownerId || state.state !== params.get('state') || typeof state.verifier !== 'string' || typeof state.expiresAt !== 'number' || state.expiresAt < Date.now()) {
      throw new GmailError('The Gmail sign-in could not be verified. Please start again.')
    }
    if (params.has('error')) throw new GmailError('Gmail access was not granted. You can return to SuperDash and try again.')
    const code = params.get('code')
    if (!code) throw new GmailError('Google did not provide a sign-in code. Please try again.')
    const token = await googleJson('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.redirectUri, code, code_verifier: state.verifier, grant_type: 'authorization_code' }),
    })
    if (typeof token.access_token !== 'string' || typeof token.expires_in !== 'number' || token.expires_in <= 0 || typeof token.scope !== 'string' || !token.scope.split(' ').includes(GMAIL_SCOPE)) {
      throw new GmailError('Read-only Gmail permission is needed to import an invoice.')
    }
    const profile = await gmailGet(token.access_token, 'profile')
    if (typeof profile.emailAddress !== 'string') throw new GmailError('Google did not identify the Gmail account.', 502)
    saveConnection(ownerId, token.access_token, profile.emailAddress, token.expires_in)
    const response = NextResponse.redirect(new URL('/superdashboard#building-expenses', config.origin))
    response.headers.set('Cache-Control', 'no-store')
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  } catch (error) {
    let origin: string
    try { origin = gmailConfig().origin } catch { return failure(error) }
    if (!(error instanceof GmailError)) console.error('[gmail-callback] Sign-in failed', error instanceof Error ? error.name : 'Unknown error')
    const url = new URL('/superdashboard', origin)
    url.searchParams.set('gmailError', error instanceof GmailError ? error.message : 'Gmail sign-in could not be completed. Please try again.')
    url.hash = 'building-expenses'
    const response = NextResponse.redirect(url)
    response.headers.set('Cache-Control', 'no-store')
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  }
}
