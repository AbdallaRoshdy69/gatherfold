import { describe, expect, it } from 'vitest'
import { sampleBooks } from '../data/sampleBooks.js'
import { loadBooks, saveBooks, STORAGE_KEY } from './storage.js'

describe('book storage', () => {
  it('returns independent sample copies', () => {
    const first = sampleBooks()
    const second = sampleBooks()
    first[0].title = 'Changed'
    expect(second[0].title).toBe('Field Notes on Rain')
  })

  it('loads a valid saved collection', () => {
    const saved = sampleBooks().slice(1)
    expect(loadBooks({ getItem: () => JSON.stringify(saved) })).toEqual(saved)
  })

  it('falls back for missing, corrupt, or empty data', () => {
    expect(loadBooks({ getItem: () => null })).toEqual(sampleBooks())
    expect(loadBooks({ getItem: () => '{bad' })).toEqual(sampleBooks())
    expect(loadBooks({ getItem: () => '[]' })).toEqual(sampleBooks())
  })

  it('saves under the versioned key', () => {
    const calls = []
    const books = sampleBooks()
    expect(saveBooks(books, { setItem: (key, value) => calls.push([key, value]) })).toBe(true)
    expect(calls).toEqual([[STORAGE_KEY, JSON.stringify(books)]])
  })

  it('survives browsers that reject storage writes', () => {
    const storage = { setItem: () => { throw new DOMException('Quota exceeded', 'QuotaExceededError') } }
    expect(saveBooks(sampleBooks(), storage)).toBe(false)
  })
})
