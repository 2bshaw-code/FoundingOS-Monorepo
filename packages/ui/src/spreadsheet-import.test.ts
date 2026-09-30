import assert from 'node:assert/strict'
import test from 'node:test'
import { buildImportRows, duplicateKey, guessMapping, importTemplateCsv, normaliseDate, parseCsv, runImport } from './spreadsheet-import'

test('reads quoted cells, commas and line breaks inside quotes, and Windows line endings', () => {
  const rows = parseCsv('\uFEFFName,Notes,Amount\r\n"Smith, Jo","Likes ""oat"" milk\non Fridays",£1,200\r\n\r\nAmina,,£50\r\n')
  assert.deepEqual(rows, [['Name', 'Notes', 'Amount'], ['Smith, Jo', 'Likes "oat" milk\non Fridays', '£1', '200'], ['Amina', '', '£50']])
})

test('reads semicolon and tab separated files', () => {
  assert.deepEqual(parseCsv('Name;Amount\nJo;12,50'), [['Name', 'Amount'], ['Jo', '12,50']])
  assert.deepEqual(parseCsv('Name\tAmount\nJo\t10'), [['Name', 'Amount'], ['Jo', '10']])
})

test('recognises common column names from other systems', () => {
  assert.deepEqual(guessMapping(['Customer Name', 'Email Address', 'Mobile', 'Balance', 'Notes']), { name: 0, email: 1, phone: 2, value: 3, secondary: 4 })
  assert.deepEqual(guessMapping(['ID', 'Name', 'Detail', 'Value', 'Status', 'Owner', 'Updated']), { status: 4, owner: 5, value: 3, name: 1, secondary: 2 })
  assert.deepEqual(guessMapping(['Invoice Number', 'Contact', 'Due Date', 'Total']), { dueDate: 2, value: 3, name: 1, secondary: 0 })
})

test('joins first and last names and fills sensible defaults', () => {
  const rows = [['First name', 'Last name', 'Email', 'Status'], ['Amina', 'Yusuf', 'amina@example.com', 'won'], ['', '', '', ''], ['Noah', '', '', 'unknown']]
  const { rows: built, skipped } = buildImportRows(rows, guessMapping(rows[0]), ['New', 'Won'])
  assert.equal(skipped, 1)
  assert.deepEqual(guessMapping(['Surname', 'First name']).name, 1)
  assert.deepEqual(built[0], { name: 'Amina Yusuf', secondary: 'amina@example.com', value: '£0', status: 'Won', email: 'amina@example.com' })
  assert.deepEqual(built[1], { name: 'Noah', secondary: 'Imported', value: '£0' })
})

test('skips rows with no name', () => {
  const { rows, skipped } = buildImportRows([['Name', 'Amount'], ['', '£5'], ['Jo', '£6']], { name: 0, value: 1 }, ['New'])
  assert.equal(rows.length, 1)
  assert.equal(skipped, 1)
})

test('understands UK, ISO and written dates', () => {
  assert.equal(normaliseDate('31/12/2026'), '2026-12-31')
  assert.equal(normaliseDate('5.1.26'), '2026-01-05')
  assert.equal(normaliseDate('2026-3-7'), '2026-03-07')
  assert.equal(normaliseDate('7 March 2026'), '2026-03-07')
  assert.equal(normaliseDate('13/13/2026'), undefined)
  assert.equal(normaliseDate('soon'), undefined)
})

test('spots duplicates by name and email regardless of case', () => {
  assert.equal(duplicateKey({ name: ' Harbour Cafe ', email: 'A@B.com' }), duplicateKey({ name: 'harbour cafe', secondary: 'x', email: 'a@b.com' }))
})

test('the template round trips through the importer', () => {
  const rows = parseCsv(importTemplateCsv({ name: 'Customer', secondary: 'Company', value: 'Lifetime value' }))
  const { rows: built } = buildImportRows(rows, guessMapping(rows[0]), ['New'])
  assert.equal(built[0].name, 'Harbour Cafe')
  assert.equal(built[0].email, 'orders@harbourcafe.co.uk')
  assert.equal(built[0].dueDate, '2026-10-31')
})

test('imports everything, reports failures and never runs more than three at once', async () => {
  let running = 0
  let peak = 0
  const progress: number[] = []
  const result = await runImport([1, 2, 3, 4, 5, 6, 7], async (item) => {
    running += 1
    peak = Math.max(peak, running)
    await new Promise((resolve) => setTimeout(resolve, 5))
    running -= 1
    if (item === 4) throw new Error('nope')
  }, (done) => progress.push(done))
  assert.equal(result.saved, 6)
  assert.deepEqual(result.failed, [4])
  assert.equal(peak, 3)
  assert.equal(progress.at(-1), 7)
})
