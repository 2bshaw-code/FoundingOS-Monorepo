import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ProExperience, useExperienceMode } from './pro-coach'

function Mode() {
  const [mode] = useExperienceMode()
  return <span>{mode}</span>
}

test('SuperDash forces Pro without changing the default in ordinary workspaces', () => {
  assert.equal(renderToStaticMarkup(<Mode />), '<span>guided</span>')
  assert.equal(renderToStaticMarkup(<ProExperience><Mode /></ProExperience>), '<span>pro</span>')
  assert.equal(renderToStaticMarkup(<Mode />), '<span>guided</span>')
})
