import { useEffect } from 'react';
import useAuthStore from './stores/authStore';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
// import PrivateRoute from './components/privateRoute';
import { RegisterPage } from './pages/RegsiterPage';
import HomePage from './pages/HomePage';

function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <AppNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route
            path="/books"
            element={
              <PrivateRoute>
              </PrivateRoute>
            }
          /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
