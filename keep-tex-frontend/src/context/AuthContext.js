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
        const token = localStorage.getItem('token');
        const currentUser = authService.getCurrentUser();
        
        if (token && currentUser) {
          console.log('Token and user found in localStorage, setting user state');
          // Définir immédiatement l'utilisateur pour éviter un état de déconnexion temporaire
          setUser(currentUser);
          
          // Verify token validity by fetching user profile in background
          try {
            const profile = await authService.getProfile();
            // Mettre à jour l'utilisateur avec les données les plus récentes
            const userData = profile.data || profile;
            setUser(userData);
            // Mettre à jour le localStorage avec les données les plus récentes
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('User profile updated from API:', userData);
          } catch (err) {
            console.log('Error verifying token:', err);
            // Si l'erreur est 401, le token est expiré, mais nous gardons l'utilisateur connecté
            // sauf si l'erreur est explicitement liée à l'authentification
            if (err.response && err.response.status === 401) {
              console.log('Token expired but keeping user session active');
              // On ne déconnecte pas l'utilisateur, on garde les données locales
            }
            // Pour les autres erreurs (réseau, etc.), on garde l'utilisateur connecté avec les données locales
          }
        } else if (!token && currentUser) {
          // Si nous avons un utilisateur mais pas de token, essayons de récupérer un nouveau token
          console.log('User found but no token, attempting to refresh session');
          try {
            // Tentative de reconnexion silencieuse si nous avons des informations suffisantes
            if (currentUser.email) {
              // Nous ne pouvons pas faire une reconnexion complète car nous n'avons pas le mot de passe
              // Mais nous pouvons garder l'utilisateur en session pour une meilleure expérience
              console.log('Keeping user session with local data');
              setUser(currentUser);
            } else {
              // Si nous n'avons pas assez d'informations, nettoyons le localStorage
              localStorage.removeItem('user');
              setUser(null);
            }
          } catch (refreshErr) {
            console.error('Failed to refresh session:', refreshErr);
            // En cas d'échec, on garde quand même l'utilisateur connecté avec les données locales
            setUser(currentUser);
          }
        } else if (token && !currentUser) {
          // Si nous avons un token mais pas d'utilisateur, essayons de récupérer l'utilisateur
          console.log('Token found but no user, trying to fetch user profile');
          try {
            const profile = await authService.getProfile();
            const userData = profile.data || profile;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('User profile retrieved successfully:', userData);
          } catch (err) {
            console.log('Error fetching user profile:', err);
            // Si nous ne pouvons pas récupérer l'utilisateur mais avons un token, gardons le token
            // L'utilisateur pourra peut-être récupérer sa session plus tard
            if (err.response && err.response.status === 401) {
              // Seulement pour les erreurs 401, on nettoie le token
              localStorage.removeItem('token');
            }
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
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!token && !!user;
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