import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./components/AuthPage";
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import StandardErrorBoundary from "./ErrorBoundary/StandardErrorBoundary";

const App = () => {
  // Check if the user is logged in
  const isLoggedIn = true;

  return (
    <StandardErrorBoundary>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/auth" />
            }
          />
          <Route exact path="/auth" element={<AuthPage />} />
          <Route
            exact
            path="/home"
            element={isLoggedIn ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </StandardErrorBoundary>
  );
};

export default App;