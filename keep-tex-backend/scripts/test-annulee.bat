@echo off
echo Test de l'etat "annulee"

REM Remplacez ces valeurs par les votres
set ID_COMMANDE=1
set TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkwMjkwMDk5LCJleHAiOjE2OTI4ODIwOTl9.1vYmfILQQTrYFIJXK7cmXJUZNSd-OxPLYCEqtYBXj-I

REM Mettre a jour l'etat a "annulee"
echo.
echo Mise a jour de l'etat a "annulee"
curl -X PUT http://localhost:5000/api/commandes/%ID_COMMANDE%/etat -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%" -d "{\"etat\": \"annulee\"}"

REM Attendre 2 secondes
timeout /t 2 /nobreak > nul

REM Verifier les details de la commande
echo.
echo.
echo Verification des details de la commande
curl -X GET http://localhost:5000/api/commandes/%ID_COMMANDE% -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo Test termine
pause