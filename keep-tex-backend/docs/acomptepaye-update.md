# Documentation: Mise à jour du champ acomptepaye

Cette documentation explique comment mettre à jour le champ `acomptepaye` d'une commande dans l'application KeepTex.

## 1. Backend

Le backend dispose d'une route API pour mettre à jour le statut de paiement de l'acompte d'une commande.

### Route API

```
PUT /api/commandes/:id/acomptepaye
```

### Paramètres

- `:id` - L'identifiant de la commande à mettre à jour

### Corps de la requête

Le corps de la requête est optionnel. Si aucun corps n'est fourni ou si le corps est `null`, la route met automatiquement le champ `acomptepaye` à `true`.

Pour spécifier explicitement la valeur :

```json
{
  "acomptepaye": true  // ou false pour marquer comme non payé
}
```

### Réponse

```json
{
  "success": true,
  "message": "Statut de paiement de l'acompte mis à jour",
  "data": {
    // Données de la commande mise à jour
  }
}
```

### Autorisations requises

Seuls les administrateurs peuvent mettre à jour le statut de paiement de l'acompte.

## 2. Frontend

Le frontend dispose d'un service et d'un composant pour faciliter la mise à jour du champ `acomptepaye`.

### Service

Le service `commandeService.js` contient une méthode `updateAcomptePaye` pour mettre à jour le statut de paiement de l'acompte :

```javascript
// Mettre à jour le statut de paiement de l'acompte d'une commande
// Version 1: Avec une valeur explicite
updateAcomptePaye: async (id, acomptepaye, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/commandes/${id}/acomptepaye`, { acomptepaye }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
},

// Version 2: Marquer simplement comme payé (utilise la valeur par défaut true)
marquerAcomptePaye: async (id, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/commandes/${id}/acomptepaye`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
```

### Composant React

Le composant `AcomptePayeToggle.js` permet d'afficher un bouton pour basculer le statut de paiement de l'acompte :

```jsx
<AcomptePayeToggle 
  commandeId={commande.id} 
  acomptepaye={commande.acomptepaye} 
  onUpdate={handleAcomptePayeUpdate} 
/>
```

## 3. Script de test

Un script de test `update-acomptepaye-true.js` est disponible dans le dossier `scripts` pour tester la mise à jour du champ `acomptepaye` en ligne de commande :

```bash
cd keep-tex-backend/scripts
node update-acomptepaye-true.js
```

Ou utilisez le script batch :

```bash
cd keep-tex-backend/scripts
update-acomptepaye-true.bat
```

## 4. Exemple d'utilisation

### Dans un composant React

```javascript
import React, { useState } from 'react';
import commandeService from '../services/commandeService';

const CommandeDetail = ({ commande }) => {
  const [acomptePaye, setAcomptePaye] = useState(commande.acomptepaye);

  const handleUpdateAcomptePaye = async (newValue) => {
    try {
      const token = localStorage.getItem('token');
      await commandeService.updateAcomptePaye(commande.id, newValue, token);
      setAcomptePaye(newValue);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  return (
    <div>
      <h2>Détails de la commande #{commande.id}</h2>
      <p>Acompte payé: {acomptePaye ? 'Oui' : 'Non'}</p>
      <button onClick={() => handleUpdateAcomptePaye(!acomptePaye)}>
        {acomptePaye ? 'Marquer comme non payé' : 'Marquer comme payé'}
      </button>
    </div>
  );
};
```

## 5. Conclusion

La mise à jour du champ `acomptepaye` est maintenant possible via l'API backend et facilement accessible depuis le frontend grâce au service `commandeService` et au composant `AcomptePayeToggle`.