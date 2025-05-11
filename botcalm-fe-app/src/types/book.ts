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
