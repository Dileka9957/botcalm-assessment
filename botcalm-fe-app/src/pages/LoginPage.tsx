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
import { loginFormSchema, type loginFormValues } from '@/schemas/userSchema';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Lock, Mail } from 'lucide-react';

export function LoginPage() {
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: loginFormValues) => {
    clearError();
    try {
      await login(values);
      toast.success('Login successful');
      navigate('/'); // Redirect after successful login
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Login failed', {
        description: error,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Sign in</h2>
          <p className="mt-2 text-sm text-gray-600">Welcome back</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-6"
          >
            <div className="space-y-4">
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
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full relative overflow-hidden transition-all duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Sign in</span>
                  {/* Gradient background */}
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  {/* Pulse animation when not loading */}
                  {!loading && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse opacity-0 hover:opacity-30"></span>
                  )}
                </>
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Button variant="link" className="p-0 text-blue-600" asChild>
            <Link to="/register">Register here</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
