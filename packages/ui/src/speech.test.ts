import assert from 'node:assert/strict'
import test from 'node:test'
import { speak } from './speech'

test('bot speech honours selected device voice and rate, and surfaces failures', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const originalUtterance = Object.getOwnPropertyDescriptor(globalThis, 'SpeechSynthesisUtterance')
  const selectedVoice = { voiceURI: 'test-voice', lang: 'en-GB', name: 'Test voice' }
  class Utterance {
    rate = 1
    voice: unknown = null
    lang = ''
    onerror?: (event: { error: string }) => void
    constructor(public text: string) {}
  }
  const calls: Utterance[] = []
  let throws = false
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { speechSynthesis: {
    getVoices: () => [selectedVoice],
    cancel: () => {},
    speak: (utterance: Utterance) => { if (throws) throw new Error('Device unavailable'); calls.push(utterance) },
  } } })
  Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', { configurable: true, value: Utterance })
  try {
    let error = ''
    const onError = (message: string) => { error = message }
    speak('Hello Buddy', { voiceURI: 'test-voice', rate: 0.8, onError })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].rate, 0.8)
    assert.equal(calls[0].voice, selectedVoice)
    assert.equal(calls[0].lang, 'en-GB')
    calls[0].onerror?.({ error: 'interrupted' })
    assert.equal(error, '')
    calls[0].onerror?.({ error: 'network' })
    assert.match(error, /playback failed \(network\)/)
    error = ''
    speak('Not spoken', { voiceURI: 'missing-voice', onError })
    assert.equal(calls.length, 1)
    assert.match(error, /unavailable/)
    throws = true
    speak('Failure', { voiceURI: 'test-voice', onError })
    assert.match(error, /could not start.*Device unavailable/)
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
    speak('Unsupported', { onError })
    assert.match(error, /not supported/)
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
    else Reflect.deleteProperty(globalThis, 'window')
    if (originalUtterance) Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', originalUtterance)
    else Reflect.deleteProperty(globalThis, 'SpeechSynthesisUtterance')
  }
})
