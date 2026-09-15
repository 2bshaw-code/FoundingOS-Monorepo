/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { DEFAULT_BRAND_SLUG, FOUNDINGOS_SHELL_THEME, QuantumTheme, getShellSafeTheme, useQuantumStore } from './store'

export type QuantumPageTheme = Pick<QuantumTheme, 'background' | 'surface' | 'accent' | 'glow' | 'quantumLines'>

const PAGE_THEME_CACHE: Record<string, QuantumPageTheme> = Object.freeze(
  Object.fromEntries(
    Object.entries({
      foundingos: getShellSafeTheme('foundingos'),
      retail: getShellSafeTheme('retail'),
      crypto: getShellSafeTheme('crypto'),
      meat: getShellSafeTheme('meat'),
      talent: getShellSafeTheme('talent'),
      foundthat: getShellSafeTheme('foundthat'),
      finance: getShellSafeTheme('finance'),
      health: getShellSafeTheme('health'),
      logistics: getShellSafeTheme('logistics'),
    }).map(([brandSlug, theme]) => [
      brandSlug,
      Object.freeze({
        background: FOUNDINGOS_SHELL_THEME.background,
        surface: FOUNDINGOS_SHELL_THEME.surface,
        accent: theme.accent,
        glow: theme.glow,
        quantumLines: FOUNDINGOS_SHELL_THEME.quantumLines,
      }),
    ])
  )
)

export function getPageTheme(brandSlug = DEFAULT_BRAND_SLUG): QuantumPageTheme {
  return PAGE_THEME_CACHE[brandSlug] ?? PAGE_THEME_CACHE[DEFAULT_BRAND_SLUG]
}

export function usePageTheme(): QuantumPageTheme {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  return getPageTheme(activeBrandSlug)
}
