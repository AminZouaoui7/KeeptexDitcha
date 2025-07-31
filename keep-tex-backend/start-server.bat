@echo off
echo ======================================================
echo Démarrage du serveur Keep-Tex Backend
echo ======================================================

REM Afficher l'adresse IP locale
echo Adresses IP disponibles sur cette machine:
ipconfig | findstr IPv4
echo.

REM Lancer le serveur Node.js
echo Démarrage du serveur...
echo.
npm start