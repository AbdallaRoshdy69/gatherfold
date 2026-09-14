import { useState } from 'react'

export function PageFinder({ totalPages, onFind }) {
  const [page, setPage] = useState('')
  const [notFound, setNotFound] = useState(false)

  function submit(event) {
    event.preventDefault()
    const value = Number(page)
    const found = Number.isInteger(value) && value >= 1 && onFind(value)
    setNotFound(!found)
  }

  return <form className="page-finder" onSubmit={submit}>
    <label htmlFor="page-finder">Find a page</label>
    <div><input id="page-finder" type="number" min="1" max={totalPages} value={page} placeholder={`1–${totalPages}`} onChange={(event) => { setPage(event.target.value); setNotFound(false) }} /><button type="submit">Locate</button></div>
    {notFound && <p role="alert">That page is not assigned.</p>}
  </form>
}
