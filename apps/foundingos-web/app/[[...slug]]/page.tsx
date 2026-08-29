/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FounderLauncher } from '@foundingos/ui'
import { notFound } from 'next/navigation'

const pages = new Set(['about', 'pricing', 'contact'])

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const page = slug[0] || 'home'
  if (page === 'home') return <FounderLauncher />
  if (!pages.has(page)) notFound()
  return <FounderLauncher />
}