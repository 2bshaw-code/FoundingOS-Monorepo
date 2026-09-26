/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Metadata } from 'next'
import { FounderSuperDash } from '@foundingos/ui/founder-superdash'

export const metadata: Metadata = { title: 'SuperDash | FoundingOS', robots: { index: false, follow: false } }

export default function SuperDashPage() {
  return <FounderSuperDash />
}
