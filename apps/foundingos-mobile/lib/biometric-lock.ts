/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Face ID / Touch ID / fingerprint app lock. The preference is persisted
// (via lib/platform-storage.ts) since it's a security setting, not session
// UI state — it should still be on the next time the app launches. The
// actual authentication prompt is invoked from components/BiometricLockGate.tsx,
// which gates the (app) group's Stack; this module only handles capability
// checks, the persisted preference, and the authenticate() call itself.
import * as LocalAuthentication from 'expo-local-authentication'
import { Platform } from 'react-native'
import { deleteStoredValue, getStoredValue, setStoredValue } from './platform-storage'

const STORAGE_KEY = 'foundingos.biometricLockEnabled'

export async function isBiometricLockSupported(): Promise<boolean> {
  if (Platform.OS === 'web') return false
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const isEnrolled = await LocalAuthentication.isEnrolledAsync()
    return hasHardware && isEnrolled
  } catch {
    return false
  }
}

export async function loadBiometricLockPreference(): Promise<boolean> {
  const stored = await getStoredValue(STORAGE_KEY)
  return stored === 'true'
}

export async function saveBiometricLockPreference(enabled: boolean): Promise<void> {
  if (enabled) await setStoredValue(STORAGE_KEY, 'true')
  else await deleteStoredValue(STORAGE_KEY)
}

export async function authenticate(): Promise<boolean> {
  if (Platform.OS === 'web') return true
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock FoundingOS',
      // Falls back to the device passcode automatically if Face ID/Touch ID
      // fails or isn't available — never leaves someone locked out because
      // biometrics briefly failed to read.
      disableDeviceFallback: false,
      cancelLabel: 'Cancel',
    })
    return result.success
  } catch {
    // Fail open rather than locking someone out of their own app if the
    // native module errors unexpectedly (e.g. simulator without biometrics).
    return true
  }
}
