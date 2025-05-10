import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
}

interface BookListProps {
  books: Book[];
  onDelete: (id: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onDelete }) => {
  return (
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
                <Button variant="outline" asChild>
                  <Link to={`/books/${book._id}/edit`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(book._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default BookList;
