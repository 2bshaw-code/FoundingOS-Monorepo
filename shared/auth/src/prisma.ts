/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AuthRepository, AuthUser, PasswordResetRecord, SessionRecord } from './core.js'

interface PrismaAuthClient {
  authUser: {
    findUnique(args: unknown): Promise<any>
    update(args: unknown): Promise<any>
  }
  authSession: {
    create(args: unknown): Promise<any>
    findUnique(args: unknown): Promise<any>
    update(args: unknown): Promise<any>
    updateMany(args: unknown): Promise<any>
  }
  passwordReset: {
    create(args: unknown): Promise<any>
    findUnique(args: unknown): Promise<any>
    update(args: unknown): Promise<any>
  }
}

const toUser = (user: any): AuthUser | null => user ? {
  id: user.id,
  email: user.email,
  passwordHash: user.passwordHash,
  role: user.role,
  tenantId: user.tenantId || undefined,
  active: user.active,
} : null

export const createPrismaAuthRepository = (prisma: PrismaAuthClient): AuthRepository => ({
  async findUserByEmail(email) {
    return toUser(await prisma.authUser.findUnique({ where: { email } }))
  },
  async findUserById(id) {
    return toUser(await prisma.authUser.findUnique({ where: { id } }))
  },
  async updatePassword(userId, passwordHash) {
    await prisma.authUser.update({ where: { id: userId }, data: { passwordHash } })
  },
  async createSession(session) {
    return prisma.authSession.create({ data: session }) as Promise<SessionRecord>
  },
  async findSession(id) {
    return prisma.authSession.findUnique({ where: { id } }) as Promise<SessionRecord | null>
  },
  async rotateSession(id, refreshTokenHash, refreshTokenId, expiresAt) {
    await prisma.authSession.update({ where: { id }, data: { refreshTokenHash, refreshTokenId, expiresAt, rotatedAt: new Date() } })
  },
  async revokeSession(id) {
    await prisma.authSession.update({ where: { id }, data: { revokedAt: new Date() } })
  },
  async revokeAllUserSessions(userId) {
    await prisma.authSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })
  },
  async createPasswordReset(reset) {
    return prisma.passwordReset.create({ data: reset }) as Promise<PasswordResetRecord>
  },
  async findPasswordResetByHash(tokenHash) {
    return prisma.passwordReset.findUnique({ where: { tokenHash } }) as Promise<PasswordResetRecord | null>
  },
  async consumePasswordReset(id) {
    await prisma.passwordReset.update({ where: { id }, data: { usedAt: new Date() } })
  },
})