function collectSlots(signatures) {
  return signatures.flatMap((signature) => signature.sheets.flatMap((sheet) => [
    ...sheet.front.map((page, slotIndex) => ({ page, signatureId: signature.id, sheetId: sheet.id, side: 'front', slotIndex })),
    ...sheet.back.map((page, slotIndex) => ({ page, signatureId: signature.id, sheetId: sheet.id, side: 'back', slotIndex })),
  ]))
}

export function analyzeBook(book) {
  const slots = collectSlots(book.signatures)
  const counts = new Map()
  const outOfRange = []

  for (const slot of slots) {
    if (!Number.isInteger(slot.page) || slot.page < 1 || slot.page > book.totalPages) outOfRange.push(slot)
    else counts.set(slot.page, (counts.get(slot.page) ?? 0) + 1)
  }

  const missing = []
  const duplicates = []
  for (let page = 1; page <= book.totalPages; page += 1) {
    const count = counts.get(page) ?? 0
    if (count === 0) missing.push(page)
    if (count > 1) duplicates.push({ page, count })
  }

  return {
    assigned: slots.length,
    missing,
    duplicates,
    outOfRange,
    isClean: missing.length === 0 && duplicates.length === 0 && outOfRange.length === 0,
  }
}

export function pageOccurrences(book, targetPage) {
  return collectSlots(book.signatures).filter(({ page }) => page === targetPage)
}
