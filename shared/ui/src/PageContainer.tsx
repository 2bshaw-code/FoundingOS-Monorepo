/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ReactNode } from 'react'

export function PageContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`page-container ${className}`.trim()}>{children}</section>
}