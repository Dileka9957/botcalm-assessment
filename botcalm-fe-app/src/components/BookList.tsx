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
import { Pencil, Trash2, Book as BookIcon } from 'lucide-react';

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

  const getGenreColor = (genre: string) => {
    const genreMap: Record<string, string> = {
      fiction: 'bg-blue-100 text-blue-800',
      'science fiction': 'bg-purple-100 text-purple-800',
      fantasy: 'bg-indigo-100 text-indigo-800',
      mystery: 'bg-green-100 text-green-800',
      biography: 'bg-yellow-100 text-yellow-800',
      history: 'bg-red-100 text-red-800',
      thriller: 'bg-orange-100 text-orange-800',
      romance: 'bg-pink-100 text-pink-800',
      horror: 'bg-gray-100 text-gray-800',
    };

    const normalizedGenre = genre.toLowerCase();
    return genreMap[normalizedGenre] || 'bg-gray-100 text-gray-800';
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center justify-center border rounded-md bg-gray-50">
        <BookIcon className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No books found</h3>
        <p className="mt-1 text-gray-500">
          Add new books to start building your collection.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto px-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Author</TableHead>
            <TableHead className="font-semibold">Genre</TableHead>
            {user && (
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow
              key={book._id}
              className="hover:bg-gray-50 transition-colors border-b"
            >
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenreColor(book.genre)}`}
                >
                  {book.genre}
                </span>
              </TableCell>
              {user && (
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    onClick={() => handleEditClick(book)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookList;
