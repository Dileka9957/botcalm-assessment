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
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get started with our platform
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          placeholder="John Doe"
                          className="pl-10"
                          {...field}
                        />
                      </div>
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
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          placeholder="you@example.com"
                          className="pl-10"
                          type="email"
                          {...field}
                        />
                      </div>
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
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          autoComplete="new-password"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Button variant="link" className="p-0 text-blue-600" asChild>
            <Link to="/login">Login here</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
