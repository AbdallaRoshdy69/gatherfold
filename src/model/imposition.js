export function imposePages(startPage, pageCount = 16, signatureId = 'signature') {
  if (!Number.isInteger(startPage) || startPage < 1) throw new RangeError('startPage must be a positive integer')
  if (!Number.isInteger(pageCount) || pageCount < 4 || pageCount % 4 !== 0) {
    throw new RangeError('pageCount must be a positive multiple of four')
  }

  const endPage = startPage + pageCount - 1
  return Array.from({ length: pageCount / 4 }, (_, index) => ({
    id: `${signatureId}-sheet-${index + 1}`,
    front: [endPage - (index * 2), startPage + (index * 2)],
    back: [startPage + (index * 2) + 1, endPage - (index * 2) - 1],
  }))
}

export function createSignature({ id, label, startPage, pageCount = 16, paper = 'Natural', note = '', proofed = false }) {
  return {
    id,
    label,
    paper,
    note,
    proofed,
    sheets: imposePages(startPage, pageCount, id),
  }
}

export function nextSignatureStart(signatures) {
  const assigned = signatures.flatMap((signature) => signature.sheets.flatMap((sheet) => [...sheet.front, ...sheet.back]))
  return assigned.length === 0 ? 1 : Math.max(...assigned.filter(Number.isFinite)) + 1
}

export function signaturePageCount(signature) {
  return signature.sheets.length * 4
}
