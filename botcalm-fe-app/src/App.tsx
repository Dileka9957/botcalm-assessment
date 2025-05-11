import { useEffect } from 'react';
import useAuthStore from './stores/authStore';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import PrivateRoute from './components/privateRoute';
import HomePage from './pages/HomePage';
import { AddBookPage } from './pages/AddBookPage';
import { RegisterPage } from './pages/RegsiterPage';
import { Toaster } from 'sonner';

function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <Toaster richColors position="top-right" />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/books/add"
            element={
              <PrivateRoute>
                <AddBookPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
