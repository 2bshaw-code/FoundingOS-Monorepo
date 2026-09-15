/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real, on-device "AI Assistance: On/Off" preference — uses the same expo-secure-store
// already used for the real session token (see lib/api.ts), so no new dependency. Unlike
// the web version (one cookie shared across every *.foundingos.com subdomain), this is
// necessarily per-app-install: each brand's native app is a separate installed app, not a
// shared browser session, so there's no cross-app storage to share here — the toggle is
// respected across every screen *within this one app*, which is the real, correct scope for
// a native app. Default is ON until the user explicitly turns it off.
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'

const AI_ASSISTANCE_KEY = 'fo_ai_assistance'
const ONBOARDED_KEY = 'fo_onboarded_screens'

export async function isAIAssistanceEnabled(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(AI_ASSISTANCE_KEY)
  return value !== 'off'
}

export async function setAIAssistanceEnabled(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(AI_ASSISTANCE_KEY, enabled ? 'on' : 'off')
}

// Every AI surface (FoundAI-equivalent AI Actions tab, onboarding welcomes, module hints,
// Guardian explanations) calls this and renders nothing/plain-only when it's false.
export function useAIAssistance(): [boolean, (enabled: boolean) => void] {
  const [enabled, setEnabledState] = useState(true)

  useEffect(() => {
    isAIAssistanceEnabled().then(setEnabledState)
  }, [])

  const setEnabled = (value: boolean) => {
    setEnabledState(value)
    setAIAssistanceEnabled(value)
  }

  return [enabled, setEnabled]
}

export async function hasSeenOnboarding(key: string): Promise<boolean> {
  const raw = await SecureStore.getItemAsync(ONBOARDED_KEY)
  if (!raw) return false
  return raw.split(',').filter(Boolean).includes(key)
}

export async function markOnboardingSeen(key: string): Promise<void> {
  const raw = await SecureStore.getItemAsync(ONBOARDED_KEY)
  const seen = new Set(raw ? raw.split(',').filter(Boolean) : [])
  seen.add(key)
  await SecureStore.setItemAsync(ONBOARDED_KEY, [...seen].join(','))
}
