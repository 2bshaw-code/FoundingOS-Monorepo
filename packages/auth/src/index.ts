/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { NextAuthOptions } from 'next-auth'

type BrandSlug = 'foundingos' | 'retail' | 'meat' | 'it' | 'talent' | 'crypto'

export type SessionRole = 'admin' | 'staff' | 'user'

export const auth = { disabled: true }

export function authOptionsForBrand(_brandSlug: BrandSlug): NextAuthOptions {
  return {
    session: { strategy: 'jwt' },
    pages: { signIn: '/dashboard' },
    providers: [],
  }
}

export function canAccess(role: unknown, required: SessionRole[] = ['admin', 'staff', 'user']) {
  return required.includes(role as SessionRole)
}