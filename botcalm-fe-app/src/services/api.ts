import axios from 'axios';

const API = axios.create({
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  // Books
  getBooks: () => API.get('/books'),
  getBook: (id) => API.get(`/books/${id}`),
  addBook: (book) => API.post('/books', book),
  updateBook: (id, book) => API.put(`/books/${id}`, book),
  deleteBook: (id) => API.delete(`/books/${id}`),

  // Auth
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
  logout: () => API.get('/auth/logout'),
};
