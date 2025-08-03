@echo off
echo Test de l'etat "annulee" avec un nouveau token

REM Remplacez ces valeurs par les votres
set ID_COMMANDE=1
set TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUzOTgxNDc4LCJleHAiOjE3NTY1NzM0Nzh9.oPsmj6iJ-Qre8Bc3QAWl7aGwz0XidL-gqlC2cKwALc0

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