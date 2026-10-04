import assert from 'node:assert/strict'
import test from 'node:test'
import { clampBotPosition } from './bot-movement'

test('bot stays within viewport on dragging and resizing', () => {
  assert.deepEqual(clampBotPosition({ x: -100, y: -100 }, 390, 844), { x: 8, y: 8 })
  assert.deepEqual(clampBotPosition({ x: 1000, y: 1000 }, 390, 844), { x: 318, y: 772 })
  assert.deepEqual(clampBotPosition({ x: 140, y: 200 }, 390, 844), { x: 140, y: 200 })
  assert.deepEqual(clampBotPosition({ x: 100, y: 100 }, 60, 60), { x: 8, y: 8 })
})
