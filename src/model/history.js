export const HISTORY_LIMIT = 50

function updateSignature(book, signatureId, updater) {
  let changed = false
  const signatures = book.signatures.map((signature) => {
    if (signature.id !== signatureId) return signature
    const next = updater(signature)
    if (next !== signature) changed = true
    return next
  })
  return changed ? { ...book, signatures } : book
}

function commit(state, present) {
  if (present === state.present) return state
  return { past: [...state.past, state.present].slice(-HISTORY_LIMIT), present, future: [] }
}

export function createHistory(book) {
  return { past: [], present: book, future: [] }
}

export function historyReducer(state, action) {
  switch (action.type) {
    case 'LOAD_BOOK':
      return createHistory(action.book)
    case 'UNDO': {
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future] }
    }
    case 'REDO': {
      if (state.future.length === 0) return state
      const next = state.future[0]
      return { past: [...state.past, state.present], present: next, future: state.future.slice(1) }
    }
    case 'EDIT_SLOT': {
      const page = Number(action.page)
      if (!Number.isInteger(page) || page < 1) return state
      const present = updateSignature(state.present, action.signatureId, (signature) => {
        const sheet = signature.sheets.find((entry) => entry.id === action.sheetId)
        const slots = sheet?.[action.side]
        if (!Array.isArray(slots) || action.slotIndex < 0 || action.slotIndex >= slots.length || slots[action.slotIndex] === page) return signature
        return {
          ...signature,
          proofed: false,
          sheets: signature.sheets.map((entry) => entry.id === action.sheetId ? {
            ...entry,
            [action.side]: entry[action.side].map((current, index) => index === action.slotIndex ? page : current),
          } : entry),
        }
      })
      return commit(state, present)
    }
    case 'MOVE_SHEET': {
      const present = updateSignature(state.present, action.signatureId, (signature) => {
        const index = signature.sheets.findIndex((sheet) => sheet.id === action.sheetId)
        const target = index + action.direction
        if (index < 0 || target < 0 || target >= signature.sheets.length) return signature
        const sheets = [...signature.sheets]
        ;[sheets[index], sheets[target]] = [sheets[target], sheets[index]]
        return { ...signature, proofed: false, sheets }
      })
      return commit(state, present)
    }
    case 'TOGGLE_PROOFED':
      return commit(state, updateSignature(state.present, action.signatureId, (signature) => ({ ...signature, proofed: !signature.proofed })))
    case 'UPDATE_NOTE':
      return commit(state, updateSignature(state.present, action.signatureId, (signature) => (
        signature.note === action.note ? signature : { ...signature, note: action.note }
      )))
    case 'ADD_SIGNATURE':
      return commit(state, {
        ...state.present,
        totalPages: state.present.totalPages + action.pageCount,
        signatures: [...state.present.signatures, action.signature],
      })
    default:
      return state
  }
}
