/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { MetadataRoute } from 'next'
import { FOUNDINGOS_BASE, LOCKED_BRAND_COLORS } from '@foundingos/config'

// Real, installable web app manifest for the FoundingOS Console itself — the first real
// candidate for a native app (per explicit product direction), this is also the fastest real
// step towards that: installable today, on every phone, with zero app store review needed.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FoundingOS Console',
    short_name: 'FoundingOS',
    description: 'FoundingOS — one simple control room for all your money, tools, and apps.',
    start_url: '/console',
    display: 'standalone',
    background_color: FOUNDINGOS_BASE,
    theme_color: LOCKED_BRAND_COLORS.foundingos,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
