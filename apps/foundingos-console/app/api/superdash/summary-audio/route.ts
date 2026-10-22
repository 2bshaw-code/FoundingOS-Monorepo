/*
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../lib/session-auth'

export const runtime = 'nodejs'

const MAX_REQUEST_BYTES = 8_000
const MAX_TEXT_LENGTH = 1_800
const MODEL_ID = 'eleven_multilingual_v2'

async function readRequestBody(request: NextRequest): Promise<string | null> {
  const reader = request.body?.getReader()
  if (!reader) return ''

  const chunks: Uint8Array[] = []
  let byteLength = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      byteLength += value.byteLength
      if (byteLength > MAX_REQUEST_BYTES) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const bytes = new Uint8Array(byteLength)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}

export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID
  if (!apiKey || !voiceId) {
    return NextResponse.json({ error: 'Spoken summaries are not configured on this server.' }, { status: 503 })
  }

  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'The summary is too long to generate audio.' }, { status: 413 })
  }
  const rawBody = await readRequestBody(request)
  if (rawBody === null) {
    return NextResponse.json({ error: 'The summary is too long to generate audio.' }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Send a valid JSON request.' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null || !('text' in body) || typeof body.text !== 'string') {
    return NextResponse.json({ error: 'A summary text value is required.' }, { status: 400 })
  }

  const text = body.text.trim()
  if (!text) return NextResponse.json({ error: 'There is no summary text to read.' }, { status: 400 })
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: 'The summary is too long to generate audio.' }, { status: 413 })
  }

  let providerResponse: Response
  try {
    providerResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.8,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    })
  } catch {
    return NextResponse.json({ error: 'The voice service is unavailable. Please try again.' }, { status: 502 })
  }

  if (!providerResponse.ok) {
    return NextResponse.json({ error: 'Could not generate the spoken summary. Please try again.' }, { status: 502 })
  }

  let audio: ArrayBuffer
  try {
    audio = await providerResponse.arrayBuffer()
  } catch {
    return NextResponse.json({ error: 'The voice service returned an unreadable audio response.' }, { status: 502 })
  }
  if (audio.byteLength === 0) {
    return NextResponse.json({ error: 'The voice service returned empty audio.' }, { status: 502 })
  }

  return new Response(audio, {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': 'inline; filename="foundingos-briefing.mp3"',
      'Content-Type': 'audio/mpeg',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
