# Documentation de l'endpoint /users/:userId/mark-absent

## Description
Cet endpoint permet de marquer un employé comme absent en incrémentant son compteur d'absences.

## Endpoint
```
PUT /api/users/:userId/mark-absent
```

## Authentification
- **Type**: Bearer Token
- **Rôle requis**: Admin
- **Header**: `Authorization: Bearer <token>`

## Paramètres

### Paramètres d'URL
| Paramètre | Type | Description |
|-----------|------|-------------|
| userId | string | UUID de l'utilisateur employé |

### Corps de la requête (optionnel)
```json
{
  "absenceCount": 1
}
```

| Champ | Type | Description | Défaut |
|-------|------|-------------|---------|
| absenceCount | number | Nombre d'absences à ajouter | 1 |

## Réponses

### Succès (200 OK)
```json
{
  "success": true,
  "message": "Employé marqué comme absent. Total absences: 3",
  "data": {
    "id": "uuid-de-l-utilisateur",
    "name": "Nom de l'employé",
    "email": "email@employe.com",
    "role": "employee",
    "absence": 3,
    ...
  }
}
```

### Erreurs

#### 404 Not Found
```json
{
  "success": false,
  "error": "Utilisateur non trouvé"
}
```

#### 400 Bad Request
```json
{
  "success": false,
  "error": "Cette action est réservée aux employés"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": "Non autorisé"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Erreur serveur"
}
```

## Exemples d'utilisation

### cURL
```bash
# Marquer comme absent avec valeur par défaut
curl -X PUT \
  http://localhost:3001/api/users/123e4567-e89b-12d3-a456-426614174000/mark-absent \
  -H 'Authorization: Bearer votre-token-jwt' \
  -H 'Content-Type: application/json'

# Marquer comme absent avec un nombre spécifique
curl -X PUT \
  http://localhost:3001/api/users/123e4567-e89b-12d3-a456-426614174000/mark-absent \
  -H 'Authorization: Bearer votre-token-jwt' \
  -H 'Content-Type: application/json' \
  -d '{"absenceCount": 2}'
```

### JavaScript (Axios)
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';
const token = 'votre-token-jwt';

// Configuration d'Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Marquer comme absent avec valeur par défaut
async function markEmployeeAbsent(userId) {
  try {
    const response = await api.put(`/users/${userId}/mark-absent`);
    console.log('Succès:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
    throw error;
  }
}

// Marquer comme absent avec un nombre spécifique\async function markEmployeeAbsentWithCount(userId, count) {
  try {
    const response = await api.put(`/users/${userId}/mark-absent`, {
      absenceCount: count
    });
    console.log('Succès:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
    throw error;
  }
}

// Exemple d'utilisation
markEmployeeAbsent('123e4567-e89b-12d3-a456-426614174000');
```

### Dart/Flutter
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class UserService {
  static const String baseUrl = 'http://localhost:3001/api';
  static const String token = 'votre-token-jwt';

  static Future<Map<String, dynamic>> markEmployeeAbsent(String userId, {int absenceCount = 1}) async {
    final url = Uri.parse('$baseUrl/users/$userId/mark-absent');
    
    final response = await http.put(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'absenceCount': absenceCount,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Erreur: ${response.statusCode} - ${response.body}');
    }
  }

  // Exemple d'utilisation
  static void exampleUsage() async {
    try {
      final result = await markEmployeeAbsent('123e4567-e89b-12d3-a456-426614174000');
      print('Employé marqué absent: $result');
    } catch (e) {
      print('Erreur: $e');
    }
  }
}
```

## Notes importantes

1. **Rôle requis**: Seuls les utilisateurs avec le rôle 'admin' peuvent accéder à cet endpoint.
2. **Type d'utilisateur**: L'endpoint ne fonctionne que pour les utilisateurs ayant le rôle 'employee'.
3. **Incrémentation**: Le champ `absence` est incrémenté du nombre spécifié (ou de 1 par défaut).
4. **Champ absence**: Le champ `absence` dans le modèle User est utilisé pour stocker le total des absences.

## Tests

Pour tester l'endpoint, utilisez le script fourni:
```bash
node test-mark-absent.js
```

Assurez-vous de remplacer les variables dans le script par vos propres valeurs.