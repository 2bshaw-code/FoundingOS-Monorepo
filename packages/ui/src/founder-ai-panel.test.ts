/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import assert from 'node:assert/strict'
import test from 'node:test'
import { collectLedgerActions, parseCostSuggestion } from './founder-ai-panel'

const CATEGORIES = ['Hosting & infrastructure', 'AI & APIs', 'Software & tools', 'Advertising', 'Other']

test('reads the cost wording FoundAI is asked to produce', () => {
  const parsed = parseCostSuggestion('Add cost: Vercel Pro, £20/month, Hosting & infrastructure', CATEGORIES)
  assert.deepEqual(parsed, { kind: 'expense', label: 'Vercel Pro', category: 'Hosting & infrastructure', amountGbp: 20, recurring: true })
})

test('reads income and one-off amounts', () => {
  const income = parseCostSuggestion('Add income: Consulting fee, £1,500, Other', CATEGORIES)
  assert.equal(income?.kind, 'income')
  assert.equal(income?.amountGbp, 1500)
  assert.equal(income?.recurring, false)
})

test('falls back to Other when no known category is named', () => {
  const parsed = parseCostSuggestion('Add cost: Mystery spend, £5/month', CATEGORIES)
  assert.equal(parsed?.category, 'Other')
  assert.equal(parsed?.recurring, true)
})

test('ignores ordinary suggestions so they never become ledger entries', () => {
  for (const text of [
    'Review your pricing page',
    'Consider adding a cost tracker',
    'Add cost tracking to your workflow',
    'Add cost:',
    'Add cost: Broken, no amount here',
    'Add cost: Zero, £0, Other',
  ]) {
    assert.equal(parseCostSuggestion(text, CATEGORIES), null, text)
  }
})

test('matches categories case-insensitively', () => {
  const parsed = parseCostSuggestion('Add cost: Claude, £35/month, ai & apis', CATEGORIES)
  assert.equal(parsed?.category, 'AI & APIs')
})

test('pulls an inline ledger line out of the answer text', () => {
  const result = collectLedgerActions({
    answer: 'Your costs are £0 so far.\n- Add cost: Vercel Pro, £20/month, Hosting & infrastructure\nAdd that and I can work out your runway.',
    suggestedActions: [],
  })
  assert.deepEqual(result.actions, ['Add cost: Vercel Pro, £20/month, Hosting & infrastructure'])
  assert.ok(!result.text.includes('Add cost:'))
  assert.ok(result.text.includes('Your costs are £0 so far.'))
})

test('does not duplicate a line returned in both places', () => {
  const line = 'Add cost: Vercel Pro, £20/month, Hosting & infrastructure'
  const result = collectLedgerActions({ answer: `Here you go.\n${line}`, suggestedActions: [line] })
  assert.deepEqual(result.actions, [line])
})

test('keeps the answer text when there is nothing to extract', () => {
  const result = collectLedgerActions({ answer: 'Your MRR is £0.', suggestedActions: ['Review your pricing page'] })
  assert.equal(result.text, 'Your MRR is £0.')
  assert.deepEqual(result.actions, ['Review your pricing page'])
})
