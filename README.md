# Gatherfold

Gatherfold is a local-first React workbench for planning book signatures before ink meets paper. It turns page ranges into press-ready sheet pairs, lets binders inspect and correct individual slots, and continuously checks the full book for missing, repeated, or out-of-range pages.

This is an editor rather than a reporting dashboard: every page card is interactive, changes are undoable, sheets can be reordered, signatures can be extended, and the current book is persisted locally.

## Core workflows

- Generate correct front/back imposition for any page range divisible by four
- Inspect both sides of a sheet or isolate one press side
- Reassign individual page slots and see preflight conflicts immediately
- Move physical sheets through the gathering order
- Find any assigned page and jump to its exact signature, sheet, side, and slot
- Mark signatures proofed with a textual, non-color-only state
- Undo and redo editing, ordering, note, proof, and signature changes
- Switch between three independent sample books
- Extend a book with another fully imposed 16-page signature

## Run locally

Use Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Run every verification step:

```bash
npm run check
```

The suite contains 33 self-contained Vitest and Testing Library tests. It requires no network, credentials, external services, or machine-specific data.

## Architecture

The workbench separates immutable domain transitions from React orchestration:

- `src/model/imposition.js` creates deterministic sheet layouts.
- `src/model/validation.js` derives book-wide preflight findings.
- `src/model/history.js` owns undoable immutable transitions.
- `src/hooks/useGatherfold.js` connects history, persistence, selection, and keyboard shortcuts.
- `src/components` contains the editor's accessible visual surfaces.

See `docs/architecture.md` and `docs/imposition.md` for the full design.

## Keyboard and accessibility

- `Ctrl/⌘ + Z` undoes the latest model change.
- `Ctrl/⌘ + Shift + Z` or `Ctrl/⌘ + Y` redoes it.
- The signature dialog traps focus, closes with `Escape`, and restores focus to its trigger.
- Proof and conflict states always include text and never rely on colour alone.

See `docs/accessibility.md` for the interaction contract and manual review checklist.

## Privacy

Gatherfold stores projects in the current browser's `localStorage`. It makes no network requests and sends no book data elsewhere.

## License

MIT
