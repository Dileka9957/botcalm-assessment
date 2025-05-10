import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
} from 'axios';

// Define interfaces for our data models
interface Book {
  _id?: string;
  title: string;
  author: string;
  // Add other book properties as needed
}

interface Credentials {
  email: string;
  password: string;
}

interface UserData {
  name: string;
  email: string;
  password: string;
  // Add other user properties as needed
}

interface User {
  _id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

// Create API instance
const API: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// Add JWT to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized responses
API.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service with typed methods
const ApiService = {
  // Books
  getBooks: (): Promise<AxiosResponse<Book[]>> => API.get('/books'),

  getBook: (id: string): Promise<AxiosResponse<Book>> =>
    API.get(`/books/${id}`),

  addBook: (book: Book): Promise<AxiosResponse<Book>> =>
    API.post('/books', book),

  updateBook: (id: string, book: Book): Promise<AxiosResponse<Book>> =>
    API.put(`/books/${id}`, book),

  deleteBook: (id: string): Promise<AxiosResponse<void>> =>
    API.delete(`/books/${id}`),

  // Auth
  login: (
    credentials: Credentials
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
