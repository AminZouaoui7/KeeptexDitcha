import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileUpload, 
  faMoneyBill, 
  faArrowRight, 
  faInfoCircle,
  faCut
} from '@fortawesome/free-solid-svg-icons';
import { 
  Button, 
  FormInput, 
  Alert, 
  AdvancedAnimatedSection, 
  SectionDivider, 
  Spinner 
} from '../components/common';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './OrderPiecesCoupeesPage.css'; // Styles spécifiques pour la page Pièces Coupées

const OrderPiecesCoupeesPage = () => {
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    model: null,
    modelPreview: null,
    modelName: '',
    quantities: {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0
    },
    notes: ''
  });

  // États pour la validation et les messages
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [step, setStep] = useState(1); // Pour la navigation entre les étapes
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth(); // Utiliser le contexte d'authentification

  // Prix unitaire fixe (6 dinars tunisiens)
  const UNIT_PRICE = 6;
  // Quantité minimale requise
  const MIN_QUANTITY = 150;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = 'Commande Pièces Coupées - KeepTex';
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      setAlert({
        show: true,
        type: 'warning',
        message: 'Vous devez être connecté pour passer une commande. Redirection vers la page de connexion...'
      });
      
      // Rediriger vers la page de connexion après 3 secondes
      const timer = setTimeout(() => {
        navigate('/login', { state: { from: '/order/pieces-coupees' } });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  // Calculer la quantité totale et le prix total lorsque les quantités changent
  useEffect(() => {
    const total = Object.values(formData.quantities).reduce((sum, qty) => sum + Number(qty), 0);
    setTotalQuantity(total);
    
    const price = total * UNIT_PRICE;
    setTotalPrice(price);
    
    // 50% du montant total pour l'acompte
    setDepositAmount(price * 0.5);
  }, [formData.quantities]);

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('quantity-')) {
      const size = name.split('-')[1];
      setFormData({
        ...formData,
        quantities: {
          ...formData.quantities,
          [size]: parseInt(value) || 0
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Effacer l'erreur pour ce champ s'il y en a une
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Gérer le téléchargement du modèle
  const handleModelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier (accepter divers formats de fichiers pour les modèles)
      const validTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml',
        'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip', 'application/x-zip-compressed'
      ];
      
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          model: 'Format de fichier non supporté. Utilisez JPG, PNG, PDF, DOC, XLS, ZIP.'
        });
        return;
      }

      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({
          ...errors,
          model: 'Le fichier est trop volumineux. Taille maximale: 10MB.'
        });
        return;
      }

      // Créer une URL pour la prévisualisation si c'est une image
      let previewURL = null;
      if (file.type.startsWith('image/')) {
        previewURL = URL.createObjectURL(file);
      }

      setFormData({
        ...formData,
        model: file,
        modelPreview: previewURL,
        modelName: file.name
      });

      // Effacer l'erreur pour le modèle s'il y en a une
      if (errors.model) {
        setErrors({
          ...errors,
          model: ''
        });
      }
    }
  };

  // Supprimer le modèle
  const handleRemoveModel = () => {
    if (formData.modelPreview) {
      URL.revokeObjectURL(formData.modelPreview);
    }

    setFormData({
      ...formData,
      model: null,
      modelPreview: null,
      modelName: ''
    });
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Étape 1: Validation du modèle
    if (step === 1) {
      if (!formData.model) {
        newErrors.model = 'Veuillez télécharger votre modèle.';
      }
    }
    
    // Étape 2: Validation des quantités
    if (step === 2) {
      if (totalQuantity < MIN_QUANTITY) {
        newErrors.quantities = `La quantité minimale requise est de ${MIN_QUANTITY} pièces.`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation entre les étapes
  const handleNextStep = () => {
    if (validateForm()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleShowSummary = () => {
    if (validateForm()) {
      setOrderSummaryVisible(true);
      window.scrollTo(0, 0);
    }
  };

  const handleHideSummary = () => {
    setOrderSummaryVisible(false);
  };

  // Soumettre la commande
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        // Préparer les données de tailles pour le backend
        const tailles = [];
        for (const [taille, quantite] of Object.entries(formData.quantities)) {
          if (quantite > 0) {
            tailles.push({ taille, quantite });
          }
        }
        
        // Créer un objet FormData pour l'envoi du fichier modèle
        const formDataToSend = new FormData();
        formDataToSend.append('type', 'pieces-coupees');
        formDataToSend.append('quantite_totale', totalQuantity);
        formDataToSend.append('prix_total', totalPrice);
        formDataToSend.append('acompte_requis', depositAmount);
        formDataToSend.append('tailles', JSON.stringify(tailles));
        formDataToSend.append('notes', formData.notes || '');
        
        if (formData.model) {
          formDataToSend.append('logo', formData.model);
        }
        
        // Envoyer la commande au backend en utilisant axios
        const response = await api.post('/commandes', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data', // Important pour FormData
          },
        });
        
        if (!response.data) {
          throw new Error('Une erreur est survenue lors de l\'envoi de la commande');
        }
        
        setLoading(false);
        setAlert({
          show: true,
          type: 'success',
          message: 'Votre commande a été enregistrée avec succès! Un conseiller vous contactera prochainement.'
        });
        
        // Rediriger vers la page d'accueil après quelques secondes
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } catch (error) {
        console.error('Erreur lors de la soumission de la commande:', error);
        
        setLoading(false);
        setAlert({
          show: true,
          type: 'error',
          message: error.message || 'Une erreur est survenue lors de l\'envoi de la commande'
        });
      }
    }
  };

  // Rendu de l'étape 1: Téléchargement du modèle
  const renderStep1 = () => (
    <div className="order-step">
      <h2 className="step-title">
        <FontAwesomeIcon icon={faCut} className="step-icon" />
        Étape 1: Téléchargement de votre modèle
      </h2>
      
      <div className="form-section">
        <h3 className="section-subtitle">Votre modèle</h3>
        <p className="section-description">
          Veuillez télécharger votre modèle. Nous acceptons les formats JPG, PNG, PDF, DOC, XLS et ZIP.
        </p>
        
        <div className="model-upload-container">
          {!formData.model ? (
            <div className="model-upload-area">
              <input 
                type="file" 
                id="model-input" 
                className="model-input" 
                onChange={handleModelUpload}
                accept=".jpg,.jpeg,.png,.gif,.svg,.pdf,.doc,.docx,.xls,.xlsx,.zip"
              />
              <label htmlFor="model-input" className="model-label">
                <FontAwesomeIcon icon={faFileUpload} className="upload-icon" />
                <span>Cliquez pour télécharger votre modèle</span>
                <span className="upload-hint">JPG, PNG, PDF, DOC, XLS, ZIP (max 10MB)</span>
              </label>
            </div>
          ) : (
            <div className="model-preview-container">
              {formData.modelPreview ? (
                <img src={formData.modelPreview} alt="Model preview" className="model-preview" />
              ) : (
                <div className="file-preview">
                  <FontAwesomeIcon icon={faFileUpload} className="file-icon" />
                  <span className="file-name">{formData.modelName}</span>
                </div>
              )}
              <Button 
                variant="outline" 
                onClick={handleRemoveModel}
                className="remove-model-button"
              >
                Supprimer
              </Button>
            </div>
          )}
        </div>
        {errors.model && <div className="error-message">{errors.model}</div>}
      </div>
      
      <div className="step-actions">
        <Button 
          variant="primary" 
          onClick={handleNextStep}
          className="next-button"
          disabled={!formData.model}
        >
          Continuer vers les quantités <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>
    </div>
  );

  // Rendu de l'étape 2: Sélection des quantités
  const renderStep2 = () => (
    <div className="order-step">
      <h2 className="step-title">
        <FontAwesomeIcon icon={faMoneyBill} className="step-icon" />
        Étape 2: Quantités et Prix
      </h2>
      
      <div className="form-section">
        <h3 className="section-subtitle">Sélectionnez les quantités par taille</h3>
        <p className="section-description">
          Veuillez indiquer la quantité souhaitée pour chaque taille. La quantité minimale totale est de {MIN_QUANTITY} pièces.
        </p>
        
        <div className="quantities-grid">
          {Object.keys(formData.quantities).map(size => (
            <div key={size} className="quantity-item">
              <label htmlFor={`quantity-${size}`} className="quantity-label">{size}</label>
              <input 
                type="number" 
                id={`quantity-${size}`} 
                name={`quantity-${size}`} 
                value={formData.quantities[size]} 
                onChange={handleChange} 
                min="0" 
                className="quantity-input"
              />
            </div>
          ))}
        </div>
        {errors.quantities && <div className="error-message">{errors.quantities}</div>}
        
        <div className="quantity-summary">
          <div className="summary-item">
            <span className="summary-label">Quantité totale:</span>
            <span className="summary-value">{totalQuantity} pièces</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Prix unitaire:</span>
            <span className="summary-value">{UNIT_PRICE} DT</span>
          </div>
          <div className="summary-item total">
            <span className="summary-label">Prix total:</span>
            <span className="summary-value">{totalPrice.toFixed(2)} DT</span>
          </div>
          <div className="summary-item deposit">
            <span className="summary-label">Acompte requis (50%):</span>
            <span className="summary-value">{depositAmount.toFixed(2)} DT</span>
          </div>
        </div>
        
        <div className="form-notes">
          <FormInput
            label="Notes supplémentaires"
            type="textarea"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Informations supplémentaires pour votre commande..."
          />
        </div>
      </div>
      
      <div className="step-actions">
        <Button 
          variant="outline" 
          onClick={handlePrevStep}
          className="prev-button"
        >
          Retour
        </Button>
        <Button 
          variant="primary" 
          onClick={handleShowSummary}
          className="next-button"
          disabled={totalQuantity < MIN_QUANTITY}
        >
          Voir le récapitulatif <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>
    </div>
  );

  // Rendu du récapitulatif de la commande
  const renderOrderSummary = () => (
    <div className="order-summary">
      <h2 className="summary-title">Récapitulatif de votre commande</h2>
      
      <div className="summary-content">
        <div className="summary-section">
          <h3 className="summary-section-title">Modèle</h3>
          <div className="summary-detail">
            <span className="detail-label">Fichier:</span>
            <span className="detail-value">{formData.modelName}</span>
          </div>
        </div>
        
        <div className="summary-section">
          <h3 className="summary-section-title">Quantités et Prix</h3>
          <div className="summary-detail">
            <span className="detail-label">Tailles:</span>
            <div className="sizes-list">
              {Object.entries(formData.quantities)
                .filter(([_, qty]) => qty > 0)
                .map(([size, qty]) => (
                  <div key={size} className="size-item">
                    <span className="size-label">{size}:</span>
                    <span className="size-value">{qty} pièces</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="summary-detail total-quantity">
            <span className="detail-label">Quantité totale:</span>
            <span className="detail-value">{totalQuantity} pièces</span>
          </div>
          
          <div className="summary-detail">
            <span className="detail-label">Prix unitaire:</span>
            <span className="detail-value">{UNIT_PRICE} DT</span>
          </div>
          
          <div className="summary-detail total-price">
            <span className="detail-label">Prix total:</span>
            <span className="detail-value">{totalPrice.toFixed(2)} DT</span>
          </div>
          
          <div className="summary-detail deposit-amount">
            <span className="detail-label">Acompte requis (50%):</span>
            <span className="detail-value">{depositAmount.toFixed(2)} DT</span>
          </div>
        </div>
        
        {formData.notes && (
          <div className="summary-section">
            <h3 className="summary-section-title">Notes</h3>
            <div className="summary-detail notes">
              <p>{formData.notes}</p>
            </div>
          </div>
        )}
        
        <div className="summary-notice">
          <FontAwesomeIcon icon={faInfoCircle} className="notice-icon" />
          <p>
            Un acompte de 50% du montant total ({depositAmount.toFixed(2)} DT) est requis avant de débuter le travail. 
            Vous serez contacté par notre équipe pour finaliser votre commande et organiser le paiement.
          </p>
        </div>
      </div>
      
      <div className="summary-actions">
        <Button 
          variant="outline" 
          onClick={handleHideSummary}
          className="back-button"
        >
          Modifier la commande
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          className="submit-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              Traitement en cours...
            </>
          ) : (
            'Confirmer la commande'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="order-page">
      {alert.show && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}
      
      <div className="page-header">
        <h1>Commande Pièces Coupées</h1>
        <p className="page-description">
          Vous avez déjà préparé les étapes de conception, patronnage et coupe de tissu. 
          Nous commençons directement à l'étape de confection.
        </p>
      </div>
      
      <SectionDivider />
      
      <div className="order-container">
        <AdvancedAnimatedSection>
          {orderSummaryVisible ? (
            renderOrderSummary()
          ) : (
            <>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
            </>
          )}
        </AdvancedAnimatedSection>
      </div>
    </div>
  );
};

export default OrderPiecesCoupeesPage;