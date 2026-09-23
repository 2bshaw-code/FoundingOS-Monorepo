/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect } from 'react'
import 'react-native-gesture-handler'
import { Stack, ThemeProvider, DarkTheme } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import { QuantumBackground } from '../components/QuantumBackground'
import { startNetworkStatusListener } from '../lib/network-status'
import { startReducedMotionListener } from '../lib/reduced-motion'
import { startTelemetryFlushLoop } from '../lib/telemetry-client'

enableScreens(true)

export default function RootLayout() {
  useEffect(() => {
    const unsubscribeNetwork = startNetworkStatusListener()
    const unsubscribeReducedMotion = startReducedMotionListener()
    const stopTelemetry = startTelemetryFlushLoop()
    return () => {
      unsubscribeNetwork()
      unsubscribeReducedMotion()
      stopTelemetry()
    }
  }, [])

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DarkTheme}>
        <QuantumBackground>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
              animation: 'fade_from_bottom',
              gestureEnabled: true,
            }}
          />
        </QuantumBackground>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
