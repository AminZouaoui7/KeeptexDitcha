# Documentation - Endpoints de Statistiques de Présence

## Endpoints créés

### 1. GET /api/attendance/stats?month=YYYY-MM
- **Description**: Récupère les statistiques mensuelles de présence par employé
- **Méthode**: GET
- **Authentification**: JWT requis
- **Paramètres**: 
  - `month` (query) - Format YYYY-MM (ex: 2024-12)
- **Réponse**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "userId": "1",
        "user_name": "John Doe",
        "present": 15,
        "absent": 3,
        "conge": 2
      }
    ]
  }
  ```

### 2. GET /api/performance?month=YYYY-MM
- **Description**: Alias de /api/attendance/stats
- **Même comportement et réponse que ci-dessus**

## Tests rapides avec curl

### 1. Obtenir un token JWT
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### 2. Tester les statistiques de présence
```bash
# Remplacer <TOKEN> par le token obtenu
curl -H "Authorization: Bearer <TOKEN>" \
  "http://localhost:5000/api/attendance/stats?month=2024-12"
```

### 3. Tester l'alias performance
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  "http://localhost:5000/api/performance?month=2024-12"
```

## Cas de test

### Cas 1: Mois valide avec données
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  "http://localhost:5000/api/attendance/stats?month=2024-12"
# Réponse attendue: 200 { "success": true, "data": [...] }
```

### Cas 2: Mois valide sans données
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  "http://localhost:5000/api/attendance/stats?month=2024-01"
# Réponse attendue: 200 { "success": true, "data": [] }
```

### Cas 3: Format de mois invalide
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  "http://localhost:5000/api/attendance/stats?month=invalid"
# Réponse attendue: 400 { "success": false, "message": "Paramètre month invalide..." }
```

### Cas 4: Sans paramètre month
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  "http://localhost:5000/api/attendance/stats"
# Réponse attendue: 400 { "success": false, "message": "Paramètre month invalide..." }
```

## Logs

Les requêtes sont loguées avec le format:
```
[STATS] month=2024-12 start=2024-12-01T00:00:00.000Z end=2025-01-01T00:00:00.000Z
```

## Fichiers modifiés

- `controllers/attendanceController.js` - Ajout de getMonthlyAttendanceStats
- `routes/attendanceRoutes.js` - Ajout de la route /attendance/stats
- `routes/performanceRoutes.js` - Modifié pour utiliser getMonthlyAttendanceStats
- `test-attendance-stats.js` - Script de test automatisé
- `README-ATTENDANCE-STATS.md` - Ce fichier de documentation