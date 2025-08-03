# Documentation pour la mise à jour du statut de paiement de l'acompte

Cette documentation explique comment utiliser la route API pour mettre à jour le statut de paiement de l'acompte d'une commande.

## Route API

```
PUT /api/commandes/:id/acomptepaye
```

## Authentification

Cette route nécessite une authentification avec un token JWT valide et un rôle d'administrateur.

## Corps de la requête

```json
{
  "acomptepaye": true
}
```

Le champ `acomptepaye` doit être un booléen (`true` ou `false`).

### Comportement par défaut

Si le corps de la requête est `null` ou si le champ `acomptepaye` n'est pas spécifié, la valeur par défaut `true` sera utilisée. Cela permet d'utiliser cette route de manière simplifiée pour marquer un acompte comme payé sans avoir à fournir un corps de requête.

## Réponses

### Succès (200 OK)

```json
{
  "success": true,
  "message": "Statut de paiement de l'acompte mis à jour",
  "data": {
    "id": 1,
    "type": "t-shirt",
    "type_modele": "col rond",
    "type_tissue": "coton",
    "logo": "logo.png",
    "logo_path": "uploads/logo.png",
    "couleur": "bleu",
    "quantite_totale": 100,
    "prix_total": 1000.00,
    "acompte_requis": 500.00,
    "acomptepaye": true,
    "date": "2023-06-01",
    "etat": "en attente",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "description": "Commande de t-shirts pour l'entreprise XYZ",
    "tailles": [
      {
        "id": 1,
        "commande_id": 1,
        "taille": "S",
        "quantite": 20
      },
      {
        "id": 2,
        "commande_id": 1,
        "taille": "M",
        "quantite": 30
      },
      {
        "id": 3,
        "commande_id": 1,
        "taille": "L",
        "quantite": 50
      }
    ]
  }
}
```

### Erreur - Requête invalide (400 Bad Request)

```json
{
  "success": false,
  "error": "La valeur de acomptepaye doit être un booléen (true/false)"
}
```

### Erreur - Commande non trouvée (404 Not Found)

```json
{
  "success": false,
  "error": "Commande avec l'ID 999 non trouvée"
}
```

### Erreur - Non autorisé (403 Forbidden)

```json
{
  "success": false,
  "error": "Seul un administrateur peut modifier le statut de paiement de l'acompte"
}
```

### Erreur - Serveur (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Erreur lors de la mise à jour du statut de paiement de l'acompte"
}
```

## Exemples d'utilisation

### Avec cURL

```bash
curl -X PUT \
  http://localhost:5000/api/commandes/1/acomptepaye \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -d '{
    "acomptepaye": true
  }'
```

### Avec Postman

1. Sélectionnez la méthode `PUT`
2. Entrez l'URL `http://localhost:5000/api/commandes/1/acomptepaye`
3. Dans l'onglet `Headers`, ajoutez :
   - Key: `Content-Type`, Value: `application/json`
   - Key: `Authorization`, Value: `Bearer YOUR_JWT_TOKEN`
4. Dans l'onglet `Body`, sélectionnez `raw` et `JSON`, puis entrez :
   ```json
   {
     "acomptepaye": true
   }
   ```
5. Cliquez sur `Send`

### Avec Flutter

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> updateAcomptePaye(String commandeId, bool acomptepaye, String token) async {
  final response = await http.put(
    Uri.parse('http://localhost:5000/api/commandes/$commandeId/acomptepaye'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode({
      'acomptepaye': acomptepaye,
    }),
  );

  if (response.statusCode == 200) {
    // Succès
    print('Statut de paiement de l\'acompte mis à jour avec succès');
    final data = jsonDecode(response.body);
    print(data);
  } else {
    // Erreur
    print('Erreur lors de la mise à jour du statut de paiement de l\'acompte');
    print('Code d\'erreur: ${response.statusCode}');
    print('Message d\'erreur: ${response.body}');
  }
}
```

## Notes

- Cette route est configurée dans `server.js` via le fichier de routes `commandeRoutes.js`.
- Seuls les utilisateurs avec le rôle `admin` peuvent utiliser cette route.
- Le champ `acomptepaye` est un booléen qui indique si l'acompte a été payé (`true`) ou non (`false`).