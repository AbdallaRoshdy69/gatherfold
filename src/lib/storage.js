import { sampleBooks } from '../data/sampleBooks.js'

export const STORAGE_KEY = 'gatherfold.books.v1'

function isBookArray(value) {
  return Array.isArray(value)
    && value.length > 0
    && value.every((book) => book && typeof book === 'object' && Array.isArray(book.signatures))
}

export function loadBooks(storage = localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return sampleBooks()
    const parsed = JSON.parse(raw)
    return isBookArray(parsed) ? parsed : sampleBooks()
  } catch {
    return sampleBooks()
  }
}

export function saveBooks(books, storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(books))
}
