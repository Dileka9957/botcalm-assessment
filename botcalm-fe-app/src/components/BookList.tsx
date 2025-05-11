import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Book, BookListProps } from '@/types/book';
import useAuthStore from '@/stores/authStore';

const BookList: React.FC<BookListProps> = ({ books, onDelete }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleEditClick = (book: Book) => {
    // Navigate to the edit page with the book ID
    navigate(`/books/edit/${book._id}`);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      setDeletingId(id);
      await onDelete(id);
      console.log('Book deleted successfully');
    } catch (error) {
      console.log('Failed to delete book');
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Genre</TableHead>
          {user && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              No books found. Add a new book to get started.
            </TableCell>
          </TableRow>
        ) : (
          books.map((book) => (
            <TableRow key={book._id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              {user && (
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEditClick(book)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteClick(book._id)}
                    disabled={deletingId === book._id}
                  >
                    {deletingId === book._id ? 'Deleting...' : 'Delete'}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default BookList;
