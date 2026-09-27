/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'
// FoundAI voice on the web: the browser's built-in speech (free, no data leaves the device).
// Replies are only read aloud when someone taps a speaker button or turns on "Speak replies".
import { useEffect, useState } from 'react'

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

export function speak(text: string) {
  if (!speechSupported() || !text.trim()) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(spoken(text))
  utter.rate = 1
  const voice = bestVoice()
  if (voice) { utter.voice = voice; utter.lang = voice.lang } else utter.lang = 'en-GB'
  utter.onend = utter.onerror = () => { if (speakingText === text) { speakingText = ''; notify() } }
  speakingText = text
  notify()
  window.speechSynthesis.speak(utter)
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

export function SpeakButton({ text, className = '' }: { text: string; className?: string }) {
  const active = useSpeaking(text)
  const [supported, setSupported] = useState(false)
  useEffect(() => setSupported(speechSupported()), [])
  if (!supported || !text) return null
  return <button aria-label={active ? 'Stop reading' : 'Read aloud'} className={`speak-button${active ? ' is-on' : ''} ${className}`} onClick={() => (active ? stopSpeaking() : speak(text))} title={active ? 'Stop reading' : 'Read aloud'} type="button">{active ? '■' : '🔊'}</button>
}
