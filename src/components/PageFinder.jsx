import { useState } from 'react'

export function PageFinder({ totalPages, onFind }) {
  const [page, setPage] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const value = Number(page)
    if (!Number.isInteger(value) || value < 1 || value > totalPages) {
      setError(`Enter a whole page number from 1 to ${totalPages}.`)
      return
    }
    setError(onFind(value) ? '' : 'That page is not assigned.')
  }

  return <form className="page-finder" noValidate onSubmit={submit}>
    <label htmlFor="page-finder">Find a page</label>
    <div><input id="page-finder" type="number" min="1" max={totalPages} value={page} placeholder={`1–${totalPages}`} aria-describedby={error ? 'page-finder-error' : undefined} aria-invalid={Boolean(error)} onChange={(event) => { setPage(event.target.value); setError('') }} /><button type="submit">Locate</button></div>
    {error && <p id="page-finder-error" role="alert">{error}</p>}
  </form>
}
