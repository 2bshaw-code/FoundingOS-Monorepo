import assert from 'node:assert/strict'
import test from 'node:test'
import { clampBotPosition, clampBotSize } from './bot-movement'

test('bot stays within viewport on dragging and resizing', () => {
  assert.deepEqual(clampBotPosition({ x: -100, y: -100 }, 390, 844), { x: 8, y: 8 })
  assert.deepEqual(clampBotPosition({ x: 1000, y: 1000 }, 390, 844), { x: 318, y: 772 })
  assert.deepEqual(clampBotPosition({ x: 140, y: 200 }, 390, 844), { x: 140, y: 200 })
  assert.deepEqual(clampBotPosition({ x: 100, y: 100 }, 60, 60), { x: 8, y: 8 })
})

test('all supported bot sizes stay within mobile and desktop bounds', () => {
  for (const size of [64, 96, 128, 192]) {
    for (const [width, height] of [[390, 844], [1280, 900], [240, 320]]) {
      const position = clampBotPosition({ x: 2000, y: 2000 }, width, height, size)
      assert.ok(position.x >= 8 && position.x + size <= width - 8)
      assert.ok(position.y >= 8 && position.y + size <= height - 8)
    }
  }
  assert.equal(clampBotSize(0, 390, 844), 64)
  assert.equal(clampBotSize(500, 390, 844), 192)
  assert.equal(clampBotSize(192, 160, 180), 144)
  assert.equal(clampBotSize(100.6, 390, 844), 101)
})
