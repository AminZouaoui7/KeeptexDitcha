# Fix de la fonctionnalité de pointage (Attendances)

## Résumé des changements effectués

### 1. Structure de la base de données
- ✅ **Suppression de la colonne `employee_id`** (obsolète)
- ✅ **Conservation de la colonne `user_id`** comme référence vers les utilisateurs
- ✅ **Ajout/confirmation des colonnes** : `check_in`, `check_out`, `notes`
- ✅ **Contrainte UNIQUE** sur `(user_id, date)` nommée `attendances_user_date_unique`
- ✅ **Champs timestamps** en camelCase : `createdAt`, `updatedAt`

### 2. Modèle Sequelize (`models/Attendance.js`)
- ✅ **Configuration** : `underscored: false` pour utiliser camelCase
- ✅ **Mapping des champs** : `userId` → `user_id`, `checkIn` → `check_in`, etc.
- ✅ **Validation des statuts** : `present`, `absent`, `late`, `conge`, `non_defini`

### 3. Contrôleur (`controllers/attendanceController.js`)
- ✅ **Fonction `upsertAttendance`** avec validation complète
- ✅ **Gestion de la contrainte unique** via `ON CONFLICT`
- ✅ **Validation des formats** : date (YYYY-MM-DD), heures (HH:mm:ss)
- ✅ **Gestion d'erreurs** détaillée

### 4. Routes
- ✅ **POST** `/api/attendance` - Créer/mettre à jour un pointage
- ✅ **GET** `/api/attendance?date=YYYY-MM-DD` - Lister par date
- ✅ **GET** `/api/attendance/stats?month=YYYY-MM` - Statistiques mensuelles

## Instructions de test

### Prérequis
- Serveur démarré : `npm start` (port 5000)
- Token d'authentification admin valide

### 1. Créer un pointage (upsert)
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VOTRE_TOKEN>" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "date": "2025-08-09",
    "status": "present",
    "checkIn": "08:30:00",
    "checkOut": "17:30:00",
    "notes": "Journée normale"
  }'
```

### 2. Mettre à jour un pointage existant
(Répéter la même requête - elle mettra à jour au lieu de créer un doublon)

### 3. Lister les pointages par date
```bash
curl -X GET "http://localhost:5000/api/attendance?date=2025-08-09" \
  -H "Authorization: Bearer <VOTRE_TOKEN>"
```

### 4. Obtenir les statistiques mensuelles
```bash
curl -X GET "http://localhost:5000/api/attendance/stats?month=2025-08" \
  -H "Authorization: Bearer <VOTRE_TOKEN>"
```

### 5. Tester la contrainte unique
```bash
# Premier appel - création
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VOTRE_TOKEN>" \
  -d '{"userId": "123e4567-e89b-12d3-a456-426614174000", "date": "2025-08-09", "status": "absent"}'

# Deuxième appel - mise à jour (pas d'erreur)
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VOTRE_TOKEN>" \
  -d '{"userId": "123e4567-e89b-12d3-a456-426614174000", "date": "2025-08-09", "status": "present"}'
```

## Validation des corrections

### ✅ Erreurs corrigées
1. **"il n'existe aucune contrainte unique"** → Résolu avec contrainte UNIQUE sur (user_id, date)
2. **"la colonne « created_at » ... n'existe pas"** → Résolu avec champs camelCase
3. **500 Internal Server Error** → Résolu avec gestion d'erreurs appropriée

### ✅ Structure finale de la table
```sql
CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status enum_attendances_status NOT NULL DEFAULT 'non_defini',
  check_in TIME,
  check_out TIME,
  notes TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, date)
);
```

## Commandes utiles

### Vérifier la structure
```bash
# Vérifier les colonnes
node -e "const sequelize = require('./sequelize'); sequelize.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'attendances\'').then(([r]) => console.log(r)).finally(() => sequelize.close())"

# Vérifier les contraintes
node -e "const sequelize = require('./sequelize'); sequelize.query('SELECT conname, contype FROM pg_constraint WHERE conrelid = \'attendances\'::regclass').then(([r]) => console.log(r)).finally(() => sequelize.close())"
```

### Réinitialiser si nécessaire
```bash
# Revenir en arrière (rollback)
node -e "const migration = require('./migrations/20241230150000-fix-attendance-structure'); const sequelize = require('./sequelize'); migration.down(sequelize.getQueryInterface(), sequelize.constructor).then(() => console.log('Rollback completed')).catch(console.error).finally(() => sequelize.close())"
```

## Notes importantes
- **Authentification requise** : Toutes les routes nécessitent un token admin
- **Format des dates** : Utiliser YYYY-MM-DD (ex: 2025-08-09)
- **Format des heures** : Utiliser HH:mm:ss (ex: 08:30:00)
- **Upsert** : La même requête POST peut créer ou mettre à jour sans doublon
- **Statuts** : `present`, `absent`, `late`, `conge`, `non_defini`