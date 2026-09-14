function PageSlot({ page, sheetId, side, slotIndex, selected, invalid, duplicated, onSelect }) {
  const state = invalid ? 'out of range' : duplicated ? 'duplicated' : 'assigned'
  return <button
    type="button"
    className="page-slot"
    data-selected={selected}
    data-invalid={invalid || duplicated}
    aria-pressed={selected}
    aria-label={`Page ${page}, ${side} side, ${state}`}
    onClick={() => onSelect(sheetId, side, slotIndex)}
  >
    <span>p.</span><strong>{page}</strong><i aria-hidden="true" />
  </button>
}

export function SheetCard({ sheet, index, viewSide, selection, report, onSelect }) {
  const visibleSides = viewSide === 'both' ? ['front', 'back'] : [viewSide]
  const duplicatePages = new Set(report.duplicates.map(({ page }) => page))
  const outOfRange = new Set(report.outOfRange.filter((slot) => slot.sheetId === sheet.id).map(({ page }) => page))

  return <article className="sheet-card" data-selected={selection.sheetId === sheet.id}>
    <header><span>Sheet {String(index + 1).padStart(2, '0')}</span><strong>{index === 0 ? 'Outer forme' : index === 3 ? 'Centre fold' : 'Gather'}</strong></header>
    <div className={`sheet-sides sides-${visibleSides.length}`}>
      {visibleSides.map((side) => <section key={side} aria-label={`${side} side`}>
        <p>{side}<span>{side === 'front' ? 'F' : 'B'}</span></p>
        <div className="spread"><span className="fold-line" aria-hidden="true" />
          {sheet[side].map((page, slotIndex) => <PageSlot
            key={`${side}-${slotIndex}`}
            page={page}
            sheetId={sheet.id}
            side={side}
            slotIndex={slotIndex}
            selected={selection.sheetId === sheet.id && selection.side === side && selection.slotIndex === slotIndex}
            invalid={outOfRange.has(page)}
            duplicated={duplicatePages.has(page)}
            onSelect={onSelect}
          />)}
        </div>
      </section>)}
    </div>
  </article>
}
