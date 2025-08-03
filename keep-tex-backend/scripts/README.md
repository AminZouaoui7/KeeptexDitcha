# Scripts de débogage pour l'authentification KeepTex

Ce dossier contient des scripts pour aider à résoudre les problèmes d'authentification dans l'application KeepTex.

## Problème résolu

Le problème était une erreur 401 lors de l'appel POST vers `/api/auth/login` depuis Flutter Web, malgré que les identifiants (email + mot de passe) soient corrects.

Les corrections apportées sont :

1. Ajout de logs détaillés dans la route de login pour faciliter le débogage
2. Normalisation de l'email (conversion en minuscules) pour éviter les problèmes de casse
3. Création d'une route de test `/api/auth/test-login` qui utilise une requête SQL directe
4. Création d'un script pour générer/mettre à jour un utilisateur admin
5. Création de scripts de test pour vérifier l'API

## Utilisation des scripts

### 1. Créer/mettre à jour l'utilisateur admin

Ce script crée un utilisateur admin avec l'email `admin@keeptex.fr` et le mot de passe `test1234`, ou met à jour le mot de passe si l'utilisateur existe déjà.

```bash
node scripts/create-admin.js
```

### 2. Tester l'API de login avec curl

Ce script teste les deux routes de login avec curl :

```bash
scripts/test-login.bat
```

### 3. Tester avec Postman

Importez la collection Postman fournie dans le fichier `postman-collection.json` pour tester l'API de manière interactive.

## Commande SQL pour vérifier le hash du mot de passe

Pour vérifier directement le hash du mot de passe dans la base de données :

```sql
SELECT id, name, email, password, role FROM users WHERE email = 'admin@keeptex.fr';
```

## Modifications apportées au code

1. **Route de login améliorée** : Ajout de logs détaillés et normalisation de l'email
2. **Route de test** : Création d'une route `/api/auth/test-login` qui utilise une requête SQL directe
3. **Scripts de test** : Création de scripts pour tester l'API et créer un utilisateur admin

## Vérifications effectuées

- ✅ `bcrypt.compare()` est bien utilisé pour comparer les mots de passe
- ✅ L'email est maintenant comparé sans problème de casse (`toLowerCase()`)
- ✅ `express.json()` est bien activé dans `server.js` pour parser le body
- ✅ Une route de test a été créée pour vérifier le login
- ✅ Des commandes SQL sont fournies pour vérifier le hash dans la base
- ✅ Un script pour générer un utilisateur admin a été créé
- ✅ Des tests via curl et Postman sont fournis