import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import commandeService from '../services/commandeService';
import AcomptePayeToggle from '../components/AcomptePayeToggle';

const CommandeDetailExample = () => {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Vous devez être connecté pour accéder à cette page');
        }

        const response = await commandeService.getCommandeById(id, token);
        setCommande(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Une erreur est survenue lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [id]);

  const handleAcomptePayeUpdate = (newValue) => {
    // Mettre à jour l'état local de la commande
    setCommande(prevCommande => ({
      ...prevCommande,
      acomptepaye: newValue
    }));
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!commande) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Commande non trouvée</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Card>
            <Card.Header as="h5">
              Commande #{commande.id}
              <Badge 
                bg={commande.etat === 'termine' ? 'success' : 
                   commande.etat === 'annulee' ? 'danger' : 
                   commande.etat === 'livree' ? 'info' : 'warning'} 
                className="ms-2"
              >
                {commande.etat}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Détails de la commande</h6>
                  <p><strong>Type:</strong> {commande.type}</p>
                  <p><strong>Modèle:</strong> {commande.type_modele}</p>
                  <p><strong>Tissu:</strong> {commande.type_tissue}</p>
                  <p><strong>Couleur:</strong> {commande.couleur}</p>
                  <p><strong>Quantité totale:</strong> {commande.quantite_totale}</p>
                  <p><strong>Date:</strong> {new Date(commande.date).toLocaleDateString()}</p>
                </Col>
                <Col md={6}>
                  <h6>Informations financières</h6>
                  <p><strong>Prix total:</strong> {commande.prix_total} €</p>
                  <p><strong>Acompte requis:</strong> {commande.acompte_requis} €</p>
                  <p>
                    <strong>Statut de l'acompte:</strong> 
                    <Badge bg={commande.acomptepaye ? 'success' : 'warning'} className="ms-2">
                      {commande.acomptepaye ? 'Payé' : 'Non payé'}
                    </Badge>
                  </p>
                  
                  {/* Composant pour mettre à jour le statut de l'acompte */}
                  <AcomptePayeToggle 
                    commandeId={commande.id} 
                    acomptepaye={commande.acomptepaye} 
                    onUpdate={handleAcomptePayeUpdate} 
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CommandeDetailExample;