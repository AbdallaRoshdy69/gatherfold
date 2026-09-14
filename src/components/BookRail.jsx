export function BookRail({ books, activeBookId, onChoose }) {
  return <aside className="book-rail" aria-label="Book projects">
    <div className="rail-heading"><span className="fold-mark" aria-hidden="true"><i /></span><strong>GATHER<br />FOLD</strong></div>
    <p className="rail-label">Books on bench</p>
    <nav>{books.map((book, index) => (
      <button
        key={book.id}
        type="button"
        className="book-tab"
        data-active={book.id === activeBookId}
        aria-current={book.id === activeBookId ? 'page' : undefined}
        onClick={() => onChoose(book.id)}
      >
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span><strong>{book.title}</strong><small>{book.client}</small></span>
      </button>
    ))}</nav>
    <div className="rail-foot"><span>Local file</span><strong>GF / 1.0</strong></div>
  </aside>
}
