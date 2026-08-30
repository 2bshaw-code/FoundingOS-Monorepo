/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { getPrismaClient } from '@foundingos/db'
import { isAuthConfigured } from '@foundingos/config/commercial-mode'

// All 8 real ecosystem brands, plus FoundingOS itself.
type BrandSlug = 'foundingos' | 'retail' | 'meat' | 'foundthat' | 'talent' | 'crypto' | 'finance' | 'health' | 'logistics'

export type SessionRole = 'admin' | 'staff' | 'user'

export const auth = { disabled: !isAuthConfigured() }

export function authOptionsForBrand(_brandSlug: BrandSlug): NextAuthOptions {
  // Dormant by default: without EMAIL_SERVER/EMAIL_FROM/NEXTAUTH_SECRET this returns
  // the exact same empty-providers config as before — zero change to current behavior.
  if (!isAuthConfigured()) {
    return {
      session: { strategy: 'jwt' },
      pages: { signIn: '/dashboard' },
      providers: [],
    }
  }

  const prisma = getPrismaClient()
  return {
    // Adapter is only attached once a real DB is configured too — auth can be "configured"
    // (env vars present) while DB is still absent, in which case sessions fall back to JWT.
    adapter: prisma ? PrismaAdapter(prisma as any) : undefined,
    session: { strategy: prisma ? 'database' : 'jwt' },
    pages: { signIn: '/dashboard' },
    providers: [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
      }),
    ],
  }
}

export function canAccess(role: unknown, required: SessionRole[] = ['admin', 'staff', 'user']) {
  return required.includes(role as SessionRole)
}
