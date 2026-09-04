/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Stack, ThemeProvider, DarkTheme } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QuantumBackground } from '../components/QuantumBackground'

// Real fix for a genuine, app-wide readability bug: without an explicit theme, React
// Navigation (which expo-router's Stack/Tabs sit on top of) defaults to its LIGHT theme —
// white scene/header backgrounds — regardless of this app's own dark styling. That made
// every screen's white text unreadable against a white background wherever a navigator's
// own default background wasn't already overridden. DarkTheme fixes every such surface at
// once (tab bar, headers, scene containers), not just the ones patched individually so far.
export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <QuantumBackground>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
      </QuantumBackground>
    </ThemeProvider>
  )
}
