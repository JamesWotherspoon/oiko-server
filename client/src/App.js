import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AuthPage from './components/AuthPage/AuthPage';
import HomePage from './components/HomePage';
import NotFoundPage from './components/NotFoundPage';
import StandardErrorBoundary from './components/ErrorBoundary/StandardErrorBoundary';
import './scss/main.scss';
import { useAuth } from './context/authContext';
import { getApiRequest } from './services/apiServices';

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return children;
};

const App = () => {
  const { login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await getApiRequest('/auth/status');
        console.log(response)
        if (response.status === 200) {
          login();
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        console.log(isLoading)
        setIsLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <StandardErrorBoundary>
      <Router>
        <Routes>
          <Route index element={<Navigate to="/home" />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </StandardErrorBoundary>
  );
};

export default App;
