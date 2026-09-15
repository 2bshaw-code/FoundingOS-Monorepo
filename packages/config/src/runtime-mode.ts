export type AppMode = 'demo' | 'production'

const productionCredentialKeys = [
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
  'CLERK_SECRET_KEY',
  'AWS_S3_BUCKET',
] as const

export function getAppMode(env: NodeJS.ProcessEnv = process.env): AppMode {
  if (env.APP_MODE === 'demo') return 'demo'
  const hasProductionCredentials = productionCredentialKeys.every((key) => Boolean(env[key]))
  if (env.APP_MODE === 'production') return hasProductionCredentials ? 'production' : 'demo'
  return hasProductionCredentials ? 'production' : 'demo'
}

export function isDemoMode(env: NodeJS.ProcessEnv = process.env): boolean {
  return getAppMode(env) === 'demo'
}

export type RuntimeProviders = {
  billing: 'mock' | 'stripe'
  auth: 'mock' | 'clerk'
  email: 'mock' | 'resend'
  sms: 'mock' | 'twilio'
  monitoring: 'mock' | 'sentry'
  storage: 'local' | 's3'
  metering: 'mock' | 'usage-events'
  onboarding: 'mock' | 'customer-workspace'
}

export function getRuntimeProviders(env: NodeJS.ProcessEnv = process.env): RuntimeProviders {
  return isDemoMode(env)
    ? {
        billing: 'mock',
        auth: 'mock',
        email: 'mock',
        sms: 'mock',
        monitoring: 'mock',
        storage: 'local',
        metering: 'mock',
        onboarding: 'mock',
      }
    : {
        billing: 'stripe',
        auth: 'clerk',
        email: 'resend',
        sms: 'twilio',
        monitoring: 'sentry',
        storage: 's3',
        metering: 'usage-events',
        onboarding: 'customer-workspace',
      }
}
