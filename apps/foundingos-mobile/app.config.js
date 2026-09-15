/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Multi-brand build entrypoint: one shared codebase (this app) produces 9 separately
// installable/branded App Store & Play Store apps (FoundingOS + 8 brand apps), selected at
// build time via the BRAND env var (set per EAS build profile in eas.json). This intentionally
// avoids copying the app into 8 separate folders — every bug fix, dependency bump, and feature
// automatically applies to all 9 apps since they share one codebase. Runtime brand-specific
// behaviour (colors, module visibility, etc.) reads `Constants.expoConfig.extra.brand`, the
// same value baked in here.
const fs = require('fs')
const path = require('path')

const baseConfig = require('./app.base.json').expo

function deepMerge(base, override) {
  if (Array.isArray(base) || Array.isArray(override)) return override ?? base
  if (typeof base === 'object' && base !== null && typeof override === 'object' && override !== null) {
    const merged = { ...base }
    for (const key of Object.keys(override)) {
      merged[key] = deepMerge(base[key], override[key])
    }
    return merged
  }
  return override ?? base
}

module.exports = () => {
  const brand = process.env.BRAND || 'foundingos'
  const brandConfigPath = path.join(__dirname, 'brands', `${brand}.json`)

  if (brand === 'foundingos' || !fs.existsSync(brandConfigPath)) {
    return { expo: baseConfig }
  }

  const brandOverrides = JSON.parse(fs.readFileSync(brandConfigPath, 'utf8'))
  return { expo: deepMerge(baseConfig, brandOverrides) }
}
