import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config';

const CommandesAvecUtilisateur = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Vous devez être connecté pour accéder à cette page');
        }

        const response = await axios.get(`${API_URL}/commandes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setCommandes(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Une erreur est survenue lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-2">Chargement des commandes...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Liste des commandes avec informations client</h2>
      
      {commandes.length === 0 ? (
        <Alert variant="info">Aucune commande trouvée</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>État</th>
              <th>Client</th>
              <th>Email</th>
              <th>Prix total</th>
              <th>Acompte payé</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((commande) => (
              <tr key={commande.id}>
                <td>{commande.id}</td>
                <td>{commande.type}</td>
                <td>
                  <Badge bg={getBadgeColor(commande.etat)}>
                    {commande.etat}
                  </Badge>
                </td>
                <td>
                  {commande.user ? commande.user.name : 'Client inconnu'}
                </td>
                <td>
                  {commande.user ? commande.user.email : 'Email inconnu'}
                </td>
                <td>{commande.prix_total} DT</td>
                <td>
                  <Badge bg={commande.acomptepaye ? 'success' : 'warning'}>
                    {commande.acomptepaye ? 'Acompte payé' : 'Non payé'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

// Fonction pour déterminer la couleur du badge en fonction de l'état
const getBadgeColor = (etat) => {
  switch (etat) {
    case 'en attente':
      return 'secondary';
    case 'conception':
      return 'info';
    case 'patronnage':
      return 'primary';
    case 'coupe':
      return 'warning';
    case 'confection':
      return 'warning';
    case 'finition':
      return 'info';
    case 'controle':
      return 'info';
    case 'termine':
      return 'success';
    case 'livree':
      return 'success';
    case 'annulee':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default CommandesAvecUtilisateur;