# Architecture

Gatherfold keeps domain logic independent from rendering so each behavior can be tested without a browser.

## State boundaries

`useGatherfold` owns the active project, selected slot, side visibility, display density, announcements, and one reducer-backed editing history. The reducer's `present` value is the active book. Every meaningful domain edit records the previous book in `past` and clears `future`; undo and redo move whole immutable book snapshots between those stacks.

The selected slot is intentionally outside history. Undoing a page correction does not throw the operator to another part of the document. Switching books loads a fresh history and selects the first physical slot of the first signature.

## Derived state

The active signature, selected sheet, selected page, and preflight report are derived during render. They are not synchronized through effects. Persistence is the only data effect; the keyboard listener is the only event effect and removes itself during cleanup.

## Domain transitions

The reducer accepts small explicit events:

- `EDIT_SLOT` changes one page and invalidates the signature's proof approval.
- `MOVE_SHEET` swaps a physical sheet with its neighbor and rejects boundary moves.
- `TOGGLE_PROOFED` changes the textual approval state.
- `UPDATE_NOTE` records production guidance.
- `ADD_SIGNATURE` appends an imposed section and extends the expected page count.
- `UNDO`, `REDO`, and `LOAD_BOOK` manage history boundaries.

## Accessibility

Page slots are real toggle buttons with page, side, and validation state in their accessible names. Side controls expose `aria-pressed`; proof status is written in text; preflight errors are listed; live announcements describe edits and navigation. All editing functions are available without drag and drop.
