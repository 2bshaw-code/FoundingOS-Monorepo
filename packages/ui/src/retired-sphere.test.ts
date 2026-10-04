import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('legacy web and native sphere imports render approved FOS marks', () => {
  for (const path of ['./QuantumSphereLogo.tsx', '../../../apps/foundingos-mobile/components/QuantumSphere.tsx']) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8')
    assert.match(source, /<FoundingOSBrandMark size=\{size\}/)
    assert.doesNotMatch(source, /<svg|<Svg|<Circle|<circle|radialGradient|RadialGradient/)
  }
})

test('collapsed coaches and inactive mascots cannot turn back into bare spheres', () => {
  const coach = readFileSync(new URL('./pro-coach.tsx', import.meta.url), 'utf8')
  assert.match(coach, /<FoundAIMascot active thinking=\{asking\}/)
  const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
  for (const part of ['limbs', 'face']) {
    const rule = css.match(new RegExp(`\\.foundai-mascot-${part} \\{([^}]+)\\}`))?.[1]
    assert.ok(rule)
    assert.match(rule, /opacity: 1;/)
    assert.doesNotMatch(rule, /scale\(\.05\)/)
  }
})
