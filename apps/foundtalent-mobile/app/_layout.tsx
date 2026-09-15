/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Stack, ThemeProvider, DarkTheme } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QuantumBackground } from '../components/QuantumBackground'
import { BRAND } from '../lib/brand'

// Real quantum gradient background, applied once here (not per-screen), tinted with this
// brand's own real accent colour — Stack's contentStyle is transparent so it shows through.
// SafeAreaProvider is required by the floating QuantumTabBar (it reads useSafeAreaInsets()
// to pad above the home indicator) — without it the app crashes right after login.
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={DarkTheme}>
        <QuantumBackground accent={BRAND.accent}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
        </QuantumBackground>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
