import React from 'react';
import { Container } from 'react-bootstrap';
import CommandesAvecUtilisateur from '../components/CommandesAvecUtilisateur';

const CommandesAvecUtilisateurPage = () => {
  return (
    <Container fluid className="p-0">
      <div className="bg-light py-3 mb-4">
        <Container>
          <h1 className="mb-0">Gestion des commandes</h1>
          <p className="text-muted">Visualisez toutes les commandes avec les informations clients</p>
        </Container>
      </div>
      
      <Container>
        <CommandesAvecUtilisateur />
      </Container>
    </Container>
  );
};

export default CommandesAvecUtilisateurPage;