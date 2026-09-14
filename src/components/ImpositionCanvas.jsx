import { SheetCard } from './SheetCard.jsx'

export function ImpositionCanvas({ signature, viewSide, density, selection, report, onSelect }) {
  return <section className="canvas-panel" aria-labelledby="canvas-title" data-density={density}>
    <div className="canvas-heading">
      <div><p className="eyebrow">Imposition map</p><h2 id="canvas-title">{signature.label}</h2></div>
      <p><span>{signature.sheets.length}</span> sheets / <span>{signature.sheets.length * 4}</span> pages</p>
    </div>
    <div className="sheet-stack">
      {signature.sheets.map((sheet, index) => <SheetCard key={sheet.id} sheet={sheet} index={index} viewSide={viewSide} selection={selection} report={report} onSelect={onSelect} />)}
    </div>
  </section>
}
