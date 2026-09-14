import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { createSignature, nextSignatureStart } from '../model/imposition.js'
import { createHistory, historyReducer } from '../model/history.js'
import { analyzeBook, pageOccurrences } from '../model/validation.js'
import { createId } from '../lib/id.js'
import { loadBooks, saveBooks } from '../lib/storage.js'

function firstSelection(book) {
  const signature = book?.signatures[0]
  return {
    signatureId: signature?.id ?? '',
    sheetId: signature?.sheets[0]?.id ?? '',
    side: 'front',
    slotIndex: 0,
  }
}

export function useGatherfold() {
  const [books, setBooks] = useState(loadBooks)
  const [activeBookId, setActiveBookId] = useState(() => books[0]?.id ?? '')
  const [history, dispatch] = useReducer(historyReducer, books[0], createHistory)
  const [selection, setSelection] = useState(() => firstSelection(books[0]))
  const [viewSide, setViewSide] = useState('both')
  const [density, setDensity] = useState('comfortable')
  const [announcement, setAnnouncement] = useState('Imposition workbench ready.')
  const selectionsByBook = useRef(new Map())

  const book = history.present
  const activeSignature = useMemo(
    () => book.signatures.find((signature) => signature.id === selection.signatureId) ?? book.signatures[0],
    [book.signatures, selection.signatureId],
  )
  const selectedSheet = useMemo(
    () => activeSignature?.sheets.find((sheet) => sheet.id === selection.sheetId) ?? activeSignature?.sheets[0],
    [activeSignature, selection.sheetId],
  )
  const selectedPage = selectedSheet?.[selection.side]?.[selection.slotIndex] ?? null
  const report = useMemo(() => analyzeBook(book), [book])

  useEffect(() => {
    setBooks((current) => current.map((entry) => entry.id === activeBookId ? book : entry))
  }, [activeBookId, book])

  useEffect(() => { saveBooks(books) }, [books])

  useEffect(() => {
    function handleKeyDown(event) {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return
      const target = event.target
      const isEditing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
      if (isEditing) return
      const key = event.key.toLowerCase()
      if (key === 'z' && event.shiftKey) {
        event.preventDefault()
        dispatch({ type: 'REDO' })
        setAnnouncement('Redid the last imposition change.')
      } else if (key === 'z') {
        event.preventDefault()
        dispatch({ type: 'UNDO' })
        setAnnouncement('Undid the last imposition change.')
      } else if (key === 'y') {
        event.preventDefault()
        dispatch({ type: 'REDO' })
        setAnnouncement('Redid the last imposition change.')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const chooseBook = useCallback((bookId) => {
    if (bookId === activeBookId) return
    const target = books.find((entry) => entry.id === bookId)
    if (!target) return
    selectionsByBook.current.set(activeBookId, selection)
    dispatch({ type: 'LOAD_BOOK', book: target })
    setActiveBookId(bookId)
    setSelection(selectionsByBook.current.get(bookId) ?? firstSelection(target))
    setViewSide('both')
    setAnnouncement(`${target.title} opened.`)
  }, [activeBookId, books, selection])

  const chooseSignature = useCallback((signatureId) => {
    const signature = book.signatures.find((entry) => entry.id === signatureId)
    if (!signature) return
    setSelection({ signatureId, sheetId: signature.sheets[0]?.id ?? '', side: 'front', slotIndex: 0 })
    setAnnouncement(`${signature.label} selected.`)
  }, [book.signatures])

  const selectSlot = useCallback((sheetId, side, slotIndex) => {
    setSelection((current) => ({ ...current, sheetId, side, slotIndex }))
    const signature = book.signatures.find((entry) => entry.id === selection.signatureId)
    const sheet = signature?.sheets.find((entry) => entry.id === sheetId)
    const page = sheet?.[side]?.[slotIndex]
    setAnnouncement(`Page ${page} selected on the ${side} of the sheet.`)
  }, [book.signatures, selection.signatureId])

  const editSelectedPage = useCallback((page) => {
    if (!activeSignature || !selectedSheet) return
    dispatch({
      type: 'EDIT_SLOT',
      signatureId: activeSignature.id,
      sheetId: selectedSheet.id,
      side: selection.side,
      slotIndex: selection.slotIndex,
      page,
    })
    setAnnouncement(`Selected slot changed to page ${page}. Proof status cleared.`)
  }, [activeSignature, selectedSheet, selection.side, selection.slotIndex])

  const moveSelectedSheet = useCallback((direction) => {
    if (!activeSignature || !selectedSheet) return
    const index = activeSignature.sheets.findIndex((sheet) => sheet.id === selectedSheet.id)
    const target = index + direction
    if (target < 0 || target >= activeSignature.sheets.length) return
    dispatch({ type: 'MOVE_SHEET', signatureId: activeSignature.id, sheetId: selectedSheet.id, direction })
    setAnnouncement(`Sheet moved ${direction < 0 ? 'toward the outer forme' : 'toward the centre fold'}.`)
  }, [activeSignature, selectedSheet])

  const toggleProofed = useCallback(() => {
    if (!activeSignature) return
    dispatch({ type: 'TOGGLE_PROOFED', signatureId: activeSignature.id })
    setAnnouncement(`${activeSignature.label} marked ${activeSignature.proofed ? 'waiting for proof' : 'proofed'}.`)
  }, [activeSignature])

  const updateNote = useCallback((note) => {
    if (!activeSignature) return
    dispatch({ type: 'UPDATE_NOTE', signatureId: activeSignature.id, note })
  }, [activeSignature])

  const addSignature = useCallback(({ label, paper, note }) => {
    const pageCount = 16
    const signature = createSignature({
      id: createId('signature'),
      label: label.trim(),
      startPage: nextSignatureStart(book.signatures),
      pageCount,
      paper,
      note: note.trim(),
    })
    dispatch({ type: 'ADD_SIGNATURE', signature, pageCount })
    setSelection({ signatureId: signature.id, sheetId: signature.sheets[0].id, side: 'front', slotIndex: 0 })
    setAnnouncement(`${signature.label} added with ${pageCount} imposed pages.`)
  }, [book.signatures])

  const findPage = useCallback((page) => {
    const [match] = pageOccurrences(book, page)
    if (!match) {
      setAnnouncement(`Page ${page} is not assigned in this book.`)
      return false
    }
    setSelection(match)
    setAnnouncement(`Page ${page} found in ${book.signatures.find((signature) => signature.id === match.signatureId)?.label}.`)
    return true
  }, [book])

  const undo = useCallback(() => { dispatch({ type: 'UNDO' }); setAnnouncement('Undid the last imposition change.') }, [])
  const redo = useCallback(() => { dispatch({ type: 'REDO' }); setAnnouncement('Redid the last imposition change.') }, [])

  return {
    books, activeBookId, book, history, activeSignature, selectedSheet, selection, selectedPage,
    report, viewSide, density, announcement,
    chooseBook, chooseSignature, selectSlot, editSelectedPage, moveSelectedSheet,
    toggleProofed, updateNote, addSignature, findPage, undo, redo, setViewSide, setDensity,
  }
}
