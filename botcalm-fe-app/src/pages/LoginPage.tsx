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

            {/* <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Remember me</FormLabel>
                  </FormItem>
                )}
              />

              <Button
                variant="link"
                className="h-auto p-0 text-sm text-blue-600 hover:text-blue-500"
                asChild
              >
                <Link href="/forgot-password">Forgot password?</Link>
              </Button>
            </div> */}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>

            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div> */}
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
