import assert from 'node:assert/strict'
import { test } from 'node:test'
import { NextRequest } from 'next/server'
import { POST } from '../app/api/access/logout/route'
import { SITE_ACCESS_COOKIE } from './site-access'

test('website logout expires both preview and founder cookies and redirects to access', async () => {
  const response = await POST(new NextRequest('https://www.foundingos.com/api/access/logout', { method: 'POST' }))
  assert.equal(response.status, 303)
  assert.equal(response.headers.get('location'), 'https://www.foundingos.com/access')
  assert.equal(response.headers.get('cache-control'), 'no-store')
  for (const name of [SITE_ACCESS_COOKIE, 'fo_tester_admin_session']) {
    const cookie = response.cookies.get(name)
    assert.equal(cookie?.value, '')
    assert.equal(cookie?.expires?.valueOf(), 0)
    assert.equal(cookie?.path, '/')
  }
})
