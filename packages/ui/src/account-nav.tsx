'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Account controls in the site header: Sign in when signed out; Open app,
// SuperDash (founder, partners and investors) and Sign out when signed in.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { adoptPreviewSession, getProductionSession, logoutProduction, productionRequest } from './workspace-production-client'

export function AccountNavLinks() {
  const [signedIn, setSignedIn] = useState(false)
  const [superDash, setSuperDash] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      let session = getProductionSession()
      if (!session) {
        // Partners and investors who entered their access code on the website are already
        // verified, so sign them in here rather than showing them a signed-out header.
        const gate = await fetch('/api/access/role', { cache: 'no-store' }).then((response) => (response.ok ? response.json() : null)).catch(() => null) as { role?: string } | null
        if (gate?.role !== 'partner' && gate?.role !== 'investor') return
        session = await adoptPreviewSession().catch(() => null)
        if (!session) return
      }
      if (cancelled) return
      setSignedIn(true)
      if (session.user?.role === 'founder_master') { setSuperDash(true); return }
      const access = await productionRequest<{ founder?: boolean; investor?: boolean }>('/founder/access').catch(() => null)
      if (!cancelled && (access?.founder || access?.investor)) setSuperDash(true)
    })()
    return () => { cancelled = true }
  }, [])

  if (!signedIn) return <Link className="site-nav-account" href="/app">Sign in</Link>
  return <>
    <Link href="/app">Open app</Link>
    {superDash ? <Link className="site-nav-superdash" href="/superdash">SuperDash</Link> : null}
    <button className="site-nav-account" onClick={() => { void logoutProduction().finally(() => { window.location.href = '/' }) }} type="button">Sign out</button>
  </>
}
