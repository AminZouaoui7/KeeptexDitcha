# Documentation: Route pour marquer l'acompte comme payé

Cette documentation explique comment utiliser la route API pour marquer l'acompte d'une commande comme payé.

## Route API

```
PUT /api/commandes/:id/acomptepaye
```

## Description

Cette route permet de marquer l'acompte d'une commande comme payé en mettant à jour le champ `acomptepaye` à `true` dans la base de données.

## Paramètres

- `:id` - L'identifiant de la commande à mettre à jour

## Corps de la requête

Le corps de la requête est optionnel. Si aucun corps n'est fourni ou si le corps est `null`, la route met automatiquement le champ `acomptepaye` à `true`.

Vous pouvez également spécifier explicitement la valeur souhaitée :

```json
{
  "acomptepaye": true
}
```

ou

```json
{
  "acomptepaye": false
}
```

Le champ `acomptepaye` doit être un booléen (`true` ou `false`).

## En-têtes

```
Authorization: Bearer <token>
```

## Autorisations requises

Seuls les administrateurs peuvent utiliser cette route.

## Réponse en cas de succès (200 OK)

```json
{
  "success": true,
  "message": "Acompte marqué comme payé",
  "data": {
    // Données de la commande mise à jour
  }
}
```

## Réponses d'erreur

### 400 Bad Request

```json
{
  "success": false,
  "error": "Erreur lors de la mise à jour du statut de paiement de l'acompte"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Seul un administrateur peut modifier le statut de paiement de l'acompte"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Commande avec l'ID <id> non trouvée"
}
```

## Exemple d'utilisation avec cURL

```bash
curl -X PUT \
  http://localhost:3001/api/commandes/123/acomptepaye \
  -H 'Authorization: Bearer <token>'
```

## Exemple d'utilisation avec JavaScript (Axios)

```javascript
const axios = require('axios');

// Exemple 1: Avec un corps null (définit acomptepaye à true par défaut)
async function marquerAcompteCommePaye(commandeId, token) {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/commandes/${commandeId}/acomptepaye`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Réponse:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
    throw error;
  }
}

// Exemple 2: Avec une valeur explicite
async function mettreAJourStatutAcompte(commandeId, token, estPaye) {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/commandes/${commandeId}/acomptepaye`,
      { acomptepaye: estPaye },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Réponse:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
    throw error;
  }
}
```

## Notes

- Cette route est conçue pour être simple et directe, ne nécessitant aucun corps de requête.
- Elle est idéale pour les interfaces utilisateur où un simple bouton permet de marquer l'acompte comme payé.
- Pour vérifier si l'acompte est payé, consultez le champ `acomptepaye` dans les données de la commande.