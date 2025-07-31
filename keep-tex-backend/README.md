# Keep-Tex Backend

Ce projet est le backend commun pour les interfaces client (React.js) et admin (Flutter Web) de l'application Keep-Tex.

## Configuration pour le développement collaboratif

Ce backend est conçu pour être accessible par plusieurs développeurs travaillant sur des machines différentes dans le même réseau local.

### Prérequis

- Node.js (v14 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

### Installation

1. Cloner le dépôt
2. Installer les dépendances :
   ```
   npm install
   ```
3. Copier le fichier `.env.example` en `.env` et configurer les variables d'environnement :
   ```
   cp .env.example .env
   ```
4. Modifier le fichier `.env` avec vos paramètres locaux

## Démarrage du serveur

### Méthode 1 : Utiliser les scripts de démarrage

#### Windows
```
.\start-server.bat
```

#### Linux/macOS
```
chmod +x ./start-server.sh
./start-server.sh
```

### Méthode 2 : Démarrage manuel
```
npm start
```

## Configuration du frontend

Chaque développeur doit configurer son frontend (React ou Flutter) pour pointer vers l'adresse IP locale du backend :

### Pour le développeur React

Dans le fichier `.env` du projet frontend React :
```
REACT_APP_API_URL=http://ADRESSE_IP_DU_BACKEND:5000/api
```

### Pour le développeur Flutter

Dans le fichier de configuration de l'application Flutter :
```dart
static const String apiBaseUrl = 'http://ADRESSE_IP_DU_BACKEND:5000/api';
```

## Vérification de la connexion

Le serveur affiche automatiquement les adresses IP disponibles au démarrage. Utilisez l'une de ces adresses pour configurer vos frontends.

Pour vérifier que le serveur est accessible, ouvrez dans un navigateur :
```
http://ADRESSE_IP_DU_BACKEND:5000
```

Vous devriez voir un message de bienvenue : `{ "message": "Welcome to Keep-Tex API" }`

## Dépannage

### Le serveur n'est pas accessible depuis une autre machine

1. Vérifiez que le pare-feu autorise les connexions sur le port 5000
2. Assurez-vous que les deux machines sont sur le même réseau
3. Vérifiez que la variable HOST dans .env est bien définie sur '0.0.0.0'

### Problèmes de connexion à la base de données

Le serveur affiche des messages détaillés en cas d'échec de connexion à PostgreSQL. Vérifiez :
1. Que PostgreSQL est en cours d'exécution
2. Que les informations de connexion dans .env sont correctes
3. Que la base de données existe