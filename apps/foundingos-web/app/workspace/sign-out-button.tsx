/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useRouter } from 'next/navigation'
import { QuantumButtonGhost } from '@foundingos/ui/quantum'

export function SignOutButton() {
  const router = useRouter()

  async function onClick() {
    await fetch('/api/session/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return <QuantumButtonGhost type="button" onClick={() => void onClick()}>Sign out</QuantumButtonGhost>
}
