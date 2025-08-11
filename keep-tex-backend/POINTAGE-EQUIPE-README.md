# Pointage d'Équipe - Documentation

Ce document décrit les nouvelles fonctionnalités de pointage d'équipe ajoutées au système.

## Endpoints

### 1. GET /api/attendance/roster
Récupère la liste de tous les utilisateurs actifs avec leur pointage pour une date spécifique.

**Accès :** Administrateur uniquement

**Paramètres :**
- `date` (query) : Date au format YYYY-MM-DD (obligatoire)

**Réponse :**
```json
{
  "success": true,
  "count": 5,
  "date": "2025-08-07",
  "data": [
    {
      "userId": "uuid-123",
      "name": "Jean Dupont",
      "email": "jean.dupont@example.com",
      "status": "present",
      "checkIn": "08:30:00",
      "checkOut": "17:30:00",
      "notes": "Travail normal"
    },
    {
      "userId": "uuid-456",
      "name": "Marie Martin",
      "email": "marie.martin@example.com",
      "status": null,
      "checkIn": null,
      "checkOut": null,
      "notes": null
    }
  ]
}
```

### 2. POST /api/attendance/bulk
Crée ou met à jour plusieurs pointages en une seule requête.

**Accès :** Administrateur uniquement

**Body :**
```json
{
  "date": "2025-08-07",
  "records": [
    {
      "userId": "uuid-123",
      "status": "present",
      "checkIn": "08:30:00",
      "checkOut": "17:30:00",
      "notes": "Travail normal"
    },
    {
      "userId": "uuid-456",
      "status": "absent",
      "notes": "Maladie"
    },
    {
      "userId": "uuid-789",
      "status": "late",
      "checkIn": "09:15:00",
      "checkOut": "18:00:00"
    }
  ]
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Pointage enregistré"
}
```

### 3. POST /api/attendance/seed-absent
Initialise tous les utilisateurs actifs comme absents pour une date donnée (optionnel).

**Accès :** Administrateur uniquement

**Body :**
```json
{
  "date": "2025-08-07"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Initialisation des absences effectuée",
  "count": 25
}
```

## Tests avec curl

### Test GET roster
```bash
curl -X GET "http://localhost:3000/api/attendance/roster?date=2025-08-07" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test POST bulk (UPSERT)
```bash
curl -X POST "http://localhost:3000/api/attendance/bulk" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-08-07",
    "records": [
      {
        "userId": "uuid-123",
        "status": "present",
        "checkIn": "08:30:00",
        "checkOut": "17:30:00"
      },
      {
        "userId": "uuid-456",
        "status": "present",
        "checkIn": "08:45:00",
        "checkOut": "17:45:00"
      }
    ]
  }'
```

### Test UPSERT idempotent
```bash
# Exécuter deux fois la même requête pour vérifier qu'il n'y a pas de doublons
curl -X POST "http://localhost:3000/api/attendance/bulk" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-08-07",
    "records": [
      {
        "userId": "uuid-test",
        "status": "present",
        "checkIn": "09:00:00"
      }
    ]
  }'
```

### Test seed absent (optionnel)
```bash
curl -X POST "http://localhost:3000/api/attendance/seed-absent" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-08-07"}'
```

## Notes d'implémentation

- Les champs `createdAt` et `updatedAt` utilisent le format camelCase conformément à la configuration Sequelize
- La contrainte UNIQUE sur `(user_id, date)` garantit l'idempotence des opérations
- Les transactions sont utilisées pour garantir l'intégrité des données lors des opérations bulk
- Les requêtes SQL brutes sont utilisées pour optimiser les performances du roster
- Les utilisateurs inactifs (`is_active = FALSE`) sont automatiquement exclus du roster