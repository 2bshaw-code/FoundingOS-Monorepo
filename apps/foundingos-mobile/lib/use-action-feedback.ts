/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// One feedback pattern for every screen with optimistic actions (Today,
// Approvals, module screens): a single banner with a tone, a message, and an
// optional retry action, replacing the bespoke `notice`/`showNotice` string
// state that used to be duplicated (with slightly different behaviour) in
// home.tsx, workflows.tsx, workforce.tsx, and module.tsx.
import { useCallback, useRef, useState } from 'react'
import { normalizeError } from './errors'
import { logAction } from './action-logger'

export type FeedbackTone = 'success' | 'warning' | 'danger' | 'info'

export type FeedbackState = {
  message: string
  tone: FeedbackTone
  onRetry?: () => void
} | null

const AUTO_DISMISS_MS = 4000

export function useActionFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState>(null)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    setFeedback(null)
  }, [])

  const show = useCallback((next: FeedbackState, autoDismiss = true) => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    setFeedback(next)
    // Errors with a retry action stay until the user acts or dismisses
    // another way; everything else clears itself so the screen stays calm.
    if (autoDismiss && !(next && next.onRetry)) {
      dismissTimer.current = setTimeout(() => setFeedback(null), AUTO_DISMISS_MS)
    }
  }, [])

  const showSuccess = useCallback((message: string) => show({ message, tone: 'success' }), [show])

  const showWarning = useCallback((message: string) => show({ message, tone: 'warning' }), [show])

  const showOffline = useCallback((message = 'Offline — queued for secure sync.') => show({ message, tone: 'warning' }), [show])

  // Surfaces a real (4xx) rejection or a network/5xx failure with the right
  // tone and, for genuine rejections, a way to try the same action again.
  const showError = useCallback(
    (err: unknown, retry?: () => void) => {
      const normalized = normalizeError(err)
      if (normalized.kind === 'rejected') {
        logAction('action_error', 'failure', { kind: 'rejected', status: normalized.status ?? null })
        show({ message: normalized.message, tone: 'danger', onRetry: retry }, false)
      } else {
        logAction('action_error', 'failure', { kind: 'network', status: normalized.status ?? null })
        showOffline(normalized.message)
      }
    },
    [show, showOffline],
  )

  return { feedback, showSuccess, showWarning, showOffline, showError, clear }
}
