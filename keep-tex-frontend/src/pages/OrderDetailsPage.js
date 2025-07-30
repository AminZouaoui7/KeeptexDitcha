import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faSpinner, faExclamationTriangle, faArrowLeft, faCalendarAlt, faMoneyBillWave, faClipboardCheck, faCheckCircle, faPencilAlt, faRuler, faCut, faTshirt, faPaintBrush, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services';
import './OrderDetailsPage.css';

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Définir le titre de la page
    document.title = 'Détails de la Commande - KeepTex';

    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Fonction pour charger les détails de la commande
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des détails de la commande:', error);
        setError('Impossible de charger les détails de la commande. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    // Charger les détails de la commande
    fetchOrderDetails();
  }, [id, isAuthenticated, navigate]);

  // Utiliser les fonctions du service pour le formatage et les statuts
  // Correction de l'avertissement concernant l'attribut alt redondant
  const formatDate = orderService.formatDate;
  const getOrderStatus = orderService.getOrderStatus;
  const calculateProgress = orderService.calculateProgress;
  const calculateEstimation = orderService.calculateEstimation;

  // Rendu du graphe d'étapes
  const renderProgressGraph = (etat, type) => {
    // Ajouter des logs pour déboguer
    console.log('État de la commande:', etat);
    console.log('Type de commande:', type);
    
    // Définir les étapes en fonction du type de commande
    let etapes = [];
    
    if (type === 'pieces-coupees') {
      console.log('Affichage des étapes pour Pièces Coupées');
      // Pour les commandes de type "Pièces Coupées", les 3 premières étapes sont déjà complétées
      etapes = [
        { id: 'conception', label: 'Conception', icon: faPencilAlt, completed: true },
        { id: 'patronnage', label: 'Patronnage', icon: faRuler, completed: true },
        { id: 'coupe', label: 'Coupe Tissu', icon: faCut, completed: true },
        { id: 'confection', label: 'Confection', icon: faTshirt },
        { id: 'finition', label: 'Finition', icon: faPaintBrush },
        { id: 'controle', label: 'Contrôle Qualité', icon: faSearch }
      ];
    } else {
      console.log('Affichage des étapes pour De A à Z ou par défaut');
      // Pour les commandes de type "De A à Z" ou par défaut
      etapes = [
        { id: 'conception', label: 'Conception', icon: faPencilAlt },
        { id: 'patronnage', label: 'Patronnage', icon: faRuler },
        { id: 'coupe', label: 'Coupe Tissu', icon: faCut },
        { id: 'confection', label: 'Confection', icon: faTshirt },
        { id: 'finition', label: 'Finition', icon: faPaintBrush },
        { id: 'controle', label: 'Contrôle Qualité', icon: faSearch }
      ];
    }
    
    // Mise à jour des étapes en fonction du statut de la commande
    if (etat) {
      console.log('Mise à jour des étapes en fonction du statut:', etat);
      switch (etat) {
        case 'en_attente':
          // Aucune étape n'est complétée pour De A à Z
          // Pour Pièces Coupées, les 3 premières étapes restent complétées
          break;
        case 'en_production':
          // Pour De A à Z, les étapes de conception et patronnage sont complétées
          if (type !== 'pieces-coupees') {
            etapes[0].completed = true;
            etapes[1].completed = true;
          } else {
            // Pour Pièces Coupées, on ajoute l'étape de confection
            etapes[3].completed = true;
          }
          break;
        case 'terminee':
          // Toutes les étapes sont complétées
          etapes.forEach(etape => etape.completed = true);
          break;
        default:
          // Déterminer l'index de l'étape actuelle
          const etatsOrdre = ['en attente', 'conception', 'patronnage', 'coupe', 'confection', 'finition', 'controle', 'termine'];
          const currentIndex = etatsOrdre.indexOf(etat);
          console.log('Index de l\'étape actuelle:', currentIndex);
          
          // Marquer les étapes comme complétées en fonction de l'état actuel
          etapes = etapes.map(step => {
            const stepIndex = etatsOrdre.indexOf(step.id);
            const isCompleted = step.completed || (stepIndex <= currentIndex && stepIndex > 0);
            console.log(`Étape ${step.label}: index=${stepIndex}, complétée=${isCompleted}`);
            return {
              ...step,
              completed: isCompleted
            };
          });
          break;
      }
    }
    
    return (
      <div className="progress-graph">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${calculateProgress(etat)}%` }}
          ></div>
        </div>
        
        <div className="progress-steps">
          {etapes.map((step) => (
            <div 
              key={step.id} 
              className={`progress-step ${step.completed ? 'completed' : ''}`}
            >
              <div className="step-icon">
                <FontAwesomeIcon icon={step.icon} />
                {step.completed && (
                  <span className="check-icon">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </span>
                )}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Rendu principal
  return (
    <div className="order-details-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/orders')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Retour aux commandes
        </button>
        <h1>
          <FontAwesomeIcon icon={faShoppingBag} className="header-icon" />
          Détails de la Commande
        </h1>
      </div>

      <div className="order-details-container">
        {loading ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <p>Chargement des détails de la commande...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            <p>{error}</p>
          </div>
        ) : order ? (
          <div className="order-details-content">
            <div className="order-header-section">
              <h2>Commande #{order.id}</h2>
              <div 
                className="order-status" 
                style={{ backgroundColor: getOrderStatus(order.etat).color }}
              >
                {getOrderStatus(order.etat).label}
              </div>
            </div>
            
            <div className="order-progress-section">
              <h3>Statut de la commande</h3>
              <div className="order-type-badge">
                {order.type === 'pieces-coupees' ? 'Pièces Coupées' : 'De A à Z'}
              </div>
              <div className="order-progress-container">
                {renderProgressGraph(order.etat, order.type)}
              </div>
              
              <div className="order-estimation">
                <p>
                  <strong>Estimation de livraison:</strong> 
                  {calculateEstimation(order.etat) === 0 
                    ? ' Votre commande est terminée!' 
                    : ` Environ ${calculateEstimation(order.etat)} jour${calculateEstimation(order.etat) > 1 ? 's' : ''} restant${calculateEstimation(order.etat) > 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>
            
            <div className="order-info-section">
              <div className="order-info-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="order-info-icon" />
                <div>
                  <span className="info-label">Date de commande</span>
                  <span className="info-value">{formatDate(order.createdAt)}</span>
                </div>
              </div>
              
              <div className="order-info-item">
                <FontAwesomeIcon icon={faMoneyBillWave} className="order-info-icon" />
                <div>
                  <span className="info-label">Montant total</span>
                  <span className="info-value">{order.prix_total} DT</span>
                </div>
              </div>
              
              <div className="order-info-item">
                <FontAwesomeIcon icon={faClipboardCheck} className="order-info-icon" />
                <div>
                  <span className="info-label">Type de commande</span>
                  <span className="info-value">{order.type}</span>
                </div>
              </div>
            </div>
            
            <div className="order-details-section">
              <h3>Détails du produit</h3>
              <div className="product-details">
                {order.logo && (
                  <div className="logo-preview">
                    <img src={`${process.env.REACT_APP_API_URL}/uploads/${order.logo}`} alt="" />
                  </div>
                )}
                
                <div className="product-info">
                  <p><strong>Quantité totale:</strong> {order.quantite_totale} pièces</p>
                  {order.type_modele && <p><strong>Modèle:</strong> {order.type_modele}</p>}
                  {order.type_tissue && <p><strong>Tissu:</strong> {order.type_tissue}</p>}
                  {order.couleur && <p><strong>Couleur:</strong> {order.couleur}</p>}
                  
                  {order.tailles && order.tailles.length > 0 && (
                    <div className="sizes-breakdown">
                      <p><strong>Répartition des tailles:</strong></p>
                      <ul>
                        {order.tailles.map((item) => (
                          <li key={item.id}>{item.taille}: {item.quantite} pièces</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {order.description && (
              <div className="order-notes">
                <h3>Notes</h3>
                <p>{order.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="error-container">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            <p>Commande introuvable.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;