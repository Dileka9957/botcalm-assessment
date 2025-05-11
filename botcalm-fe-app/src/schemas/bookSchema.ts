import { GENRE_OPTIONS } from '@/types/book';
import { z } from 'zod';

export const bookFormSchema = z.object({
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
  genre: z.enum(GENRE_OPTIONS, {
    message: 'Please select a valid genre.',
  }),
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

export type BookFormValues = z.infer<typeof bookFormSchema>;
