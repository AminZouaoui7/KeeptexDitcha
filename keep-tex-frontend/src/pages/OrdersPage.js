import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaSpinner, FaExclamationTriangle, FaCalendarAlt, FaMoneyBillWave, FaBoxOpen } from 'react-icons/fa';
import { orderService } from '../services';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // État pour le rafraîchissement manuel
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Définir le titre de la page
    document.title = 'Mes Commandes - KeepTex';

    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Charger les commandes de l'utilisateur
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async (isRefresh = false) => {
    try {
      // Si c'est un rafraîchissement manuel, on met à jour l'état de rafraîchissement
      // sinon on met à jour l'état de chargement initial
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null); // Réinitialiser l'erreur à chaque tentative
      const response = await orderService.getUserOrders();
      
      if (response && response.data) {
        setOrders(response.data);
      } else {
        // Si la réponse est vide ou mal formatée
        console.error('Réponse invalide reçue du serveur:', response);
        setError('Format de réponse invalide. Veuillez réessayer plus tard.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      if (error.response && error.response.status === 401) {
        // Erreur d'authentification - déjà gérée par l'intercepteur API
        setError('Session expirée. Veuillez vous reconnecter.');
      } else if (error.message === 'Utilisateur non connecté' || error.message === 'Données utilisateur manquantes' || error.message === 'Données utilisateur invalides') {
        // L'utilisateur n'est pas connecté ou les données sont corrompues
        setError('Veuillez vous connecter pour voir vos commandes.');
      } else {
        // Autres erreurs
        setError('Impossible de charger vos commandes. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Fonction pour gérer le rafraîchissement manuel
  const handleRefresh = () => {
    fetchOrders(true);
  };

  // Utiliser les fonctions du service pour le formatage et les statuts
  const formatDate = orderService.formatDate;
  const getOrderStatus = orderService.getOrderStatus;

  // Function to handle order click
  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="page-header">
          <h1><FaShoppingBag className="header-icon" /> Mes Commandes</h1>
        </div>
        <div className="loading-container">
          <FaSpinner className="loading-icon spin" />
          <p>Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="page-header">
          <h1><FaShoppingBag className="header-icon" /> Mes Commandes</h1>
        </div>
        <div className="error-container">
          <FaExclamationTriangle className="error-icon" />
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <FaSpinner className="spin" /> Chargement...
              </>
            ) : (
              'Réessayer'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1><FaShoppingBag className="header-icon" /> Mes Commandes</h1>
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          disabled={refreshing || loading}
          title="Rafraîchir la liste des commandes"
        >
          <FaSpinner className={`refresh-icon ${refreshing ? 'spin' : ''}`} /> 
          {refreshing ? 'Chargement...' : 'Rafraîchir'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <FaBoxOpen className="no-orders-icon" />
          <h2>Vous n'avez pas encore de commandes</h2>
          <p>Explorez notre catalogue et passez votre première commande dès maintenant !</p>
          <Link to="/products" className="browse-products-btn">Voir les produits</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="order-card" 
              onClick={() => handleOrderClick(order.id)}
            >
              <div className="order-header">
                <div className="order-id">
                  <span className="label">Commande #</span>
                  <span className="value">{order.id}</span>
                </div>
                <div 
                  className="order-status" 
                  style={{ backgroundColor: getOrderStatus(order.etat).color }}
                >
                  {getOrderStatus(order.etat).label}
                </div>
              </div>

              <div className="order-details">
                <div className="order-info">
                  <div className="info-item">
                    <FaCalendarAlt className="info-icon" />
                    <div>
                      <span className="info-label">Date de commande</span>
                      <span className="info-value">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaMoneyBillWave className="info-icon" />
                    <div>
                      <span className="info-label">Montant total</span>
                      <span className="info-value">{order.prix_total} DT</span>
                    </div>
                  </div>
                </div>

                <div className="order-products">
                  <span className="products-count">{order.quantite_totale} pièce(s)</span>
                  <div className="products-preview">
                    <div className="product-preview">
                      <span>Type:</span>
                      <span>{order.type}</span>
                    </div>
                    {order.type_modele && (
                      <div className="product-preview">
                        <span>Modèle:</span>
                        <span>{order.type_modele}</span>
                      </div>
                    )}
                    {order.type_tissue && (
                      <div className="product-preview">
                        <span>Tissu:</span>
                        <span>{order.type_tissue}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="view-details">
                <span>Voir les détails</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;