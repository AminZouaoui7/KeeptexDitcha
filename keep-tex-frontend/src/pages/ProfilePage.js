import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faSpinner, faCheck, faTimes, faShield } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { userService } from '../services';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    emailConfirmationCode: ''
  });
  const [emailChanged, setEmailChanged] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Définir le titre de la page
    document.title = 'Mon Profil - KeepTex';

    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Charger les données de l'utilisateur
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
      setLoading(false);
    } else {
      fetchUserProfile();
    }
  }, [isAuthenticated, navigate, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      const userData = response.data.data;
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setError('Impossible de charger votre profil. Veuillez réessayer plus tard.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Si l'email est modifié, activer le bouton de confirmation
    if (name === 'email' && value !== user?.email) {
      setEmailChanged(true);
      setConfirmationSent(false);
    } else if (name === 'email' && value === user?.email) {
      setEmailChanged(false);
      setConfirmationSent(false);
    }
  };

  // Nouveau champ pour le code de confirmation d'email
  const handleEmailCodeChange = (e) => {
    setFormData({
      ...formData,
      emailConfirmationCode: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Fonction pour demander un code de confirmation d'email
  const requestEmailConfirmation = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      setLoading(true);
      // Utiliser le service userService pour demander un code de confirmation
      await userService.requestEmailConfirmation(formData.email);
      setSuccess('Un code de confirmation a été envoyé à votre adresse email.');
      setConfirmationSent(true);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la demande de confirmation d\'email:', error);
      setError(error.response?.data?.error || 'Une erreur est survenue lors de l\'envoi du code de confirmation.');
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Vérifier si l'email a été modifié et si un code de confirmation est requis
    if (emailChanged && !formData.emailConfirmationCode && !confirmationSent) {
      setError('Veuillez demander un code de confirmation pour votre nouvelle adresse email.');
      return;
    }
    
    try {
      setLoading(true);
      // Envoyer uniquement les champs nécessaires
      const payload = {
        name: formData.name,
        email: formData.email
      };
      if (formData.emailConfirmationCode) {
        payload.emailConfirmationCode = formData.emailConfirmationCode;
      }
      await userService.updateProfile(payload);
      setSuccess('Votre profil a été mis à jour avec succès.');
      setLoading(false);
      setEmailChanged(false);
      setConfirmationSent(false);
      
      // Mettre à jour les informations utilisateur dans le localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        const updatedUser = { ...currentUser, ...payload };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      // Réinitialiser le code de confirmation
      setFormData(prev => ({ ...prev, emailConfirmationCode: '' }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError(error.response?.data?.error || 'Une erreur est survenue lors de la mise à jour de votre profil.');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Vérifier que les mots de passe correspondent
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    
    try {
      setLoading(true);
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setSuccess('Votre mot de passe a été mis à jour avec succès.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      setError(error.response?.data?.error || 'Une erreur est survenue lors de la mise à jour de votre mot de passe.');
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <p>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Mon Profil</h1>
          <div className="profile-avatar">
            {formData.name ? formData.name.charAt(0).toUpperCase() : <FontAwesomeIcon icon={faUser} />}
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FontAwesomeIcon icon={faUser} className="tab-icon" />
            Informations personnelles
          </button>
          <button 
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <FontAwesomeIcon icon={faShield} className="tab-icon" />
            Sécurité
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <FontAwesomeIcon icon={faTimes} className="alert-icon" />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <FontAwesomeIcon icon={faCheck} className="alert-icon" />
            {success}
          </div>
        )}

        <div className="profile-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                  Adresse e-mail
                </label>
                <div className="email-confirmation-container">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {emailChanged && !confirmationSent && (
                    <button 
                      type="button" 
                      className="confirm-email-button"
                      onClick={requestEmailConfirmation}
                      disabled={loading}
                    >
                      Confirmer
                    </button>
                  )}
                </div>
                {emailChanged && (
                  <div className="email-confirmation-message">
                    {confirmationSent ? 
                      "Un code a été envoyé à votre adresse email." : 
                      "Vous devez confirmer votre nouvelle adresse email."}
                  </div>
                )}
              </div>
              
              {(emailChanged || confirmationSent) && (
                <div className="form-group">
                  <label htmlFor="emailConfirmationCode">
                    <FontAwesomeIcon icon={faCheck} className="input-icon" />
                    Code de confirmation
                  </label>
                  <input
                    type="text"
                    id="emailConfirmationCode"
                    name="emailConfirmationCode"
                    value={formData.emailConfirmationCode}
                    onChange={handleEmailCodeChange}
                    placeholder="Entrez le code reçu par email"
                    required={emailChanged}
                  />
                </div>
              )}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Mise à jour...
                  </>
                ) : (
                  'Mettre à jour le profil'
                )}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPassword">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Mise à jour...
                  </>
                ) : (
                  'Mettre à jour le mot de passe'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;