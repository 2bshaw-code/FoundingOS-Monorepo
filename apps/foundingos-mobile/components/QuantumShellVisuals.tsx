/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ReactNode, useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { QuantumSphere } from './QuantumSphere'
import { QuantumText, quantumColors, quantumRadius, quantumShadow, quantumSpace } from './QuantumUI'
import { FOUNDINGOS_SHELL_THEME, QuantumTheme, useQuantumStore } from '../lib/store'

export function QuantumShellVisuals({ children }: { children?: ReactNode }) {
  return (
    <View style={styles.shellRoot}>
      <QuantumOverlay shellTheme={FOUNDINGOS_SHELL_THEME} />
      {children}
    </View>
  )
}

export function QuantumOverlay({ accent, shellTheme }: { accent?: string; shellTheme?: QuantumTheme }) {
  const lowEndMode = useQuantumStore((state) => state.lowEndMode)
  const drift = useRef(new Animated.Value(0)).current
  const theme = shellTheme ?? FOUNDINGOS_SHELL_THEME
  const resolvedAccent = accent ?? theme.accent

  useEffect(() => {
    if (lowEndMode) return
    const loop = Animated.loop(
      Animated.timing(drift, { toValue: 1, duration: 16000, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
    )
    loop.start()
    return () => loop.stop()
  }, [drift, lowEndMode])

  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -16] })
  const opacity = drift.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 0.82, 0.5] })

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.overlayRoot, { backgroundColor: theme.bgPrimary }]}>
      <Animated.View
        style={[
          styles.overlayOrbPrimary,
          { backgroundColor: theme.glowColor, borderColor: resolvedAccent, opacity, transform: [{ translateY }] },
        ]}
      />
      <View style={[styles.overlayOrbSecondary, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]} />
      <View style={styles.quantumLines}>
        <View style={[styles.quantumLine, styles.quantumLineOne, { backgroundColor: resolvedAccent }]} />
        <View style={[styles.quantumLine, styles.quantumLineTwo, { backgroundColor: resolvedAccent }]} />
        <View style={[styles.quantumLine, styles.quantumLineThree, { backgroundColor: resolvedAccent }]} />
        <View style={[styles.quantumLine, styles.quantumLineFour, { backgroundColor: resolvedAccent }]} />
        <View style={[styles.quantumLine, styles.quantumLineFive, { backgroundColor: resolvedAccent }]} />
      </View>
      <View style={[styles.overlayGrid, { borderColor: theme.borderColor }]} />
    </View>
  )
}

export function QuantumDepthSurface({
  children,
  accent,
  shellTheme,
  style,
}: {
  children?: ReactNode
  accent?: string
  shellTheme?: QuantumTheme
  style?: StyleProp<ViewStyle>
}) {
  const theme = shellTheme ?? FOUNDINGOS_SHELL_THEME
  const resolvedAccent = accent ?? theme.accent
  return (
    <View
      style={[
        styles.depthSurface,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor, shadowColor: resolvedAccent },
        quantumShadow(resolvedAccent),
        style,
      ]}
    >
      {children}
    </View>
  )
}

export function QuantumShellHeaderTitle({ title, brandName, accent }: { title: string; brandName: string; accent: string }) {
  return (
    <View style={styles.headerTitleWrap}>
      <QuantumText variant="caption" color={accent} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
        FoundingOS Quantum Command
      </QuantumText>
      <QuantumText variant="h3" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.68} ellipsizeMode="tail">
        {title}
      </QuantumText>
      <QuantumText variant="caption" color={quantumColors.neutral200} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} ellipsizeMode="tail">
        {brandName} · AI ecosystem · multi-brand SaaS operating layer
      </QuantumText>
    </View>
  )
}

export function QuantumShellHeaderBackdrop({ theme, accent }: { theme: QuantumTheme; accent: string }) {
  return (
    <QuantumDepthSurface accent={accent} shellTheme={theme} style={styles.headerBackdrop}>
      <View style={[styles.headerAccentLine, { backgroundColor: accent }]} />
    </QuantumDepthSurface>
  )
}

export function QuantumShellFooter({ brandName, accent, shellTheme }: { brandName: string; accent: string; shellTheme?: QuantumTheme }) {
  return (
    <View pointerEvents="none" style={styles.footerWrap}>
      <QuantumDepthSurface accent={accent} shellTheme={shellTheme} style={styles.footerSurface}>
        <QuantumSphere size={18} accent={accent} />
        <View style={styles.footerCopy}>
          <QuantumText variant="caption" color={accent}>
            FoundingOS mission control
          </QuantumText>
          <QuantumText variant="caption" color={quantumColors.neutral200}>
            {brandName} runs inside the AAL, Superdash, Package Model D, and full multi-brand SaaS ecosystem.
          </QuantumText>
        </View>
      </QuantumDepthSurface>
    </View>
  )
}

const styles = StyleSheet.create({
  overlayRoot: {
    overflow: 'hidden',
  },
  shellRoot: {
    flex: 1,
    backgroundColor: FOUNDINGOS_SHELL_THEME.bgPrimary,
  },
  overlayOrbPrimary: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
  },
  overlayOrbSecondary: {
    position: 'absolute',
    bottom: 90,
    left: -92,
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    opacity: 0.5,
  },
  quantumLines: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.14,
  },
  quantumLine: {
    position: 'absolute',
    height: 1,
    width: 360,
    transform: [{ rotate: '-28deg' }],
  },
  quantumLineOne: {
    top: 92,
    left: -84,
  },
  quantumLineTwo: {
    top: 176,
    right: -72,
  },
  quantumLineThree: {
    top: 288,
    left: -118,
  },
  quantumLineFour: {
    bottom: 184,
    right: -108,
  },
  quantumLineFive: {
    bottom: 76,
    left: -64,
  },
  overlayGrid: {
    position: 'absolute',
    top: 96,
    left: quantumSpace.lg,
    right: quantumSpace.lg,
    bottom: 112,
    borderWidth: 1,
    borderRadius: quantumRadius.lg,
    opacity: 0.18,
  },
  depthSurface: {
    borderWidth: 1,
    borderRadius: quantumRadius.lg,
  },
  headerTitleWrap: {
    flex: 1,
    flexShrink: 1,
    gap: 1,
    minWidth: 0,
    maxWidth: 238,
    paddingRight: quantumSpace.sm,
  },
  headerBackdrop: {
    flex: 1,
    borderRadius: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    opacity: 0.96,
  },
  headerAccentLine: {
    position: 'absolute',
    left: quantumSpace.lg,
    right: quantumSpace.lg,
    bottom: 0,
    height: 1,
    opacity: 0.72,
  },
  footerWrap: {
    position: 'absolute',
    left: quantumSpace.lg,
    right: quantumSpace.lg,
    bottom: 88,
  },
  footerSurface: {
    minHeight: 48,
    paddingVertical: quantumSpace.sm,
    paddingHorizontal: quantumSpace.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: quantumSpace.sm,
  },
  footerCopy: {
    flex: 1,
  },
})
