export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  error?: string;
}

export const GENRE_OPTIONS = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Biography',
  'History',
] as const;

export type Genre = (typeof GENRE_OPTIONS)[number];

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: Genre;
  publicationDate?: string;
  description?: string;
  isbn?: string;
}

export interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  addBook: (book: BookInput) => Promise<Book>;
  updateBook: (id: string, book: BookInput) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
}

export interface BookListProps {
  books: Book[];
  onDelete: (id: string) => void;
}

export interface BookInput {
  title: string;
  author: string;
  genre: Genre;
  publicationDate?: string;
  description?: string;
  isbn?: string;
}

export interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}
