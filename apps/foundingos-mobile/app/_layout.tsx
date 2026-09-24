/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect } from 'react'
import 'react-native-gesture-handler'
import Constants from 'expo-constants'
import { Stack, ThemeProvider, DarkTheme } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import { CrashBoundary } from '../components/CrashBoundary'
import { QuantumBackground } from '../components/QuantumBackground'
import { installGlobalErrorHandlers } from '../lib/crash-reporting'
import { registerPushToken, startNotificationResponseListener } from '../lib/notifications'
import { startNetworkStatusListener } from '../lib/network-status'
import { startReducedMotionListener } from '../lib/reduced-motion'
import { startTelemetryFlushLoop } from '../lib/telemetry-client'

enableScreens(true)

export default function RootLayout() {
  useEffect(() => {
    installGlobalErrorHandlers()
    const unsubscribeNetwork = startNetworkStatusListener()
    const unsubscribeReducedMotion = startReducedMotionListener()
    const stopTelemetry = startTelemetryFlushLoop()
    const unsubscribeNotifications = startNotificationResponseListener()
    // Registers a push token now so it's ready the moment a backend exists
    // to send to — silently no-ops on web/simulators/denied permission.
    const projectId = Constants.expoConfig?.extra?.eas?.projectId
    if (projectId) void registerPushToken(projectId)
    return () => {
      unsubscribeNetwork()
      unsubscribeReducedMotion()
      stopTelemetry()
      unsubscribeNotifications()
    }
  }, [])

  return (
    // react-native-gesture-handler v2 requires a single GestureHandlerRootView
    // ancestor for gestures (e.g. the sales pipeline's swipe-to-advance cards)
    // to work reliably alongside react-native-screens, which is enabled above.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={DarkTheme}>
          <QuantumBackground>
            <StatusBar style="light" />
            <CrashBoundary>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'transparent' },
                  animation: 'fade_from_bottom',
                  gestureEnabled: true,
                }}
              />
            </CrashBoundary>
          </QuantumBackground>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
