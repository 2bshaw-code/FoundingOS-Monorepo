/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'

export function TesterGreeting() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    setEmail(window.sessionStorage.getItem('testerEmail'))
  }, [])

  if (!email) return null
  return <span style={{ display: 'block', marginTop: 4 }}>Signed in as {email}</span>
}
