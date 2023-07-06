import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';

const App = () => {
  // Check if the user is logged in
  const isLoggedIn = false;

  return (
    <Router>
    <Routes>
      <Route 
        exact 
        path="/"
        element={isLoggedIn ? <Navigate to="/HomePage" /> : <Navigate to="/auth"/>}
      />
      <Route 
        exact 
        path="/auth" 
        element={ <AuthPage />} />
      <Route
        exact
        path="/home"
        render={() => (isLoggedIn ? <HomePage /> : <Navigate to="/auth" />)}
      />
    </Routes>
    </Router>
  );
};

export default App;
