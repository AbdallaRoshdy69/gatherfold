import { createSignature } from '../model/imposition.js'

const books = [
  {
    id: 'book-field-notes',
    title: 'Field Notes on Rain',
    client: 'Common Press',
    totalPages: 64,
    trimSize: '148 × 210 mm',
    binding: 'Section sewn',
    signatures: [
      createSignature({ id: 'rain-a', label: 'A · Front matter', startPage: 1, paper: 'Natural', note: 'Title leaf and contents. Keep page 2 intentionally quiet.', proofed: true }),
      createSignature({ id: 'rain-b', label: 'B · Weather fronts', startPage: 17, paper: 'Mist blue', note: 'Full-bleed map crosses the centre fold.', proofed: false }),
      createSignature({ id: 'rain-c', label: 'C · River gauges', startPage: 33, paper: 'Natural', note: 'Check chart keys at 100% before plating.', proofed: false }),
      createSignature({ id: 'rain-d', label: 'D · Index', startPage: 49, paper: 'Warm grey', note: 'Index closes on page 63; page 64 carries the colophon.', proofed: true }),
    ],
  },
  {
    id: 'book-orchard',
    title: 'The Night Orchard',
    client: 'Moth Editions',
    totalPages: 48,
    trimSize: '165 × 235 mm',
    binding: 'French link',
    signatures: [
      createSignature({ id: 'orchard-a', label: 'A · Threshold', startPage: 1, paper: 'Ivory', note: 'Gatefold reference follows page 8.', proofed: true }),
      createSignature({ id: 'orchard-b', label: 'B · Canopy', startPage: 17, paper: 'Ivory', note: 'Spot black changes after page 24.', proofed: false }),
      createSignature({ id: 'orchard-c', label: 'C · Moth index', startPage: 33, paper: 'Soft green', note: 'Last four pages print one colour only.', proofed: false }),
    ],
  },
  {
    id: 'book-tidal',
    title: 'Tidal Type Specimen',
    client: 'North Quay Studio',
    totalPages: 32,
    trimSize: '210 × 270 mm',
    binding: 'Singer sewn',
    signatures: [
      createSignature({ id: 'tidal-a', label: 'A · Display cuts', startPage: 1, paper: 'Chalk', note: 'Metallic ink on the outer forme.', proofed: false }),
      createSignature({ id: 'tidal-b', label: 'B · Text cuts', startPage: 17, paper: 'Chalk', note: 'Keep running heads aligned through the fold.', proofed: false }),
    ],
  },
]

export function sampleBooks() {
  return structuredClone(books)
}
