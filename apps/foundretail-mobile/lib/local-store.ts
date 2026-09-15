/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

// Generic local JSON store for on-device demo state (sales ledger, stock levels) —
// SecureStore on iOS/Android, localStorage on web previews.
async function getRaw(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null
  }
  return SecureStore.getItemAsync(key)
}

async function setRaw(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value)
    return
  }
  await SecureStore.setItemAsync(key, value)
}

export async function getJSON<T>(key: string, fallback: T): Promise<T> {
  const raw = await getRaw(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  await setRaw(key, JSON.stringify(value))
}
