import type { AuthCredentials, User, UserData } from '@/types/auth';
import type { Book, BookInput } from '@/types/book';
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
} from 'axios';

// Create API instance
const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add JWT to requests
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') ||
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 unauthorized responses
API.interceptors.response.use(
  (response: AxiosResponse) => {
    // Store token if it comes in the response body
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Clear cookie if exists
      document.cookie =
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    return Promise.reject(error);
  }
);

// API service with typed methods
const ApiService = {
  getBooks: (): Promise<AxiosResponse<Book[]>> => API.get('/books'),
  getBook: (id: string): Promise<AxiosResponse<Book>> =>
    API.get(`/books/${id}`),
  addBook: (book: BookInput): Promise<AxiosResponse<Book>> =>
    API.post('/books', book),
  updateBook: (
    id: string,
    book: Partial<BookInput>
  ): Promise<AxiosResponse<Book>> => API.put(`/books/${id}`, book),
  deleteBook: (id: string): Promise<AxiosResponse<void>> =>
    API.delete(`/books/${id}`),
  login: (
    credentials: AuthCredentials
  ): Promise<AxiosResponse<{ token: string; user: User }>> =>
    API.post('/auth/login', credentials),
  register: (
    userData: UserData
  ): Promise<AxiosResponse<{ token: string; user: User }>> =>
    API.post('/auth/register', userData),
  getMe: (): Promise<AxiosResponse<User>> => API.get('/auth/me'),
  logout: (): Promise<AxiosResponse<{ message: string }>> =>
    API.get('/auth/logout'),
};

export default ApiService;
