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

export function brandIconPath(workspace?: WorkspaceBrandIcon) {
  return `/brand/fos/${workspace ?? 'foundingos'}.png`
}

const publicBrandPaths = new Set([brandIconPath(), ...Object.keys(workspaceBrandIcons).map((key) => `/brand/fos/${key}.png`)])

export function isPublicBrandIcon(path: string) {
  return publicBrandPaths.has(path)
}
