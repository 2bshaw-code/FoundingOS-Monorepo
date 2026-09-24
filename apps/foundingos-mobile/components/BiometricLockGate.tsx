/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Renders a full-screen Face ID / Touch ID prompt over the (app) group
// whenever biometricLockEnabled is on — gates re-entry to the authenticated
// shell on cold launch and whenever the app returns from the background, the
// same trigger points banking apps use. Demo mode always bypasses this: an
// investor/buyer walking through the demo should never hit a lock screen on
// someone else's device.
import { useEffect, useRef, useState } from 'react'
import { AppState, type AppStateStatus, StyleSheet, View } from 'react-native'
import { authenticate } from '../lib/biometric-lock'
import { hapticError, hapticSuccess } from '../lib/haptics'
import { useQuantumStore } from '../lib/store'
import { QuantumButton, QuantumScreen, QuantumText } from './QuantumUI'

export function BiometricLockGate({ children }: { children: React.ReactNode }) {
  const biometricLockEnabled = useQuantumStore((state) => state.biometricLockEnabled)
  const demoMode = useQuantumStore((state) => state.demoMode)
  const [locked, setLocked] = useState(biometricLockEnabled && !demoMode)
  const [checking, setChecking] = useState(false)
  const appState = useRef(AppState.currentState)

  const active = biometricLockEnabled && !demoMode

  const tryUnlock = async () => {
    if (checking) return
    setChecking(true)
    const success = await authenticate()
    setChecking(false)
    if (success) {
      hapticSuccess()
      setLocked(false)
    } else {
      hapticError()
    }
  }

  useEffect(() => {
    if (!active) {
      setLocked(false)
      return
    }
    setLocked(true)
    void tryUnlock()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useEffect(() => {
    if (!active) return
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      // Re-lock the instant the app leaves the foreground, then prompt again
      // the moment it's active — never leave a window where a backgrounded
      // app is visible unlocked in the app switcher.
      if (appState.current.match(/active/) && nextState.match(/inactive|background/)) {
        setLocked(true)
      } else if (nextState === 'active' && appState.current !== 'active') {
        void tryUnlock()
      }
      appState.current = nextState
    })
    return () => subscription.remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (!locked) return <>{children}</>

  return (
    <QuantumScreen>
      <View style={styles.center}>
        <QuantumText variant="h2">FoundingOS is locked</QuantumText>
        <QuantumText variant="caption" style={styles.caption}>
          Confirm it's you with Face ID, Touch ID, or your device passcode to continue.
        </QuantumText>
        <QuantumButton onPress={tryUnlock} disabled={checking} style={styles.button}>
          {checking ? 'Checking…' : 'Unlock'}
        </QuantumButton>
      </View>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 24 },
  caption: { textAlign: 'center', opacity: 0.75 },
  button: { marginTop: 12, minWidth: 160 },
})
