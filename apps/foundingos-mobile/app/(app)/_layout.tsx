/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { FOUNDINGOS_SHELL_THEME, useQuantumStore } from '../../lib/store'
import { getScreenHeaderOptions } from '../../components/QuantumUI'
import { QuantumShellHeaderBackdrop } from '../../components/QuantumShellVisuals'
import { BiometricLockGate } from '../../components/BiometricLockGate'
import { loadBiometricLockPreference } from '../../lib/biometric-lock'

// The bottom-tab bar ((tabs) group) can never support the native iOS
// edge-swipe-to-go-back gesture — tab navigators don't have a "previous
// screen" to swipe back to. Screens that aren't part of the tab bar (Sales
// Pipeline, Team, Onboarding, Activity, Guardian) are pushed onto this
// Stack instead, so they get a real back button and native swipe-back.
export default function AppStackLayout() {
  const shellTheme = FOUNDINGOS_SHELL_THEME
  const setBiometricLockEnabled = useQuantumStore((state) => state.setBiometricLockEnabled)

  useEffect(() => {
    void loadBiometricLockPreference().then(setBiometricLockEnabled)
  }, [setBiometricLockEnabled])

  return (
    <BiometricLockGate>
      <Stack
        screenOptions={{
          ...getScreenHeaderOptions(shellTheme),
          headerBackground: () => <QuantumShellHeaderBackdrop theme={shellTheme} accent={shellTheme.accent} />,
          contentStyle: { backgroundColor: 'transparent' },
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="crm" options={{ title: 'Sales Pipeline' }} />
        <Stack.Screen name="activity" options={{ title: 'Activity' }} />
        <Stack.Screen name="guardian" options={{ title: 'Guardian' }} />
        <Stack.Screen name="team" options={{ title: 'Team & Roles' }} />
        <Stack.Screen name="onboarding" options={{ title: 'Setup & Onboarding' }} />
      </Stack>
    </BiometricLockGate>
  )
}
