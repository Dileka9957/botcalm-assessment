import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import useBookStore from '../stores/bookStore';
import { type EditBookModalProps } from '@/types/book';
import { bookFormSchema, type BookFormValues } from '@/schemas/bookSchema';

export function EditBookModal({ isOpen, onClose, book }: EditBookModalProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loading, updateBook } = useBookStore();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      genre: book?.genre || 'Fiction',
      publicationDate: book?.publicationDate
        ? format(parseISO(book.publicationDate), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      description: book?.description || '',
      isbn: book?.isbn || '',
    },
  });

  // Reset form when book changes
  useEffect(() => {
    if (book) {
      form.reset({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || 'Fiction',
        publicationDate: book.publicationDate
          ? format(parseISO(book.publicationDate), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        description: book.description || '',
        isbn: book.isbn || '',
      });
    }
  }, [book, form.reset]);

  const onSubmit = async (values: BookFormValues) => {
    if (!book?._id) return;

    setError(null);
    setSuccess(false);

    try {
      // Format date to ISO string for API
      const formattedData = {
        ...values,
        publicationDate: new Date(values.publicationDate).toISOString(),
      };

      await updateBook(book._id, formattedData);
      setSuccess(true);

      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Handle various error formats that might come from the store or API
      if (Array.isArray(err.response?.data?.error)) {
        setError(err.response.data.error.join(', '));
      } else if (typeof err.response?.data?.error === 'string') {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to update book');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>Book updated successfully!</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Book title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Fiction">Fiction</SelectItem>
                      <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                      <SelectItem value="Science Fiction">
                        Science Fiction
                      </SelectItem>
                      <SelectItem value="Fantasy">Fantasy</SelectItem>
                      <SelectItem value="Mystery">Mystery</SelectItem>
                      <SelectItem value="Thriller">Thriller</SelectItem>
                      <SelectItem value="Romance">Romance</SelectItem>
                      <SelectItem value="Biography">Biography</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publicationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      max={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input placeholder="ISBN (10 or 13 digits)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Book description (max 500 characters)"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-gray-500 mt-1">
                    {field.value.length}/500 characters
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Book'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditBookModal;
