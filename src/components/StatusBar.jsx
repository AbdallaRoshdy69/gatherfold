export function StatusBar({ book, report }) {
  const proofed = book.signatures.filter((signature) => signature.proofed).length
  return <footer className="status-bar">
    <span><i className={report.isClean ? 'ok' : 'warn'} aria-hidden="true" />{report.isClean ? 'Preflight clean' : 'Preflight needs attention'}</span>
    <span>{report.assigned} assignments · {book.totalPages} expected pages</span>
    <span>{proofed} of {book.signatures.length} signatures proofed</span>
    <span>Saved locally</span>
  </footer>
}
