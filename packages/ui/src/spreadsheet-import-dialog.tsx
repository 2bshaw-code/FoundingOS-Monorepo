'use client'

import { useMemo, useState, type ChangeEvent } from 'react'
import { buildImportRows, IMPORT_BATCH_SIZE, duplicateKey, guessMapping, IMPORT_FIELDS, importTemplateCsv, MAX_IMPORT_ROWS, parseCsv, runImport, type ImportField, type ImportMapping, type ImportRow } from './spreadsheet-import'

type Props = {
  moduleId: string
  moduleLabel: string
  noun: string
  fields: { name: string; secondary: string; value: string }
  statuses: string[]
  existing: Array<{ name: string; secondary?: string; email?: string }>
  onSaveBatch: (rows: ImportRow[], start: number, batch: string) => Promise<{ created: number; skipped: number }>
  onFinished: () => Promise<void>
  onClose: () => void
}

type Stage = 'choose' | 'preview' | 'running' | 'done'

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

const quote = (value: string) => `"${value.replaceAll('"', '""')}"`

export function SpreadsheetImportDialog({ moduleId, moduleLabel, noun, fields, statuses, existing, onSaveBatch, onFinished, onClose }: Props) {
  const [stage, setStage] = useState<Stage>('choose')
  const [fileName, setFileName] = useState('')
  const [table, setTable] = useState<string[][]>([])
  const [mapping, setMapping] = useState<ImportMapping>({})
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const [error, setError] = useState('')
  const [done, setDone] = useState(0)
  const [total, setTotal] = useState(0)
  const [result, setResult] = useState<{ saved: number; already: number; failed: ImportRow[] } | null>(null)

  const labels: Record<ImportField, string> = { name: `${fields.name} (required)`, secondary: fields.secondary, value: fields.value, status: 'Stage', owner: 'Owner', email: 'Email', phone: 'Phone', dueDate: 'Date' }
  const headers = table[0] ?? []
  const built = useMemo(() => table.length > 1 ? buildImportRows(table, mapping, statuses) : { rows: [], skipped: 0 }, [table, mapping, statuses])
  const existingKeys = useMemo(() => new Set(existing.map(duplicateKey)), [existing])
  const duplicates = built.rows.filter((row) => existingKeys.has(duplicateKey(row))).length
  const toImport = skipDuplicates ? built.rows.filter((row) => !existingKeys.has(duplicateKey(row))) : built.rows

  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError('')
    if (/\.(xlsx?|numbers)$/i.test(file.name)) {
      setError('That is an Excel or Numbers file. Open it, choose File, then Save As (or Download), pick CSV, and choose the new file here.')
      return
    }
    const text = await file.text()
    const rows = parseCsv(text)
    if (rows.length < 2) {
      setError('We could not find any rows. Check the file has a header row and at least one line underneath.')
      return
    }
    if (rows.length - 1 > MAX_IMPORT_ROWS) {
      setError(`That file has ${rows.length - 1} rows. Please split it into files of ${MAX_IMPORT_ROWS} rows or fewer.`)
      return
    }
    setFileName(file.name)
    setTable(rows)
    setMapping(guessMapping(rows[0]))
    setStage('preview')
  }

  const start = async () => {
    if (toImport.length === 0) return
    const batch = Date.now().toString(36).toUpperCase()
    setTotal(toImport.length)
    setStage('running')
    setDone(0)
    const chunks = Array.from({ length: Math.ceil(toImport.length / IMPORT_BATCH_SIZE) }, (_, index) => ({ start: index * IMPORT_BATCH_SIZE, rows: toImport.slice(index * IMPORT_BATCH_SIZE, (index + 1) * IMPORT_BATCH_SIZE) }))
    let created = 0
    let already = 0
    const outcome = await runImport(chunks, async (chunk) => {
      const saved = await onSaveBatch(chunk.rows, chunk.start, batch)
      created += saved.created
      already += saved.skipped
    }, (finished) => setDone(Math.min(toImport.length, finished * IMPORT_BATCH_SIZE)), 2)
    await onFinished().catch(() => undefined)
    setResult({ saved: created, already, failed: outcome.failed.flatMap((chunk) => chunk.rows) })
    setStage('done')
  }

  const downloadFailed = () => {
    if (!result) return
    const header = ['Name', 'Detail', 'Value', 'Email', 'Phone', 'Date']
    const lines = result.failed.map((row) => [row.name, row.secondary, row.value, row.email ?? '', row.phone ?? '', row.dueDate ?? ''].map(quote).join(','))
    download(`${moduleId}-not-imported.csv`, [header.map(quote).join(','), ...lines].join('\n'))
  }

  const plural = (count: number) => `${count} ${noun}${count === 1 ? '' : 's'}`

  return <div className="retail-app-modal-backdrop" role="dialog" aria-modal="true" aria-label={`Import ${moduleLabel}`}>
    <div className="retail-app-modal spreadsheet-import">
      <div><p>{moduleLabel}</p><h2>Import from a spreadsheet</h2></div>

      {stage === 'choose' ? <>
        <ol className="spreadsheet-import__steps">
          <li>Export your list from your old system or spreadsheet as a <strong>CSV</strong> file.</li>
          <li>Make sure the first row holds the column names, such as Name, Email, Phone and Amount.</li>
          <li>Choose the file below. You will see a preview before anything is saved.</li>
        </ol>
        <label className="retail-app-primary spreadsheet-import__pick">
          <input accept=".csv,.tsv,.txt,text/csv" hidden onChange={(event) => void choose(event)} type="file" />
          <span>Choose CSV file</span>
        </label>
        <button className="spreadsheet-import__link" onClick={() => download(`${moduleId}-import-template.csv`, importTemplateCsv(fields))} type="button">Download a blank template</button>
      </> : null}

      {stage === 'preview' ? <>
        <p className="spreadsheet-import__summary"><strong>{fileName}</strong>: {plural(built.rows.length)} found{built.skipped ? `, ${built.skipped} empty row${built.skipped === 1 ? '' : 's'} left out` : ''}.</p>
        <p className="spreadsheet-import__hint">Check each box points at the right column. We have guessed from your column names.</p>
        <div className="spreadsheet-import__mapping">
          {IMPORT_FIELDS.map((field) => <label key={field}>{labels[field]}
            <select aria-label={`Column for ${labels[field]}`} onChange={(event) => setMapping((current) => ({ ...current, [field]: event.target.value === '' ? undefined : Number(event.target.value) }))} value={mapping[field] ?? ''}>
              <option value="">Not in my file</option>
              {headers.map((header, index) => <option key={`${header}-${index}`} value={index}>{header || `Column ${index + 1}`}</option>)}
            </select>
          </label>)}
        </div>
        <div className="spreadsheet-import__preview">
          <table>
            <thead><tr><th>{fields.name}</th><th>{fields.secondary}</th><th>{fields.value}</th><th>Email</th><th>Phone</th></tr></thead>
            <tbody>{built.rows.slice(0, 5).map((row, index) => <tr key={index}><td>{row.name}</td><td>{row.secondary}</td><td>{row.value}</td><td>{row.email ?? ''}</td><td>{row.phone ?? ''}</td></tr>)}</tbody>
          </table>
          {built.rows.length > 5 ? <p className="spreadsheet-import__hint">Showing the first 5 of {built.rows.length}.</p> : null}
        </div>
        {duplicates > 0 ? <label className="spreadsheet-import__check"><input checked={skipDuplicates} onChange={(event) => setSkipDuplicates(event.target.checked)} type="checkbox" /> Skip {plural(duplicates)} already in FoundingOS</label> : null}
      </> : null}

      {stage === 'running' ? <div className="spreadsheet-import__progress" role="status">
        <p>Importing {done} of {total}… please keep this window open.</p>
        <progress max={total} value={done} />
      </div> : null}

      {stage === 'done' && result ? <div className="spreadsheet-import__progress" role="status">
        <p><strong>{plural(result.saved)} imported.</strong>{result.already ? ` ${plural(result.already)} were already there.` : ''}{result.failed.length ? ` ${result.failed.length} could not be saved.` : ' Everything went in.'}</p>
        {result.failed.length ? <button className="spreadsheet-import__link" onClick={downloadFailed} type="button">Download the ones that did not import</button> : null}
      </div> : null}

      {error ? <div className="complete-workspace-error" role="alert"><span>{error}</span></div> : null}

      <footer>
        {stage === 'done' ? <button className="retail-app-primary" onClick={onClose} type="button">Done</button> : <>
          <button className="retail-app-secondary" disabled={stage === 'running'} onClick={stage === 'preview' ? () => { setStage('choose'); setTable([]) } : onClose} type="button">{stage === 'preview' ? 'Back' : 'Cancel'}</button>
          {stage === 'preview' ? <button className="retail-app-primary" disabled={toImport.length === 0 || mapping.name === undefined} onClick={() => void start()} type="button">Import {plural(toImport.length)}</button> : null}
        </>}
      </footer>
    </div>
  </div>
}
