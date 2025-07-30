import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faRuler, faCut, faTshirt, faPaintBrush, faSearch, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './OrderProgressBar.css';

const OrderProgressBar = ({ etat, type }) => {
  console.log('OrderProgressBar - Props reçues:', { etat, type });
  
  const renderProgressGraph = () => {
    console.log('Status:', etat, 'Type:', type);
    let etapes = [];
    
    // Définir les étapes avec leurs icônes
    if (type === 'pieces-coupees' || type === 'pièce coupée' || type === 'pièces coupées') {
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
      // Déterminer l'index de l'étape actuelle
      const etatsOrdre = ['en attente', 'conception', 'patronnage', 'coupe', 'confection', 'finition', 'controle', 'termine'];
      const currentIndex = etatsOrdre.indexOf(etat);
      console.log('Index de l\'étape actuelle:', currentIndex);
      
      // Marquer les étapes comme complétées ou courantes en fonction de l'état actuel
      etapes = etapes.map((etape, index) => {
        const etapeIndex = etatsOrdre.indexOf(etape.id);
        let status = {
          completed: etape.completed || false,
          current: false
        };
        
        // Si l'étape est avant l'étape actuelle, elle est complétée
        if (etapeIndex < currentIndex && etapeIndex > 0) {
          status.completed = true;
        }
        // Si l'étape est l'étape actuelle, elle est courante
        else if (etapeIndex === currentIndex) {
          status.current = true;
        }
        
        // Pour les commandes terminées, toutes les étapes sont complétées
        if (etat === 'termine') {
          status.completed = true;
          status.current = false;
        }
        
        console.log(`Étape ${etape.label}: index=${etapeIndex}, complétée=${status.completed}, courante=${status.current}`);
        return {
          ...etape,
          ...status
        };
      });
    }

    return (
      <div className="progress-graph">
        {etapes.map((etape, index) => (
          <div key={etape.id} className="progress-step">
            {index < etapes.length - 1 && (
              <div className={`progress-line ${etape.completed ? 'completed' : ''}`}></div>
            )}
            <div className={`step-icon ${etape.completed ? 'completed' : ''} ${etape.current ? 'current' : ''}`}>
              {etape.completed ? (
                <FontAwesomeIcon icon={faCheckCircle} />
              ) : (
                <FontAwesomeIcon icon={etape.icon} />
              )}
            </div>
            <div className={`step-label ${etape.completed ? 'completed' : ''} ${etape.current ? 'current' : ''}`}>
              {etape.label}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="order-progress-section">
      <h3>Progression de la commande</h3>
      <div className="order-type-badge">
        {(type === 'pieces-coupees' || type === 'pièce coupée' || type === 'pièces coupées') ? 'Pièces Coupées' : 'De A à Z'}
      </div>
      {renderProgressGraph()}
    </div>
  );
};

export default OrderProgressBar;