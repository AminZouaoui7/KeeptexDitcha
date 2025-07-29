import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faCut, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from './index';
import './OrderTypeSelector.css';

const OrderTypeSelector = ({ onSelectType, onClose }) => {
  return (
    <div className="order-type-selector">
      <p className="order-type-description">
        Veuillez choisir le type de commande que vous souhaitez passer :
      </p>
      
      <div className="order-types">
        <div className="order-type-card">
          <div className="order-type-icon">
            <FontAwesomeIcon icon={faCut} />
          </div>
          <h3 className="order-type-title">Pièces Coupées</h3>
          <p className="order-type-info">
            Vous avez déjà préparé les étapes de conception, patronnage et coupe de tissu. 
            Nous commençons directement à l'étape de confection.
          </p>
          <div className="order-type-steps">
            <div className="step-item completed">Conception</div>
            <div className="step-item completed">Patronnage</div>
            <div className="step-item completed">Coupe Tissu</div>
            <div className="step-item highlight">Confection</div>
            <div className="step-item highlight">Finition</div>
            <div className="step-item highlight">Contrôle Qualité</div>
          </div>
          <Button 
            variant="primary" 
            className="order-type-button"
            onClick={() => onSelectType('pieces-coupees')}
          >
            Choisir <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </div>
        
        <div className="order-type-card">
          <div className="order-type-icon">
            <FontAwesomeIcon icon={faTshirt} />
          </div>
          <h3 className="order-type-title">De A à Z</h3>
          <p className="order-type-info">
            Nous prenons en charge toutes les étapes du processus, de la conception 
            jusqu'à la livraison du produit fini.
          </p>
          <div className="order-type-steps">
            <div className="step-item highlight">Conception</div>
            <div className="step-item highlight">Patronnage</div>
            <div className="step-item highlight">Coupe Tissu</div>
            <div className="step-item highlight">Confection</div>
            <div className="step-item highlight">Finition</div>
            <div className="step-item highlight">Contrôle Qualité</div>
          </div>
          <Button 
            variant="primary" 
            className="order-type-button"
            onClick={() => onSelectType('a-a-z')}
          >
            Choisir <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </div>
      </div>
      
      <div className="order-type-actions">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Annuler
        </Button>
      </div>
    </div>
  );
};

OrderTypeSelector.propTypes = {
  onSelectType: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderTypeSelector;