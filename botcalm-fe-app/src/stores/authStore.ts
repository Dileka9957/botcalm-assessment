import { create } from 'zustand';
import API from '../services/api';
// import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => {
  // const { toast } = useToast();

  return {
    user: null,
    loading: true,
    error: null,

    login: async (credentials) => {
      try {
        set({ loading: true, error: null });
        const { data } = await API.login(credentials);
        localStorage.setItem('token', data.token);
        set({ user: data.data, loading: false });
        // toast({
        //   title: 'Login successful',
        //   description: 'Welcome back!',
        // });
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Login failed';
        set({ error: errorMessage, loading: false });
        // toast({
        //   title: 'Login failed',
        //   description: errorMessage,
        //   variant: 'destructive',
        // });
        throw err;
      }
    },

    register: async (userData) => {
      try {
        set({ loading: true, error: null });
        const { data } = await API.register(userData);
        localStorage.setItem('token', data.token);
        set({ user: data.data, loading: false });
        // toast({
        //   title: 'Registration successful',
        //   description: 'Your account has been created!',
        // });
        return data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Registration failed';
        set({ error: errorMessage, loading: false });
        // toast({
        //   title: 'Registration failed',
        //   description: errorMessage,
        //   variant: 'destructive',
        // });
        throw err;
      }
    },

    logout: async () => {
      try {
        set({ loading: true });
        await API.logout();
        localStorage.removeItem('token');
        set({ user: null, loading: false });
        // toast({
        //   title: 'Logged out successfully',
        // });
      } catch (err) {
        set({ loading: false });
        // toast({
        //   title: 'Logout failed',
        //   variant: 'destructive',
        // });
      }
    },

    loadUser: async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await API.getMe();
          set({ user: data });
        }
      } catch (err) {
        localStorage.removeItem('token');
        console.error(err);
      } finally {
        set({ loading: false });
      }
    },
  };
});

export default useAuthStore;
