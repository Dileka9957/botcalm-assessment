import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import BookList from '@/components/BookList';
import useBookStore from '@/stores/bookStore';
import type { Book } from '@/types/book';
import AppNavbar from '@/components/Navbar';
import useAuthStore from '@/stores/authStore';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';

const HomePage = () => {
  const { books, loading, error, fetchBooks, deleteBook } = useBookStore();
  const user = useAuthStore((state) => state.user);
  const [inputValue, setInputValue] = useState('');
  // Use the custom hook to debounce the search input
  const debouncedSearchTerm = useDebounce(inputValue, 300);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id);
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  };

  const handleClearSearch = useCallback(() => {
    setInputValue('');
  }, []);

  const filteredBooks = books
    ? (books as Book[]).filter(
        (book) =>
          book.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          book.author
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          book.genre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : [];

  // if (loading)
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="animate-pulse text-lg font-medium text-gray-700">
  //         Loading books...
  //       </div>
  //     </div>
  //   );

  // if (error)
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div
  //         className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
  //         role="alert"
  //       >
  //         <strong className="font-bold">Error: </strong>
  //         <span className="block sm:inline">{error}</span>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              My Book Collection
            </h1>

            {user && (
              <Link
                to="/books/add"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Add New Book
              </Link>
            )}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-10 pr-10 w-full md:w-96"
            />
            {inputValue && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {!loading && !error && (
            <div className="bg-white rounded-md shadow-sm border border-gray-200">
              <BookList books={filteredBooks} onDelete={handleDeleteBook} />
            </div>
          )}

          {filteredBooks.length === 0 && debouncedSearchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No books match your search criteria.
              </p>
              <button
                onClick={handleClearSearch}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
