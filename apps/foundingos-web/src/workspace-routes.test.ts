import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { talentModules } from '@foundingos/ui/talent-workspace'
import { WORKSPACES } from '../../foundingos-mobile/lib/workspace-modules'
import { workspaceSections, workspaceStaticParams } from './workspace-routes'
import { financeModuleLabels } from '@foundingos/ui/finance-labels'

test('every web/native Talent menu destination is accepted and statically registered', () => {
  const paths = new Set(workspaceStaticParams().map(({ slug }) => slug.join('/')))
  assert.deepEqual(workspaceSections.talent, talentModules.map((module) => module.id))
  for (const module of talentModules) {
    for (const root of ['app', 'test-workspaces']) {
      const path = [root, 'talent', ...(module.id === 'overview' ? [] : [module.id])].join('/')
      assert.ok(paths.has(path), `${path} must be generated while dynamicParams=false`)
    }
  }
  assert.equal(new Set(workspaceStaticParams().map(({ slug }) => slug.join('/'))).size, workspaceStaticParams().length)
  assert.ok(!paths.has('app/talent/not-a-module'))
})

test('every workspace menu module has a registered website route', () => {
  for (const workspace of WORKSPACES) {
    const sections = workspaceSections[workspace.slug]
    for (const module of workspace.modules) assert.ok(sections.includes(module.id), `${workspace.slug}/${module.id} is missing`)
  }
})

test('formal Finance names retain existing native and website route identifiers', () => {
  const finance = WORKSPACES.find((workspace) => workspace.slug === 'finance')
  assert.ok(finance)
  const web = readFileSync(new URL('../../../packages/ui/src/complete-workspace-application.tsx', import.meta.url), 'utf8')
  for (const [id, label] of Object.entries(financeModuleLabels)) {
    assert.equal(finance.modules.find((module) => module.id === id)?.label, label)
    assert.ok(workspaceSections.finance.includes(id))
    assert.ok(web.includes(`workspaceModule('${id}', financeModuleLabels.${id}`))
  }
})

test('the catch-all page consumes the tested route registry for generation and validation', () => {
  const page = readFileSync(new URL('../app/[[...slug]]/page.tsx', import.meta.url), 'utf8')
  assert.match(page, /\.\.\.workspaceStaticParams\(\)/)
  assert.match(page, /workspaceSections\[workspace\]\.includes\(section\)/)
  assert.match(page, /dynamicParams = false/)
})
