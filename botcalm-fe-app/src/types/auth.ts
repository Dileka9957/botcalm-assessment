export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  // Add other user properties as needed
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  loadUser: () => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<User>;
  register: (userData: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  clearError: () => void;
}
