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
import { EditBookModal } from './EditModal';
import type { Book, BookListProps } from '@/types/book';

const BookList: React.FC<BookListProps> = ({ books, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
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

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => {
      setSelectedBook(null);
    }, 300);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Actions</TableHead>
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        book={selectedBook}
      />
    </>
  );
};

export default BookList;
