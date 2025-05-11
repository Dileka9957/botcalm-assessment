import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Book, BookListProps } from '@/types/book';
import useAuthStore from '@/stores/authStore';
import { toast } from 'sonner';
import { Pencil, Trash2, Book as BookIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateFormatter';

const MobileBookList: React.FC<BookListProps> = ({ books, onDelete }) => {
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
    <div className="grid gap-4 p-4 md:hidden">
      {books.map((book) => (
        <Card key={book._id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{book.title}</CardTitle>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">{book.author}</p>
              <Badge variant="outline" className={getGenreColor(book.genre)}>
                {book.genre}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex gap-2">
            <p className="text-sm text-gray-900">{book.description}</p>
          </CardContent>

          <CardFooter className="flex justify-between gap-2">
            <p className="text-sm text-gray-500">
              Published: {formatDate(book.publicationDate)}
            </p>
            {user && (
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  onClick={() => handleEditClick(book)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
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
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MobileBookList;
