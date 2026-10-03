import assert from 'node:assert/strict'
import test from 'node:test'
import { legalMarketCountries, legalObligations, readLegalReview, validateLegalReview, type LegalReview } from './founder-legal'

const review: LegalReview = { obligationId: 'local-tax', country: 'India', state: 'In review', reviewer: 'Tax adviser', nextReview: '2027-01-15', evidence: 'Scope: business subscriptions in India; tax treatment awaiting advice.' }
test('launch reviews require one named country and supporting evidence', () => {
  assert.equal(validateLegalReview(review), '')
  for (const country of ['Africa', 'Global', '', 'Kenya, Nigeria']) assert.match(validateLegalReview({ ...review, country }), /one country/)
  assert.match(validateLegalReview({ ...review, reviewer: ' ' }), /reviewer/)
  assert.match(validateLegalReview({ ...review, evidence: '' }), /evidence/)
  assert.match(validateLegalReview({ ...review, nextReview: '2027-02-30' }), /valid/)
  assert.equal(new Set(legalMarketCountries).size, legalMarketCountries.length)
  assert.equal(new Set(legalObligations.map((item) => item.id)).size, legalObligations.length)
})
test('recorded evidence remains a review, never an automatic legal approval', () => {
  const record = { id: 'r1', reference: 'LEGAL-REVIEW-1', name: 'India tax review', status: 'Draft', version: 1, updatedAt: '2026-10-03T10:00:00Z', data: { founderLegalReview: { ...review, state: 'Evidence recorded' } } }
  assert.equal(readLegalReview(record)?.state, 'Evidence recorded')
  assert.equal(readLegalReview({ ...record, data: { founderLegalReview: { ...review, state: 'Compliant' } } }), null)
  assert.equal(readLegalReview({ ...record, data: {} }), null)
  assert.equal(readLegalReview({ ...record, data: { founderLegalReview: { ...review, obligationId: 'unknown' } } }), null)
})
