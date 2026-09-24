/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Zero-dependency crash reporting. There's no Sentry/PostHog DSN configured
// anywhere in this repo, and this change can't fabricate one — so rather
// than scaffold a third-party SDK that silently does nothing, this reuses
// the action-logger + telemetry pipeline that already exists (see
// docs/telemetry.md and lib/telemetry-client.ts, which flushes 'failure'
// entries to the backend immediately). A 'crash' entry is exactly that: a
// failure entry, so it gets the same immediate-flush treatment for free.
// If/when the user supplies a real Sentry or PostHog DSN, swap
// installGlobalErrorHandlers()'s body for that SDK's native crash handler —
// the call sites below (app/_layout.tsx, components/CrashBoundary.tsx) don't
// need to change.
import { Platform } from 'react-native'
import { logAction } from './action-logger'

function truncate(message: string, max = 300): string {
  return message.length > max ? `${message.slice(0, max)}…` : message
}

export function reportCrash(error: unknown, context: 'render' | 'fatal-js' | 'unhandled-rejection'): void {
  const message = error instanceof Error ? error.message : String(error)
  const name = error instanceof Error ? error.name : 'UnknownError'
  logAction('crash', 'failure', {
    context,
    name,
    message: truncate(message),
  })
}

let installed = false

export function installGlobalErrorHandlers(): void {
  if (installed) return
  installed = true

  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return
    window.addEventListener('error', (event) => reportCrash(event.error ?? event.message, 'fatal-js'))
    window.addEventListener('unhandledrejection', (event) => reportCrash(event.reason, 'unhandled-rejection'))
    return
  }

  // React Native's global handler — chain to the previous one (RN's own
  // redbox/native crash reporter in dev, or the default fatal-error
  // behaviour in production) so this only *adds* reporting, never replaces
  // the platform's own crash handling.
  const g = globalThis as unknown as {
    ErrorUtils?: {
      getGlobalHandler: () => (error: unknown, isFatal?: boolean) => void
      setGlobalHandler: (handler: (error: unknown, isFatal?: boolean) => void) => void
    }
  }
  if (!g.ErrorUtils) return
  const previousHandler = g.ErrorUtils.getGlobalHandler()
  g.ErrorUtils.setGlobalHandler((error, isFatal) => {
    reportCrash(error, 'fatal-js')
    previousHandler?.(error, isFatal)
  })
}
