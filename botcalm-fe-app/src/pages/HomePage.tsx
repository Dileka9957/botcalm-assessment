import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookList from '@/components/BookList';
import useBookStore from '@/stores/bookStore';

const HomePage = () => {
  const { books, loading, error, fetchBooks, deleteBook } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id);
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Books</h1>
        <Link to="/books/add" className="btn btn-primary">
          Add New Book
        </Link>
      </div>

      {!loading && !error && (
        <BookList books={books || []} onDelete={handleDeleteBook} />
      )}
    </div>
  );
};

export default HomePage;
