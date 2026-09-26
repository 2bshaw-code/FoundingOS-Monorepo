'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Account controls in the site header: Sign in when signed out; Open app,
// SuperDash (founder only) and Sign out when signed in.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProductionSession, logoutProduction, productionRequest } from './workspace-production-client'

export function AccountNavLinks() {
  const [signedIn, setSignedIn] = useState(false)
  const [founder, setFounder] = useState(false)

  useEffect(() => {
    const session = getProductionSession()
    setSignedIn(Boolean(session))
    if (!session) return
    if (session.user?.role === 'founder_master') { setFounder(true); return }
    productionRequest<{ founder: boolean }>('/founder/access').then((access) => setFounder(Boolean(access?.founder))).catch(() => undefined)
  }, [])

  if (!signedIn) return <Link className="site-nav-account" href="/app">Sign in</Link>
  return <>
    <Link href="/app">Open app</Link>
    {founder ? <Link className="site-nav-superdash" href="/superdash">SuperDash</Link> : null}
    <button className="site-nav-account" onClick={() => { void logoutProduction().finally(() => { window.location.href = '/' }) }} type="button">Sign out</button>
  </>
}
