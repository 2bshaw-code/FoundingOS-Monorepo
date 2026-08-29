/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export const founderOsTheme = {
  primary: '#7dd3fc',
  secondary: '#a78bfa',
  accent: '#7dd3fc',
  background: '#050816',
  surface: '#0b1220',
  panel: 'rgba(15, 23, 42, 0.76)',
  line: 'rgba(148, 163, 184, 0.22)',
  text: '#e5eefc',
  muted: '#a9bad5',
  radius: '20px',
  shadow: '0 24px 64px rgba(2, 6, 23, 0.55)',
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    heading: '700 2.5rem/1.1 "Inter", "Segoe UI", sans-serif',
    body: '400 1rem/1.6 "Inter", "Segoe UI", sans-serif',
    label: '700 0.72rem/1.3 "Inter", "Segoe UI", sans-serif',
  },
} as const

export const brandTheme = {
  founderOs: founderOsTheme,
  foundretail: { ...founderOsTheme, primary: '#4ade80', secondary: '#1f2937', accent: '#4ade80', surface: '#0d1724' },
  foundmeat: { ...founderOsTheme, primary: '#fb7185', secondary: '#fda4af', accent: '#fb7185', surface: '#170b14' },
  foundthis: { ...founderOsTheme, primary: '#facc15', secondary: '#fef3c7', accent: '#facc15', surface: '#17130a' },
  foundit: { ...founderOsTheme, primary: '#facc15', secondary: '#fef3c7', accent: '#facc15', surface: '#17130a' },
  foundtalent: { ...founderOsTheme, primary: '#fb923c', secondary: '#fdba74', accent: '#fb923c', surface: '#1b120d' },
  foundcrypto: { ...founderOsTheme, primary: '#a78bfa', secondary: '#c4b5fd', accent: '#a78bfa', surface: '#100d1d' },
} as const