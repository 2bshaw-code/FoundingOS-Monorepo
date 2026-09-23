/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { LinearGradient } from 'expo-linear-gradient'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  RefreshControlProps,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ensureReadableText } from '../lib/colour-audit'
import { ENTRANCE_DURATION_MS, PRESS_SPRING, staggerDelay, useReducedMotionPreference } from '../lib/motion'
import { QuantumTheme, getShellSafeTheme, useQuantumStore } from '../lib/store'
import { QuantumHeader as QuantumHeaderV1 } from './QuantumHeader'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const quantumSpace = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const

export const quantumRadius = {
  sm: 10,
  md: 14,
  lg: 18,
  pill: 999,
} as const

export const quantumColors = {
  neutral0: '#ffffff',
  neutral100: '#d9e4ef',
  neutral200: '#a9b8c8',
  neutral300: '#7f91a5',
  neutral500: '#536173',
  neutral700: '#162232',
  neutral800: '#0c1521',
  neutral900: '#0A0A0A',
  success: '#26E07F',
  warning: '#FFD166',
  danger: '#FF5470',
  whatsapp: '#25D366',
} as const

// Darkens (negative percent) or lightens (positive percent) a #rrggbb hex color by
// mixing it toward black/white. Used to build a subtle two-stop gradient from a flat
// accent color without needing a second design token per accent.
export function shadeColor(hex: string, percent: number): string {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return hex
  const num = parseInt(clean, 16)
  const amount = Math.round(2.55 * percent)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Sizes tuned for a "premium, easy-to-read" feel (Sep 2026 legibility pass): every
// step is larger than the original scale, and `label` was added because buttons/pills
// were previously reusing the tiny `caption` size, which read as cramped and cheap.
export const quantumTypography = StyleSheet.create({
  h1: { fontSize: 32, lineHeight: 38, fontWeight: '900', letterSpacing: -0.5 },
  h2: { fontSize: 25, lineHeight: 31, fontWeight: '800', letterSpacing: -0.25 },
  h3: { fontSize: 19, lineHeight: 25, fontWeight: '800' },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '500' },
  label: { fontSize: 16, lineHeight: 20, fontWeight: '800' },
  caption: { fontSize: 14, lineHeight: 19, fontWeight: '700' },
  overline: { fontSize: 12, lineHeight: 15, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
})

type QuantumScreenProps = {
  children: ReactNode
  scroll?: boolean
  refreshControl?: ReactElement<RefreshControlProps>
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
}

type QuantumTextProps = {
  children: ReactNode
  variant?: keyof typeof quantumTypography
  color?: string
  align?: TextStyle['textAlign']
  style?: StyleProp<TextStyle>
} & Pick<TextProps, 'adjustsFontSizeToFit' | 'ellipsizeMode' | 'minimumFontScale' | 'numberOfLines'>

type QuantumCardProps = {
  children: ReactNode
  accent?: string
  elevated?: boolean
  style?: StyleProp<ViewStyle>
  // Optional — supplying this turns the card into a pressable surface with a
  // premium spring press-in (subtle scale + lift), replacing the old pattern
  // of wrapping QuantumCard in a separate <Pressable style={{opacity}}>.
  onPress?: () => void
  disabled?: boolean
  // Position of this card within a list/grid — when set, its mount animation
  // is delayed by a small, capped amount per index so a grid of cards
  // cascades in rather than all appearing at once.
  index?: number
  // Escape hatch for cards that shouldn't animate on mount at all (rare —
  // defaults to true everywhere else). Always ignored when the user has
  // Reduce Motion enabled, which already disables the animation outright.
  animateEntrance?: boolean
}

type QuantumButtonProps = {
  children: ReactNode
  onPress?: () => void
  tone?: 'primary' | 'secondary' | 'ghost' | 'danger'
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

type QuantumPillProps = {
  children: ReactNode
  active?: boolean
  accent?: string
  onPress?: () => void
}

export function getSemanticColor(tone: 'good' | 'watch' | 'risk' | 'info') {
  if (tone === 'good') return quantumColors.success
  if (tone === 'watch') return quantumColors.warning
  if (tone === 'risk') return quantumColors.danger
  return quantumColors.neutral200
}

export function useActiveQuantumTheme() {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  return getShellSafeTheme(activeBrandSlug)
}

export function QuantumScreen({ children, scroll = true, refreshControl, style, contentStyle }: QuantumScreenProps) {
  const theme = useActiveQuantumTheme()
  const containerStyle = [styles.screen, style]
  const content = [styles.screenContent, contentStyle]

  return (
    <View style={styles.screenBackdrop}>
      <LinearGradient
        colors={[theme.bgSecondary, theme.bgPrimary, '#000814']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={[styles.screenGlow, { backgroundColor: theme.accent, opacity: 0.07 }]} />
      <SafeAreaView style={containerStyle} edges={['left', 'right', 'bottom']}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={content}
            refreshControl={refreshControl}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={content}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  )
}

export function QuantumLoadingScreen() {
  const theme = useActiveQuantumTheme()
  return (
    <QuantumScreen scroll={false} contentStyle={styles.center}>
      <ActivityIndicator color={theme.accent} size="large" />
    </QuantumScreen>
  )
}

export function QuantumText({ children, variant = 'body', color, align, style, ...textProps }: QuantumTextProps) {
  const theme = useActiveQuantumTheme()
  const rawColor = color ?? (variant === 'caption' || variant === 'overline' ? theme.subtextColor : theme.textColor)
  const resolvedColor = ensureReadableText(rawColor, theme.bgPrimary, theme.textColor)
  return (
    <Text {...textProps} style={[quantumTypography[variant], { color: resolvedColor, textAlign: align }, style]}>
      {children}
    </Text>
  )
}

export function QuantumCard({
  children,
  accent,
  elevated = true,
  style,
  onPress,
  disabled,
  index,
  animateEntrance = true,
}: QuantumCardProps) {
  const theme = useActiveQuantumTheme()
  const reduceMotion = useReducedMotionPreference()
  // 0 = resting, 1 = fully pressed — driven by withSpring on press in/out,
  // read by the animated style below to derive both the scale-down and the
  // small lift, so the two always stay perfectly in sync with one spring.
  const press = useSharedValue(0)

  const pressStyle = useAnimatedStyle(() => ({
    transform: [
      // 0.965 rest scale floor sits in the "subtle, tactile" range the brief
      // asked for (0.96–0.97) without reading as a heavy squash.
      { scale: 1 - press.value * 0.035 },
      { translateY: -press.value * 2 },
    ],
  }))

  const handlePressIn = () => {
    if (reduceMotion) return
    press.value = withSpring(1, PRESS_SPRING)
  }
  const handlePressOut = () => {
    if (reduceMotion) return
    press.value = withSpring(0, PRESS_SPRING)
  }

  // `style` is applied here too (not just on the outermost wrapper below) —
  // callers pass layout props through it for two different purposes: grid
  // sizing (minWidth/flexGrow, needed on the outermost element so it
  // participates correctly in a wrapping row) and internal content layout
  // (gap/alignItems, needed here so it actually affects the real children).
  // Applying it at both levels keeps every existing call site working
  // unchanged regardless of which kind of prop it passed.
  const cardBody = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: accent ?? theme.borderColor,
          shadowColor: accent ?? theme.accent,
        },
        elevated && styles.cardElevation,
        style,
      ]}
    >
      {accent ? (
        <LinearGradient
          colors={[accent, `${accent}00`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardAccentBar}
        />
      ) : null}
      {children}
    </View>
  )

  const pressableBody = onPress ? (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={reduceMotion ? undefined : pressStyle}
    >
      {cardBody}
    </AnimatedPressable>
  ) : (
    cardBody
  )

  if (reduceMotion || !animateEntrance) {
    return <View style={style}>{pressableBody}</View>
  }

  return (
    <Animated.View
      style={style}
      entering={FadeInDown.delay(staggerDelay(index)).duration(ENTRANCE_DURATION_MS).springify().damping(18)}
    >
      {pressableBody}
    </Animated.View>
  )
}

export function QuantumHeader({
  eyebrow,
  title,
  description,
  action,
  accent,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  accent?: string
}) {
  const theme = useActiveQuantumTheme()
  const resolvedAccent = accent ?? theme.accent
  const subtitle = [eyebrow, description].filter(Boolean).join(' · ')
  return <QuantumHeaderV1 title={title} subtitle={subtitle} accent={resolvedAccent} rightSlot={action} />
}

export function QuantumButton({ children, onPress, tone = 'primary', disabled, style }: QuantumButtonProps) {
  const theme = useActiveQuantumTheme()
  const backgroundColor =
    tone === 'primary' ? theme.accent : tone === 'danger' ? quantumColors.danger : tone === 'secondary' ? theme.bgSecondary : 'transparent'
  const borderColor = tone === 'ghost' || tone === 'secondary' ? theme.borderColor : backgroundColor
  const textColor = tone === 'primary' || tone === 'danger' ? quantumColors.neutral900 : theme.textColor
  const gradientColors = tone === 'primary' ? [shadeColor(theme.accent, 4), shadeColor(theme.accent, -12), shadeColor(theme.accent, -28)] : null

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { borderColor, opacity: disabled ? 0.55 : pressed ? 0.82 : 1, overflow: 'hidden' },
        !gradientColors && { backgroundColor },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {gradientColors ? (
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {typeof children === 'string' || typeof children === 'number' ? (
        <QuantumText variant="label" color={textColor} style={styles.buttonText}>
          {children}
        </QuantumText>
      ) : (
        children
      )}
    </Pressable>
  )
}

export function QuantumPill({ children, active, accent, onPress }: QuantumPillProps) {
  const theme = useActiveQuantumTheme()
  const resolvedAccent = accent ?? theme.accent
  return (
    <Pressable
      style={[
        styles.pill,
        {
          borderColor: resolvedAccent,
          backgroundColor: active ? shadeColor(resolvedAccent, -22) : 'transparent',
        },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <QuantumText variant="label" color={active ? quantumColors.neutral0 : theme.textColor}>
        {children}
      </QuantumText>
    </Pressable>
  )
}

export function QuantumSectionHeader({ label, action }: { label: string; action?: ReactNode }) {
  const theme = useActiveQuantumTheme()
  return (
    <View style={styles.sectionHeader}>
      <QuantumText variant="overline" color={theme.subtextColor}>
        {label}
      </QuantumText>
      {action}
    </View>
  )
}

export function QuantumTextInput(props: TextInputProps) {
  const theme = useActiveQuantumTheme()
  return (
    <TextInput
      placeholderTextColor={quantumColors.neutral500}
      {...props}
      style={[
        styles.input,
        { backgroundColor: theme.bgSecondary, borderColor: theme.borderColor, color: theme.textColor },
        props.style,
      ]}
    />
  )
}

export function QuantumPasswordInput(props: TextInputProps) {
  const theme = useActiveQuantumTheme()
  const [visible, setVisible] = useState(false)
  return (
    <View style={{ position: 'relative', justifyContent: 'center' }}>
      <TextInput
        placeholderTextColor={quantumColors.neutral500}
        {...props}
        secureTextEntry={!visible}
        // Passwords must never be auto-capitalized/auto-corrected — the OS keyboard
        // silently mangling characters (capitalizing after punctuation, "correcting"
        // words) was causing valid passwords to be sent to the backend incorrectly,
        // which surfaced as a confusing "sign in succeeds on Home but fails everywhere
        // else" bug rather than a visible wrong-password error.
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        textContentType="password"
        spellCheck={false}
        style={[
          styles.input,
          { backgroundColor: theme.bgSecondary, borderColor: theme.borderColor, color: theme.textColor, paddingRight: 56 },
          props.style,
        ]}
      />
      <Pressable
        onPress={() => setVisible((current) => !current)}
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        style={{ position: 'absolute', right: quantumSpace.md, padding: quantumSpace.xs }}
      >
        <Text style={{ color: theme.textColor, fontSize: 15, fontWeight: '700' }}>{visible ? 'Hide' : 'Show'}</Text>
      </Pressable>
    </View>
  )
}

export function QuantumFormField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <View style={styles.formField}>
      <QuantumText variant="caption">{label}</QuantumText>
      {children}
    </View>
  )
}

export function QuantumListItem({
  title,
  subtitle,
  accent,
  trailing,
  onPress,
}: {
  title: string
  subtitle?: string
  accent?: string
  trailing?: ReactNode
  onPress?: () => void
}) {
  const theme = useActiveQuantumTheme()
  const Wrapper = onPress ? Pressable : View
  const pressStyle = onPress ? ({ pressed }: { pressed: boolean }) => [styles.listItem, { borderColor: accent ?? theme.borderColor, backgroundColor: theme.cardBg, opacity: pressed ? 0.7 : 1 }] : [styles.listItem, { borderColor: accent ?? theme.borderColor, backgroundColor: theme.cardBg }]
  return (
    <Wrapper style={pressStyle} onPress={onPress}>
      <View style={[styles.listDot, { backgroundColor: accent ?? theme.accent }]} />
      <View style={styles.listCopy}>
        <QuantumText variant="h3">{title}</QuantumText>
        {subtitle ? (
          <QuantumText variant="caption" color={theme.subtextColor}>
            {subtitle}
          </QuantumText>
        ) : null}
      </View>
      {trailing ?? (
        <QuantumText variant="h3" color={accent ?? theme.accent}>
          ›
        </QuantumText>
      )}
    </Wrapper>
  )
}

export function QuantumFooter({ children }: { children: ReactNode }) {
  const theme = useActiveQuantumTheme()
  return <View style={[styles.footer, { borderTopColor: theme.borderColor }]}>{children}</View>
}

export function QuantumModalSurface({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useActiveQuantumTheme()
  return (
    <View style={[styles.modalSurface, { backgroundColor: theme.bgSecondary, borderColor: theme.accent, shadowColor: theme.accent }, style]}>
      {children}
    </View>
  )
}

export function QuantumNotice({
  children,
  tone = 'info',
  onRetry,
}: {
  children: ReactNode
  tone?: 'success' | 'warning' | 'danger' | 'info'
  // When set, renders a "Retry" affordance next to the message — used for
  // genuine (4xx) action failures so the user can immediately try again
  // instead of hunting for the control that failed.
  onRetry?: () => void
}) {
  const theme = useActiveQuantumTheme()
  const color =
    tone === 'success' ? quantumColors.success : tone === 'warning' ? quantumColors.warning : tone === 'danger' ? quantumColors.danger : theme.accent
  return (
    <View style={[styles.notice, { borderColor: color, backgroundColor: `${color}18` }, onRetry ? styles.noticeRow : null]}>
      <QuantumText variant="caption" color={color} align="center" style={onRetry ? { flex: 1 } : undefined}>
        {children}
      </QuantumText>
      {onRetry ? (
        <Pressable onPress={onRetry} hitSlop={8}>
          <QuantumText variant="caption" color={color} style={styles.noticeRetry}>
            Retry
          </QuantumText>
        </Pressable>
      ) : null}
    </View>
  )
}

export function QuantumMetric({
  label,
  value,
  tone = 'info',
}: {
  label: string
  value: string | number
  tone?: 'good' | 'watch' | 'risk' | 'info'
}) {
  const color = getSemanticColor(tone)
  return (
    <View style={styles.metric}>
      <QuantumText variant="h2" color={color}>
        {value}
      </QuantumText>
      <QuantumText variant="caption" align="center">
        {label}
      </QuantumText>
    </View>
  )
}

// A labelled fill bar used anywhere the app needs to visualize an AI
// confidence/reliability/decision score (Guardian's health card, the
// Approvals AI preview panel). The fill animates in with withTiming rather
// than mounting at full width, so it reads as the number actually being
// computed/settling rather than a static, static-feeling stat — this is the
// single visual most responsible for the "intelligent" feel the AI preview
// is meant to convey. Respects Reduce Motion (mounts already-filled instead).
export function QuantumConfidenceBar({
  label,
  percent,
  tone = 'info',
}: {
  label: string
  percent: number
  tone?: 'good' | 'watch' | 'risk' | 'info'
}) {
  const reduceMotion = useReducedMotionPreference()
  const clamped = Math.max(0, Math.min(100, Math.round(percent)))
  const color = getSemanticColor(tone)
  const fill = useSharedValue(reduceMotion ? clamped : 0)

  useEffect(() => {
    fill.value = reduceMotion ? clamped : withTiming(clamped, { duration: 700, easing: Easing.out(Easing.cubic) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped, reduceMotion])

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.value}%` }))

  return (
    <View style={styles.confidenceRow}>
      <View style={styles.confidenceLabelRow}>
        <QuantumText variant="caption">{label}</QuantumText>
        <QuantumText variant="caption" color={color}>{clamped}%</QuantumText>
      </View>
      <View style={styles.confidenceTrack}>
        <Animated.View style={[styles.confidenceFill, { backgroundColor: color }, fillStyle]} />
      </View>
    </View>
  )
}

// A single shimmering placeholder block — the building block for every
// skeleton loading state in the app (replaces a bare spinner with a preview
// of the real layout that's about to appear, which reads as faster and more
// premium). Respects Reduce Motion by holding a static, softly-visible tone
// instead of animating.
export function QuantumSkeleton({ style }: { style?: StyleProp<ViewStyle> }) {
  const theme = useActiveQuantumTheme()
  const reduceMotion = useReducedMotionPreference()
  const shimmer = useSharedValue(reduceMotion ? 0.5 : 0.35)

  useEffect(() => {
    if (reduceMotion) return
    shimmer.value = withRepeat(withSequence(withTiming(0.65, { duration: 900, easing: Easing.inOut(Easing.sin) }), withTiming(0.35, { duration: 900, easing: Easing.inOut(Easing.sin) })), -1, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  const shimmerStyle = useAnimatedStyle(() => ({ opacity: shimmer.value }))

  return <Animated.View style={[styles.skeletonBlock, { backgroundColor: theme.borderColor }, shimmerStyle, style]} />
}

// A ready-made skeleton for a vertical stack of card-shaped placeholders —
// used anywhere a screen's real content is a list of QuantumCards (Guardian's
// signal cards, the Approvals queue, module record lists) so the loading
// state's shape matches what's about to replace it.
export function QuantumSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.skeletonList}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.skeletonCard}>
          <QuantumSkeleton style={styles.skeletonTitle} />
          <QuantumSkeleton style={styles.skeletonLineWide} />
          <QuantumSkeleton style={styles.skeletonLineNarrow} />
        </View>
      ))}
    </View>
  )
}

// A consistent, considered "nothing here (yet)" state — used instead of a
// bare QuantumNotice wherever a whole section is empty, so the app never
// reads as broken or unfinished. `glyph` is a single character/emoji kept
// deliberately restrained (no illustration library), `action` is optional
// for the rare case a retry/next-step control belongs here.
export function QuantumEmptyState({
  glyph = '◇',
  title,
  subtitle,
  action,
}: {
  glyph?: string
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  const theme = useActiveQuantumTheme()
  return (
    <View style={[styles.emptyStateBox, { borderColor: theme.borderColor }]}>
      <QuantumText variant="h2" color={theme.subtextColor} style={styles.emptyStateGlyph}>{glyph}</QuantumText>
      <QuantumText variant="h3" align="center">{title}</QuantumText>
      {subtitle ? <QuantumText variant="caption" align="center" color={theme.subtextColor}>{subtitle}</QuantumText> : null}
      {action ? <View style={styles.emptyStateAction}>{action}</View> : null}
    </View>
  )
}

export function quantumShadow(accent: string): ViewStyle {
  return {
    shadowColor: accent,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  }
}

export function getScreenHeaderOptions(theme: QuantumTheme) {
  return {
    headerStyle: { backgroundColor: theme.bgPrimary },
    headerTintColor: theme.textColor,
    headerTitleStyle: { color: theme.textColor, fontSize: 19, fontWeight: '900' as const },
    headerTitleContainerStyle: { maxWidth: 238, minWidth: 0, flexShrink: 1 },
    headerRightContainerStyle: { flexShrink: 0 },
    headerShadowVisible: false,
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1 },
  screenBackdrop: { flex: 1 },
  screenGlow: {
    position: 'absolute',
    top: -140,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  screenContent: {
    paddingHorizontal: quantumSpace.lg,
    paddingTop: quantumSpace.lg,
    paddingBottom: 180,
    gap: quantumSpace.md,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    borderWidth: 1,
    borderRadius: quantumRadius.lg,
    padding: quantumSpace.xl,
    gap: quantumSpace.md,
    position: 'relative',
  },
  cardAccentBar: {
    position: 'absolute',
    top: 0,
    left: 1,
    right: 1,
    height: 3,
    borderTopLeftRadius: quantumRadius.lg - 1,
    borderTopRightRadius: quantumRadius.lg - 1,
  },
  cardElevation: {
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  button: {
    borderWidth: 1,
    borderRadius: quantumRadius.pill,
    paddingVertical: quantumSpace.md,
    paddingHorizontal: quantumSpace.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonText: { fontWeight: '900' },
  pill: {
    borderWidth: 1,
    borderRadius: quantumRadius.pill,
    paddingVertical: quantumSpace.sm,
    paddingHorizontal: quantumSpace.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: quantumSpace.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: quantumSpace.md,
  },
  headerCopy: { flex: 1, gap: quantumSpace.xs },
  input: {
    borderWidth: 1,
    borderRadius: quantumRadius.md,
    padding: quantumSpace.md,
    fontSize: 16,
    minHeight: 50,
  },
  formField: { gap: quantumSpace.sm },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: quantumSpace.md,
    borderWidth: 1,
    borderRadius: quantumRadius.md,
    padding: quantumSpace.lg,
  },
  listDot: { width: 10, height: 10, borderRadius: 5 },
  listCopy: { flex: 1, gap: quantumSpace.xs },
  footer: {
    borderTopWidth: 1,
    paddingTop: quantumSpace.md,
    paddingBottom: quantumSpace.xs,
    gap: quantumSpace.sm,
  },
  modalSurface: {
    width: '100%',
    maxWidth: 420,
    borderRadius: quantumRadius.lg,
    borderWidth: 1,
    padding: quantumSpace.lg,
    gap: quantumSpace.md,
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  notice: {
    borderWidth: 1,
    borderRadius: quantumRadius.md,
    paddingVertical: quantumSpace.md,
    paddingHorizontal: quantumSpace.lg,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: quantumSpace.sm,
  },
  noticeRetry: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  metric: {
    flex: 1,
    minWidth: 92,
    alignItems: 'center',
    justifyContent: 'center',
    gap: quantumSpace.xs,
  },
  confidenceRow: {
    gap: 4,
  },
  confidenceLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confidenceTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  skeletonBlock: {
    borderRadius: quantumRadius.sm,
  },
  skeletonList: {
    gap: quantumSpace.sm,
  },
  skeletonCard: {
    borderRadius: quantumRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: quantumSpace.lg,
    gap: quantumSpace.sm,
  },
  skeletonTitle: {
    height: 16,
    width: '55%',
  },
  skeletonLineWide: {
    height: 11,
    width: '92%',
  },
  skeletonLineNarrow: {
    height: 11,
    width: '68%',
  },
  emptyStateBox: {
    alignItems: 'center',
    gap: quantumSpace.xs,
    paddingVertical: quantumSpace.xl,
    paddingHorizontal: quantumSpace.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: quantumRadius.lg,
  },
  emptyStateGlyph: {
    opacity: 0.5,
    marginBottom: quantumSpace.xs,
  },
  emptyStateAction: {
    marginTop: quantumSpace.sm,
  },
})
