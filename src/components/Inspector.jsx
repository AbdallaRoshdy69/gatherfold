import { useEffect, useState } from 'react'
import { PageFinder } from './PageFinder.jsx'

export function Inspector({ book, signature, selectedSheet, selectedPage, selection, report, onEditPage, onMoveSheet, onToggleProofed, onUpdateNote, onFindPage }) {
  const [pageDraft, setPageDraft] = useState(String(selectedPage ?? ''))

  useEffect(() => { setPageDraft(String(selectedPage ?? '')) }, [selectedPage])

  const sheetIndex = signature.sheets.findIndex((sheet) => sheet.id === selectedSheet?.id)

  function submitPage(event) {
    event.preventDefault()
    const page = Number(pageDraft)
    if (Number.isInteger(page) && page >= 1) onEditPage(page)
  }

  return <aside className="inspector" aria-label="Page and signature inspector">
    <div className="panel-heading"><div><p className="eyebrow">Selected slot</p><h2>Page {selectedPage}</h2></div><span className="side-badge">{selection.side}</span></div>
    <section className="inspector-section">
      <p className="section-label">Assignment</p>
      <form className="page-editor" onSubmit={submitPage}>
        <label htmlFor="page-number">Page number</label>
        <div><input id="page-number" type="number" min="1" value={pageDraft} onChange={(event) => setPageDraft(event.target.value)} /><button type="submit">Apply</button></div>
      </form>
      <dl><div><dt>Sheet</dt><dd>{String(sheetIndex + 1).padStart(2, '0')} of {signature.sheets.length}</dd></div><div><dt>Position</dt><dd>{selection.slotIndex === 0 ? 'Left' : 'Right'} page</dd></div><div><dt>Paper</dt><dd>{signature.paper}</dd></div></dl>
      <div className="move-buttons"><button type="button" disabled={sheetIndex <= 0} onClick={() => onMoveSheet(-1)}>↑ Move outward</button><button type="button" disabled={sheetIndex >= signature.sheets.length - 1} onClick={() => onMoveSheet(1)}>↓ Move inward</button></div>
    </section>

    <section className="inspector-section">
      <p className="section-label">Preflight</p>
      <div className={`preflight ${report.isClean ? 'is-clean' : 'has-errors'}`}><strong>{report.isClean ? 'Ready to fold' : `${report.missing.length + report.duplicates.length + report.outOfRange.length} conflicts`}</strong><span>{report.isClean ? 'All pages assigned once' : 'Resolve marked page slots'}</span></div>
      {!report.isClean && <ul className="issue-list">
        {report.missing.length > 0 && <li><strong>Missing:</strong>{' '}{report.missing.slice(0, 8).join(', ')}</li>}
        {report.duplicates.length > 0 && <li><strong>Repeated:</strong>{' '}{report.duplicates.slice(0, 8).map(({ page }) => page).join(', ')}</li>}
        {report.outOfRange.length > 0 && <li><strong>Out of range:</strong>{' '}{report.outOfRange.slice(0, 8).map(({ page }) => page).join(', ')}</li>}
      </ul>}
      <button type="button" className="proof-button" aria-pressed={signature.proofed} onClick={onToggleProofed}>{signature.proofed ? '✓ Signature proofed' : 'Mark signature proofed'}</button>
    </section>

    <section className="inspector-section"><PageFinder totalPages={book.totalPages} onFind={onFindPage} /></section>

    <section className="inspector-section">
      <label className="section-label" htmlFor="signature-note">Binder note</label>
      <textarea id="signature-note" rows="5" value={signature.note} onChange={(event) => onUpdateNote(event.target.value)} />
    </section>
  </aside>
}
