import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requirePin = false }) => {
  const { isAuthenticated, isPinVerified, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  // Not authenticated at all
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Authenticated but PIN not verified (and PIN is required)
  if (requirePin && !isPinVerified) {
    return <Navigate to="/pin-verify" replace />;
  }

  return children;
};

export default ProtectedRoute;
