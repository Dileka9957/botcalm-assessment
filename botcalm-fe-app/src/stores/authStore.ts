import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import API from '../services/api';
import type { User, AuthState, ApiResponse } from '@/types/auth';

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      loadUser: async () => {
        const currentState = useAuthStore.getState();
        if (currentState.user) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            set({ loading: false });
            return;
          }

          const response = await API.getMe();

          const { data } = response.data as unknown as ApiResponse<User>;

          if (!data) {
            throw new Error('User data not found in response');
          }

          set({ user: data, loading: false });
        } catch (err: unknown) {
          localStorage.removeItem('token');
          const error =
            err instanceof Error ? err.message : 'Failed to load user';
          set({ error, loading: false, user: null });
        }
      },

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await API.login(credentials);
          //@ts-ignore
          const { token, data: user } = response.data;

          if (!token || !user) {
            throw new Error('Authentication failed - no token received');
          }

          localStorage.setItem('token', token);
          set({ user, loading: false });
          return user;
        } catch (err) {
          console.error('Login error:', err);
          const error = err instanceof Error ? err.message : 'Login failed';
          set({ error, loading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await API.register(userData);
          //@ts-ignore
          const { token, data } = response.data;
          if (token) {
            localStorage.setItem('token', token);
            set({ user: data, loading: false });
            return data;
          }
          throw new Error('Registration token missing');
        } catch (err: unknown) {
          const error =
            err instanceof Error ? err.message : 'Registration failed';
          set({ error, loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await API.logout();
          localStorage.removeItem('token');
          set({ user: null, loading: false });
        } catch (err: unknown) {
          const error = err instanceof Error ? err.message : 'Logout failed';
          set({ error, loading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;
