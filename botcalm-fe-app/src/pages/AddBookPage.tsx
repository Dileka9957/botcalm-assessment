import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { format } from 'date-fns';
import useBookStore from '../stores/bookStore';
import AppNavbar from '@/components/Navbar';
import {
  addBookFormSchema,
  type AddBookFormValues,
} from '@/schemas/bookSchema';
import { toast } from 'sonner';
import { BookOpen, Loader2 } from 'lucide-react';

export function AddBookPage() {
  const [, setError] = useState<string | null>(null);
  const { loading, addBook } = useBookStore();
  const navigate = useNavigate();

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

  const onSubmit = async (values: AddBookFormValues) => {
    setError(null);

    try {
      const formattedData = {
        ...values,
        publicationDate: new Date(values.publicationDate).toISOString(),
      };

      await addBook(formattedData);
      toast.success('Book added successfully!', {
        description: `"${values.title}" has been added to your collection.`,
      });
      form.reset();
      // Navigate back to the home page after successful addition
      navigate('/');
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

  const handleCancel = () => {
    // Navigate back to the home page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Add New Book</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Book title"
                          {...field}
                          className="focus-visible:ring-blue-500"
                        />
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
                      <FormLabel className="text-gray-700">Author</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Author name"
                          {...field}
                          className="focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Genre</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-blue-500">
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fiction">Fiction</SelectItem>
                          <SelectItem value="Non-Fiction">
                            Non-Fiction
                          </SelectItem>
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
                      <FormLabel className="text-gray-700">
                        Publication Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          max={format(new Date(), 'yyyy-MM-dd')}
                          className="focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">ISBN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ISBN (10 or 13 digits)"
                        {...field}
                        className="focus-visible:ring-blue-500"
                      />
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
                    <FormLabel className="text-gray-700">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Book description (max 500 characters)"
                        {...field}
                        rows={4}
                        className="resize-none focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <div className="flex justify-between items-center mt-1">
                      <FormMessage />
                      <div
                        className={`text-xs ${field.value.length > 450 ? (field.value.length > 500 ? 'text-red-500' : 'text-orange-500') : 'text-gray-500'}`}
                      >
                        {field.value.length}/500 characters
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Book'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
