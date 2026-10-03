import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { brandIconPath, isPublicBrandIcon, workspaceBrandIcons } from './brand-icons'
import { WORKSPACES } from '../../../apps/foundingos-mobile/lib/workspace-modules'

test('every workspace has the approved colour and a matching web/native PNG', () => {
  assert.equal(Object.keys(workspaceBrandIcons).length, 9)
  for (const name of ['foundingos', ...Object.keys(workspaceBrandIcons)]) {
    const web = readFileSync(new URL(`../../../apps/foundingos-web/public/brand/fos/${name}.png`, import.meta.url))
    const native = readFileSync(new URL(`../../../apps/foundingos-mobile/assets/brand/${name}.png`, import.meta.url))
    const shared = readFileSync(new URL(`../assets/fos/${name}.png`, import.meta.url))
    assert.ok(web.equals(native), `${name} must match across surfaces`)
    assert.ok(web.equals(shared), `${name} must match the shared console bundle`)
    assert.equal(web.readUInt32BE(16), 256)
    assert.equal(web.readUInt32BE(20), 256)
  }
  for (const workspace of WORKSPACES) assert.ok(workspaceBrandIcons[workspace.slug])
  assert.equal(brandIconPath(), '/brand/fos/foundingos.png')
  assert.equal(brandIconPath('talent'), '/brand/fos/talent.png')
  const main = readFileSync(new URL('../../../apps/foundingos-web/public/brand/fos/foundingos.png', import.meta.url))
  const legal = readFileSync(new URL('../../../apps/foundingos-web/public/brand/fos/legal.png', import.meta.url))
  assert.ok(!main.equals(legal), 'Main multicolour icon must not use the blue workspace variant')
})

test('branding remains separate from the FoundAI mascot and uses the selected workspace', () => {
  const brand = readFileSync(new URL('./brand-mark.tsx', import.meta.url), 'utf8')
  assert.ok(!brand.includes('FoundAIMascot'))
  const workspace = readFileSync(new URL('./complete-workspace-application.tsx', import.meta.url), 'utf8')
  assert.ok(workspace.includes('<FoundingOSBrandMark workspace={workspace} />'))
  const ai = readFileSync(new URL('./found-ai.tsx', import.meta.url), 'utf8')
  assert.ok(ai.includes('<FoundAIMascot'))
})

test('only the ten approved icon paths bypass the website access gate', () => {
  assert.ok(isPublicBrandIcon(brandIconPath()))
  for (const name of Object.keys(workspaceBrandIcons)) assert.ok(isPublicBrandIcon(`/brand/fos/${name}.png`))
  for (const path of ['/brand/fos/README.md', '/brand/fos/private.png', '/brand/fos/talent.png/extra', '/app/talent', '/brand/fos/../secret']) assert.ok(!isPublicBrandIcon(path))
  const middleware = readFileSync(new URL('../../../apps/foundingos-web/middleware.ts', import.meta.url), 'utf8')
  assert.ok(middleware.includes('isPublicBrandIcon(request.nextUrl.pathname)'))
})
