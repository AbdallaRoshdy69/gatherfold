import { describe, expect, it } from 'vitest'
import { sampleBooks } from '../data/sampleBooks.js'
import { analyzeBook, pageOccurrences } from './validation.js'

describe('analyzeBook', () => {
  it('recognizes a clean complete imposition', () => {
    const report = analyzeBook(sampleBooks()[0])
    expect(report).toMatchObject({ assigned: 64, missing: [], duplicates: [], outOfRange: [], isClean: true })
  })

  it('reports a missing page and its duplicate', () => {
    const book = sampleBooks()[0]
    book.signatures[0].sheets[0].front[0] = 15
    const report = analyzeBook(book)
    expect(report.missing).toEqual([16])
    expect(report.duplicates).toEqual([{ page: 15, count: 2 }])
    expect(report.isClean).toBe(false)
  })

  it('reports values outside the book extent', () => {
    const book = sampleBooks()[0]
    book.signatures[0].sheets[0].front[0] = 99
    const report = analyzeBook(book)
    expect(report.outOfRange[0]).toMatchObject({ page: 99, signatureId: 'rain-a', side: 'front', slotIndex: 0 })
    expect(report.missing).toContain(16)
  })

  it('treats non-integer assignments as invalid', () => {
    const book = sampleBooks()[0]
    book.signatures[0].sheets[0].back[0] = 2.5
    expect(analyzeBook(book).outOfRange[0].page).toBe(2.5)
  })
})

describe('pageOccurrences', () => {
  it('locates an imposed page with its exact slot', () => {
    expect(pageOccurrences(sampleBooks()[0], 33)).toEqual([
      { page: 33, signatureId: 'rain-c', sheetId: 'rain-c-sheet-1', side: 'front', slotIndex: 1 },
    ])
  })
})
