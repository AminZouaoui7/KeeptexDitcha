#!/bin/bash

# Script de test de connexion PostgreSQL pour Linux/macOS
# Ce script vérifie si PostgreSQL est accessible sur un PC distant (PC A)

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration - MODIFIEZ CES VALEURS
PC_A_IP="192.168.1.X"  # Remplacez X par l'adresse IP du PC A
POSTGRES_PORT=5433     # Port PostgreSQL (vérifiez qu'il s'agit bien du port utilisé)
DB_NAME="keeptex"      # Nom de la base de données
DB_USER="postgres"     # Utilisateur PostgreSQL
DB_PASSWORD="1234"     # Mot de passe PostgreSQL

# Afficher les informations de connexion
echo ""
echo -e "${CYAN}Test de connexion PostgreSQL${NC}"
echo -e "${CYAN}=========================${NC}"
echo -e "${YELLOW}Adresse IP du serveur PostgreSQL: ${PC_A_IP}${NC}"
echo -e "${YELLOW}Port PostgreSQL: ${POSTGRES_PORT}${NC}"
echo -e "${YELLOW}Base de données: ${DB_NAME}${NC}"
echo -e "${YELLOW}Utilisateur: ${DB_USER}${NC}"
echo ""

# Étape 1: Vérifier si l'hôte est accessible (ping)
echo -e "${CYAN}Étape 1: Test de connectivité réseau (ping)...${NC}"
if ping -c 2 -W 2 $PC_A_IP > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Le PC A ($PC_A_IP) répond au ping.${NC}"
else
    echo -e "${RED}❌ Le PC A ($PC_A_IP) ne répond pas au ping.${NC}"
    echo -e "${YELLOW}   Vérifiez que le PC est allumé et connecté au réseau.${NC}"
    echo -e "${YELLOW}   Note: Certains pare-feu peuvent bloquer les pings.${NC}"
fi

# Étape 2: Vérifier si le port PostgreSQL est accessible
echo ""
echo -e "${CYAN}Étape 2: Test de connexion au port PostgreSQL...${NC}"
if nc -z -w 5 $PC_A_IP $POSTGRES_PORT > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Le port PostgreSQL ($POSTGRES_PORT) est accessible sur $PC_A_IP.${NC}"
    PORT_ACCESSIBLE=true
else
    echo -e "${RED}❌ Le port PostgreSQL ($POSTGRES_PORT) n'est pas accessible sur $PC_A_IP.${NC}"
    echo -e "${YELLOW}   Causes possibles:${NC}"
    echo -e "${YELLOW}   1. PostgreSQL n'est pas démarré sur le PC A${NC}"
    echo -e "${YELLOW}   2. PostgreSQL n'est pas configuré pour écouter sur toutes les interfaces${NC}"
    echo -e "${YELLOW}   3. Le pare-feu bloque les connexions sur le port $POSTGRES_PORT${NC}"
    echo -e "${YELLOW}   4. Le port PostgreSQL configuré est incorrect${NC}"
    PORT_ACCESSIBLE=false
fi

# Étape 3: Tester la connexion avec pg_isready si disponible
if [ "$PORT_ACCESSIBLE" = true ] && command -v pg_isready > /dev/null; then
    echo ""
    echo -e "${CYAN}Étape 3: Test avec pg_isready...${NC}"
    if pg_isready -h $PC_A_IP -p $POSTGRES_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL est prêt à accepter des connexions.${NC}"
    else
        echo -e "${RED}❌ PostgreSQL n'est pas prêt à accepter des connexions.${NC}"
        echo -e "${YELLOW}   Le serveur est peut-être en cours de démarrage ou surchargé.${NC}"
    fi
fi

# Étape 4: Tester la connexion avec psql si disponible
if [ "$PORT_ACCESSIBLE" = true ] && command -v psql > /dev/null; then
    echo ""
    echo -e "${CYAN}Étape 4: Test de connexion avec psql...${NC}"
    export PGPASSWORD="$DB_PASSWORD"
    if psql -h $PC_A_IP -p $POSTGRES_PORT -U $DB_USER -d $DB_NAME -c "SELECT 'Connexion réussie!'" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Connexion à la base de données réussie avec psql.${NC}"
        
        # Afficher les tables disponibles
        echo -e "${CYAN}Tables disponibles dans la base de données:${NC}"
        psql -h $PC_A_IP -p $POSTGRES_PORT -U $DB_USER -d $DB_NAME -c "\dt" -t | sed 's/^/   /'
    else
        echo -e "${RED}❌ Impossible de se connecter à la base de données avec psql.${NC}"
        echo -e "${YELLOW}   Causes possibles:${NC}"
        echo -e "${YELLOW}   1. Les identifiants sont incorrects${NC}"
        echo -e "${YELLOW}   2. L'utilisateur n'a pas les permissions nécessaires${NC}"
        echo -e "${YELLOW}   3. La base de données n'existe pas${NC}"
        echo -e "${YELLOW}   4. pg_hba.conf n'autorise pas les connexions depuis cette adresse IP${NC}"
    fi
    unset PGPASSWORD
fi

# Étape 5: Conseils supplémentaires
echo ""
echo -e "${CYAN}Étapes suivantes:${NC}"
echo -e "${CYAN}===============${NC}"

if [ "$PORT_ACCESSIBLE" = true ]; then
    echo -e "1. Testez la connexion avec le script Node.js:"
    echo -e "   ${YELLOW}node test-pg-connection.js${NC}"
    echo ""
    echo -e "2. Si le test Node.js échoue, vérifiez:"
    echo -e "   ${YELLOW}- Les identifiants PostgreSQL (utilisateur/mot de passe)${NC}"
    echo -e "   ${YELLOW}- La configuration pg_hba.conf pour autoriser les connexions depuis votre IP${NC}"
else
    echo -e "1. Sur le PC A, vérifiez la configuration PostgreSQL:"
    echo -e "   ${YELLOW}- Dans postgresql.conf: listen_addresses = '*'${NC}"
    echo -e "   ${YELLOW}- Dans pg_hba.conf: ajoutez 'host all all 192.168.1.0/24 md5'${NC}"
    echo ""
    echo -e "2. Vérifiez que le service PostgreSQL est démarré:"
    echo -e "   ${YELLOW}- Linux: sudo systemctl status postgresql${NC}"
    echo -e "   ${YELLOW}- macOS: brew services list${NC}"
    echo ""
    echo -e "3. Vérifiez la configuration du pare-feu:"
    echo -e "   ${YELLOW}- Linux: sudo ufw status${NC}"
    echo -e "   ${YELLOW}- macOS: sudo pfctl -s rules${NC}"
fi

echo ""
echo -e "${CYAN}Pour plus d'informations, consultez le fichier GUIDE-POSTGRESQL-RESEAU.md${NC}"
echo ""