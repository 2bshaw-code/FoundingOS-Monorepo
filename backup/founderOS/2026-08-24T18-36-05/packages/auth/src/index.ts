import type { NextAuthOptions } from 'next-auth'
import type { BrandSlug } from '@foundingos/config'

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