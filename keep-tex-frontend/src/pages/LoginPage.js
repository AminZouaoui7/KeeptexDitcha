import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormInput, Button, Alert } from '../components/common';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');
    
    try {
      await login(formData);
      setSuccessMessage('Connexion réussie! Vous allez être redirigé...');
      // Rediriger après un court délai pour que l'utilisateur puisse voir le message de succès
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setApiError(error.response?.data?.error || 'Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Connexion</h1>
        
        {apiError && <Alert type="error" message={apiError} />}
        {successMessage && <Alert type="success" message={successMessage} autoClose={true} autoCloseTime={1500} />}
        
        <form onSubmit={handleSubmit} className="login-form">
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Entrez votre email"
            error={errors.email}
            required
          />
          
          <FormInput
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Entrez votre mot de passe"
            error={errors.password}
            required
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>
        
        <div className="login-footer">
          <p>Vous n'avez pas de compte ? <Link to="/register">Inscrivez-vous</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;