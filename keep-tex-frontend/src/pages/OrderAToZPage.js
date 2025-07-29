import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShirt, 
  faPalette, 
  faFileUpload, 
  faMoneyBill, 
  faArrowRight, 
  faInfoCircle,
  faCheck
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
import './OrderAToZPage.css';

const OrderAToZPage = () => {
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    modelType: '',
    modelColor: '#1e3a8a', // Couleur par défaut (bleu foncé)
    fabricType: '',
    logo: null,
    logoPreview: null,
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
  // const location = useLocation(); // Sera utilisé dans une future implémentation

  // Options pour les types de modèles
  const modelTypes = [
    { id: 't-shirt', name: 'T-Shirt' },
    { id: 'polo', name: 'Polo' },
    { id: 'chemise', name: 'Chemise' },
    { id: 'veste', name: 'Veste' },
    { id: 'pantalon', name: 'Pantalon' }
  ];

  // Options pour les types de tissus
  const fabricTypes = [
    { id: 'coton', name: 'Coton' },
    { id: 'polyester', name: 'Polyester' },
    { id: 'coton-polyester', name: 'Coton-Polyester' },
    { id: 'lin', name: 'Lin' },
    { id: 'jean', name: 'Jean' },
    { id: 'autre', name: 'Autre' }
  ];

  // Prix unitaire fixe (8.5 dinars tunisiens)
  const UNIT_PRICE = 8.5;
  // Quantité minimale requise
  const MIN_QUANTITY = 500;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = 'Commande De A à Z - KeepTex';
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      setAlert({
        show: true,
        type: 'warning',
        message: 'Vous devez être connecté pour passer une commande. Redirection vers la page de connexion...'
      });
      
      // Rediriger vers la page de connexion après 3 secondes
      const timer = setTimeout(() => {
        navigate('/login', { state: { from: '/order-a-to-z' } });
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

  // Gérer le téléchargement du logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier (uniquement les images)
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          logo: 'Format de fichier non supporté. Utilisez JPG, PNG, GIF ou SVG.'
        });
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          logo: 'Le fichier est trop volumineux. Taille maximale: 5MB.'
        });
        return;
      }

      // Créer une URL pour la prévisualisation
      const previewURL = URL.createObjectURL(file);

      setFormData({
        ...formData,
        logo: file,
        logoPreview: previewURL
      });

      // Effacer l'erreur pour le logo s'il y en a une
      if (errors.logo) {
        setErrors({
          ...errors,
          logo: ''
        });
      }
    }
  };

  // Supprimer le logo
  const handleRemoveLogo = () => {
    if (formData.logoPreview) {
      URL.revokeObjectURL(formData.logoPreview);
    }

    setFormData({
      ...formData,
      logo: null,
      logoPreview: null
    });
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};

    // Validation selon l'étape actuelle
    if (step === 1) {
      if (!formData.modelType) {
        newErrors.modelType = 'Veuillez sélectionner un type de modèle';
      }
      // La couleur a toujours une valeur par défaut, pas besoin de validation
    } else if (step === 2) {
      if (!formData.fabricType) {
        newErrors.fabricType = 'Veuillez sélectionner un type de tissu';
      }
    } else if (step === 3) {
      // Le logo est optionnel, pas de validation nécessaire
    } else if (step === 4) {
      if (totalQuantity < MIN_QUANTITY) {
        newErrors.quantities = `La quantité totale doit être d'au moins ${MIN_QUANTITY} pièces`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Passer à l'étape suivante
  const handleNextStep = () => {
    if (validateForm()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  // Revenir à l'étape précédente
  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Afficher le récapitulatif de la commande
  const handleShowSummary = () => {
    if (validateForm()) {
      setOrderSummaryVisible(true);
    }
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
        
        // Créer un objet FormData pour l'envoi du fichier logo
        const formDataToSend = new FormData();
        formDataToSend.append('type', 'a-a-z');
        formDataToSend.append('type_modele', formData.modelType);
        formDataToSend.append('type_tissue', formData.fabricType);
        formDataToSend.append('couleur', formData.modelColor);
        formDataToSend.append('quantite_totale', totalQuantity);
        formDataToSend.append('prix_total', totalPrice);
        formDataToSend.append('acompte_requis', depositAmount);
        formDataToSend.append('tailles', JSON.stringify(tailles));
        formDataToSend.append('notes', formData.notes || '');
        
        if (formData.logo) {
          formDataToSend.append('logo', formData.logo);
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
        setLoading(false);
        setAlert({
          show: true,
          type: 'error',
          message: error.message || 'Une erreur est survenue lors de l\'envoi de la commande'
        });
      }
    }
  };

  // Rendu de l'étape 1: Choix du modèle et de la couleur
  const renderStep1 = () => (
    <div className="order-step">
      <h2 className="step-title">
        <FontAwesomeIcon icon={faShirt} className="step-icon" />
        Étape 1: Choix du Modèle
      </h2>
      
      <div className="form-section">
        <h3 className="section-subtitle">Type de Modèle</h3>
        <div className="model-type-grid">
          {modelTypes.map(model => (
            <div 
              key={model.id}
              className={`model-type-card ${formData.modelType === model.id ? 'selected' : ''}`}
              onClick={() => handleChange({ target: { name: 'modelType', value: model.id } })}
            >
              <div className="model-type-content">
                <FontAwesomeIcon icon={faShirt} className="model-icon" />
                <span className="model-name">{model.name}</span>
              </div>
              {formData.modelType === model.id && (
                <div className="selected-indicator">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              )}
            </div>
          ))}
        </div>
        {errors.modelType && <div className="error-message">{errors.modelType}</div>}
      </div>
      
      <div className="form-section">
        <h3 className="section-subtitle">Couleur du Modèle</h3>
        <div className="color-picker-container">
          <input 
            type="color" 
            name="modelColor" 
            value={formData.modelColor} 
            onChange={handleChange} 
            className="color-picker"
          />
          <div className="color-preview" style={{ backgroundColor: formData.modelColor }}></div>
          <span className="color-value">{formData.modelColor}</span>
        </div>
      </div>
      
      <div className="step-actions">
        <Button 
          variant="primary" 
          onClick={handleNextStep}
          className="next-button"
        >
          Continuer <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>
    </div>
  );

  // Rendu de l'étape 2: Sélection du type de tissu
  const renderStep2 = () => (
    <div className="order-step">
      <h2 className="step-title">
        <FontAwesomeIcon icon={faPalette} className="step-icon" />
        Étape 2: Sélection du Tissu
      </h2>
      
      <div className="form-section">
        <h3 className="section-subtitle">Type de Tissu</h3>
        <div className="fabric-type-grid">
          {fabricTypes.map(fabric => (
            <div 
              key={fabric.id}
              className={`fabric-type-card ${formData.fabricType === fabric.id ? 'selected' : ''}`}
              onClick={() => handleChange({ target: { name: 'fabricType', value: fabric.id } })}
            >
              <div className="fabric-type-content">
                <span className="fabric-name">{fabric.name}</span>
              </div>
              {formData.fabricType === fabric.id && (
                <div className="selected-indicator">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              )}
            </div>
          ))}
        </div>
        {errors.fabricType && <div className="error-message">{errors.fabricType}</div>}
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
          onClick={handleNextStep}
          className="next-button"
        >
          Continuer <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>
    </div>
  );

  // Rendu de l'étape 3: Téléchargement du logo (optionnel)
  const renderStep3 = () => (
    <div className="order-step">
      <h2 className="step-title">
        <FontAwesomeIcon icon={faFileUpload} className="step-icon" />
        Étape 3: Logo (Optionnel)
      </h2>
      
      <div className="form-section">
        <h3 className="section-subtitle">Télécharger votre Logo</h3>
        <p className="section-description">
          Cette étape est optionnelle. Si vous souhaitez ajouter un logo à votre commande, veuillez télécharger un fichier image.
        </p>
        
        <div className="logo-upload-container">
          {!formData.logoPreview ? (
            <div className="logo-upload-area">
              <input 
                type="file" 
                id="logo" 
                name="logo" 
                onChange={handleLogoUpload} 
                accept="image/*" 
                className="logo-input"
              />
              <label htmlFor="logo" className="logo-label">
                <FontAwesomeIcon icon={faFileUpload} className="upload-icon" />
                <span>Cliquez pour télécharger</span>
                <span className="upload-hint">JPG, PNG, GIF ou SVG (max 5MB)</span>
              </label>
            </div>
          ) : (
            <div className="logo-preview-container">
              <img src={formData.logoPreview} alt="Logo preview" className="logo-preview" />
              <Button 
                variant="outline" 
                onClick={handleRemoveLogo}
                className="remove-logo-button"
              >
                Supprimer
              </Button>
            </div>
          )}
        </div>
        {errors.logo && <div className="error-message">{errors.logo}</div>}
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
          onClick={handleNextStep}
          className="next-button"
        >
          Continuer <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>
    </div>
  );

  // Rendu de l'étape 4: Quantités et prix
  const renderStep4 = () => (
    <div className="order-step">
      <h2 className="step-title">
        <FontAwesomeIcon icon={faMoneyBill} className="step-icon" />
        Étape 4: Quantités et Prix
      </h2>
      
      <div className="form-section">
        <h3 className="section-subtitle">Quantités par Taille</h3>
        <p className="section-description">
          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
          Minimum de commande: {MIN_QUANTITY} pièces au total. Prix unitaire: {UNIT_PRICE} DT
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
            <span className="detail-label">Type:</span>
            <span className="detail-value">
              {modelTypes.find(m => m.id === formData.modelType)?.name || formData.modelType}
            </span>
          </div>
          <div className="summary-detail">
            <span className="detail-label">Couleur:</span>
            <div className="color-preview-small" style={{ backgroundColor: formData.modelColor }}></div>
            <span className="detail-value">{formData.modelColor}</span>
          </div>
        </div>
        
        <div className="summary-section">
          <h3 className="summary-section-title">Tissu</h3>
          <div className="summary-detail">
            <span className="detail-label">Type:</span>
            <span className="detail-value">
              {fabricTypes.find(f => f.id === formData.fabricType)?.name || formData.fabricType}
            </span>
          </div>
        </div>
        
        <div className="summary-section">
          <h3 className="summary-section-title">Logo</h3>
          {formData.logoPreview ? (
            <div className="summary-logo">
              <img src={formData.logoPreview} alt="Logo" className="summary-logo-image" />
            </div>
          ) : (
            <div className="summary-detail">
              <span className="detail-value">Aucun logo fourni</span>
            </div>
          )}
        </div>
        
        <div className="summary-section">
          <h3 className="summary-section-title">Quantités et Prix</h3>
          <div className="summary-quantities">
            {Object.entries(formData.quantities)
              .filter(([_, qty]) => qty > 0)
              .map(([size, qty]) => (
                <div key={size} className="summary-detail">
                  <span className="detail-label">Taille {size}:</span>
                  <span className="detail-value">{qty} pièces</span>
                </div>
              ))}
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
          onClick={() => setOrderSummaryVisible(false)}
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
          {loading ? <Spinner size="small" color="white" text="" /> : 'Confirmer la commande'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="order-a-to-z-page">
      <div className="container">
        <AdvancedAnimatedSection
          animationType="slideFromTop"
          duration={1.0}
          delay={0}
        >
          <h1 className="page-title">Commande De A à Z</h1>
          <p className="page-subtitle">
            Nous prenons en charge toutes les étapes du processus, de la conception jusqu'à la livraison du produit fini.
          </p>
        </AdvancedAnimatedSection>
        
        <SectionDivider variant="wave" delay={0.1} />
        
        {alert.show && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert({ show: false, type: '', message: '' })} 
          />
        )}
        
        <div className="order-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Modèle</div>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Tissu</div>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Logo</div>
          </div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Quantités</div>
          </div>
        </div>
        
        <div className="order-form-container">
          {orderSummaryVisible ? (
            renderOrderSummary()
          ) : (
            <>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderAToZPage;