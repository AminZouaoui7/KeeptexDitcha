import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        // Vérifier si l'utilisateur est déjà connecté
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          // Verify token validity by fetching user profile
          try {
            const profile = await authService.getProfile();
            setUser(profile.user || profile);
          } catch (err) {
            console.log('Error verifying token:', err);
            // Si l'API échoue mais que nous avons un utilisateur en local storage, utilisons-le quand même
            setUser(currentUser);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      console.log('Login successful, response data:', data);
      
      // Vérifier si data.user existe
      if (data.user) {
        console.log('Setting user data:', data.user);
        setUser(data.user);
      } else {
        console.log('No user data in response, checking localStorage');
        // Si pas de data.user, essayer de récupérer l'utilisateur du localStorage
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          console.log('Using user data from localStorage:', storedUser);
          setUser(storedUser);
        } else {
          console.warn('No user data available after login');
        }
      }
      
      return data;
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.';
      console.error('Error message:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.verifyEmail(email);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur de vérification d\'email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const value = {
    user,
    loading,
    error,
    login,
    verifyEmail,
    register,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};