import { describe, expect, it } from 'vitest'
import { createSignature, imposePages, nextSignatureStart, signaturePageCount } from './imposition.js'

describe('imposePages', () => {
  it('imposes a sixteen-page signature from the outside inward', () => {
    const sheets = imposePages(1, 16, 'a')
    expect(sheets).toHaveLength(4)
    expect(sheets[0]).toEqual({ id: 'a-sheet-1', front: [16, 1], back: [2, 15] })
    expect(sheets[3]).toEqual({ id: 'a-sheet-4', front: [10, 7], back: [8, 9] })
  })

  it('offsets every page for a later signature', () => {
    expect(imposePages(17, 8, 'b')).toEqual([
      { id: 'b-sheet-1', front: [24, 17], back: [18, 23] },
      { id: 'b-sheet-2', front: [22, 19], back: [20, 21] },
    ])
  })

  it('rejects an invalid starting page', () => {
    expect(() => imposePages(0, 16)).toThrow(/positive integer/)
    expect(() => imposePages(1.5, 16)).toThrow(/positive integer/)
  })

  it('rejects page counts that cannot be folded into sheets', () => {
    expect(() => imposePages(1, 6)).toThrow(/multiple of four/)
    expect(() => imposePages(1, 0)).toThrow(/multiple of four/)
  })
})

describe('signature helpers', () => {
  it('creates a complete signature and reports its capacity', () => {
    const signature = createSignature({ id: 'sig', label: 'A', startPage: 1, pageCount: 8, paper: 'Ivory' })
    expect(signature).toMatchObject({ id: 'sig', label: 'A', paper: 'Ivory', proofed: false })
    expect(signaturePageCount(signature)).toBe(8)
  })

  it('finds the first page after all existing assignments', () => {
    const signatures = [
      createSignature({ id: 'a', label: 'A', startPage: 1, pageCount: 8 }),
      createSignature({ id: 'b', label: 'B', startPage: 9, pageCount: 8 }),
    ]
    expect(nextSignatureStart(signatures)).toBe(17)
    expect(nextSignatureStart([])).toBe(1)
  })
})
