# Résumé : Configuration PostgreSQL pour le développement en réseau local

## 🔹 Sur le PC A (hébergeant PostgreSQL)

### 1. Modifier les fichiers de configuration PostgreSQL

**Dans `postgresql.conf` :**
```
listen_addresses = '*'
port = 5433  # Vérifiez que c'est le bon port
```

**Dans `pg_hba.conf`, ajouter :**
```
host    all             postgres        192.168.1.0/24            md5
host    keeptex         postgres        192.168.1.0/24            md5
```

### 2. Redémarrer PostgreSQL

**Windows :** Services > postgresql-x64-[version] > Redémarrer  
**Linux :** `sudo systemctl restart postgresql`  
**macOS :** `brew services restart postgresql`

### 3. Configurer le pare-feu

**Windows :** Pare-feu Windows > Règles de trafic entrant > Nouvelle règle > Port TCP 5433  
**Linux :** `sudo ufw allow 5433/tcp`  
**macOS :** `sudo pfctl -e -f /etc/pf.conf` (après avoir ajouté la règle)

### 4. Vérifier l'adresse IP du PC A

**Windows :** `ipconfig`  
**Linux/macOS :** `ifconfig` ou `ip addr`

## 🔹 Sur le PC B (se connectant à PostgreSQL)

### 1. Configurer le fichier `.env`

```
POSTGRES_HOST=192.168.1.X     # Adresse IP du PC A
POSTGRES_PORT=5433
POSTGRES_DB=keeptex
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_URI=postgres://postgres:1234@192.168.1.X:5433/keeptex
```

### 2. Tester la connexion

**Avec les scripts fournis :**
- **Node.js :** `node test-pg-connection.js`
- **PowerShell :** `./test-pg-connection.ps1`
- **Bash :** `bash test-pg-connection.sh`

**Avec psql :**
```
psql -h 192.168.1.X -p 5433 -U postgres -d keeptex
```

## 🔹 Dépannage rapide

### Le serveur PostgreSQL n'est pas accessible

1. **Vérifier que PostgreSQL est démarré** sur le PC A
2. **Vérifier les fichiers de configuration** (`postgresql.conf` et `pg_hba.conf`)
3. **Vérifier le pare-feu** sur le PC A
4. **Tester avec un ping** : `ping 192.168.1.X`
5. **Tester le port** : 
   - Windows : `Test-NetConnection -ComputerName 192.168.1.X -Port 5433`
   - Linux/macOS : `nc -zv 192.168.1.X 5433`

### Erreur d'authentification

1. **Vérifier les identifiants** (utilisateur/mot de passe)
2. **Vérifier les permissions** dans `pg_hba.conf`
3. **Vérifier que l'utilisateur existe** et a accès à la base de données

## 🔹 Ressources

- **Guide complet :** Voir le fichier `GUIDE-POSTGRESQL-RESEAU.md`
- **Exemples de code :** 
  - `sequelize-remote-example.js` (configuration Sequelize)
  - `test-pg-connection.js` (test avec Node.js)
- **Scripts de test :** 
  - `test-pg-connection.ps1` (PowerShell)
  - `test-pg-connection.sh` (Bash)

---

**Note :** Pour plus de détails, consultez la documentation officielle de PostgreSQL sur la [configuration du serveur](https://www.postgresql.org/docs/current/runtime-config.html) et l'[authentification des clients](https://www.postgresql.org/docs/current/client-authentication.html).