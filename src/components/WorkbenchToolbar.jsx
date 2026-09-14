export function WorkbenchToolbar({ viewSide, density, canUndo, canRedo, onViewSide, onDensity, onUndo, onRedo }) {
  return <div className="workbench-toolbar" aria-label="Workbench controls">
    <div className="segmented" aria-label="Sheet sides">
      {['front', 'both', 'back'].map((side) => <button key={side} type="button" data-active={viewSide === side} aria-pressed={viewSide === side} onClick={() => onViewSide(side)}>{side}</button>)}
    </div>
    <div className="toolbar-actions">
      <button type="button" className="tool-button" disabled={!canUndo} onClick={onUndo} aria-label="Undo last change"><span aria-hidden="true">↶</span> Undo</button>
      <button type="button" className="tool-button" disabled={!canRedo} onClick={onRedo} aria-label="Redo last change"><span aria-hidden="true">↷</span> Redo</button>
      <button type="button" className="tool-button density-button" aria-pressed={density === 'compact'} onClick={() => onDensity(density === 'compact' ? 'comfortable' : 'compact')}><span aria-hidden="true">▦</span> {density === 'compact' ? 'Roomy' : 'Compact'}</button>
    </div>
  </div>
}
