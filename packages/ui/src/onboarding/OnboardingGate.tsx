/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Thin client-side gate in front of the existing onboarding flow. Does not touch
// OnboardingForm's internals at all — it only decides whether to render it or
// redirect to Tester Login first. Commercial Mode bypasses this entirely.
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { readTesterProfile } from '@foundingos/config/tester-profile'

export function OnboardingGate({ commercialMode, children }: { commercialMode: 'demo' | 'commercial'; children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(commercialMode === 'commercial')

  useEffect(() => {
    if (commercialMode === 'commercial') return
    if (!readTesterProfile()) {
      router.replace('/tester-login')
      return
    }
    setReady(true)
  }, [commercialMode, router])

  if (!ready) return null
  return <>{children}</>
}

export default OnboardingGate
