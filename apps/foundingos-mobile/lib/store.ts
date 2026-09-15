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
  retail: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#00A651',
    glow: 'rgba(0, 166, 81, 0.18)',
    glowColor: 'rgba(0, 166, 81, 0.18)',
  },
  crypto: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#9D00FF',
    glow: 'rgba(153, 51, 255, 0.15)',
    glowColor: 'rgba(153, 51, 255, 0.15)',
  },
  meat: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#FF3B3B',
    glow: 'rgba(255, 0, 51, 0.15)',
    glowColor: 'rgba(255, 0, 51, 0.15)',
  },
  talent: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#FF7A00',
    glow: 'rgba(255, 136, 0, 0.15)',
    glowColor: 'rgba(255, 136, 0, 0.15)',
  },
  foundthat: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#FFD300',
    glow: 'rgba(255, 221, 0, 0.15)',
    glowColor: 'rgba(255, 221, 0, 0.15)',
  },
  foundit: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#FFD300',
    glow: 'rgba(255, 221, 0, 0.15)',
    glowColor: 'rgba(255, 221, 0, 0.15)',
  },
  finance: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#A8A8A8',
    glow: 'rgba(168, 168, 168, 0.18)',
    glowColor: 'rgba(168, 168, 168, 0.18)',
  },
  health: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#4FC3F7',
    glow: 'rgba(51, 204, 255, 0.15)',
    glowColor: 'rgba(51, 204, 255, 0.15)',
  },
  logistics: {
    ...FOUNDINGOS_SHELL_THEME,
    accent: '#DC143C',
    glow: 'rgba(220, 20, 60, 0.15)',
    glowColor: 'rgba(220, 20, 60, 0.15)',
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

function getValidBrandSlug(slug: string): string {
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
  // Console & Brand selection
  activeBrandSlug: string
  activeConsoleModule: string | null
  role: UserRole
  tier: UserTier
  
  // Africa-ready / Performance mode
  lowEndMode: boolean
  
  // UI state
  commandBarOpen: boolean
  quantumWheelOpen: boolean
  isOnline: boolean
  
  // Outbox sync count
  pendingSyncCount: number
  
  // Actions
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
  
  // Computed getters
  getActiveBrand: () => Brand | undefined
  getActiveTheme: () => QuantumTheme
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

  getActiveBrand: () => BRANDS.find((b) => b.slug === getValidBrandSlug(get().activeBrandSlug)),
  getActiveTheme: () => getShellSafeTheme(get().activeBrandSlug),
}))
