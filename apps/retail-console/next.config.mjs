/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // Skip PWA build during local `next dev` — only generate the real service worker for
  // production builds, matching serwist's own documented recommendation (a service worker
  // active during dev makes hot-reload/debugging unreliable).
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
}

export default withSerwist(nextConfig)
