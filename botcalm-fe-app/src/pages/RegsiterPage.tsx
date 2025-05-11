import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import useAuthStore from '../stores/authStore';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { regsiterFormSchema, type UserFormValues } from '@/schemas/userSchema';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export function RegisterPage() {
  const { register, error, clearError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(regsiterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (error) {
      // If there's a duplicate email error, focus the email field
      if (error.includes('Email already')) {
        form.setError('email', {
          type: 'manual',
          message: 'This email is already registered',
        });
        form.setFocus('email');
      } else {
        // Show general error as toast
        toast.error('Registration Error', {
          description: error,
        });
      }
    }
  }, [error, form]);

  const onSubmit = async (values: UserFormValues) => {
    clearError();
    setIsSubmitting(true);
    try {
      await register(values);

      toast.success('Registration successful', {
        description: "You've been successfully registered!",
      });
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Register</h2>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      {/* Debug output - remove in production */}
      <div className="mb-2 p-2 bg-gray-100 rounded text-xs">
        <div>Form valid: {form.formState.isValid.toString()}</div>
        <div>Errors: {JSON.stringify(form.formState.errors)}</div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    {...field}
                    type="email"
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    autoComplete="new-password"
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
