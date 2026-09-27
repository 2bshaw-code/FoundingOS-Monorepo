/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// FoundAI voice on the phone: the device's own text-to-speech (free, on-device).
import * as Speech from 'expo-speech'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'

const AUTO_KEY = 'foundingos-foundai-speak'
let speakingText = ''
let autoSpeak = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

void SecureStore.getItemAsync(AUTO_KEY).then((value) => { autoSpeak = value === 'on'; notify() }).catch(() => undefined)

const spoken = (text: string) => text.replace(/[→•✦✓#*_`>]/g, ' ').replace(/\s+/g, ' ').trim()

export function stopSpeaking() {
  void Speech.stop()
  speakingText = ''
  notify()
}

export function speak(text: string) {
  if (!text.trim()) return
  void Speech.stop()
  speakingText = text
  notify()
  const done = () => { if (speakingText === text) { speakingText = ''; notify() } }
  Speech.speak(spoken(text), { language: 'en-GB', rate: 1, onDone: done, onStopped: done, onError: done })
}

// Speaks the text when "Speak replies" is on.
export function speakIfAuto(text: string) { if (autoSpeak) speak(text) }

export function setAutoSpeak(on: boolean) {
  autoSpeak = on
  void (on ? SecureStore.setItemAsync(AUTO_KEY, 'on') : SecureStore.deleteItemAsync(AUTO_KEY)).catch(() => undefined)
  if (!on) stopSpeaking()
  notify()
}

export function useSpeech(text = '') {
  const [state, setState] = useState({ speaking: false, auto: autoSpeak })
  useEffect(() => {
    const sync = () => setState({ speaking: !!text && speakingText === text, auto: autoSpeak })
    listeners.add(sync)
    sync()
    return () => { listeners.delete(sync) }
  }, [text])
  return state
}
