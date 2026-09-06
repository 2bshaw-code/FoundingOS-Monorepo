/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FOUNDINGOS_SHELL_THEME } from '../lib/store'
import { quantumRadius, quantumSpace } from './QuantumUI'

export function FloatingFoundAIButton() {
  const insets = useSafeAreaInsets()

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open brand wheel"
      onPress={() => router.push('/brandwheel')}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: FOUNDINGOS_SHELL_THEME.accent,
          bottom: insets.bottom + 90,
          shadowColor: FOUNDINGOS_SHELL_THEME.accent,
          opacity: pressed ? 0.86 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
    >
      <View style={[styles.core, { backgroundColor: FOUNDINGOS_SHELL_THEME.bgPrimary }]} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: quantumSpace.xl,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    zIndex: 40,
  },
  core: {
    width: 28,
    height: 28,
    borderRadius: quantumRadius.pill,
  },
})
