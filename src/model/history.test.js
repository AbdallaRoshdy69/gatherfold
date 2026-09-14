import { describe, expect, it } from 'vitest'
import { sampleBooks } from '../data/sampleBooks.js'
import { createSignature } from './imposition.js'
import { createHistory, historyReducer } from './history.js'

function reduce(state, action) { return historyReducer(state, action) }

describe('historyReducer', () => {
  it('starts without undo or redo entries', () => {
    const book = sampleBooks()[0]
    expect(createHistory(book)).toEqual({ past: [], present: book, future: [] })
  })

  it('edits one slot immutably and clears proof approval', () => {
    const book = sampleBooks()[0]
    const state = reduce(createHistory(book), { type: 'EDIT_SLOT', signatureId: 'rain-a', sheetId: 'rain-a-sheet-1', side: 'front', slotIndex: 0, page: 15 })
    expect(state.present.signatures[0].sheets[0].front).toEqual([15, 1])
    expect(state.present.signatures[0].proofed).toBe(false)
    expect(book.signatures[0].sheets[0].front).toEqual([16, 1])
    expect(state.past).toHaveLength(1)
  })

  it('undoes and redoes an edit', () => {
    const initial = createHistory(sampleBooks()[0])
    const edited = reduce(initial, { type: 'EDIT_SLOT', signatureId: 'rain-a', sheetId: 'rain-a-sheet-1', side: 'front', slotIndex: 0, page: 15 })
    const undone = reduce(edited, { type: 'UNDO' })
    expect(undone.present.signatures[0].sheets[0].front[0]).toBe(16)
    expect(undone.future).toHaveLength(1)
    expect(reduce(undone, { type: 'REDO' }).present.signatures[0].sheets[0].front[0]).toBe(15)
  })

  it('leaves state alone when undo or redo is unavailable', () => {
    const initial = createHistory(sampleBooks()[0])
    expect(reduce(initial, { type: 'UNDO' })).toBe(initial)
    expect(reduce(initial, { type: 'REDO' })).toBe(initial)
  })

  it('does not record no-op or invalid slot edits', () => {
    const initial = createHistory(sampleBooks()[0])
    const samePage = { type: 'EDIT_SLOT', signatureId: 'rain-a', sheetId: 'rain-a-sheet-1', side: 'front', slotIndex: 0, page: 16 }
    const invalidSlot = { ...samePage, slotIndex: 8, page: 12 }
    expect(reduce(initial, samePage)).toBe(initial)
    expect(reduce(initial, invalidSlot)).toBe(initial)
    expect(reduce(initial, { ...samePage, page: 1.5 })).toBe(initial)
  })

  it('moves a sheet within a signature', () => {
    const initial = createHistory(sampleBooks()[0])
    const moved = reduce(initial, { type: 'MOVE_SHEET', signatureId: 'rain-a', sheetId: 'rain-a-sheet-1', direction: 1 })
    expect(moved.present.signatures[0].sheets.map(({ id }) => id).slice(0, 2)).toEqual(['rain-a-sheet-2', 'rain-a-sheet-1'])
  })

  it('does not record an impossible sheet move', () => {
    const initial = createHistory(sampleBooks()[0])
    expect(reduce(initial, { type: 'MOVE_SHEET', signatureId: 'rain-a', sheetId: 'rain-a-sheet-1', direction: -1 })).toBe(initial)
  })

  it('toggles proofing and updates the binder note', () => {
    const initial = createHistory(sampleBooks()[0])
    const unproofed = reduce(initial, { type: 'TOGGLE_PROOFED', signatureId: 'rain-a' })
    const noted = reduce(unproofed, { type: 'UPDATE_NOTE', signatureId: 'rain-a', note: 'Check fold.' })
    expect(noted.present.signatures[0]).toMatchObject({ proofed: false, note: 'Check fold.' })
    expect(noted.past).toHaveLength(2)
  })

  it('does not record an unchanged binder note', () => {
    const initial = createHistory(sampleBooks()[0])
    const note = initial.present.signatures[0].note
    expect(reduce(initial, { type: 'UPDATE_NOTE', signatureId: 'rain-a', note })).toBe(initial)
  })

  it('adds a signature and extends the book by its page count', () => {
    const initial = createHistory(sampleBooks()[0])
    const signature = createSignature({ id: 'rain-e', label: 'E', startPage: 65 })
    const next = reduce(initial, { type: 'ADD_SIGNATURE', signature, pageCount: 16 })
    expect(next.present.totalPages).toBe(80)
    expect(next.present.signatures.at(-1).id).toBe('rain-e')
  })
})
