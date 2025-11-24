import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import PinCodeForm from './components/PinCodeForm';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const { isAuthenticated, isPinVerified } = useContext(AuthContext);

  return (
    <Routes>
      {/* Redirect to appropriate page based on auth state */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            isPinVerified ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/pin-verify" replace />
            )
          ) : (
            <LoginForm />
          )
        }
      />

      {/* PIN Verification - requires login */}
      <Route
        path="/pin-verify"
        element={
          <ProtectedRoute>
            <PinCodeForm />
          </ProtectedRoute>
        }
      />

      {/* Dashboard - requires login and PIN verification */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requirePin={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
