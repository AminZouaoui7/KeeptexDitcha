# Documentation de la route de mise à jour d'état de commande

Cette documentation explique comment utiliser la nouvelle route API pour mettre à jour uniquement l'état d'une commande.

## Spécifications de la route

- **Méthode** : PUT
- **Endpoint** : `/api/commandes/:id/etat`
- **Authentification** : Token Bearer dans les headers
- **Corps de la requête** : JSON avec le champ `etat`
- **Réponse en cas de succès** : JSON avec `success: true`, un message et les données de la commande mise à jour

## États valides

Les états valides pour une commande sont :
- `en attente`
- `conception`
- `patronnage`
- `coupe`
- `confection`
- `finition`
- `controle`
- `termine`

## Exemple de requête avec curl

```bash
curl -X PUT http://localhost:5000/api/commandes/1/etat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer votre_token_jwt_ici" \
  -d '{"etat": "confection"}'
```

## Exemple de requête avec Postman

Un fichier de collection Postman est disponible dans le dossier `scripts` : `postman-update-etat.json`.

Pour l'utiliser :
1. Importez la collection dans Postman
2. Créez un environnement avec une variable `jwt_token`
3. Exécutez d'abord la requête "Login" pour obtenir un token
4. Puis exécutez la requête "Mettre à jour l'état d'une commande"

## Exemple de requête avec Flutter

```dart
Future<void> updateCommandeEtat(int commandeId, String etat) async {
  final url = Uri.parse('http://votre_serveur:5000/api/commandes/$commandeId/etat');
  final response = await http.put(
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode({'etat': etat}),
  );

  if (response.statusCode == 200) {
    // Succès
    print('État de la commande mis à jour avec succès');
  } else {
    // Erreur
    print('Erreur lors de la mise à jour de l\'état: ${response.body}');
  }
}
```

## Gestion des erreurs

La route peut renvoyer les codes d'erreur suivants :

- **400** : État invalide
- **401** : Non authentifié (token manquant ou invalide)
- **403** : Non autorisé (l'utilisateur n'est pas propriétaire de la commande et n'est pas admin)
- **404** : Commande non trouvée
- **500** : Erreur serveur

## Configuration dans server.js

La route est déjà configurée dans le fichier `server.js` via :

```javascript
app.use('/api/commandes', require('./routes/commandeRoutes'));
```

Aucune configuration supplémentaire n'est nécessaire.