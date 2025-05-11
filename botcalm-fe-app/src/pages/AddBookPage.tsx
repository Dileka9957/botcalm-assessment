import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
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

// Schema for book form validation
const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: 'Title is required.',
    })
    .max(100, {
      message: 'Title cannot exceed 100 characters.',
    }),
  author: z
    .string()
    .min(1, {
      message: 'Author is required.',
    })
    .max(50, {
      message: 'Author name cannot exceed 50 characters.',
    }),
  genre: z.enum(
    [
      'Fiction',
      'Non-Fiction',
      'Science Fiction',
      'Fantasy',
      'Mystery',
      'Thriller',
      'Romance',
      'Biography',
      'History',
    ],
    {
      message: 'Please select a valid genre.',
    }
  ),
  publicationDate: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate <= today;
    },
    {
      message: 'Publication date cannot be in the future.',
    }
  ),
  description: z.string().max(500, {
    message: 'Description cannot exceed 500 characters.',
  }),
  isbn: z
    .string()
    .min(1, {
      message: 'ISBN is required.',
    })
    .refine(
      (isbn) => {
        // Regex to validate ISBN (10 or 13 digits)
        return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(isbn);
      },
      {
        message: 'Please enter a valid ISBN (10 or 13 digits).',
      }
    ),
});

export function AddBookPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loading } = useBookStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: 'Fiction',
      publicationDate: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      isbn: '',
    },
  });

  const { addBook } = useBookStore();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setSuccess(false);

    try {
      // Format date to ISO string for API
      const formattedData = {
        ...values,
        publicationDate: new Date(values.publicationDate).toISOString(),
      };

      await addBook(formattedData);
      setSuccess(true);
      form.reset();
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
        setError('Failed to create book');
      }
    }
  };

  return (
    <div>
      <AppNavbar />
      <h2 className="my-4">Add New Book</h2>
      <div className="container mt-5" style={{ maxWidth: '600px' }}>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>Book created successfully!</AlertDescription>
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Add Book'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
