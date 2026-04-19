import { useEffect, useReducer, useRef, useState } from 'react'
import {
  initialLibraryState,
  libraryReducer,
  type Book,
} from './libraryReducer'
import './App.css'

function availableCopies(b: Book): number {
  return b.totalCopies - b.borrowed
}

export default function App() {
  const [state, dispatch] = useReducer(libraryReducer, initialLibraryState)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [copies, setCopies] = useState(1)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!state.flash) return
    const t = window.setTimeout(() => {
      dispatch({ type: 'CLEAR_FLASH' })
    }, 4000)
    return () => window.clearTimeout(t)
  }, [state.flash])

  function onAdd(e: React.FormEvent) {
    e.preventDefault()
    dispatch({ type: 'ADD_BOOK', title, author, copies })
    setTitle('')
    setAuthor('')
    setCopies(1)
    titleRef.current?.focus()
  }

  return (
    <div className="layout">
      <header className="header">
        <div>
          <p className="eyebrow">Frontend only · no server</p>
          <h1>Library desk</h1>
          <p className="lede">
            Add titles to the shelf, borrow copies, and return them. State lives
            in this browser tab until you refresh.
          </p>
        </div>
      </header>

      {state.flash ? (
        <div
          className={`flash flash-${state.flash.variant}`}
          role="status"
          aria-live="polite"
        >
          {state.flash.text}
        </div>
      ) : null}

      <section className="panel" aria-labelledby="add-heading">
        <h2 id="add-heading">Add a book</h2>
        <form className="add-form" onSubmit={onAdd}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              ref={titleRef}
              id="title"
              name="title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Left Hand of Darkness"
            />
          </div>
          <div className="field">
            <label htmlFor="author">Author</label>
            <input
              id="author"
              name="author"
              type="text"
              autoComplete="off"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Ursula K. Le Guin"
            />
          </div>
          <div className="field field-narrow">
            <label htmlFor="copies">Copies on shelf</label>
            <input
              id="copies"
              name="copies"
              type="number"
              min={1}
              step={1}
              value={copies}
              onChange={(e) => setCopies(Number(e.target.value))}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add to catalog
            </button>
          </div>
        </form>
      </section>

      <section className="panel" aria-labelledby="catalog-heading">
        <div className="panel-head">
          <h2 id="catalog-heading">Catalog</h2>
          <span className="count">{state.books.length} titles</span>
        </div>

        {state.books.length === 0 ? (
          <p className="empty">
            No books yet. Use the form above to add your first title.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="catalog">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Author</th>
                  <th scope="col" className="num">
                    Total
                  </th>
                  <th scope="col" className="num">
                    Out
                  </th>
                  <th scope="col" className="num">
                    Available
                  </th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.books.map((book) => {
                  const avail = availableCopies(book)
                  return (
                    <tr key={book.id}>
                      <td className="title-cell">{book.title}</td>
                      <td>{book.author}</td>
                      <td className="num">{book.totalCopies}</td>
                      <td className="num">{book.borrowed}</td>
                      <td className="num">
                        <span
                          className={
                            avail === 0 ? 'badge badge-zero' : 'badge badge-ok'
                          }
                        >
                          {avail}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          type="button"
                          className="btn btn-ghost"
                          disabled={avail === 0}
                          onClick={() =>
                            dispatch({ type: 'BORROW', bookId: book.id })
                          }
                        >
                          Borrow
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          disabled={book.borrowed === 0}
                          onClick={() =>
                            dispatch({ type: 'RETURN', bookId: book.id })
                          }
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
