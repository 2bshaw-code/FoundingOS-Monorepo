/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import Svg, { Defs, RadialGradient, LinearGradient, Stop, Circle } from 'react-native-svg'

// Real native equivalent of the web's QuantumSphereLogo (packages/ui/src/QuantumSphereLogo.tsx)
// — same real design intent (a radial-gradient sphere; the unified rainbow gradient for
// FoundingOS itself, a single-brand-accent radial gradient everywhere else), reproduced with
// react-native-svg since CSS filters/animateTransform aren't available in React Native. The
// FoundingOS (no accent) sphere keeps a slow continuous rotation, matching the web's 18s loop.
export function QuantumSphere({ size = 48, accent }: { size?: number; accent?: string }) {
  const rotation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (accent) return // Only the unified FoundingOS sphere rotates, matching the web version.
    const loop = Animated.loop(
      Animated.timing(rotation, { toValue: 1, duration: 18000, easing: Easing.linear, useNativeDriver: true })
    )
    loop.start()
    return () => loop.stop()
  }, [accent, rotation])

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })

  return (
    <Animated.View style={[styles.sphere, { width: size, height: size }, accent ? null : { transform: [{ rotate: spin }] }]}>
      <Svg width={size} height={size} viewBox="0 0 512 512">
        <Defs>
          {accent ? (
            <RadialGradient id="sphereFill" cx="38%" cy="32%" r="75%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
              <Stop offset="35%" stopColor={accent} stopOpacity={1} />
              <Stop offset="100%" stopColor={accent} stopOpacity={0.85} />
            </RadialGradient>
          ) : (
            <LinearGradient id="sphereFill" x1="106" y1="106" x2="406" y2="406" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#4FC3F7" />
              <Stop offset="25%" stopColor="#9D00FF" />
              <Stop offset="50%" stopColor="#FF3B3B" />
              <Stop offset="75%" stopColor="#FFD300" />
              <Stop offset="100%" stopColor="#00A651" />
            </LinearGradient>
          )}
          <RadialGradient id="innerGlow" cx="38%" cy="32%" r="65%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.95} />
            <Stop offset="35%" stopColor="#ffffff" stopOpacity={0.25} />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="256" cy="256" r="200" fill="url(#sphereFill)" />
        <Circle cx="256" cy="256" r="200" fill="url(#innerGlow)" />
      </Svg>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  sphere: {},
})
