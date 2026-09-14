import { useEffect, useRef, useState } from 'react'

const papers = ['Natural', 'Ivory', 'Mist blue', 'Warm grey', 'Soft green', 'Chalk']

export function AddSignaturePanel({ open, onClose, onAdd }) {
  const [label, setLabel] = useState('')
  const [paper, setPaper] = useState('Natural')
  const [note, setNote] = useState('')
  const labelRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const previousFocus = document.activeElement
    labelRef.current?.focus()

    return () => previousFocus?.focus()
  }, [open])

  if (!open) return null

  function submit(event) {
    event.preventDefault()
    if (!label.trim()) return
    onAdd({ label, paper, note })
    setLabel('')
    setPaper('Natural')
    setNote('')
    onClose()
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)')]
    const first = focusable[0]
    const last = focusable.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return <div
    className="modal-layer"
    role="presentation"
    onKeyDown={handleKeyDown}
    onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
  >
    <section ref={dialogRef} className="add-signature" role="dialog" aria-modal="true" aria-labelledby="add-signature-title">
      <div className="panel-heading"><div><p className="eyebrow">Extend the book</p><h2 id="add-signature-title">Add a 16-page signature</h2></div><button type="button" className="icon-button" aria-label="Close add signature panel" onClick={onClose}>×</button></div>
      <form onSubmit={submit}>
        <label htmlFor="signature-label">Signature label</label><input ref={labelRef} id="signature-label" required value={label} placeholder="E · Appendix" onChange={(event) => setLabel(event.target.value)} />
        <label htmlFor="signature-paper">Paper stock</label><select id="signature-paper" value={paper} onChange={(event) => setPaper(event.target.value)}>{papers.map((value) => <option key={value}>{value}</option>)}</select>
        <label htmlFor="new-signature-note">Binder note</label><textarea id="new-signature-note" rows="4" value={note} onChange={(event) => setNote(event.target.value)} />
        <div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit">Add signature</button></div>
      </form>
    </section>
  </div>
}
