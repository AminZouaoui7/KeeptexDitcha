# Endpoint GET /commandes avec informations utilisateur

Cette documentation décrit les modifications apportées à l'endpoint `GET /api/commandes` pour inclure les informations de l'utilisateur associé à chaque commande.

## Description

L'endpoint `GET /api/commandes` retourne désormais les informations de l'utilisateur (client) associé à chaque commande. Ces informations sont incluses dans un objet `user` pour chaque commande.

## Structure de la réponse

```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "id": 15,
      "type": "...",
      "userId": "...",
      "user": {
        "id": "...",
        "name": "Nom du client",
        "email": "email@client.com"
      },
      ...
    },
    ...
  ]
}
```

## Modifications techniques

1. Ajout de la relation entre les modèles `Commande` et `User` dans `customModels.js`:
   ```javascript
   Commande.belongsTo(User, { foreignKey: 'userId', as: 'user' });
   User.hasMany(Commande, { foreignKey: 'userId' });
   ```

2. Modification des méthodes de recherche dans `CommandeRepository.js` pour inclure les informations de l'utilisateur:
   ```javascript
   async findAll() {
     return await Commande.findAll({
       include: [
         { model: CommandeTaille, as: 'tailles' },
         { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
       ]
     });
   }
   ```

3. Ajout du count dans la réponse de `getAllCommandes` dans `commandeController.js`:
   ```javascript
   res.status(200).json({
     success: true,
     count: commandes.length,
     data: commandes
   });
   ```

## Utilisation

Pour récupérer les commandes avec les informations utilisateur, utilisez l'endpoint `GET /api/commandes` avec un token d'authentification valide.

### Exemple de requête

```javascript
const response = await axios.get(
  'http://localhost:5000/api/commandes',
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
```

### Accès aux informations utilisateur

```javascript
const commandes = response.data.data;
const premierClient = commandes[0].user.name;
```