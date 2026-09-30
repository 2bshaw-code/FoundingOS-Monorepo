const test = require('node:test')
const assert = require('node:assert')
const Module = require('node:module')

// Load main.js without starting Electron.
const originalLoad = Module._load
Module._load = function (request, ...rest) {
  if (request === 'electron') {
    const noop = () => {}
    return {
      app: { setName: noop, requestSingleInstanceLock: () => false, quit: noop, on: noop },
      BrowserWindow: { getAllWindows: () => [] },
      shell: {}, session: {}, Menu: {},
    }
  }
  return originalLoad.call(this, request, ...rest)
}
const { isTrusted } = require('./main.js')
Module._load = originalLoad

test('only FoundingOS over https stays inside the app', () => {
  assert.equal(isTrusted('https://www.foundingos.com/app/retail'), true)
  assert.equal(isTrusted('https://foundingos.com/privacy'), true)
  assert.equal(isTrusted('https://core-operations-backend.vercel.app/health'), true)
  assert.equal(isTrusted('http://www.foundingos.com/app'), false)
  assert.equal(isTrusted('https://foundingos.com.evil.example/app'), false)
  assert.equal(isTrusted('https://wa.me/447000000000'), false)
  assert.equal(isTrusted('not a url'), false)
})
