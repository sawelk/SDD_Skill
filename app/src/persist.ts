import type { Book } from './libraryReducer'

const STORAGE_KEY = 'library-desk:v1'

type StoredShape = {
  v: 1
  books: Book[]
}

function isBook(x: unknown): x is Book {
  if (x === null || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.author === 'string' &&
    typeof o.totalCopies === 'number' &&
    typeof o.borrowed === 'number' &&
    Number.isInteger(o.totalCopies) &&
    Number.isInteger(o.borrowed) &&
    o.totalCopies >= 1 &&
    o.borrowed >= 0 &&
    o.borrowed <= o.totalCopies
  )
}

export function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      (parsed as StoredShape).v !== 1 ||
      !Array.isArray((parsed as StoredShape).books)
    ) {
      return []
    }
    const books = (parsed as StoredShape).books.filter(isBook)
    return books
  } catch {
    return []
  }
}

export function saveBooks(books: readonly Book[]): void {
  const payload: StoredShape = { v: 1, books: [...books] }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // quota or private mode — ignore
  }
}
