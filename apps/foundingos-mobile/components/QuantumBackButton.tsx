/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text } from 'react-native'
import { FOUNDINGOS_SHELL_THEME } from '../lib/store'
import { quantumRadius, quantumSpace, useActiveQuantumTheme } from './QuantumUI'

type QuantumBackButtonProps = {
  label?: string
  fallbackHref?: string
}

export function QuantumBackButton({ label = 'Back', fallbackHref = '/(app)/home' }: QuantumBackButtonProps) {
  const theme = useActiveQuantumTheme()

  function handlePress() {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace(fallbackHref)
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: FOUNDINGOS_SHELL_THEME.cardBg,
          borderColor: FOUNDINGOS_SHELL_THEME.borderColor,
          shadowColor: theme.accent,
          opacity: pressed ? 0.84 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.78}
        ellipsizeMode="tail"
        style={[styles.label, { color: theme.accent }]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: quantumRadius.md,
    paddingHorizontal: quantumSpace.md,
    paddingVertical: 6,
    minHeight: 34,
    minWidth: 64,
    maxWidth: 160,
    justifyContent: 'center',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
})
