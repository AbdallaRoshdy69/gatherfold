import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

const memory = new Map()
const memoryStorage = {
  get length() { return memory.size },
  clear() { memory.clear() },
  getItem(key) { return memory.get(key) ?? null },
  key(index) { return [...memory.keys()][index] ?? null },
  removeItem(key) { memory.delete(key) },
  setItem(key, value) { memory.set(key, String(value)) },
}

Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: memoryStorage })
beforeEach(() => localStorage.clear())
afterEach(() => { cleanup(); localStorage.clear() })
