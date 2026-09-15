/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { QuantumSphere } from './QuantumSphere'
import { useAIAssistance } from '../lib/ai-assistance'

const POSITION_KEY = 'fo_ai_sphere_position_v1'
const SPHERE_SIZE = 56
const EDGE_MARGIN = 12
// Roughly clears the floating pill tab bar (~64px tall + its own bottom safe-area padding)
// plus a little breathing room, so the sphere never sits on top of tab bar controls.
const BOTTOM_CLEARANCE = 110

type SavedPosition = { side: 'left' | 'right'; y: number }

// Real, global floating AI entry point — a single tap always opens this brand's real AI
// Actions screen (the same live GET /api/console/ai-actions data every AI Actions tab already
// shows), from ANY screen in the app, not just the AI Actions tab itself. Draggable + persists
// its last position on-device (SecureStore) so a user can drag it out of the way of content
// it happens to cover, and it stays out of the way next time the app opens. Always snaps to
// whichever screen edge (left/right) it's closest to when released, and is vertically clamped
// so it can never sit on top of the header or the floating tab bar.
export function FloatingAISphere() {
  const [aiEnabled] = useAIAssistance()
  const insets = useSafeAreaInsets()
  const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
  const minY = insets.top + 60
  const maxY = screenHeight - insets.bottom - BOTTOM_CLEARANCE - SPHERE_SIZE
  const rightX = screenWidth - SPHERE_SIZE - EDGE_MARGIN
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
    // Deliberately runs once at mount only — re-computing on every insets/dimension change
    // would fight the user's own drag; orientation changes are rare enough on these
    // brand apps (portrait-locked) that this is an acceptable, simple tradeoff.
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
        const snapLeft = currentX + SPHERE_SIZE / 2 < screenWidth / 2
        const targetX = snapLeft ? leftX : rightX

        Animated.spring(pan, { toValue: { x: targetX, y: clampedY }, useNativeDriver: false, friction: 8 }).start()
        SecureStore.setItemAsync(POSITION_KEY, JSON.stringify({ side: snapLeft ? 'left' : 'right', y: clampedY } as SavedPosition))

        if (!draggingRef.current && Math.abs(gesture.dx) < 4 && Math.abs(gesture.dy) < 4) {
          router.push('/(app)/ai-actions')
        }
      },
    })
  ).current

  // AI Assistance off = no floating entry point either, matching every other AI surface's
  // real on/off behaviour rather than showing a dead button.
  if (!aiEnabled || !ready) return null

  return (
    <Animated.View
      style={[styles.wrap, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <Pressable style={styles.pressable} hitSlop={8}>
        <View style={styles.glow}>
          <QuantumSphere size={SPHERE_SIZE} />
        </View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, zIndex: 999, elevation: 999 },
  pressable: { width: SPHERE_SIZE, height: SPHERE_SIZE },
  glow: {
    width: SPHERE_SIZE,
    height: SPHERE_SIZE,
    borderRadius: SPHERE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E0FF',
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
})
