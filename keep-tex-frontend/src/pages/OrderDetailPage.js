import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner, FaExclamationTriangle, FaCalendarAlt, FaMoneyBillWave, FaBoxOpen, FaShippingFast, FaClipboardCheck } from 'react-icons/fa';
import { orderService } from '../services';
import { useAuth } from '../context/AuthContext';
import OrderProgressBar from '../components/OrderProgressBar';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Définir le titre de la page
    document.title = 'Détails de la Commande - KeepTex';

    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Charger les détails de la commande
    fetchOrderDetails();
  }, [orderId, isAuthenticated, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des détails de la commande:', error);
      setError('Impossible de charger les détails de la commande. Veuillez réessayer plus tard.');
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="order-detail-container loading">
        <div className="loading-spinner">
          <FaSpinner className="spinner" />
          <p>Chargement des détails de la commande...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-container error">
        <div className="error-message">
          <FaExclamationTriangle className="error-icon" />
          <p>{error}</p>
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container error">
        <div className="error-message">
          <FaExclamationTriangle className="error-icon" />
          <p>Commande introuvable.</p>
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  const status = orderService.getOrderStatus(order.etat);
  const progress = orderService.calculateProgress(order.etat);
  const estimatedDays = orderService.calculateEstimation(order.etat);

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <button className="back-button" onClick={handleGoBack}>
          <FaArrowLeft /> Retour aux commandes
        </button>
        <h1>Détails de la Commande #{order.id}</h1>
      </div>

      <div className="order-detail-card">
        <div className="order-status-section">
          <div className="status-header">
            <h2>Statut de la commande</h2>
            <div 
              className="status-badge" 
              style={{ backgroundColor: status.color }}
            >
              {status.label}
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-labels">
              <span>Commande reçue</span>
              <span>En production</span>
              <span>Terminée</span>
            </div>
          </div>

          {estimatedDays > 0 && (
            <div className="estimated-time">
              <FaShippingFast className="icon" />
              <span>Temps estimé restant: <strong>{estimatedDays} jour{estimatedDays > 1 ? 's' : ''}</strong></span>
            </div>
          )}
          
          {/* Barre de progression des étapes de production */}
          <OrderProgressBar etat={order.etat} type={order.type_modele || order.type} />
        </div>

        <div className="order-info-section">
          <div className="info-group">
            <h3><FaCalendarAlt className="icon" /> Informations de commande</h3>
            <div className="info-row">
              <div className="info-item">
                <span className="info-label">Date de commande</span>
                <span className="info-value">{orderService.formatDate(order.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Montant total</span>
                <span className="info-value">{order.prix_total} DT</span>
              </div>
            </div>
          </div>

          <div className="info-group">
            <h3><FaBoxOpen className="icon" /> Détails du produit</h3>
            <div className="product-details">
              <div className="product-info">
                <div className="info-item">
                  <span className="info-label">Type</span>
                  <span className="info-value">{order.type}</span>
                </div>
                {order.type_modele && (
                  <div className="info-item">
                    <span className="info-label">Modèle</span>
                    <span className="info-value">{order.type_modele}</span>
                  </div>
                )}
                {order.type_tissue && (
                  <div className="info-item">
                    <span className="info-label">Tissu</span>
                    <span className="info-value">{order.type_tissue}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Quantité</span>
                  <span className="info-value">{order.quantite_totale} pièce(s)</span>
                </div>
              </div>
              {order.image_url && (
                <div className="product-image">
                  <img src={order.image_url} alt="Image du produit" />
                </div>
              )}
            </div>
          </div>

          {order.commentaire && (
            <div className="info-group">
              <h3><FaClipboardCheck className="icon" /> Instructions spéciales</h3>
              <div className="special-instructions">
                <p>{order.commentaire}</p>
              </div>
            </div>
          )}

          <div className="info-group">
            <h3><FaMoneyBillWave className="icon" /> Paiement</h3>
            <div className="payment-info">
              <div className="info-item">
                <span className="info-label">Méthode de paiement</span>
                <span className="info-value">{order.methode_paiement || 'Paiement à la livraison'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Statut du paiement</span>
                <span className="info-value payment-status">
                  {order.paiement_status ? 'Payé' : 'En attente de paiement'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;