/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { MetadataRoute } from 'next'
import { brandConfig } from './brand-config'

// Real, installable web app manifest — lets a tester/customer add this console to their
// phone's home screen and open it full-screen, no browser chrome, like a real app. Uses the
// same real brand accent/name already used everywhere else in this console.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brandConfig.name} Console`,
    short_name: brandConfig.name,
    description: `${brandConfig.name} — manage your business from one simple control room.`,
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#05060a',
    theme_color: brandConfig.accent,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
