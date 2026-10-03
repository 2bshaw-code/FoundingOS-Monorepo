'use client'
import { FoundingOSBrandMark } from './brand-mark'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Account controls in the site header: Sign in when signed out; Open app,
// SuperDash (founder, partners and investors) and Sign out when signed in.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { adoptPreviewSession, getProductionSession, signOutOfFoundingOS, productionRequest } from './workspace-production-client'

export function AccountNavLinks({ variant = 'account' }: { variant?: 'account' | 'superdash' | 'card' } = {}) {
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

  if (variant !== 'account') {
    if (variant === 'card') return <Link href="/superdash">
      <FoundingOSBrandMark workspace="superdash" />
      <div><small>Founder, partner and investor access required</small><h2>Founder SuperDash</h2><p>Run FoundingOS itself: business, finance, sales, marketing media and legal.</p></div>
      <footer><strong>Separate from Core Intelligence</strong><b>{superDash ? 'Open SuperDash' : 'Open protected SuperDash'}</b></footer>
    </Link>
    return <Link className="retail-product-switcher" href="/superdash"><span>Founder SuperDash</span><b>↗</b></Link>
  }
  if (!signedIn) return <><Link className="site-nav-account" href="/app">Sign in</Link><Link href="/superdash">SuperDash</Link></>
  return <>
    <Link href="/app">Open app</Link>
    <Link className="site-nav-superdash" href="/superdash">SuperDash</Link>
    <button className="site-nav-account" onClick={() => { void signOutOfFoundingOS() }} type="button">Sign out</button>
  </>
}
