import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faSpinner, faExclamationTriangle, faEye, faCalendarAlt, faMoneyBillWave, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './UserOrdersPage.css';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Définir le titre de la page
    document.title = 'Mes Commandes - KeepTex';

    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Charger les commandes de l'utilisateur
    fetchUserOrders();
  }, [isAuthenticated, navigate]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/commandes/user');
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      setError('Impossible de charger vos commandes. Veuillez réessayer plus tard.');
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Déterminer le statut de la commande
  const getOrderStatus = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', color: '#f59e0b' };
      case 'processing':
        return { label: 'En cours', color: '#3b82f6' };
      case 'completed':
        return { label: 'Terminée', color: '#10b981' };
      case 'cancelled':
        return { label: 'Annulée', color: '#ef4444' };
      default:
        return { label: 'En attente', color: '#f59e0b' };
    }
  };

  // Rendu du modal de détails de commande
  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    const status = getOrderStatus(selectedOrder.status);

    return (
      <div className="order-details-modal-overlay">
        <div className="order-details-modal">
          <div className="order-details-header">
            <h2>Détails de la commande #{selectedOrder.id}</h2>
            <button className="close-button" onClick={closeOrderDetails}>
              &times;
            </button>
          </div>
          
          <div className="order-details-content">
            <div className="order-status-badge" style={{ backgroundColor: status.color }}>
              {status.label}
            </div>
            
            <div className="order-info-section">
              <div className="order-info-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="order-info-icon" />
                <div>
                  <span className="info-label">Date de commande</span>
                  <span className="info-value">{formatDate(selectedOrder.createdAt)}</span>
                </div>
              </div>
              
              <div className="order-info-item">
                <FontAwesomeIcon icon={faMoneyBillWave} className="order-info-icon" />
                <div>
                  <span className="info-label">Montant total</span>
                  <span className="info-value">{selectedOrder.prixTotal} DT</span>
                </div>
              </div>
              
              <div className="order-info-item">
                <FontAwesomeIcon icon={faClipboardCheck} className="order-info-icon" />
                <div>
                  <span className="info-label">Type de commande</span>
                  <span className="info-value">{selectedOrder.type}</span>
                </div>
              </div>
            </div>
            
            <div className="order-details-section">
              <h3>Détails du produit</h3>
              <div className="product-details">
                {selectedOrder.logo && (
                  <div className="logo-preview">
                    <img src={`${process.env.REACT_APP_API_URL}/uploads/${selectedOrder.logo}`} alt="Logo" />
                  </div>
                )}
                
                <div className="product-info">
                  <p><strong>Quantité totale:</strong> {selectedOrder.quantiteTotal} pièces</p>
                  
                  {selectedOrder.CommandeTailles && selectedOrder.CommandeTailles.length > 0 && (
                    <div className="sizes-breakdown">
                      <p><strong>Répartition des tailles:</strong></p>
                      <ul>
                        {selectedOrder.CommandeTailles.map((item) => (
                          <li key={item.id}>{item.taille}: {item.quantite} pièces</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {selectedOrder.notes && (
              <div className="order-notes">
                <h3>Notes</h3>
                <p>{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Rendu principal
  return (
    <div className="user-orders-page">
      <div className="page-header">
        <h1>
          <FontAwesomeIcon icon={faShoppingBag} className="header-icon" />
          Mes Commandes
        </h1>
      </div>

      <div className="orders-container">
        {loading ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <p>Chargement de vos commandes...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <FontAwesomeIcon icon={faShoppingBag} className="empty-icon" />
            <h2>Vous n'avez pas encore de commandes</h2>
            <p>Découvrez nos services et passez votre première commande dès maintenant!</p>
            <button className="primary-button" onClick={() => navigate('/services')}>
              Découvrir nos services
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const status = getOrderStatus(order.status);
              
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <h3>Commande #{order.id}</h3>
                    <div className="order-status" style={{ backgroundColor: status.color }}>
                      {status.label}
                    </div>
                  </div>
                  
                  <div className="order-body">
                    <div className="order-info">
                      <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                      <p><strong>Type:</strong> {order.type}</p>
                      <p><strong>Quantité:</strong> {order.quantiteTotal} pièces</p>
                      <p><strong>Montant:</strong> {order.prixTotal} DT</p>
                    </div>
                    
                    <button 
                      className="view-details-button"
                      onClick={() => handleViewOrderDetails(order)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                      Voir les détails
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {renderOrderDetailsModal()}
    </div>
  );
};

export default UserOrdersPage;