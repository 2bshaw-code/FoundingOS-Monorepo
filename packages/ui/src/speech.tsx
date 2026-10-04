/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'
// Built-in device speech; some installed voices use the device provider's online service.
// Replies are only read aloud when someone taps a speaker button or turns on "Speak replies".
import { useEffect, useState } from 'react'
import { BOT_VOICE_PROFILES, matchedBotVoice } from './bot-voice'
import type { BotPreferences } from './foundai-preferences'

const AUTO_KEY = 'foundingos-foundai-speak'
let cachedVoice: SpeechSynthesisVoice | null = null
let speakingText = ''
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const speechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window

function bestVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  const english = voices.filter((voice) => /^en-GB/i.test(voice.lang))
  const pool = english.length ? english : voices.filter((voice) => /^en/i.test(voice.lang)).length ? voices.filter((voice) => /^en/i.test(voice.lang)) : voices
  cachedVoice = pool.find((voice) => /natural|enhanced|premium/i.test(voice.name)) ?? pool.find((voice) => /google|online/i.test(voice.name)) ?? pool[0]
  return cachedVoice
}
if (speechSupported()) window.speechSynthesis.addEventListener?.('voiceschanged', () => { cachedVoice = null })

// Strip symbols that sound odd when read out.
const spoken = (text: string) => text.replace(/[→•✦✓#*_`>]/g, ' ').replace(/\s+/g, ' ').trim()

export function stopSpeaking() {
  if (!speechSupported()) return
  window.speechSynthesis.cancel()
  speakingText = ''
  notify()
}

export type SpeechOptions = { voiceURI?: string; rate?: number; character?: BotPreferences['character']; onError?: (message: string) => void }

export function speak(text: string, options: SpeechOptions = {}) {
  if (!speechSupported()) { options.onError?.('Speech is not supported on this device.'); return }
  if (!text.trim()) return
  const voice = options.voiceURI
    ? window.speechSynthesis.getVoices().find((item) => item.voiceURI === options.voiceURI)
    : options.character ? matchedBotVoice(window.speechSynthesis.getVoices(), options.character) : bestVoice()
  if (!options.voiceURI && options.character && !voice) {
    options.onError?.('No on-device English voice is available yet. Install an English device voice or choose a voice manually in Bot settings.')
    return
  }
  if (options.voiceURI && !voice) {
    options.onError?.('Your selected voice is unavailable. Choose another voice in Bot settings.')
    return
  }
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(spoken(text))
  utter.rate = options.rate ?? 1
  if (options.character && !options.voiceURI) utter.pitch = BOT_VOICE_PROFILES[options.character].pitch
  if (voice) { utter.voice = voice; utter.lang = voice.lang } else utter.lang = 'en-GB'
  const clear = () => { if (speakingText === text) { speakingText = ''; notify() } }
  utter.onend = clear
  utter.onerror = (event) => {
    clear()
    if (event.error !== 'canceled' && event.error !== 'interrupted') options.onError?.(`Voice playback failed (${event.error}). Please try another device voice.`)
  }
  speakingText = text
  notify()
  try {
    window.speechSynthesis.speak(utter)
  } catch (error) {
    clear()
    const message = `Voice playback could not start. ${error instanceof Error ? error.message : 'Please try another device voice.'}`
    if (options.onError) options.onError(message)
    else console.error(message)
  }
}

export function useSpeaking(text: string) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const sync = () => setOn(speakingText === text)
    listeners.add(sync)
    sync()
    return () => { listeners.delete(sync) }
  }, [text])
  return on
}

export function useAutoSpeak(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(false)
  useEffect(() => { try { setOn(window.localStorage.getItem(AUTO_KEY) === 'on') } catch { /* private mode */ } }, [])
  const set = (next: boolean) => {
    setOn(next)
    try { if (next) window.localStorage.setItem(AUTO_KEY, 'on'); else window.localStorage.removeItem(AUTO_KEY) } catch { /* private mode */ }
    if (!next) stopSpeaking()
  }
  return [on, set]
}

export function SpeakButton({ text, className = '', options }: { text: string; className?: string; options?: SpeechOptions }) {
  const active = useSpeaking(text)
  const [supported, setSupported] = useState(false)
  useEffect(() => setSupported(speechSupported()), [])
  if (!supported || !text) return null
  return <button aria-label={active ? 'Stop reading' : 'Read aloud'} className={`speak-button${active ? ' is-on' : ''} ${className}`} onClick={() => (active ? stopSpeaking() : speak(text, options))} title={active ? 'Stop reading' : 'Read aloud'} type="button">{active ? '■' : '🔊'}</button>
}
