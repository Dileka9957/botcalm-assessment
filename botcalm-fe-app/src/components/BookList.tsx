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
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

const BookList: React.FC<BookListProps> = ({ books, onDelete }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleEditClick = (book: Book) => {
    navigate(`/books/edit/${book._id}`);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      setDeletingId(id);
      await onDelete(id);
      toast.success('Book deleted successfully');
    } catch (error) {
      toast.error('Failed to delete book');
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
          {user && <TableHead className="text-right">Actions</TableHead>}
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
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell className="capitalize">
                {book.genre.toLowerCase()}
              </TableCell>
              {user && (
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => handleEditClick(book)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteClick(book._id)}
                    disabled={deletingId === book._id}
                  >
                    {deletingId === book._id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </>
                    )}
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
