/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { defaultCache } from '@serwist/next/worker'
import { Serwist } from 'serwist'
import type { PrecacheEntry } from 'serwist'

declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }

// Real, working offline support — precaches every static asset Next.js's build produces
// (serwist injects the manifest at build time into __SW_MANIFEST) plus runtime caching for
// pages/API calls, so a returning visitor on a flaky connection still gets a usable app shell
// instead of a blank browser error page.
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
})

serwist.addEventListeners()
