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
  | {
      type: 'EDIT_BOOK'
      bookId: string
      title: string
      author: string
      totalCopies: number
    }
  | { type: 'DELETE_BOOK'; bookId: string }
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

    case 'EDIT_BOOK': {
      const idx = state.books.findIndex((b) => b.id === action.bookId)
      if (idx === -1) {
        return {
          ...state,
          flash: { variant: 'error', text: 'Book not found.' },
        }
      }
      const book = state.books[idx]
      const title = action.title.trim()
      const author = action.author.trim()
      const totalCopies = Math.floor(action.totalCopies)

      if (!title || !author) {
        return {
          ...state,
          flash: { variant: 'error', text: 'Title and author are required.' },
        }
      }
      if (!Number.isFinite(totalCopies) || totalCopies < 1) {
        return {
          ...state,
          flash: {
            variant: 'error',
            text: 'Total copies must be at least 1.',
          },
        }
      }
      if (totalCopies < book.borrowed) {
        return {
          ...state,
          flash: {
            variant: 'error',
            text: `Total copies cannot be less than borrowed (${book.borrowed} out).`,
          },
        }
      }

      const next = [...state.books]
      next[idx] = {
        ...book,
        title,
        author,
        totalCopies,
      }
      return {
        books: next,
        flash: { variant: 'success', text: `Updated “${title}”.` },
      }
    }

    case 'DELETE_BOOK': {
      const idx = state.books.findIndex((b) => b.id === action.bookId)
      if (idx === -1) {
        return {
          ...state,
          flash: { variant: 'error', text: 'Book not found.' },
        }
      }
      const book = state.books[idx]
      return {
        books: state.books.filter((b) => b.id !== action.bookId),
        flash: { variant: 'success', text: `Removed “${book.title}”.` },
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

export function createInitialState(books: Book[]): LibraryState {
  return { books, flash: null }
}
