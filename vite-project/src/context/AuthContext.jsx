import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedPinVerified = localStorage.getItem('pinVerified');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      setIsPinVerified(storedPinVerified === 'true');
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);

      if (response.success) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('pinVerified', 'false');

        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        setIsPinVerified(false);

        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register
  const register = async (username, email, password, fullName) => {
    try {
      const response = await authAPI.register(username, email, password, fullName);

      if (response.success) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('pinVerified', 'false');

        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        setIsPinVerified(false);

        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Verify PIN
  const verifyPin = () => {
    localStorage.setItem('pinVerified', 'true');
    setIsPinVerified(true);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('pinVerified');

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsPinVerified(false);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isPinVerified,
    login,
    register,
    verifyPin,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
