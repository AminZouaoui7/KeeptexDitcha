# Guide de configuration PostgreSQL pour un accès réseau local

Ce guide vous explique comment configurer PostgreSQL sur le PC A pour qu'il accepte les connexions depuis le PC B sur votre réseau local.

## 1. Configuration de PostgreSQL sur le PC A (hébergeant la base de données)

### Étape 1 : Localiser les fichiers de configuration PostgreSQL

Sur Windows, les fichiers de configuration se trouvent généralement dans :
```
C:\Program Files\PostgreSQL\[version]\data\
```

Sur Linux :
```
/etc/postgresql/[version]/main/
```

Sur macOS :
```
/usr/local/var/postgres/
```

### Étape 2 : Modifier le fichier `postgresql.conf`

1. Ouvrez le fichier `postgresql.conf` avec un éditeur de texte (en tant qu'administrateur sous Windows)

2. Recherchez la ligne contenant `listen_addresses` et modifiez-la comme suit :

```
listen_addresses = '*'          # à la place de 'localhost'
```

3. Vérifiez que le port est correctement configuré (par défaut 5432, mais dans votre cas 5433) :

```
port = 5433                    # Assurez-vous que c'est le bon port
```

4. Enregistrez le fichier

### Étape 3 : Modifier le fichier `pg_hba.conf`

1. Ouvrez le fichier `pg_hba.conf` avec un éditeur de texte (en tant qu'administrateur)

2. Ajoutez les lignes suivantes à la fin du fichier pour autoriser les connexions depuis votre réseau local :

```
# Autoriser les connexions depuis le réseau local 192.168.1.0/24
host    all             postgres        192.168.1.0/24            md5
host    keeptex         postgres        192.168.1.0/24            md5
```

> **Note de sécurité** : 
> - `md5` signifie que l'authentification par mot de passe est requise
> - Remplacez `192.168.1.0/24` par votre plage d'adresses réseau si elle est différente
> - Si vous connaissez l'adresse IP exacte du PC B, vous pouvez être plus restrictif en utilisant `192.168.1.X/32`

3. Enregistrez le fichier

### Étape 4 : Redémarrer PostgreSQL

**Sous Windows :**

1. Ouvrez le menu Démarrer et recherchez "Services"
2. Trouvez le service "postgresql-x64-[version]" ou similaire
3. Cliquez droit et sélectionnez "Redémarrer"

Ou via PowerShell (en administrateur) :
```powershell
Restart-Service postgresql-x64-[version]
```

**Sous Linux :**
```bash
sudo systemctl restart postgresql
```

**Sous macOS :**
```bash
brew services restart postgresql
```

### Étape 5 : Configurer le pare-feu Windows

1. Ouvrez le Pare-feu Windows Defender (recherchez "pare-feu" dans le menu Démarrer)
2. Cliquez sur "Règles de trafic entrant" dans le panneau de gauche
3. Cliquez sur "Nouvelle règle..." dans le panneau de droite
4. Sélectionnez "Port" et cliquez sur "Suivant"
5. Sélectionnez "TCP" et entrez "5433" dans "Ports locaux spécifiques" (ou votre port PostgreSQL)
6. Cliquez sur "Suivant"
7. Sélectionnez "Autoriser la connexion" et cliquez sur "Suivant"
8. Cochez uniquement "Privé" (pour le réseau local) et cliquez sur "Suivant"
9. Donnez un nom à la règle (ex: "PostgreSQL") et cliquez sur "Terminer"

## 2. Configuration sur le PC B (qui se connecte à distance)

### Étape 1 : Créer un fichier `.env` pour la connexion

Créez ou modifiez le fichier `.env` dans votre projet backend :

```
# Configuration PostgreSQL
POSTGRES_HOST=192.168.1.X     # Remplacez X par l'adresse IP du PC A
POSTGRES_PORT=5433
POSTGRES_DB=keeptex
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234

# URI de connexion complète
POSTGRES_URI=postgres://postgres:1234@192.168.1.X:5433/keeptex
```

### Étape 2 : Tester la connexion

Utilisez le script `test-pg-connection.js` fourni pour tester la connexion :

1. Modifiez l'adresse IP dans le script pour qu'elle corresponde à celle du PC A
2. Exécutez le script :

```bash
node test-pg-connection.js
```

Si tout est correctement configuré, vous devriez voir un message de succès et la liste des tables disponibles.

## 3. Dépannage

### Problème : Connexion refusée

**Vérifications :**

1. **PostgreSQL est-il en cours d'exécution ?**
   - Vérifiez que le service PostgreSQL est démarré sur le PC A

2. **Les fichiers de configuration sont-ils correctement modifiés ?**
   - Vérifiez que `listen_addresses = '*'` est bien défini dans `postgresql.conf`
   - Vérifiez que les règles d'accès sont correctement ajoutées dans `pg_hba.conf`

3. **Le pare-feu bloque-t-il les connexions ?**
   - Désactivez temporairement le pare-feu pour tester
   - Vérifiez que la règle pour le port 5433 est correctement configurée

4. **L'adresse IP est-elle correcte ?**
   - Sur le PC A, exécutez `ipconfig` (Windows) ou `ifconfig` (Linux/macOS) pour vérifier l'adresse IP

5. **Le port est-il correct ?**
   - Vérifiez que vous utilisez le bon port (5433 dans votre cas)

### Problème : Erreur d'authentification

**Vérifications :**

1. **Les identifiants sont-ils corrects ?**
   - Vérifiez le nom d'utilisateur et le mot de passe

2. **Les permissions sont-elles correctement configurées ?**
   - Vérifiez que l'utilisateur a accès à la base de données depuis une adresse distante

## 4. Sécurité

Pour une sécurité renforcée en production :

1. **Créez un utilisateur dédié** au lieu d'utiliser `postgres`
2. **Utilisez un mot de passe fort**
3. **Limitez l'accès** à des adresses IP spécifiques plutôt qu'à tout le sous-réseau
4. **Activez SSL** pour les connexions
5. **Utilisez un VPN** si vous devez vous connecter depuis l'extérieur du réseau local

## 5. Commandes utiles

### Vérifier si PostgreSQL écoute sur toutes les interfaces

Sur le PC A, exécutez :

```bash
netstat -an | findstr 5433
```

Vous devriez voir quelque chose comme :
```
TCP    0.0.0.0:5433           0.0.0.0:0              LISTENING
```

### Tester la connexion avec psql

Si vous avez les outils PostgreSQL installés sur le PC B :

```bash
psql -h 192.168.1.X -p 5433 -U postgres -d keeptex
```

### Ping pour vérifier la connectivité réseau

```bash
ping 192.168.1.X
```

---

Ce guide devrait vous permettre de configurer PostgreSQL pour qu'il soit accessible depuis un autre PC sur votre réseau local. Si vous rencontrez des problèmes, n'hésitez pas à consulter la documentation officielle de PostgreSQL ou à demander de l'aide supplémentaire.