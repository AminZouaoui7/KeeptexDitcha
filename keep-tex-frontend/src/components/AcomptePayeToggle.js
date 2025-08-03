import React, { useState } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import commandeService from '../services/commandeService';

const AcomptePayeToggle = ({ commandeId, acomptepaye, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleToggleAcomptePaye = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Récupérer le token depuis le localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }

      // Appeler le service pour mettre à jour l'acomptepaye
      const newValue = !acomptepaye;
      const result = await commandeService.updateAcomptePaye(commandeId, newValue, token);
      
      setSuccess(true);
      // Appeler la fonction de callback pour mettre à jour l'état parent si nécessaire
      if (onUpdate) {
        onUpdate(newValue);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="acompte-paye-toggle">
      <Button 
        variant={acomptepaye ? "success" : "warning"}
        onClick={handleToggleAcomptePaye}
        disabled={loading}
        className="mb-2"
      >
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            <span className="ms-2">Chargement...</span>
          </>
        ) : (
          <>
            {acomptepaye ? "Acompte payé" : "Marquer l'acompte comme payé"}
          </>
        )}
      </Button>

      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mt-2">
          Le statut de paiement de l'acompte a été mis à jour avec succès.
        </Alert>
      )}
    </div>
  );
};

export default AcomptePayeToggle;