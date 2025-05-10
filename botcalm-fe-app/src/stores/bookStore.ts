import { create } from 'zustand';
import API from '../services/api';

// Define the Book interface
export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
}

// Book without _id for creation
export interface BookInput {
  title: string;
  author: string;
  genre: string;
}

// Define the store state and actions
interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  addBook: (book: BookInput) => Promise<Book>;
  updateBook: (id: string, book: BookInput) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
}

// Create the typed store
const useBookStore = create<BookState>()((set) => ({
  books: [],
  loading: false,
  error: null,

  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.getBooks();
      set({ books: data, loading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to fetch books',
        loading: false,
      });
    }
  },

  addBook: async (book: BookInput) => {
    try {
      const { data } = await API.addBook(book);
      set((state) => ({ books: [...state.books, data] }));
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to add book' });
      throw err;
    }
  },

  updateBook: async (id: string, book: BookInput) => {
    try {
      const { data } = await API.updateBook(id, book);
      set((state) => ({
        books: state.books.map((b) => (b._id === id ? data : b)),
      }));
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to update book' });
      throw err;
    }
  },

  deleteBook: async (id: string) => {
    try {
      await API.deleteBook(id);
      set((state) => ({
        books: state.books.filter((book) => book._id !== id),
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to delete book' });
      throw err;
    }
  },
}));

export default useBookStore;
