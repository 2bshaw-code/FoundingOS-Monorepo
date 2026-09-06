/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View, StyleSheet, type ViewProps } from 'react-native'
import { FOUNDINGOS_BASE } from '../lib/brands'

export function QuantumBackground({ accent, children, style }: { accent?: string; children: React.ReactNode; style?: ViewProps['style'] }) {
  return <View style={[styles.fill, accent ? { shadowColor: accent } : null, style]}>{children}</View>
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: FOUNDINGOS_BASE },
})
