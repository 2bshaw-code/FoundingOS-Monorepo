'use client'

import { useRouter } from 'next/navigation'

// Returns to the previous page when the visitor navigated here from within the site,
// otherwise to `fallbackHref` (e.g. opened from a shared link or new tab).
export function BackButton({ fallbackHref = '/', label = 'Back' }: { fallbackHref?: string; label?: string }) {
  const router = useRouter()
  const goBack = () => {
    const cameFromSite = typeof document !== 'undefined' && document.referrer.startsWith(window.location.origin)
    if (cameFromSite && window.history.length > 1) router.back()
    else router.push(fallbackHref)
  }
  return <button className="site-back-button" onClick={goBack} type="button">← {label}</button>
}
