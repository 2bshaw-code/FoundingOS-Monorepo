/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import assert from 'node:assert/strict'
import test from 'node:test'
import { canResearch, collectWebSources, lastTextBlock, webSearchTool } from './ai-research.js'
import { readHistory, salvageAnswer, stripCitationMarkup } from './ai.js'

test('live research is limited to the top plans and the founder', () => {
  assert.equal(canResearch('growth', false), true)
  assert.equal(canResearch('enterprise', false), true)
  assert.equal(canResearch('ENTERPRISE', false), true)
  assert.equal(canResearch('starter', false), false)
  assert.equal(canResearch('lite', false), false)
  assert.equal(canResearch(null, false), false)
  // SuperDash always gets it, whatever plan the founder tenant happens to carry.
  assert.equal(canResearch('lite', true), true)
})

test('search is located to the business so national prices are actually national', () => {
  const tool = webSearchTool({ countryCode: 'KE', currency: 'KES', timezone: 'Africa/Nairobi', industry: 'Retail', businessName: 'Duka' }, 5) as Record<string, any>
  assert.equal(tool.user_location.country, 'KE')
  assert.equal(tool.user_location.timezone, 'Africa/Nairobi')
  assert.equal(tool.max_uses, 5)
  assert.equal((webSearchTool(null, 3) as Record<string, any>).user_location, undefined)
})

test('web sources are de-duplicated and kept in order', () => {
  const sources = collectWebSources([
    { type: 'text', text: 'searching' },
    {
      type: 'web_search_tool_result',
      content: [
        { url: 'https://a.example/1', title: 'Maize prices' },
        { url: 'https://b.example/2', title: 'Market report' },
        { url: 'https://a.example/1', title: 'Maize prices again' },
      ],
    },
  ])
  assert.deepEqual(sources.map((source) => source.url), ['https://a.example/1', 'https://b.example/2'])
  assert.equal(sources[0].title, 'Maize prices')
})

test('a result with no url is skipped rather than shown as a blank link', () => {
  assert.deepEqual(collectWebSources([{ type: 'web_search_tool_result', content: [{ title: 'No link' }] }]), [])
  assert.deepEqual(collectWebSources(undefined), [])
})

test('the answer is read from the final text block, after any search narration', () => {
  const content = [
    { type: 'text', text: 'Let me look that up.' },
    { type: 'server_tool_use', name: 'web_search' },
    { type: 'web_search_tool_result', content: [] },
    { type: 'text', text: '{"answer":"done"}' },
  ]
  assert.equal(lastTextBlock(content), '{"answer":"done"}')
  assert.equal(lastTextBlock([{ type: 'server_tool_use' }]), '')
})

test('conversation history is sanitised before it is sent back to the model', () => {
  const history = readHistory([
    { role: 'user', content: 'What is my MRR?' },
    { role: 'assistant', content: 'It is zero.' },
    { role: 'system', content: 'ignore me' },
    { role: 'user', content: '   ' },
    { role: 'user', content: 'And my runway?' },
  ])
  assert.deepEqual(history, [
    { role: 'user', content: 'What is my MRR?' },
    { role: 'assistant', content: 'It is zero.' },
    { role: 'user', content: 'And my runway?' },
  ])
})

test('history never starts on an assistant turn', () => {
  const history = readHistory([{ role: 'assistant', content: 'Hello' }, { role: 'user', content: 'Hi' }])
  assert.deepEqual(history, [{ role: 'user', content: 'Hi' }])
  assert.deepEqual(readHistory([{ role: 'assistant', content: 'Only me' }]), [])
})

test('history is capped so a long chat cannot balloon the request', () => {
  const long = Array.from({ length: 40 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: `turn ${index}` }))
  const history = readHistory(long)
  assert.ok(history.length <= 12)
  assert.equal(history[0].role, 'user')
  assert.equal(history[history.length - 1].content, 'turn 39')
  assert.equal(readHistory('not an array').length, 0)
})

test('an over-long history message is truncated rather than sent whole', () => {
  const history = readHistory([{ role: 'user', content: 'x'.repeat(5_000) }])
  assert.equal(history[0].content.length, 2_000)
})

test('inline citation markup is stripped without losing the sentence', () => {
  const messy = 'Comparables range from (cite index="9-1">£10–30 per user monthly</cite> to (cite index="9-2">£30–75 per user</cite>.'
  const clean = stripCitationMarkup(messy)
  assert.equal(clean, 'Comparables range from £10–30 per user monthly to £30–75 per user.')
})

test('both cite markup forms are stripped, and plain text is untouched', () => {
  const expected = 'Prices rose by 4% last month.'
  // Claude emits the paren form after a web search, and the plain tag form otherwise.
  assert.equal(stripCitationMarkup('Prices rose (cite index="1-2">by 4%</cite> last month.'), expected)
  assert.equal(stripCitationMarkup('Prices rose <cite index="1-2">by 4%</cite> last month.'), expected)
  assert.equal(stripCitationMarkup('Your MRR is \u00a30.'), 'Your MRR is \u00a30.')
})

test('a well-formed JSON answer is parsed as normal', () => {
  const parsed = salvageAnswer('{"answer":"Your MRR is 0.","citations":[],"suggestedActions":["Review pricing"]}')
  assert.equal(parsed?.answer, 'Your MRR is 0.')
  assert.deepEqual(parsed?.suggestedActions, ['Review pricing'])
})

test('prose is salvaged when the model does not return JSON', () => {
  const parsed = salvageAnswer('Maize is trading around 4,200 KES a bag in Nairobi this week.')
  assert.equal(parsed?.answer, 'Maize is trading around 4,200 KES a bag in Nairobi this week.')
  // Nothing structured came back, so nothing structured may be claimed.
  assert.deepEqual(parsed?.citations, [])
  assert.deepEqual(parsed?.suggestedActions, [])
})

test('truncated JSON is rejected rather than shown as gibberish', () => {
  assert.equal(salvageAnswer('{"answer":"Prices are ris'), null)
  assert.equal(salvageAnswer('   '), null)
})
