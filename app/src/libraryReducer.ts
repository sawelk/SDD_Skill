export type Book = {
  id: string
  title: string
  author: string
  totalCopies: number
  borrowed: number
}

export type Flash = { variant: 'success' | 'error'; text: string }

export type LibraryState = {
  books: Book[]
  flash: Flash | null
}

export type LibraryAction =
  | { type: 'ADD_BOOK'; title: string; author: string; copies: number }
  | { type: 'BORROW'; bookId: string }
  | { type: 'RETURN'; bookId: string }
  | { type: 'CLEAR_FLASH' }

function newId(): string {
  return crypto.randomUUID()
}

export function libraryReducer(
  state: LibraryState,
  action: LibraryAction,
): LibraryState {
  switch (action.type) {
    case 'CLEAR_FLASH':
      return { ...state, flash: null }

    case 'ADD_BOOK': {
      const title = action.title.trim()
      const author = action.author.trim()
      const copies = Math.floor(action.copies)

      if (!title || !author) {
        return {
          ...state,
          flash: { variant: 'error', text: 'Title and author are required.' },
        }
      }
      if (!Number.isFinite(copies) || copies < 1) {
        return {
          ...state,
          flash: {
            variant: 'error',
            text: 'Number of copies must be at least 1.',
          },
        }
      }

      const book: Book = {
        id: newId(),
        title,
        author,
        totalCopies: copies,
        borrowed: 0,
      }

      return {
        books: [book, ...state.books],
        flash: { variant: 'success', text: `Added “${title}”.` },
      }
    }

    case 'BORROW': {
      const idx = state.books.findIndex((b) => b.id === action.bookId)
      if (idx === -1) {
        return {
          ...state,
          flash: { variant: 'error', text: 'Book not found.' },
        }
      }
      const book = state.books[idx]
      const available = book.totalCopies - book.borrowed
      if (available <= 0) {
        return {
          ...state,
          flash: {
            variant: 'error',
            text: `No copies available for “${book.title}”.`,
          },
        }
      }
      const next = [...state.books]
      next[idx] = { ...book, borrowed: book.borrowed + 1 }
      return {
        books: next,
        flash: { variant: 'success', text: `Borrowed one copy of “${book.title}”.` },
      }
    }

    case 'RETURN': {
      const idx = state.books.findIndex((b) => b.id === action.bookId)
      if (idx === -1) {
        return {
          ...state,
          flash: { variant: 'error', text: 'Book not found.' },
        }
      }
      const book = state.books[idx]
      if (book.borrowed <= 0) {
        return {
          ...state,
          flash: {
            variant: 'error',
            text: `No borrowed copies to return for “${book.title}”.`,
          },
        }
      }
      const next = [...state.books]
      next[idx] = { ...book, borrowed: book.borrowed - 1 }
      return {
        books: next,
        flash: { variant: 'success', text: `Returned one copy of “${book.title}”.` },
      }
    }

    default:
      return state
  }
}

export const initialLibraryState: LibraryState = {
  books: [],
  flash: null,
}
