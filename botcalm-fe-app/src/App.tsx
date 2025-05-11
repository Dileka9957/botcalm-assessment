import { useEffect } from 'react';
import useAuthStore from './stores/authStore';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/privateRoute';
import HomePage from './pages/HomePage';
import { AddBookPage } from './pages/AddBookPage';
import { RegisterPage } from './pages/RegsiterPage';
import { Toaster } from 'sonner';
import { EditBookPage } from './pages/EditBookPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <Toaster richColors position="top-right" />
      <div className="">
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
          <Route
            path="/books/edit/:bookId"
            element={
              <PrivateRoute>
                <EditBookPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
