import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookList from '@/components/BookList';
import useBookStore from '@/stores/bookStore';
import type { Book } from '@/types/book';
import AppNavbar from '@/components/Navbar';
import useAuthStore from '@/stores/authStore';

const HomePage = () => {
  const { books, loading, error, fetchBooks, deleteBook } = useBookStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id);
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <AppNavbar />
      <div className="mt-10">
        {user && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Link to="/books/add" className="btn btn-primary">
              Add New Book
            </Link>
          </div>
        )}

        {!loading && !error && (
          <BookList
            books={(books as Book[]) || []}
            onDelete={handleDeleteBook}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
