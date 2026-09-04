/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Stack, ThemeProvider, DarkTheme } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QuantumBackground } from '../components/QuantumBackground'
import { BRAND } from '../lib/brand'

// Real quantum gradient background, applied once here (not per-screen), tinted with this
// brand's own real accent colour — Stack's contentStyle is transparent so it shows through.
export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <QuantumBackground accent={BRAND.accent}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
      </QuantumBackground>
    </ThemeProvider>
  )
}
