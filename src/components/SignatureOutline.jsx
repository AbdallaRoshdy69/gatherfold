import { signaturePageCount } from '../model/imposition.js'

export function SignatureOutline({ signatures, activeId, onChoose, onAdd }) {
  return <aside className="signature-outline" aria-label="Signature outline">
    <div className="panel-heading"><div><p className="eyebrow">Binding order</p><h2>Signatures</h2></div><button type="button" className="icon-button" aria-label="Add signature" onClick={onAdd}>＋</button></div>
    <ol>{signatures.map((signature, index) => (
      <li key={signature.id}>
        <button type="button" className="signature-tab" data-active={signature.id === activeId} aria-current={signature.id === activeId ? 'step' : undefined} onClick={() => onChoose(signature.id)}>
          <span className="signature-index">{String(index + 1).padStart(2, '0')}</span>
          <span><strong>{signature.label}</strong><small>{signaturePageCount(signature)} pages · {signature.paper}</small></span>
          <span className={`proof-dot ${signature.proofed ? 'is-proofed' : ''}`}><i aria-hidden="true" />{signature.proofed ? 'Proofed' : 'To proof'}</span>
        </button>
      </li>
    ))}</ol>
    <div className="outline-key"><span><i className="proof-dot is-proofed" /> Proofed</span><span><i className="proof-dot" /> Waiting</span></div>
  </aside>
}
