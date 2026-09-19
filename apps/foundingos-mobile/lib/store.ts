/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { create } from 'zustand'
import { BRANDS, Brand, FOUNDINGOS_ACCENT, FOUNDINGOS_BASE, FOUNDINGOS_GLOW, FOUNDINGOS_SURFACE, FOUNDINGOS_SURFACE_GRADIENT } from './brands'

export type UserRole = 'founder' | 'admin' | 'manager' | 'operator'
export type UserTier = 'enterprise' | 'growth' | 'starter'

export type QuantumTheme = {
  background: string
  surface: string
  accent: string
  bgPrimary: string
  bgSecondary: string
  cardBg: string
  borderColor: string
  textColor: string
  subtextColor: string
  glow: string
  glowColor: string
  quantumLines: 'enabled'
}

export const DEFAULT_BRAND_SLUG = 'foundingos'

export const FOUNDINGOS_SHELL_THEME: QuantumTheme = Object.freeze({
  background: FOUNDINGOS_BASE,
  surface: FOUNDINGOS_SURFACE_GRADIENT,
  accent: FOUNDINGOS_ACCENT,
  bgPrimary: FOUNDINGOS_BASE,
  bgSecondary: FOUNDINGOS_SURFACE,
  cardBg: 'rgba(0, 36, 85, 0.82)',
  borderColor: 'rgba(76, 201, 255, 0.26)',
  textColor: '#ffffff',
  subtextColor: '#d9e4ef',
  glow: FOUNDINGOS_GLOW,
  glowColor: FOUNDINGOS_GLOW,
  quantumLines: 'enabled',
})

export const SAFE_FALLBACK_THEME = FOUNDINGOS_SHELL_THEME

export const BRAND_SKINS: Record<string, QuantumTheme> = {
  foundingos: {
    ...FOUNDINGOS_SHELL_THEME,
  },
  core_operations: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#26E07F',
    glow: 'rgba(38, 224, 127, 0.18)',
    glowColor: 'rgba(38, 224, 127, 0.18)',
  },
  core_workforce: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#FFB703',
    glow: 'rgba(255, 183, 3, 0.18)',
    glowColor: 'rgba(255, 183, 3, 0.18)',
  },
  core_intelligence: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#A78BFA',
    glow: 'rgba(167, 139, 250, 0.18)',
    glowColor: 'rgba(167, 139, 250, 0.18)',
  },
}

export const SHELL_SAFE_BRAND_SKINS: Record<string, QuantumTheme> = Object.fromEntries(
  Object.entries(BRAND_SKINS).map(([slug, brandTheme]) => [
    slug,
    Object.freeze({
      ...BRAND_SKINS['foundingos'],
      accent: brandTheme.accent,
      glow: brandTheme.glow,
      glowColor: brandTheme.glowColor,
    }),
  ])
)

export function getShellSafeTheme(slug: string): QuantumTheme {
  return SHELL_SAFE_BRAND_SKINS[slug] ?? SHELL_SAFE_BRAND_SKINS[DEFAULT_BRAND_SLUG]
}

export function getValidBrandSlug(slug: string): string {
  return BRAND_SKINS[slug] ? slug : DEFAULT_BRAND_SLUG
}

export type OutboxItem = {
  id: string
  actionType: string
  brandSlug: string
  payload: Record<string, unknown>
  createdAt: number
  status: 'pending' | 'syncing' | 'synced' | 'failed'
  retryCount: number
  errorMessage?: string
}

interface QuantumState {
  activeBrandSlug: string
  activeConsoleModule: string | null
  role: UserRole
  tier: UserTier
  lowEndMode: boolean
  commandBarOpen: boolean
  quantumWheelOpen: boolean
  isOnline: boolean
  pendingSyncCount: number
  licensedSuites: { core_workforce: boolean; core_intelligence: boolean }
  setActiveBrand: (slug: string) => void
  setActiveConsoleModule: (moduleName: string | null) => void
  setRole: (role: UserRole) => void
  setTier: (tier: UserTier) => void
  toggleLowEndMode: () => void
  setLowEndMode: (enabled: boolean) => void
  setCommandBarOpen: (open: boolean) => void
  setQuantumWheelOpen: (open: boolean) => void
  setIsOnline: (online: boolean) => void
  setPendingSyncCount: (count: number) => void
  setLicensedSuites: (suites: { core_workforce: boolean; core_intelligence: boolean }) => void
  getActiveBrand: () => Brand | undefined
  getActiveTheme: () => QuantumTheme
  getVisibleBrands: () => Brand[]
}

export const useQuantumStore = create<QuantumState>((set, get) => ({
  activeBrandSlug: DEFAULT_BRAND_SLUG,
  activeConsoleModule: null,
  role: 'founder',
  tier: 'enterprise',
  lowEndMode: false,
  commandBarOpen: false,
  quantumWheelOpen: false,
  isOnline: true,
  pendingSyncCount: 0,
  // Defaults to visible so the shell renders instantly; corrected once the real
  // TenantSuiteLicense-backed /module-access check resolves (see _layout.tsx).
  licensedSuites: { core_workforce: true, core_intelligence: true },

  setActiveBrand: (slug: string) => set({ activeBrandSlug: getValidBrandSlug(slug) }),
  setActiveConsoleModule: (moduleName: string | null) => set({ activeConsoleModule: moduleName }),
  setRole: (role: UserRole) => set({ role }),
  setTier: (tier: UserTier) => set({ tier }),
  toggleLowEndMode: () => set((state) => ({ lowEndMode: !state.lowEndMode })),
  setLowEndMode: (enabled: boolean) => set({ lowEndMode: enabled }),
  setCommandBarOpen: (open: boolean) => set({ commandBarOpen: open }),
  setQuantumWheelOpen: (open: boolean) => set({ quantumWheelOpen: open }),
  setIsOnline: (online: boolean) => set({ isOnline: online }),
  setPendingSyncCount: (count: number) => set({ pendingSyncCount: count }),
  setLicensedSuites: (suites) => set({ licensedSuites: suites }),

  getActiveBrand: () => BRANDS.find((b) => b.slug === getValidBrandSlug(get().activeBrandSlug)),
  getActiveTheme: () => getShellSafeTheme(get().activeBrandSlug),
  getVisibleBrands: () => {
    const { licensedSuites } = get()
    return BRANDS.filter((brand) => {
      if (brand.slug === 'core_workforce') return licensedSuites.core_workforce
      if (brand.slug === 'core_intelligence') return licensedSuites.core_intelligence
      return true
    })
  },
}))
