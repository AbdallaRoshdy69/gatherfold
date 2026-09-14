import { useState } from 'react'
import './App.css'
import { AddSignaturePanel } from './components/AddSignaturePanel.jsx'
import { BookRail } from './components/BookRail.jsx'
import { ImpositionCanvas } from './components/ImpositionCanvas.jsx'
import { Inspector } from './components/Inspector.jsx'
import { SignatureOutline } from './components/SignatureOutline.jsx'
import { StatusBar } from './components/StatusBar.jsx'
import { WorkbenchToolbar } from './components/WorkbenchToolbar.jsx'
import { useGatherfold } from './hooks/useGatherfold.js'

function App() {
  const studio = useGatherfold()
  const [addOpen, setAddOpen] = useState(false)

  if (!studio.book || !studio.activeSignature || !studio.selectedSheet) {
    return <main className="fatal-state"><h1>No book on the bench</h1><p>Restore the sample projects to open Gatherfold.</p></main>
  }

  return <div className="app-shell">
    <BookRail books={studio.books} activeBookId={studio.activeBookId} onChoose={studio.chooseBook} />
    <div className="studio-shell">
      <header className="studio-header">
        <div><p className="eyebrow">Open imposition file</p><h1>{studio.book.title}</h1></div>
        <dl><div><dt>Client</dt><dd>{studio.book.client}</dd></div><div><dt>Trim</dt><dd>{studio.book.trimSize}</dd></div><div><dt>Binding</dt><dd>{studio.book.binding}</dd></div><div><dt>Extent</dt><dd>{studio.book.totalPages} pp.</dd></div></dl>
      </header>

      <WorkbenchToolbar
        viewSide={studio.viewSide}
        density={studio.density}
        canUndo={studio.history.past.length > 0}
        canRedo={studio.history.future.length > 0}
        onViewSide={studio.setViewSide}
        onDensity={studio.setDensity}
        onUndo={studio.undo}
        onRedo={studio.redo}
      />

      <div className="workspace-grid">
        <SignatureOutline signatures={studio.book.signatures} activeId={studio.activeSignature.id} onChoose={studio.chooseSignature} onAdd={() => setAddOpen(true)} />
        <ImpositionCanvas signature={studio.activeSignature} viewSide={studio.viewSide} density={studio.density} selection={studio.selection} report={studio.report} onSelect={studio.selectSlot} />
        <Inspector
          book={studio.book}
          signature={studio.activeSignature}
          selectedSheet={studio.selectedSheet}
          selectedPage={studio.selectedPage}
          selection={studio.selection}
          report={studio.report}
          onEditPage={studio.editSelectedPage}
          onMoveSheet={studio.moveSelectedSheet}
          onToggleProofed={studio.toggleProofed}
          onUpdateNote={studio.updateNote}
          onFindPage={studio.findPage}
        />
      </div>

      <StatusBar book={studio.book} report={studio.report} />
      <div className="sr-only" role="status" aria-live="polite">{studio.announcement}</div>
    </div>

    <AddSignaturePanel open={addOpen} onClose={() => setAddOpen(false)} onAdd={studio.addSignature} />
  </div>
}

export default App
