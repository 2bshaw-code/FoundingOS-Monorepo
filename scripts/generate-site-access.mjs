#!/usr/bin/env node
import { randomBytes, scryptSync } from 'node:crypto'

const password = `FoundingOS-${randomBytes(7).toString('base64url')}!`
const salt = randomBytes(16)
const passwordHash = `scrypt$${salt.toString('hex')}$${scryptSync(password, salt, 32).toString('hex')}`
const secret = randomBytes(32).toString('base64url')

console.log(`Share this password with invited testers: ${password}`)
console.log('\nAdd these values to the web deployment environment:')
console.log('SITE_ACCESS_ENABLED=true')
console.log(`SITE_ACCESS_PASSWORD_HASH=${passwordHash}`)
console.log(`SITE_ACCESS_SECRET=${secret}`)
