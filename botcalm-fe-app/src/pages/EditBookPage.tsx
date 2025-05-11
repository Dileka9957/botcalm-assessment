import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
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
import { format } from 'date-fns';
import useBookStore from '../stores/bookStore';
import AppNavbar from '@/components/Navbar';
import {
  addBookFormSchema,
  type AddBookFormValues,
} from '@/schemas/bookSchema';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';

export function EditBookPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { getBook, updateBook } = useBookStore();

  const form = useForm<AddBookFormValues>({
    resolver: zodResolver(addBookFormSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: 'Fiction',
      publicationDate: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      isbn: '',
    },
  });

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;

      try {
        setLoading(true);
        const book = await getBook(bookId);
        if (book) {
          form.reset({
            title: book.title,
            author: book.author,
            genre: book.genre,
            publicationDate: book.publicationDate
              ? format(new Date(book.publicationDate), 'yyyy-MM-dd')
              : format(new Date(), 'yyyy-MM-dd'),
            description: book.description,
            isbn: book.isbn,
          });
        }
      } catch (err) {
        console.error('Failed to fetch book:', err);
        toast.error('Failed to load book data');
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, getBook, form, navigate]);

  const onSubmit = async (values: AddBookFormValues) => {
    if (!bookId) return;

    setError(null);
    setLoading(true);

    try {
      const formattedData = {
        ...values,
        publicationDate: new Date(values.publicationDate).toISOString(),
      };

      await updateBook(bookId, formattedData);
      toast.success('Book updated successfully!');
      navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Handle various error formats
      if (Array.isArray(err.response?.data?.error)) {
        setError(err.response.data.error.join(', '));
      } else if (typeof err.response?.data?.error === 'string') {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to update book');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppNavbar />
      <div className="container mt-5" style={{ maxWidth: '600px' }}>
        <h2 className="my-4">Edit Book</h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
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

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Updating...' : 'Update Book'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
