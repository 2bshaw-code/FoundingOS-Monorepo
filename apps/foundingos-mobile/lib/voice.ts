/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { File, Paths } from 'expo-file-system'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'
import { authedFetch } from './api'

export async function createSpokenSummary(text: string, signal?: AbortSignal): Promise<File> {
  if (IS_DEMO_MODE) throw new Error('Spoken summaries are unavailable in demo mode.')

  const response = await authedFetch('https://console.foundingos.com/api/superdash/summary-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    signal,
  })

  if (!response.ok) {
    let message = 'Could not generate spoken audio. Please try again.'
    try {
      const data: unknown = await response.json()
      if (typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string') {
        message = data.error
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error
    }
    throw new Error(message)
  }

  if (response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'audio/mpeg') {
    throw new Error('The voice service returned an unexpected response.')
  }

  const audio = new Uint8Array(await response.arrayBuffer())
  if (audio.length === 0) throw new Error('The voice service returned empty audio.')

  const file = new File(Paths.cache, `foundingos-briefing-${Date.now()}.mp3`)
  file.write(audio)
  if (signal?.aborted) {
    file.delete()
    throw new Error('Audio generation was cancelled.')
  }
  return file
}
