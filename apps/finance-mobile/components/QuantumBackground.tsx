/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View, StyleSheet, type ViewProps } from 'react-native'

// Real background — a flat, solid dark blue. Earlier attempts used expo-linear-gradient for
// a corner-glow effect matching the web's radial gradient, but repeated live testing showed
// it never actually rendered any colour (plain View styling elsewhere in the app — borders,
// accent colours, text — all worked correctly the whole time), so the gradient dependency is
// dropped entirely here in favour of the simplest thing guaranteed to work: a plain View with
// a real backgroundColor.
export function QuantumBackground({ accent, children, style }: { accent?: string; children: React.ReactNode; style?: ViewProps['style'] }) {
  return <View style={[styles.fill, style]}>{children}</View>
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#0F2942' },
})
