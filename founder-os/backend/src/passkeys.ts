/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import bcrypt from 'bcrypt'
import { Router, type Request } from 'express'
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse, type AuthenticationResponseJSON, type AuthenticatorTransportFuture, type RegistrationResponseJSON } from '@simplewebauthn/server'
import { authSuccess, getDeviceFingerprint } from '@founder-os/auth'
import { authService, prisma, requireEcosystemAccess } from './auth.js'

const rpID = process.env.WEBAUTHN_RP_ID || 'localhost'
const rpName = process.env.WEBAUTHN_RP_NAME || 'FoundingOS'
const origins = (process.env.WEBAUTHN_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3005').split(',')
const challengeTtl = 5 * 60 * 1000
const normalizeEmail = (value: unknown) => String(value || '').trim().toLowerCase()
const context = (req: Request) => ({ deviceFingerprint: getDeviceFingerprint(req.headers), ipAddress: req.ip })

const saveChallenge = async (email: string, type: string, challenge: string) => {
  await prisma.passkeyChallenge.deleteMany({ where: { email, type } })
  await prisma.passkeyChallenge.create({ data: { email, type, challenge, expiresAt: new Date(Date.now() + challengeTtl) } })
}
const readChallenge = async (email: string, type: string) => prisma.passkeyChallenge.findFirst({ where: { email, type, expiresAt: { gt: new Date() } }, orderBy: { createdAt: 'desc' } })

export const passkeyRouter = Router()

passkeyRouter.post('/registration/options', requireEcosystemAccess, async (_req, res, next) => {
  try {
    const identity = res.locals.auth
    let user = await prisma.authUser.findUnique({ where: { email: identity.email } })
    if (!user) user = await prisma.authUser.create({ data: { email: identity.email, passwordHash: await bcrypt.hash(crypto.randomUUID(), 12), role: identity.role, tenantId: identity.tenantId, active: true } })
    else if (user.role !== identity.role || user.tenantId !== identity.tenantId) user = await prisma.authUser.update({ where: { id: user.id }, data: { role: identity.role, tenantId: identity.tenantId } })
    const credentials = await prisma.passkeyCredential.findMany({ where: { userId: user.id } })
    const options = await generateRegistrationOptions({ rpName, rpID, userName: user.email, userDisplayName: user.email, userID: new TextEncoder().encode(user.id), attestationType: 'none', preferredAuthenticatorType: 'localDevice', authenticatorSelection: { residentKey: 'preferred', userVerification: 'required' }, excludeCredentials: credentials.map((credential) => ({ id: credential.credentialId, transports: (credential.transports || []) as AuthenticatorTransportFuture[] })) })
    await saveChallenge(user.email, 'registration', options.challenge)
    res.json({ success: true, data: options })
  } catch (error) { next(error) }
})

passkeyRouter.post('/registration/verify', requireEcosystemAccess, async (req, res, next) => {
  try {
    const email = normalizeEmail(res.locals.auth.email)
    const challenge = await readChallenge(email, 'registration')
    if (!challenge) return res.status(400).json({ success: false, message: 'Passkey registration challenge expired' })
    const verification = await verifyRegistrationResponse({ response: req.body?.response as RegistrationResponseJSON, expectedChallenge: challenge.challenge, expectedOrigin: origins, expectedRPID: rpID, requireUserVerification: true })
    if (!verification.verified) return res.status(400).json({ success: false, message: 'Passkey registration failed' })
    const user = await prisma.authUser.findUniqueOrThrow({ where: { email } })
    const credential = verification.registrationInfo.credential
    await prisma.passkeyCredential.upsert({ where: { credentialId: credential.id }, create: { credentialId: credential.id, publicKey: Buffer.from(credential.publicKey), counter: BigInt(credential.counter), transports: credential.transports || [], deviceType: verification.registrationInfo.credentialDeviceType, backedUp: verification.registrationInfo.credentialBackedUp, userId: user.id }, update: { publicKey: Buffer.from(credential.publicKey), counter: BigInt(credential.counter), transports: credential.transports || [], deviceType: verification.registrationInfo.credentialDeviceType, backedUp: verification.registrationInfo.credentialBackedUp, userId: user.id } })
    await prisma.passkeyChallenge.delete({ where: { id: challenge.id } })
    res.json({ success: true })
  } catch (error) { next(error) }
})

passkeyRouter.post('/authentication/options', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email)
    const user = await prisma.authUser.findUnique({ where: { email }, include: { passkeys: true } })
    if (!user?.passkeys.length) return res.status(404).json({ success: false, message: 'No passkey is registered for this account' })
    const options = await generateAuthenticationOptions({ rpID, userVerification: 'required', allowCredentials: user.passkeys.map((credential) => ({ id: credential.credentialId, transports: (credential.transports || []) as AuthenticatorTransportFuture[] })) })
    await saveChallenge(email, 'authentication', options.challenge)
    res.json({ success: true, data: options })
  } catch (error) { next(error) }
})

passkeyRouter.post('/authentication/verify', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email)
    const response = req.body?.response as AuthenticationResponseJSON
    const challenge = await readChallenge(email, 'authentication')
    const credential = await prisma.passkeyCredential.findUnique({ where: { credentialId: response?.id }, include: { user: true } })
    if (!challenge || !credential || credential.user.email !== email) return res.status(400).json({ success: false, message: 'Passkey authentication challenge expired' })
    const verification = await verifyAuthenticationResponse({ response, expectedChallenge: challenge.challenge, expectedOrigin: origins, expectedRPID: rpID, requireUserVerification: true, credential: { id: credential.credentialId, publicKey: new Uint8Array(credential.publicKey), counter: Number(credential.counter), transports: (credential.transports || []) as AuthenticatorTransportFuture[] } })
    if (!verification.verified) return res.status(401).json({ success: false, message: 'Passkey authentication failed' })
    await prisma.passkeyCredential.update({ where: { id: credential.id }, data: { counter: BigInt(verification.authenticationInfo.newCounter), lastUsedAt: new Date() } })
    await prisma.passkeyChallenge.delete({ where: { id: challenge.id } })
    res.json(authSuccess(await authService.loginWithVerifiedIdentity(email, context(req))))
  } catch (error) { next(error) }
})
