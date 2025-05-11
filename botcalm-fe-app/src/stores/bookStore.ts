import { create } from 'zustand';
import API from '../services/api';
import type { ApiResponse, Book, BookInput, BookState } from '@/types/book';

const useBookStore = create<BookState>()((set) => ({
  books: [],
  loading: false,
  error: null,

  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await API.getBooks();
      set({
        books: (response.data as unknown as ApiResponse<Book[]>).data,
        loading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to fetch books',
        loading: false,
      });
    }
  },

  getBook: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await API.getBook(id);
      const book = (response.data as unknown as ApiResponse<Book>).data;
      set({ loading: false });
      return book;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to fetch book',
        loading: false,
      });
      throw err;
    }
  },

  addBook: async (book: BookInput) => {
    try {
      const response = await API.addBook(book);
      const newBook = (response.data as unknown as ApiResponse<Book>).data;
      set((state) => ({
        books: [...state.books, newBook],
        error: null,
      }));
      return newBook;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to add book' });
      throw err;
    }
  },

  updateBook: async (id: string, book: BookInput) => {
    try {
      const response = await API.updateBook(id, book);
      const updatedBook = (response.data as unknown as ApiResponse<Book>).data;
      set((state) => ({
        books: state.books.map((b) => (b._id === id ? updatedBook : b)),
        error: null,
      }));
      return updatedBook;
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
        error: null,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to delete book' });
      throw err;
    }
  },
}));

export default useBookStore;
