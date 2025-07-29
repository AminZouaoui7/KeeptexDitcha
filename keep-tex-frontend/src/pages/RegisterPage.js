import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormInput, Button, Alert } from '../components/common';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    role: 'client' // Par défaut, on inscrit un client
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);

  const { register, verifyEmail } = useAuth();
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

  const validateEmailForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (verificationStep && !formData.verificationCode) {
      newErrors.verificationCode = 'Le code de vérification est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    
    if (!validateEmailForm()) return;
    
    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');
    
    try {
      await verifyEmail(formData.email);
      setVerificationStep(true);
      setSuccessMessage('Un code de vérification a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et entrer le code pour continuer.');
    } catch (error) {
      setApiError(error.response?.data?.error || 'Erreur lors de la vérification de l\'email. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');
    
    // Préparer les données pour l'API (sans confirmPassword)
    const { confirmPassword, ...userData } = formData;
    
    try {
      await register(userData);
      setSuccessMessage('Inscription réussie! Vous allez être redirigé...');
      // Rediriger après un court délai pour que l'utilisateur puisse voir le message de succès
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setApiError(error.response?.data?.error || 'Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Créer un compte</h1>
        
        {apiError && <Alert type="error" message={apiError} />}
        {successMessage && <Alert type="success" message={successMessage} autoClose={!verificationStep} autoCloseTime={1500} />}
        
        {!verificationStep ? (
          <form onSubmit={handleEmailVerification} className="register-form">
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
            
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={isLoading}
            >
              {isLoading ? 'Envoi en cours...' : 'Vérifier mon email'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="register-form">
            <FormInput
              label="Nom complet"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Entrez votre nom complet"
              error={errors.name}
              required
            />
            
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrez votre email"
              error={errors.email}
              disabled={true}
              required
            />

            <FormInput
              label="Code de vérification"
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              placeholder="Entrez le code reçu par email"
              error={errors.verificationCode}
              required
            />
            
            <FormInput
              label="Mot de passe"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Créez un mot de passe"
              error={errors.password}
              required
            />
            
            <FormInput
              label="Confirmer le mot de passe"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
              error={errors.confirmPassword}
              required
            />
            
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={isLoading}
            >
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
          </form>
        )}
        
        <div className="register-footer">
          <p>Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;