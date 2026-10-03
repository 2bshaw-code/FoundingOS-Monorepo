export const workspaceBrandIcons = {
  retail: { label: 'Retail', accent: '#24c47a' },
  finance: { label: 'Finance', accent: '#ffb33e' },
  marketing: { label: 'Marketing', accent: '#f56fc2' },
  logistics: { label: 'Logistics', accent: '#ff496e' },
  legal: { label: 'Legal', accent: '#3158d4' },
  health: { label: 'Health', accent: '#4cc9ff' },
  talent: { label: 'Talent', accent: '#ff8a33' },
  hr: { label: 'HR', accent: '#2ec4b6' },
  intelligence: { label: 'Intelligence', accent: '#b77aff' },
} as const

export type WorkspaceBrandIcon = keyof typeof workspaceBrandIcons
export type BrandIcon = WorkspaceBrandIcon | 'superdash'

export function brandIconPath(workspace?: BrandIcon) {
  return `/brand/fos/${workspace ?? 'foundingos'}.png`
}

const publicBrandPaths = new Set([brandIconPath(), brandIconPath('superdash'), ...Object.keys(workspaceBrandIcons).map((key) => `/brand/fos/${key}.png`)])

export function brandIconLabel(icon?: BrandIcon) {
  return icon === 'superdash' ? 'SuperDash logo' : icon ? `${workspaceBrandIcons[icon].label} workspace logo` : 'FoundingOS logo'
}

export function isPublicBrandIcon(path: string) {
  return publicBrandPaths.has(path)
}
