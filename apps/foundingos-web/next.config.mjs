// In demo mode, skip transpiling the Prisma-backed @foundingos/db (and @foundingos/auth,
// which re-exports it) since this app never imports them directly — including them here
// forces Next to resolve @prisma/client, whose generated client is unavailable/unbuildable
// on this iCloud-synced workspace and stalls the build indefinitely.
const DEMO_MODE = process.env.APP_MODE === 'demo'
const nextConfig = {
  output: 'export',
  transpilePackages: DEMO_MODE
    ? ['@foundingos/ui', '@foundingos/config']
    : ['@foundingos/ui', '@foundingos/config', '@foundingos/auth', '@foundingos/db'],
  distDir: process.env.DEMO_BUILD_DIR || '.next',
}

export default nextConfig
