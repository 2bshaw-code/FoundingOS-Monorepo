import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { FoundAIMascot } from './foundai-mascot'
import { BOT_CHARACTERS } from './foundai-preferences'

test('folded-light mascot renders sculpted ribbons without a sphere backdrop', () => {
  const markup = renderToStaticMarkup(createElement(FoundAIMascot, { size: 64, active: true, thinking: true, character: 'folded' }))
  assert.match(markup, /width="64" height="64" viewBox="0 0 160 180"/)
  assert.match(markup, /aria-hidden="true" focusable="false"/)
  assert.match(markup, /foundai-mascot is-active is-thinking/)
  assert.match(markup, /-ribbon/)
  assert.match(markup, /-edge/)
  assert.match(markup, /-ink/)
  assert.doesNotMatch(markup, /-chrome|-pearl|-glass/)
  assert.doesNotMatch(markup, /<circle/)
  for (const part of ['arm-left', 'arm-right', 'leg-left', 'leg-right', 'eyes', 'body']) {
    assert.ok(markup.includes(`foundai-mascot-${part}`))
  }
})

test('colour customisation and every accessory survive the folded-light redesign', () => {
  for (const accessory of ['none', 'glasses', 'bowtie', 'crown'] as const) {
    const markup = renderToStaticMarkup(createElement(FoundAIMascot, { colour: '#a78bfa', accessory, character: 'folded' }))
    assert.match(markup, /fill="#a78bfa"/)
    assert.match(markup, /stroke="#a78bfa"/)
    assert.equal(markup.includes('stroke="#e2e8f0"'), accessory === 'glasses')
    assert.equal(markup.includes('fill="#fb7185"'), accessory === 'bowtie')
    assert.equal(markup.includes('fill="#fbbf24"'), accessory === 'crown')
  }
})

test('multiple mascots have unique, resolvable gradient and lighting references', () => {
  const markup = renderToStaticMarkup(createElement('div', null, createElement(FoundAIMascot), createElement(FoundAIMascot)))
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  assert.equal(ids.length, 12)
  assert.equal(new Set(ids).size, ids.length)
  for (const match of markup.matchAll(/url\(#([^)]+)\)/g)) {
    assert.ok(ids.includes(match[1]), `Missing definition: ${match[1]}`)
  }
})

test('every character has a distinct silhouette and supports every accessory', () => {
  const silhouettes = new Set<string>()
  for (const character of BOT_CHARACTERS) {
    const markup = renderToStaticMarkup(createElement(FoundAIMascot, { character: character.id }))
    assert.match(markup, new RegExp(`data-character="${character.id}"`))
    silhouettes.add(markup.slice(markup.indexOf('class="foundai-mascot-body"'), markup.indexOf('class="foundai-mascot-face"')))
    for (const accessory of ['glasses', 'bowtie', 'crown'] as const) {
      const dressed = renderToStaticMarkup(createElement(FoundAIMascot, { character: character.id, accessory }))
      assert.ok(dressed.includes(accessory === 'glasses' ? 'stroke="#e2e8f0"' : accessory === 'bowtie' ? 'fill="#fb7185"' : 'fill="#fbbf24"'))
    }
  }
  assert.equal(silhouettes.size, BOT_CHARACTERS.length)
})

test('SuperBot has a cape and custom FOS chest emblem without a sphere', () => {
  const markup = renderToStaticMarkup(createElement(FoundAIMascot, { character: 'superbot', active: true }))
  assert.match(markup, /foundai-mascot-cape/)
  assert.match(markup, /M71 127 V119 H76/)
  assert.doesNotMatch(markup, /<circle/)
})

test('SuperBot keeps metallic gold trim with every chosen lighting colour', () => {
  for (const colour of ['#38bdf8', '#a78bfa', '#34d399']) {
    const markup = renderToStaticMarkup(createElement(FoundAIMascot, { character: 'superbot', colour }))
    assert.match(markup, /stop-color="#e8bb55"/)
    assert.match(markup, /fill="url\(#[^)]+-gold\)"/)
    assert.equal([...markup.matchAll(/stroke="url\(#[^)]+-gold\)"/g)].length, 3)
    assert.ok(markup.includes(`stroke="${colour}"`))
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
    for (const match of markup.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(match[1]))
  }
  assert.doesNotMatch(renderToStaticMarkup(createElement(FoundAIMascot, { character: 'creature' })), /-gold/)
})

test('every character supports a saved multicolour finish with valid SVG paints', () => {
  for (const character of BOT_CHARACTERS) {
    const markup = renderToStaticMarkup(createElement(FoundAIMascot, { character: character.id, multicolour: true }))
    assert.match(markup, /data-multicolour="true"/)
    for (const colour of ['#38bdf8', '#a78bfa', '#fb7185', '#fbbf24', '#34d399']) assert.ok(markup.includes(`stop-color="${colour}"`))
    assert.doesNotMatch(markup, /stop-color="url/)
    if (character.id === 'superbot') assert.match(markup, /fill="url\(#[^)]+-gold\)"/)
  }
})
