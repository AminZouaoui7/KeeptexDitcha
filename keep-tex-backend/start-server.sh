#!/bin/bash
echo "======================================================"
echo "Démarrage du serveur Keep-Tex Backend"
echo "======================================================"

# Afficher l'adresse IP locale
echo "Adresses IP disponibles sur cette machine:"
if [[ "$(uname)" == "Darwin" ]]; then
  # macOS
  ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
else
  # Linux
  ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1
fi
echo ""

# Lancer le serveur Node.js
echo "Démarrage du serveur..."
echo ""
npm start