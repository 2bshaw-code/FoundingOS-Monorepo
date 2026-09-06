/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ensureReadableText } from '../lib/colour-audit'
import { FOUNDINGOS_SHELL_THEME, getShellSafeTheme, useQuantumStore } from '../lib/store'

type QuantumHeaderProps = {
  title: string
  subtitle?: string
  accent?: string
  rightSlot?: ReactNode
}

export function QuantumHeader({ title, subtitle, accent, rightSlot }: QuantumHeaderProps) {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const theme = getShellSafeTheme(activeBrandSlug)
  const resolvedAccent = accent ?? FOUNDINGOS_SHELL_THEME.accent
  const titleColor = ensureReadableText(theme.textColor, FOUNDINGOS_SHELL_THEME.bgPrimary, FOUNDINGOS_SHELL_THEME.textColor)
  const subtitleColor = ensureReadableText(theme.subtextColor, FOUNDINGOS_SHELL_THEME.bgPrimary, FOUNDINGOS_SHELL_THEME.textColor)

  return (
    <View style={[styles.root, { backgroundColor: FOUNDINGOS_SHELL_THEME.cardBg, borderColor: FOUNDINGOS_SHELL_THEME.borderColor, shadowColor: resolvedAccent }]}>
      <View style={styles.copy}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
          ellipsizeMode="tail"
          style={[styles.title, { color: titleColor }]}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.78}
            ellipsizeMode="tail"
            style={[styles.subtitle, { color: subtitleColor }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}

      <View style={[styles.accentLine, { backgroundColor: resolvedAccent }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    minHeight: 68,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    maxWidth: '100%',
    paddingRight: 12,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
  },
  rightSlot: {
    maxWidth: 120,
    flexShrink: 1,
    alignItems: 'flex-end',
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    opacity: 0.35,
  },
})
