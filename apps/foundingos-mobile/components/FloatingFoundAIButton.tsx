/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { FOUNDINGOS_SHELL_THEME } from '../lib/store'

const POSITION_KEY = 'fo_foundingos_sphere_position_v1'
const BUTTON_SIZE = 58
const EDGE_MARGIN = 16
// Clears the floating pill tab bar + this app's own QuantumShellFooter, so the button never
// sits on top of either.
const BOTTOM_CLEARANCE = 150

type SavedPosition = { side: 'left' | 'right'; y: number }

// Real, global floating brand-wheel entry point — draggable, and persists its last position
// on-device (SecureStore) so it never permanently blocks content it happens to land on; always
// snaps to whichever edge (left/right) it's nearest when released, vertically clamped so it
// can never overlap the header or the footer/tab bar.
export function FloatingFoundAIButton() {
  const insets = useSafeAreaInsets()
  const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
  const minY = insets.top + 60
  const maxY = screenHeight - insets.bottom - BOTTOM_CLEARANCE - BUTTON_SIZE
  const rightX = screenWidth - BUTTON_SIZE - EDGE_MARGIN
  const leftX = EDGE_MARGIN

  const pan = useRef(new Animated.ValueXY({ x: rightX, y: maxY - 40 })).current
  const [ready, setReady] = useState(false)
  const draggingRef = useRef(false)

  useEffect(() => {
    SecureStore.getItemAsync(POSITION_KEY).then((raw) => {
      let next = { x: rightX, y: maxY - 40 }
      if (raw) {
        try {
          const saved = JSON.parse(raw) as SavedPosition
          const clampedY = Math.min(Math.max(saved.y, minY), maxY)
          next = { x: saved.side === 'left' ? leftX : rightX, y: clampedY }
        } catch {
          // Corrupt/old value — fall back to the default bottom-right position.
        }
      }
      pan.setValue(next)
      setReady(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4,
      onPanResponderGrant: () => {
        draggingRef.current = false
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value })
        pan.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: (_evt, gesture) => {
        if (Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4) draggingRef.current = true
        pan.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (_evt, gesture) => {
        pan.flattenOffset()
        const currentX = (pan.x as any)._value as number
        const currentY = (pan.y as any)._value as number
        const clampedY = Math.min(Math.max(currentY, minY), maxY)
        const snapLeft = currentX + BUTTON_SIZE / 2 < screenWidth / 2
        const targetX = snapLeft ? leftX : rightX

        Animated.spring(pan, { toValue: { x: targetX, y: clampedY }, useNativeDriver: false, friction: 8 }).start()
        SecureStore.setItemAsync(POSITION_KEY, JSON.stringify({ side: snapLeft ? 'left' : 'right', y: clampedY } as SavedPosition))

        if (!draggingRef.current && Math.abs(gesture.dx) < 4 && Math.abs(gesture.dy) < 4) {
          router.push('/brandwheel')
        }
      },
    })
  ).current

  if (!ready) return null

  return (
    <Animated.View
      style={[styles.wrap, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open brand wheel"
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: FOUNDINGOS_SHELL_THEME.accent,
            shadowColor: FOUNDINGOS_SHELL_THEME.accent,
            opacity: pressed ? 0.86 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <View style={[styles.core, { backgroundColor: FOUNDINGOS_SHELL_THEME.bgPrimary }]} />
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, zIndex: 999, elevation: 999 },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  core: { width: 28, height: 28, borderRadius: 999 },
})
