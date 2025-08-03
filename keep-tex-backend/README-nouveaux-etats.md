# Nouveaux États de Commande

Ce document décrit les nouveaux états ajoutés au modèle de commande.

## États Ajoutés

Deux nouveaux états ont été ajoutés à l'énumération `etat` du modèle `Commande` :

1. **livree** : Indique que la commande a été livrée au client.
2. **annulee** : Indique que la commande a été annulée.

## Liste Complète des États

Voici la liste complète des états possibles pour une commande :

- **en attente** : La commande vient d'être créée et est en attente de traitement.
- **conception** : La commande est en phase de conception.
- **patronnage** : La commande est en phase de patronnage.
- **coupe** : La commande est en phase de coupe.
- **confection** : La commande est en phase de confection.
- **finition** : La commande est en phase de finition.
- **controle** : La commande est en phase de contrôle qualité.
- **termine** : La commande est terminée et prête à être livrée.
- **livree** : La commande a été livrée au client.
- **annulee** : La commande a été annulée.

## Utilisation

Pour mettre à jour l'état d'une commande, utilisez la route API existante :

```
PUT /api/commandes/:id/etat
```

Avec le corps de la requête :

```json
{
  "etat": "livree"
}
```

ou

```json
{
  "etat": "annulee"
}
```

## Exemple avec cURL

```bash
curl -X PUT http://localhost:5000/api/commandes/1/etat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"etat": "livree"}'
```

## Exemple avec Flutter

```dart
final response = await http.put(
  Uri.parse('http://localhost:5000/api/commandes/1/etat'),
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token',
  },
  body: jsonEncode({
    'etat': 'livree',
  }),
);
```

## Notes

- Seuls les administrateurs et les propriétaires de la commande peuvent modifier l'état d'une commande.
- L'état "annulee" devrait être utilisé avec précaution car il indique que la commande ne sera pas traitée.
- L'état "livree" marque la fin du cycle de vie de la commande.